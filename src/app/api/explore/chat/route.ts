import { NextResponse } from "next/server";

import { generateExplorationChatReply } from "@/lib/exploration-chat";
import type { ExplorationMemoryEntry } from "@/types/exploration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

interface ExplorationChatRequest {
  entry?: ExplorationMemoryEntry;
  question?: string;
}

function isValidEntry(entry: unknown): entry is ExplorationMemoryEntry {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  const candidate = entry as Partial<ExplorationMemoryEntry>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.englishName === "string" &&
    typeof candidate.type === "string" &&
    typeof candidate.avatar === "string" &&
    Array.isArray(candidate.facts) &&
    Array.isArray(candidate.sources) &&
    Boolean(candidate.generated) &&
    typeof candidate.generated?.summary === "string" &&
    typeof candidate.generated?.personality === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExplorationChatRequest;
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!isValidEntry(body.entry)) {
      return NextResponse.json({ error: "缺少已抽到的星体资料。" }, { status: 400 });
    }

    if (!question) {
      return NextResponse.json({ error: "请输入想问这颗星的话。" }, { status: 400 });
    }

    if (question.length > 240) {
      return NextResponse.json({ error: "单次提问请控制在 240 字以内。" }, { status: 400 });
    }

    const reply = await generateExplorationChatReply(body.entry, question);

    return NextResponse.json(
      {
        reply,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "这颗星刚刚被云遮住了，请稍后再问一次。" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
