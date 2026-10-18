import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";
export const metadata: Metadata = { title: { default: "WOYKE — i am, we are.", template: "%s — WOYKE" }, description: "WOYKE — a guided custom jewellery atelier." };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { const locale = (await cookies()).get("woyke.locale")?.value === "zh" ? "zh" : "en"; return <html lang={locale === "zh" ? "zh-SG" : "en-SG"}><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader initialLanguage={locale} />{children}<SiteFooter /></body></html>; }
