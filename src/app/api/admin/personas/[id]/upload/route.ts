import { isAuthenticated } from "@/lib/admin/auth";
import { personaDir, personaPhotosDir, fileExists } from "@/lib/admin/file-store";
import { getPersona, addModule } from "@/lib/admin/content-manager";
import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/personas/[id]/upload
 * Body: multipart/form-data
 *   - file: File
 *   - moduleType: "photos" | "video" | "music" | "audio"
 */
export async function POST(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const persona = await getPersona(id);
    if (!persona) {
      return Response.json({ error: "Persona not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const moduleType = formData.get("moduleType") as string | null;

    if (!file || !moduleType) {
      return Response.json({ error: "file and moduleType are required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let destPath: string;
    let publicUrl: string;

    // Map content directory to public directory for media files
    const publicBaseDir = path.join(process.cwd(), "public", "content");

    if (moduleType === "photos") {
      const photosDir = path.join(publicBaseDir, id, "photos");
      await fs.mkdir(photosDir, { recursive: true });

      const ext = path.extname(file.name);
      const baseName = sanitizeFilename(path.basename(file.name, ext));
      let filename = `${baseName}${ext}`;
      let counter = 1;
      while (await fileExists(path.join(photosDir, filename))) {
        filename = `${baseName}-${counter++}${ext}`;
      }
      destPath = path.join(photosDir, filename);
      publicUrl = `/content/${id}/photos/${filename}`;
    } else {
      const dir = path.join(publicBaseDir, id);
      await fs.mkdir(dir, { recursive: true });

      const ext = path.extname(file.name);
      const filePrefix = moduleType === "video" ? "video" : moduleType === "music" ? "music" : "audio";
      const filename = `${filePrefix}${ext}`;
      destPath = path.join(dir, filename);
      publicUrl = `/content/${id}/${filename}`;
    }

    await fs.writeFile(destPath, buffer);

    // Ensure module is registered
    if (!persona.modules.includes(moduleType as "photos" | "video" | "music" | "audio")) {
      await addModule(id, moduleType as "photos" | "video" | "music" | "audio");
    }

    return Response.json({ ok: true, url: publicUrl });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9_\-]/gi, "_").slice(0, 60);
}
