import { NextResponse } from "next/server";
import { listPublishedProducts } from "@/lib/catalogue";

export async function GET(request: Request) {
  const url = new URL(request.url);
  try {
    const products = await listPublishedProducts({
      query: url.searchParams.get("q") ?? undefined,
      category: url.searchParams.get("category") ?? undefined,
      sort: url.searchParams.get("sort") ?? undefined,
    });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Catalogue is temporarily unavailable." }, { status: 503 });
  }
}