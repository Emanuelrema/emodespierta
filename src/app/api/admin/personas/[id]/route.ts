import { isAuthenticated } from "@/lib/admin/auth";
import {
  getPersonaWithContent,
  updatePersona,
  deletePersona,
  addModule,
  removeModule,
  saveLetter,
} from "@/lib/admin/content-manager";
import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import type { ModuleType } from "@/types/admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const persona = await getPersonaWithContent(id);
    if (!persona) {
      return Response.json({ error: "Persona not found" }, { status: 404 });
    }
    return Response.json(persona);
  } catch {
    return Response.json({ error: "Failed to read persona" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Handle different PATCH operations
    if (body.action === "add-module") {
      const updated = await addModule(id, body.moduleType as ModuleType);
      return updated
        ? Response.json(updated)
        : Response.json({ error: "Persona not found" }, { status: 404 });
    }

    if (body.action === "remove-module") {
      const updated = await removeModule(id, body.moduleType as ModuleType);
      return updated
        ? Response.json(updated)
        : Response.json({ error: "Persona not found" }, { status: 404 });
    }

    if (body.action === "save-letter") {
      await saveLetter(id, body.content ?? "");
      return Response.json({ ok: true });
    }

    if (body.action === "remove-photo") {
      const filename = body.filename as string;
      if (!filename) {
        return Response.json({ error: "filename required" }, { status: 400 });
      }
      const filePath = path.join(process.cwd(), "public", "content", id, "photos", filename);
      await fs.unlink(filePath).catch(() => {});
      return Response.json({ ok: true });
    }

    // General metadata update
    const updated = await updatePersona(id, body);
    return updated
      ? Response.json(updated)
      : Response.json({ error: "Persona not found" }, { status: 404 });
  } catch {
    return Response.json({ error: "Failed to update persona" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deletePersona(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to delete persona" }, { status: 500 });
  }
}
