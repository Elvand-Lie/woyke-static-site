import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function safeReturnPath(value: string | null | undefined, fallback = "/account") {
  return value?.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export async function getAuthContext() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: roles } = await supabase.from("roles").select("role").eq("user_id", user.id);
  return {
    user,
    roles: (roles ?? []).map((item) => item.role as "customer" | "admin"),
  };
}

export async function requireUser(returnTo = "/account") {
  const context = await getAuthContext();
  if (!context) redirect(`/auth?return=${encodeURIComponent(safeReturnPath(returnTo))}`);
  return context;
}

export async function requireAdmin() {
  const context = await requireUser("/admin");
  if (!context.roles.includes("admin")) redirect("/account?error=admin-required");
  return context;
}