import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  validateWpConnection,
  saveWpSite,
  getUserSites,
} from "@/lib/services/wordpress";
import { z } from "zod";

const siteSchema = z.object({
  siteUrl: z.string().url("Invalid URL"),
  username: z.string().min(1, "Username is required"),
  applicationPassword: z.string().min(1, "Application password is required"),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const sites = await getUserSites(user.id);
    return NextResponse.json({ sites });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { ok } = checkRateLimit(`site:${user.id}`);
    if (!ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = siteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { siteUrl, username, applicationPassword } = parsed.data;

    // Validate connection first
    const validation = await validateWpConnection(
      siteUrl,
      username,
      applicationPassword
    );

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error || "Connection failed" },
        { status: 400 }
      );
    }

    const site = await saveWpSite(
      user.id,
      siteUrl,
      username,
      applicationPassword
    );

    return NextResponse.json({
      site: {
        id: site.id,
        siteUrl: site.siteUrl,
        username: site.username,
        isConnected: site.isConnected,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
