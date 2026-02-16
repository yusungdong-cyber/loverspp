import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { publishArticle } from "@/lib/services/articles";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    const { ok } = checkRateLimit(`publish:${user.id}`);
    if (!ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const publishStatus = body.status as "draft" | "publish" | "future" | undefined;
    const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : undefined;

    const article = await publishArticle(params.id, user.id, {
      status: publishStatus,
      scheduledAt,
    });

    return NextResponse.json({ article });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to publish";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
