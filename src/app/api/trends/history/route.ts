import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getTrendHistory } from "@/lib/services/trends";

export async function GET() {
  try {
    const user = await requireAuth();
    const history = await getTrendHistory(user.id);
    return NextResponse.json({ history });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
