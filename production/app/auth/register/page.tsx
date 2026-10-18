import type { Metadata } from "next";
import Link from "next/link";
import { registerAction } from "../actions";
import { safeReturnPath } from "@/lib/auth";

export const metadata: Metadata = { title: "Create account" };
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const text = (value: string | string[] | undefined) => typeof value === "string" ? value : "";

export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams; const returnTo = safeReturnPath(text(params.return)); const error = text(params.error);
  return <main id="main"><section className="auth-shell" data-header-theme="dark"><div className="auth-media"><img src="/assets/media/images/hero-model.webp" alt="Model wearing jewellery" /><div className="auth-media-shade" /><div className="auth-media-copy"><span className="section-kicker">Private account</span><h1>Make room for<br />what is yours.</h1><p>Your saved designs and authenticated bag stay private to your account.</p></div></div><div className="auth-panel"><form action={registerAction} className="auth-form"><div className="section-kicker">Registration</div><h2>Create your account.</h2><input type="hidden" name="returnTo" value={returnTo} /><label>Name<input required minLength={2} maxLength={80} name="displayName" autoComplete="name" /></label><label>Email<input required name="email" type="email" autoComplete="email" /></label><label>Phone<input required name="phone" type="tel" autoComplete="tel" /></label><label>Password<input required minLength={8} maxLength={128} name="password" type="password" autoComplete="new-password" /></label><button className="btn" type="submit"><span>Create account</span><span>→</span></button>{error ? <p className="form-status" data-tone="error" role="alert">{error}</p> : null}<p className="auth-switch">Already registered? <Link href={`/auth?return=${encodeURIComponent(returnTo)}`}>Sign in</Link></p></form></div></section></main>;
}