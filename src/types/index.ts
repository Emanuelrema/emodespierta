export type ModuleType = "message" | "video" | "photos" | "audio";

export interface MemoryModule {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  content: {
    text?: string;        // For letters
    mediaUrl?: string;    // For video/audio/photo URLs
    images?: string[];    // For photo gallery lightboxes
  };
}

export interface Persona {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  musicUrl?: string;      // Background vinyl music track
  musicTitle?: string;
  themeColor: string;     // Color name for visual glows: 'indigo' | 'teal' | 'rose' | 'amber' etc.
  description: string;
  modules: MemoryModule[];
}
