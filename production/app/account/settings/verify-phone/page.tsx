import { verifyPhoneAction } from "@/app/account/actions";
import { requireUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
type Props = { searchParams: Promise<{ error?: string }> };
function mask(phone: string) { return phone.length > 4 ? `${phone.slice(0, 3)}••••${phone.slice(-3)}` : phone; }
export default async function VerifyPhonePage({ searchParams }: Props) {
  const { user } = await requireUser("/account/settings/verify-phone");
  const supabase = await createServerSupabaseClient(); const { data: profile } = await supabase.from("profiles").select("phone").eq("id", user.id).single(); const params = await searchParams;
  return <main id="main"><section className="page-hero" data-header-theme="light"><div className="container"><div className="section-kicker">Secure account</div><h1 className="display-lg">Verify your phone.</h1><p className="lede">Enter the six-digit code sent to {profile?.phone ? mask(profile.phone) : "your phone"}.</p><form className="auth-form compact-form" action={verifyPhoneAction}><label>Verification code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} name="token" autoComplete="one-time-code" /></label><button className="btn"><span>Verify phone</span><span>&rarr;</span></button>{params.error ? <p className="form-status" role="alert">{params.error}</p> : null}</form></div></section></main>;
}