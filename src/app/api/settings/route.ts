import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/crypto";
import { z } from "zod";

function maskKey(encrypted: string | null): string {
  if (!encrypted) return "";
  try {
    const raw = decrypt(encrypted);
    if (raw.length <= 8) return "••••••••";
    return raw.slice(0, 4) + "••••••••" + raw.slice(-4);
  } catch {
    return "••••••••";
  }
}

// GET: Retrieve current settings (masked keys)
export async function GET() {
  try {
    const user = await requireAuth();

    const full = await db.user.findUnique({
      where: { id: user.id },
      select: {
        openaiApiKey: true,
        claudeApiKey: true,
        aiProvider: true,
      },
    });

    if (!full) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      openaiApiKey: maskKey(full.openaiApiKey),
      claudeApiKey: maskKey(full.claudeApiKey),
      aiProvider: full.aiProvider,
      hasOpenaiKey: !!full.openaiApiKey,
      hasClaudeKey: !!full.claudeApiKey,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

const settingsSchema = z.object({
  openaiApiKey: z.string().optional(),
  claudeApiKey: z.string().optional(),
  aiProvider: z.enum(["openai", "claude"]).optional(),
});

// PUT: Update settings
export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { ok } = checkRateLimit(`settings:${user.id}`);
    if (!ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data: Record<string, string> = {};

    // Only update keys that were actually provided (not empty/placeholder)
    if (parsed.data.openaiApiKey && !parsed.data.openaiApiKey.includes("••••")) {
      data.openaiApiKey = encrypt(parsed.data.openaiApiKey);
    }
    if (parsed.data.claudeApiKey && !parsed.data.claudeApiKey.includes("••••")) {
      data.claudeApiKey = encrypt(parsed.data.claudeApiKey);
    }
    if (parsed.data.aiProvider) {
      data.aiProvider = parsed.data.aiProvider;
    }

    await db.user.update({
      where: { id: user.id },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
