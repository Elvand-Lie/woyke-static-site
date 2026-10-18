import { NextResponse } from "next/server";
import { getServerEnvironmentStatus } from "@/lib/env/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "woyke-production",
    environment: getServerEnvironmentStatus(),
  });
}
