import type { Metadata } from "next";
import { readLegacyMain } from "@/lib/legacy-page";
export const metadata: Metadata = { title: "Sustainability" };
export default function SustainabilityPage() { return <div dangerouslySetInnerHTML={{ __html: readLegacyMain("sustainability") }} />; }
