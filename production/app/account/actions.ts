"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function saveProfileAction(formData: FormData) {
  const { user } = await requireUser("/account/settings");
  const parsed = z.object({ displayName: z.string().trim().min(2).max(80), phone: z.string().trim().max(30) }).safeParse({ displayName: formData.get("displayName"), phone: formData.get("phone") });
  if (!parsed.success) redirect("/account/settings?error=Check+your+profile+details.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("profiles").update({ display_name: parsed.data.displayName, phone: parsed.data.phone || null }).eq("id", user.id);
  redirect(error ? "/account/settings?error=Profile+could+not+be+saved." : "/account/settings?message=Profile+saved.");
}

export async function startPhoneVerificationAction(formData: FormData) {
  const { user } = await requireUser("/account/settings");
  const parsed = z.string().trim().min(7).max(30).safeParse(formData.get("phone"));
  if (!parsed.success) redirect("/account/settings?error=Enter+a+valid+phone+number+with+country+code.");
  const supabase = await createServerSupabaseClient();
  const profile = await supabase.from("profiles").update({ phone: parsed.data }).eq("id", user.id);
  if (profile.error) redirect("/account/settings?error=Phone+number+could+not+be+saved.");
  const { error } = await supabase.auth.updateUser({ phone: parsed.data });
  if (error) redirect("/account/settings?error=SMS+verification+is+not+available+yet.");
  redirect("/account/settings/verify-phone");
}

export async function verifyPhoneAction(formData: FormData) {
  const { user } = await requireUser("/account/settings/verify-phone");
  const token = z.string().regex(/^\d{6}$/).safeParse(formData.get("token"));
  if (!token.success) redirect("/account/settings/verify-phone?error=Enter+the+six-digit+code.");
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase.from("profiles").select("phone").eq("id", user.id).single();
  if (!profile?.phone) redirect("/account/settings?error=Save+a+phone+number+first.");
  const { error } = await supabase.auth.verifyOtp({ phone: profile.phone, token: token.data, type: "phone_change" });
  if (error) redirect("/account/settings/verify-phone?error=The+verification+code+is+invalid+or+expired.");
  redirect("/account/settings?message=Phone+number+verified.");
}

export async function saveAddressAction(formData: FormData) {
  const { user } = await requireUser("/account/settings");
  const parsed = z.object({ id: z.string().uuid().optional().or(z.literal("")), recipientName: z.string().trim().min(2).max(100), phone: z.string().trim().max(30), line1: z.string().trim().min(3).max(160), line2: z.string().trim().max(160), city: z.string().trim().min(2).max(80), region: z.string().trim().max(80), postal: z.string().trim().min(4).max(12), country: z.string().trim().length(2) }).safeParse({ id: formData.get("id") || "", recipientName: formData.get("recipientName"), phone: formData.get("phone"), line1: formData.get("line1"), line2: formData.get("line2"), city: formData.get("city"), region: formData.get("region"), postal: formData.get("postal"), country: formData.get("country") });
  if (!parsed.success) redirect("/account/settings?error=Check+the+delivery+address.");
  const supabase = await createServerSupabaseClient(); const values = { user_id: user.id, recipient_name: parsed.data.recipientName, phone: parsed.data.phone || null, address_line_1: parsed.data.line1, address_line_2: parsed.data.line2 || null, city: parsed.data.city, region: parsed.data.region || null, postal_code: parsed.data.postal, country_code: parsed.data.country.toUpperCase(), is_default: true };
  const result = parsed.data.id ? await supabase.from("customer_addresses").update(values).eq("id", parsed.data.id).eq("user_id", user.id) : await supabase.from("customer_addresses").insert(values);
  redirect(result.error ? "/account/settings?error=Address+could+not+be+saved." : "/account/settings?message=Address+saved.");
}