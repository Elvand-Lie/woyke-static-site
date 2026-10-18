import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "./actions";
import { getAuthContext, safeReturnPath } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const text = (value: string | string[] | undefined) => typeof value === "string" ? value : "";

export default async function AuthPage({ searchParams }: Props) {
  const params = await searchParams;
  const returnTo = safeReturnPath(text(params.return));
  if (await getAuthContext()) redirect(returnTo);
  const message = text(params.message); const error = text(params.error);
  return <main id="main"><section className="auth-shell" data-header-theme="dark"><div className="auth-media"><img src="/assets/media/images/hero-model.webp" alt="Model wearing jewellery" /><div className="auth-media-shade" /><div className="auth-media-copy"><span className="section-kicker">Private account</span><h1>Keep the designs<br />that belong to you.</h1><p>Save a piece, return to it and follow its journey through the atelier.</p></div></div><div className="auth-panel"><form action={loginAction} className="auth-form"><div className="section-kicker">Secure sign in</div><h2>Welcome back.</h2><p className="lede">Use the email and password attached to your WOYKE account.</p><input type="hidden" name="returnTo" value={returnTo} /><label>Email or phone<input required name="identifier" autoComplete="username" /></label><label>Password<input required minLength={8} name="password" type="password" autoComplete="current-password" /></label><button className="btn" type="submit"><span>Sign in</span><span>→</span></button>{error || message ? <p className="form-status" data-tone={error ? "error" : "success"} role="status">{error || message}</p> : null}<p className="auth-switch"><Link href="/auth/forgot">Forgot your password?</Link></p><p className="auth-switch">New to WOYKE? <Link href={`/auth/register?return=${encodeURIComponent(returnTo)}`}>Create an account</Link></p><p className="prototype-note">SMS remains in development mock mode for this milestone.</p></form></div></section></main>;
}