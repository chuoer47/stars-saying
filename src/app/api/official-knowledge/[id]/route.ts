import { NextResponse } from "next/server";

import { getOfficialAstronomy } from "@/lib/official-astronomy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

interface OfficialKnowledgeRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: OfficialKnowledgeRouteProps) {
  const { id } = await params;
  const result = await getOfficialAstronomy(id);

  if (!result) {
    return NextResponse.json({ error: "没有找到这颗星体。" }, { status: 404 });
  }

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}
