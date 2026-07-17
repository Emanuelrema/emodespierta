import { getAllPersonas, getPersonaWithContent } from "@/lib/admin/content-manager";
import type { Persona, MemoryModule } from "@/types";

export async function getPublicPersonas(): Promise<Persona[]> {
  const metadataList = await getAllPersonas();
  const personas: Persona[] = [];

  for (const meta of metadataList) {
    if (meta.status !== "complete") continue; // Only show complete personas in public app

    const content = await getPersonaWithContent(meta.id);
    if (!content) continue;

    const modules: MemoryModule[] = [];

    if (content.modules.includes("letter") && content.letterContent) {
      modules.push({
        id: `${meta.id}-letter`,
        type: "message",
        title: "Carta",
        description: "Una reflexión escrita.",
        content: { text: content.letterContent },
      });
    }

    if (content.modules.includes("photos") && content.photos && content.photos.length > 0) {
      modules.push({
        id: `${meta.id}-photos`,
        type: "photos",
        title: "Fotos",
        description: "Una colección de recuerdos.",
        content: { images: content.photos.map(p => `/content/${meta.id}/photos/${p}`) },
      });
    }

    if (content.modules.includes("video") && content.videoFile) {
      modules.push({
        id: `${meta.id}-video`,
        type: "video",
        title: "Video",
        description: "Un recuerdo en movimiento.",
        content: { mediaUrl: `/content/${meta.id}/${content.videoFile}` },
      });
    }

    if (content.modules.includes("audio") && content.audioFile) {
      modules.push({
        id: `${meta.id}-audio`,
        type: "audio",
        title: "Audio",
        description: "Una nota de voz.",
        content: { mediaUrl: `/content/${meta.id}/${content.audioFile}` },
      });
    }

    personas.push({
      id: meta.id,
      name: meta.name,
      title: meta.title || meta.name,
      imageUrl: meta.imageUrl || "/images/placeholder.jpg",
      themeColor: meta.themeColor || "indigo",
      description: meta.description || "",
      musicUrl: content.musicFile ? `/content/${meta.id}/${content.musicFile}` : undefined,
      musicTitle: "Canción de fondo",
      modules,
    });
  }

  return personas;
}
