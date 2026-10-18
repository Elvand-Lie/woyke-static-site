import { AnonymousStateSync } from "@/components/anonymous-state-sync";
import { requireUser } from "@/lib/auth";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireUser("/account");
  return <><AnonymousStateSync userId={user.id} />{children}</>;
}