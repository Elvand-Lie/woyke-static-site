import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ product?: string }> };
export default async function LegacyProductPage({ searchParams }: Props) { const { product } = await searchParams; redirect(product ? `/product/${encodeURIComponent(product)}` : "/shop"); }