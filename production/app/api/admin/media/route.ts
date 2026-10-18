import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";
import { getServerEnvironment } from "@/lib/env/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("signature") }),
  z.object({
    action: z.literal("record"),
    productId: z.string().uuid(),
    url: z.string().url().startsWith("https://res.cloudinary.com/"),
    storagePath: z.string().trim().min(1).max(500),
    altText: z.string().trim().min(3).max(240),
    role: z.enum(["primary", "gallery", "detail", "social"]),
    matchQuality: z.enum(["exact", "representative", "fallback"]),
  }),
]);

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!auth.roles.includes("admin")) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid media request." }, { status: 400 });
  const environment = getServerEnvironment();

  if (parsed.data.action === "signature") {
    if (!environment.CLOUDINARY_CLOUD_NAME || !environment.CLOUDINARY_API_KEY || !environment.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 503 });
    }
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "woyke/products";
    const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${environment.CLOUDINARY_API_SECRET}`).digest("hex");
    return NextResponse.json({ cloudName: environment.CLOUDINARY_CLOUD_NAME, apiKey: environment.CLOUDINARY_API_KEY, timestamp, folder, signature });
  }

  const admin = createAdminSupabaseClient();
  const { data: product } = await admin.from("products").select("id").eq("id", parsed.data.productId).maybeSingle();
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const { data: last } = await admin.from("product_media").select("sort_order").eq("product_id", product.id).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { data: media, error } = await admin.from("product_media").insert({
    product_id: product.id,
    storage_path: parsed.data.storagePath,
    url: parsed.data.url,
    alt_text: parsed.data.altText,
    media_type: "image",
    role: parsed.data.role,
    match_quality: parsed.data.matchQuality,
    sort_order: (last?.sort_order ?? -1) + 1,
  }).select("*").single();
  if (error) return NextResponse.json({ error: "The uploaded asset could not be recorded." }, { status: 500 });
  await admin.from("admin_audit_logs").insert({ actor_id: auth.user.id, action: "media.create", entity_type: "product_media", entity_id: media.id, before_state: null, after_state: media, request_id: request.headers.get("x-vercel-id")?.slice(0, 240) ?? null });
  return NextResponse.json({ ok: true, media });
}