import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

// TODO: Replace with real CRM integration (e.g. HubSpot, Mailchimp, Supabase)
// For MVP, leads are appended to a local JSON file and logged to console.

interface Lead {
  email: string;
  handle: string;
  platform: "telegram" | "whatsapp";
  timestamp: string;
}

const DATA_DIR = join(process.cwd(), "data");
const LEADS_FILE = join(DATA_DIR, "leads.json");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Lead>;

    if (!body.email || !body.platform) {
      return NextResponse.json({ error: "Email and platform are required" }, { status: 400 });
    }

    const lead: Lead = {
      email: body.email,
      handle: body.handle ?? "",
      platform: body.platform,
      timestamp: new Date().toISOString(),
    };

    // Console log (always)
    console.log("[Lead captured]", lead);

    // Persist to local JSON file
    try {
      await mkdir(DATA_DIR, { recursive: true });
      let leads: Lead[] = [];
      try {
        const raw = await readFile(LEADS_FILE, "utf-8");
        leads = JSON.parse(raw) as Lead[];
      } catch {
        // File doesn't exist yet — start fresh
      }
      leads.push(lead);
      await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
    } catch (err) {
      console.error("[Lead persist error]", err);
      // Don't fail the request if file I/O fails
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
