import type { Metadata } from "next";
import { readLegacyMain } from "@/lib/legacy-page";
export const metadata: Metadata = { title: "Our craft" };
export default function CraftPage() { return <div dangerouslySetInnerHTML={{ __html: readLegacyMain("craft") }} />; }
