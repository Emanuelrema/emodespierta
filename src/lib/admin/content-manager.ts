/**
 * content-manager.ts
 * High-level CRUD operations for personas and site config.
 * Consumed by API Route handlers.
 */

import path from "path";
import {
  CONTENT_ROOT,
  PUBLIC_CONTENT_ROOT,
  readJson,
  writeJson,
  readText,
  writeText,
  deleteFile,
  deleteDirectory,
  fileExists,
  listDirectory,
  listPersonaIds,
  personaDir,
  personaMetadataPath,
  personaLetterPath,
  personaPhotosDir,
  configPath,
} from "./file-store";
import type {
  PersonaMetadata,
  PersonaWithContent,
  SiteConfig,
  ModuleType,
} from "@/types/admin";

// ─────────────────────────────────────────────
// Personas
// ─────────────────────────────────────────────

export async function getAllPersonas(): Promise<PersonaMetadata[]> {
  const ids = await listPersonaIds();
  const metas = await Promise.all(
    ids.map((id) => readJson<PersonaMetadata>(personaMetadataPath(id)))
  );
  return metas
    .filter((m): m is PersonaMetadata => m !== null)
    .sort((a, b) => a.order - b.order);
}

export async function getPersona(id: string): Promise<PersonaMetadata | null> {
  return readJson<PersonaMetadata>(personaMetadataPath(id));
}

export async function getPersonaWithContent(id: string): Promise<PersonaWithContent | null> {
  const meta = await getPersona(id);
  if (!meta) return null;

  const result: PersonaWithContent = { ...meta };

  if (meta.modules.includes("letter")) {
    result.letterContent = (await readText(personaLetterPath(id))) ?? undefined;
  }

  if (meta.modules.includes("photos")) {
    const dir = personaPhotosDir(id);
    const files = await listDirectory(dir);
    result.photos = files
      .filter((f) => /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(f))
      .sort();
  }

  if (meta.modules.includes("video")) {
    const publicDir = path.join(PUBLIC_CONTENT_ROOT, id);
    const files = await listDirectory(publicDir);
    result.videoFile = files.find((f) => /^video\.(mp4|webm|mov)$/i.test(f));
  }

  if (meta.modules.includes("music")) {
    const publicDir = path.join(PUBLIC_CONTENT_ROOT, id);
    const files = await listDirectory(publicDir);
    result.musicFile = files.find((f) => /^music\.(mp3|wav|ogg|m4a)$/i.test(f));
  }

  if (meta.modules.includes("audio")) {
    const publicDir = path.join(PUBLIC_CONTENT_ROOT, id);
    const files = await listDirectory(publicDir);
    result.audioFile = files.find((f) => /^audio\.(mp3|wav|ogg|m4a)$/i.test(f));
  }

  return result;
}

export async function createPersona(name: string): Promise<PersonaMetadata> {
  const id = slugify(name);
  const existingIds = await listPersonaIds();

  // Ensure unique id
  let uniqueId = id;
  let counter = 1;
  while (existingIds.includes(uniqueId)) {
    uniqueId = `${id}-${counter++}`;
  }

  const personas = await getAllPersonas();
  const maxOrder = personas.reduce((max, p) => Math.max(max, p.order), -1);

  const meta: PersonaMetadata = {
    id: uniqueId,
    name,
    status: "draft",
    createdAt: new Date().toISOString(),
    order: maxOrder + 1,
    modules: [],
  };

  await writeJson(personaMetadataPath(uniqueId), meta);
  return meta;
}

export async function updatePersona(
  id: string,
  updates: Partial<Pick<PersonaMetadata, "name" | "status" | "order">>
): Promise<PersonaMetadata | null> {
  const meta = await getPersona(id);
  if (!meta) return null;

  const updated = { ...meta, ...updates };
  await writeJson(personaMetadataPath(id), updated);
  return updated;
}

export async function deletePersona(id: string): Promise<void> {
  await deleteDirectory(personaDir(id));
}

// ─────────────────────────────────────────────
// Modules
// ─────────────────────────────────────────────

export async function addModule(id: string, moduleType: ModuleType): Promise<PersonaMetadata | null> {
  const meta = await getPersona(id);
  if (!meta) return null;
  if (meta.modules.includes(moduleType)) return meta; // already exists

  const updated: PersonaMetadata = {
    ...meta,
    modules: [...meta.modules, moduleType],
    status: "in-progress",
  };
  await writeJson(personaMetadataPath(id), updated);
  return updated;
}

export async function removeModule(id: string, moduleType: ModuleType): Promise<PersonaMetadata | null> {
  const meta = await getPersona(id);
  if (!meta) return null;

  // Remove associated files
  switch (moduleType) {
    case "letter":
      await deleteFile(personaLetterPath(id));
      break;
    case "photos":
      await deleteDirectory(personaPhotosDir(id));
      break;
    case "video":
      await deleteModuleFile(id, /^video\.(mp4|webm|mov)$/i);
      break;
    case "music":
      await deleteModuleFile(id, /^music\.(mp3|wav|ogg|m4a)$/i);
      break;
    case "audio":
      await deleteModuleFile(id, /^audio\.(mp3|wav|ogg|m4a)$/i);
      break;
  }

  const updated: PersonaMetadata = {
    ...meta,
    modules: meta.modules.filter((m) => m !== moduleType),
  };
  await writeJson(personaMetadataPath(id), updated);
  return updated;
}

async function deleteModuleFile(id: string, pattern: RegExp): Promise<void> {
  const dir = personaDir(id);
  const files = await listDirectory(dir);
  const match = files.find((f) => pattern.test(f));
  if (match) {
    await deleteFile(path.join(dir, match));
  }
}

// ─────────────────────────────────────────────
// Letter
// ─────────────────────────────────────────────

export async function saveLetter(id: string, content: string): Promise<void> {
  await writeText(personaLetterPath(id), content);
}

export async function getLetter(id: string): Promise<string | null> {
  return readText(personaLetterPath(id));
}

// ─────────────────────────────────────────────
// Site Config
// ─────────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig | null> {
  return readJson<SiteConfig>(configPath());
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  await writeJson(configPath(), config);
}

// ─────────────────────────────────────────────
// Utils
// ─────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
