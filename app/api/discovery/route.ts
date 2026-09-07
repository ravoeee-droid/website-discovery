import { NextResponse } from "next/server";
import { z } from "zod";

const recommendationSchema = z.object({
  label: z.string().min(1).max(160),
  reason: z.string().min(1).max(500),
  category: z.enum(["core", "growth", "recruiting", "automation", "media"]),
});

const discoverySchema = z.object({
  companyName: z.string().trim().min(1).max(200),
  website: z.string().trim().max(500),
  contactPerson: z.string().trim().max(200),
  goals: z.array(z.string().max(120)).max(20),
  audiences: z.array(z.string().max(120)).max(20),
  recruitingNeed: z.string().max(120),
  contactChannels: z.array(z.string().max(120)).max(20),
  mediaAssets: z.array(z.string().max(120)).max(30),
  visualDirection: z.string().max(120),
  visualTraits: z.array(z.string().max(120)).max(20),
  features: z.array(z.string().max(120)).max(40),
  aiAssistantTasks: z.array(z.string().max(120)).max(30),
  automations: z.array(z.string().max(160)).max(30),
  locations: z.number().int().min(1).max(500),
  languages: z.array(z.string().max(80)).min(1).max(30),
  notes: z.string().max(12000),
  email: z.string().trim().max(320),
  phone: z.string().trim().max(80),
  recommendations: z.array(recommendationSchema).max(30),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = discoverySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Bitte prüfen Sie die Angaben.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const id = crypto.randomUUID();
  const payload = {
    id,
    createdAt: new Date().toISOString(),
    source: "dg-website-discovery",
    ...parsed.data,
  };

  const webhook = process.env.DISCOVERY_WEBHOOK_URL;
  let delivered = false;

  if (webhook) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      const response = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.DISCOVERY_WEBHOOK_SECRET
            ? { "X-DG-Discovery-Secret": process.env.DISCOVERY_WEBHOOK_SECRET }
            : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      delivered = response.ok;
    } catch {
      delivered = false;
    }
  }

  return NextResponse.json({ id, delivered }, { status: 201 });
}
