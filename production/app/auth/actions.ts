"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { safeReturnPath } from "@/lib/auth";
import { publicEnvironment } from "@/lib/env/public";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  identifier: z.string().trim().min(5).max(254),
  password: z.string().min(8).max(128),
  returnTo: z.string().optional(),
});

function authRedirect(path: string, key: "error" | "message", message: string, returnTo?: string): never {
  const query = new URLSearchParams({ [key]: message });
  if (returnTo) query.set("return", safeReturnPath(returnTo));
  redirect(`${path}?${query}`);
}

export async function loginAction(formData: FormData) {
  const parsed = credentialsSchema.safeParse({ identifier: formData.get("identifier"), password: formData.get("password"), returnTo: formData.get("returnTo") || undefined });
  if (!parsed.success) authRedirect("/auth", "error", "Enter your email or phone and a password of at least eight characters.", String(formData.get("returnTo") ?? ""));
  let email = parsed.data.identifier;
  if (!email.includes("@")) { const admin = createAdminSupabaseClient(); const { data } = await admin.from("profiles").select("email").eq("phone", email).maybeSingle(); email = data?.email ?? ""; }
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: parsed.data.password });
  if (error) authRedirect("/auth", "error", "The email or password is incorrect.", parsed.data.returnTo);
  redirect(safeReturnPath(parsed.data.returnTo));
}

export async function registerAction(formData: FormData) {
  const parsed = credentialsSchema.extend({ identifier: z.string().email().max(254), displayName: z.string().trim().min(2).max(80), phone: z.string().trim().min(7).max(30) }).safeParse({ displayName: formData.get("displayName"), phone: formData.get("phone"), identifier: formData.get("email"), password: formData.get("password"), returnTo: formData.get("returnTo") || undefined });
  if (!parsed.success) authRedirect("/auth/register", "error", "Complete every field and use a password of at least eight characters.", String(formData.get("returnTo") ?? ""));
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.identifier,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName, phone: parsed.data.phone },
      emailRedirectTo: `${publicEnvironment.NEXT_PUBLIC_APP_URL}/auth/callback?return=${encodeURIComponent(safeReturnPath(parsed.data.returnTo))}`,
    },
  });
  if (error) authRedirect("/auth/register", "error", "This account could not be created.", parsed.data.returnTo);
  if (data.session) redirect(safeReturnPath(parsed.data.returnTo));
  authRedirect("/auth", "message", "Check your email to confirm the account before signing in.", parsed.data.returnTo);
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
export async function requestPasswordResetAction(formData: FormData) {
  const email = z.string().email().safeParse(formData.get("email"));
  if (!email.success) authRedirect("/auth/forgot", "error", "Enter a valid email address.");
  const supabase = await createServerSupabaseClient();
  await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: `${publicEnvironment.NEXT_PUBLIC_APP_URL}/auth/callback?return=/auth/reset` });
  authRedirect("/auth/forgot", "message", "If the account exists, a secure reset link has been sent.");
}

export async function updatePasswordAction(formData: FormData) {
  const parsed = z.object({ password: z.string().min(10).max(128), confirmation: z.string().min(10).max(128) }).safeParse({ password: formData.get("password"), confirmation: formData.get("confirmation") });
  if (!parsed.success || parsed.data.password !== parsed.data.confirmation) authRedirect("/auth/reset", "error", "Use at least ten characters and enter the same password twice.");
  const supabase = await createServerSupabaseClient(); const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) authRedirect("/auth/reset", "error", "The reset session is invalid or expired.");
  authRedirect("/account", "message", "Password updated.");
}
