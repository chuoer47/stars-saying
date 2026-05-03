import { NextResponse } from "next/server";

import {
  generateGroundedReply,
  getChatRuntimeStatus,
  getRelatedSummary,
  sanitizeChatHistory,
  validateChatInput,
} from "@/lib/chat";
import type { ChatRequest, ChatResponse } from "@/types/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ChatRequest>;

    if (typeof body.bodyId !== "string" || typeof body.message !== "string") {
      return NextResponse.json({ error: "请求格式不正确。" }, { status: 400 });
    }

    const validation = validateChatInput(body.bodyId, body.message);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const history = sanitizeChatHistory(body.history);
    const reply = await generateGroundedReply(body.bodyId, body.message, history);
    const response: ChatResponse = {
      reply,
      relatedBodyId: body.bodyId,
      relatedSummary: getRelatedSummary(body.bodyId),
      runtime: getChatRuntimeStatus(),
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "星星刚刚被云遮住了，请稍后再试一次。" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
