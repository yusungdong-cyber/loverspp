import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const validateSchema = z.object({
  provider: z.enum(["openai", "claude"]),
  apiKey: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { ok } = checkRateLimit(`validate-key:${user.id}`);
    if (!ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = validateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { provider, apiKey } = parsed.data;

    if (provider === "openai") {
      const result = await validateOpenAIKey(apiKey);
      return NextResponse.json(result);
    } else {
      const result = await validateClaudeKey(apiKey);
      return NextResponse.json(result);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Validation failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

async function validateOpenAIKey(apiKey: string): Promise<{ valid: boolean; error?: string; model?: string }> {
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (res.status === 401) {
      return { valid: false, error: "Invalid API key" };
    }
    if (!res.ok) {
      return { valid: false, error: `OpenAI API error: ${res.status}` };
    }

    return { valid: true, model: "gpt-4o" };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

async function validateClaudeKey(apiKey: string): Promise<{ valid: boolean; error?: string; model?: string }> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 10,
        messages: [{ role: "user", content: "Hi" }],
      }),
    });

    if (res.status === 401) {
      return { valid: false, error: "Invalid API key" };
    }
    // A successful response or 400 (model issue) means the key is valid
    if (res.ok || res.status === 400) {
      return { valid: true, model: "claude-sonnet-4-5-20250929" };
    }

    return { valid: false, error: `Anthropic API error: ${res.status}` };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}
