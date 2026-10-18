import { redirect } from "next/navigation";
type Props = { searchParams: Promise<{ token?: string }> };
export default async function ShareIndex({ searchParams }: Props) { const { token } = await searchParams; redirect(token ? `/share/${encodeURIComponent(token)}` : "/account/designs"); }
