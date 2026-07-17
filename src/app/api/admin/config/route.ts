import { isAuthenticated } from "@/lib/admin/auth";
import { getSiteConfig, saveSiteConfig } from "@/lib/admin/content-manager";
import { NextRequest } from "next/server";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await getSiteConfig();
    return Response.json(config);
  } catch {
    return Response.json({ error: "Failed to read config" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await saveSiteConfig(body);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to save config" }, { status: 500 });
  }
}
