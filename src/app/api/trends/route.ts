import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateTrendTopics, getLatestTrends } from "@/lib/services/trends";

export async function GET() {
  try {
    const user = await requireAuth();
    const trends = await getLatestTrends(user.id);
    return NextResponse.json({ trends });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch trends";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { ok } = checkRateLimit(`trends:${user.id}`);
    if (!ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const category = body.category as string | undefined;

    const result = await generateTrendTopics(user.id, category);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate trends";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
