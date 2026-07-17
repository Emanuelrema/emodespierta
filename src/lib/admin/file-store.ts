/**
 * file-store.ts
 * Core file-system abstraction for reading and writing content.
 * All content lives in /content/ at the project root.
 * This module runs SERVER-SIDE ONLY (Node.js fs).
 */

import fs from "fs/promises";
import path from "path";

// Root of the content directory — next to package.json (for metadata/letters)
export const CONTENT_ROOT = path.join(process.cwd(), "content");

// Root of publicly-served media (photos, video, audio, music)
export const PUBLIC_CONTENT_ROOT = path.join(process.cwd(), "public", "content");

// ─────────────────────────────────────────────
// Generic JSON helpers
// ─────────────────────────────────────────────

export async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function readText(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

export async function writeText(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore if file doesn't exist
  }
}

export async function deleteDirectory(dirPath: string): Promise<void> {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch {
    // Ignore if dir doesn't exist
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function listDirectory(dirPath: string): Promise<string[]> {
  try {
    return await fs.readdir(dirPath);
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// Content-specific helpers
// ─────────────────────────────────────────────

/** Returns all persona folder names */
export async function listPersonaIds(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_ROOT, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

/** Absolute path for a persona's folder */
export function personaDir(personaId: string): string {
  return path.join(CONTENT_ROOT, personaId);
}

/** Absolute path for a persona's metadata */
export function personaMetadataPath(personaId: string): string {
  return path.join(CONTENT_ROOT, personaId, "metadata.json");
}

/** Absolute path for a persona's letter */
export function personaLetterPath(personaId: string): string {
  return path.join(CONTENT_ROOT, personaId, "letter.md");
}

/** Absolute path for a persona's photos directory (in public/) */
export function personaPhotosDir(personaId: string): string {
  return path.join(PUBLIC_CONTENT_ROOT, personaId, "photos");
}

/** Returns an ordered list of photo filenames */
export async function listPersonaPhotos(personaId: string): Promise<string[]> {
  const dir = personaPhotosDir(personaId);
  const files = await listDirectory(dir);
  return files.filter((f) => /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(f)).sort();
}

/** Global config path */
export function configPath(): string {
  return path.join(CONTENT_ROOT, "config.json");
}
