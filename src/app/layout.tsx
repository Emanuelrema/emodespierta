import type { Metadata } from "next";
import { Poppins, Pixelify_Sans } from "next/font/google";
import { Providers } from "@/app/providers";
import { ImmersiveHeader } from "@/components/common/immersive-header";
import { StarrySky } from "@/components/common/starry-sky";
import { DinoEgg } from "@/components/common/dino-egg";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "🕷️💌 EmoDespierta - Mensajes para Emo",
  description: "Una experiencia interactiva y regalo de cumpleaños diseñado especialmente para Emo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${pixelifySans.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans bg-background text-foreground antialiased selection:bg-rose-600/30 selection:text-rose-400 flex flex-col">
        <Providers>
          <ImmersiveHeader />
          <StarrySky />
          <DinoEgg />
          <main className="flex-grow pt-16 relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
