import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { captureAnalytics, sendEmail } from "@/lib/providers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(254),
  phone: z.string().trim().max(30).default(""),
  preferredDate: z.string().date().optional().or(z.literal("")),
  preferredTime: z.string().trim().max(40).default(""),
  channel: z.enum(["video", "phone", "in_person"]).default("video"),
  message: z.string().trim().max(1200).default(""),
  productSlug: z.string().trim().max(120).default(""),
  designId: z.string().uuid().optional().or(z.literal("")),
});
function reference() { return `WC-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${randomBytes(3).toString("hex").toUpperCase()}`; }
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the consultation details." }, { status: 400 });
  const supabase = await createServerSupabaseClient(); const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminSupabaseClient();
  const [product, design] = await Promise.all([
    parsed.data.productSlug ? admin.from("products").select("id").eq("slug", parsed.data.productSlug).eq("status", "published").maybeSingle() : Promise.resolve({ data: null }),
    parsed.data.designId && user ? admin.from("saved_designs").select("id").eq("id", parsed.data.designId).eq("owner_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  const consultationReference = reference();
  const { data, error } = await admin.from("consultation_requests").insert({
    reference: consultationReference, owner_id: user?.id ?? null, product_id: product.data?.id ?? null, saved_design_id: design.data?.id ?? null,
    name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone || null,
    preferred_date: parsed.data.preferredDate || null, preferred_time: parsed.data.preferredTime || null,
    channel: parsed.data.channel, message: parsed.data.message || null,
  }).select("id").single();
  if (error) return NextResponse.json({ error: "The request could not be saved." }, { status: 500 });
  const notification = await sendEmail({ to: parsed.data.email, template: "consultation-received", variables: { name: parsed.data.name, reference: consultationReference } }).catch(() => null);
  await captureAnalytics("consultation_requested", { channel: parsed.data.channel }).catch(() => null);
  return NextResponse.json({ id: data.id, reference: consultationReference, notificationMode: notification?.mode ?? "unavailable" });
}