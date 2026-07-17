import type { Metadata } from "next";
import { Poppins, Pixelify_Sans } from "next/font/google";
import "../globals.css";

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
  title: "🕷️💌 EmoDespierta Studio",
  description: "CMS privado para administrar el proyecto EmoDespierta",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${pixelifySans.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans bg-background text-foreground antialiased selection:bg-rose-600/30 selection:text-rose-400">
        {children}
      </body>
    </html>
  );
}
