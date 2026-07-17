/**
 * Admin-specific types for EmoDespierta Studio.
 * Extends the public types with management metadata.
 */

export type ModuleType = "letter" | "photos" | "video" | "music" | "audio";

export type PersonaStatus = "draft" | "in-progress" | "complete";

export interface PersonaMetadata {
  id: string;
  name: string;
  status: PersonaStatus;
  createdAt: string; // ISO string
  order: number;
  modules: ModuleType[];
  title?: string;
  imageUrl?: string;
  themeColor?: string;
  description?: string;
}

/** Full persona data including loaded module content */
export interface PersonaWithContent extends PersonaMetadata {
  letterContent?: string;        // Contents of letter.md
  photos?: string[];             // Filenames in /photos/
  videoFile?: string;            // Filename of video file
  musicFile?: string;            // Filename of music file
  audioFile?: string;            // Filename of audio file
}

export interface SiteConfig {
  birthday: {
    name: string;
    date: string;
    mainText: string;
    subtitle: string;
    cakeImageUrl: string;
    mainSongUrl: string;
    mainSongTitle: string;
  };
  fireworks: {
    enabled: boolean;
    colors: string[];
  };
  branding: {
    logo: string;
    siteName: string;
    palette: {
      primary: string;
      accent: string;
      background: string;
    };
    fontHeading: string;
    fontBody: string;
  };
  sounds: {
    clickEnabled: boolean;
    hoverEnabled: boolean;
    ambientEnabled: boolean;
  };
}

export interface DashboardStats {
  totalPersonas: number;
  totalLetters: number;
  totalPhotos: number;
  totalVideos: number;
  totalAudios: number;
  totalSongs: number;
  completionPercent: number;
}

export interface TimelineItem {
  personaName: string;
  personaId: string;
  module: ModuleType;
  status: "done" | "pending";
  label: string;
}
