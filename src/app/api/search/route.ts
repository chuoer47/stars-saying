import { NextResponse } from "next/server";

import { semanticSearch } from "@/lib/retrieval";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string };
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    return NextResponse.json({
      results: semanticSearch(query, 8).map((result) => ({
        id: result.id,
        type: result.type,
        title: result.title,
        summary: result.summary,
        href: result.href,
        bodyId: result.bodyId,
        score: result.score,
        matchedTerms: result.matchedTerms,
      })),
    });
  } catch {
    return NextResponse.json({ error: "语义检索暂时不可用。" }, { status: 500 });
  }
}
