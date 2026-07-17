import { isAuthenticated } from "@/lib/admin/auth";
import { getAllPersonas, createPersona } from "@/lib/admin/content-manager";
import { NextRequest } from "next/server";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const personas = await getAllPersonas();
    return Response.json(personas);
  } catch {
    return Response.json({ error: "Failed to read personas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name } = body as { name: string };

    if (!name?.trim()) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const persona = await createPersona(name.trim());
    return Response.json(persona, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create persona" }, { status: 500 });
  }
}
