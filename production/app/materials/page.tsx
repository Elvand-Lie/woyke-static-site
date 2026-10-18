import type { Metadata } from "next";
import { readLegacyMain } from "@/lib/legacy-page";
export const metadata: Metadata = { title: "Materials" };
export default function MaterialsPage() { return <div dangerouslySetInnerHTML={{ __html: readLegacyMain("materials") }} />; }
