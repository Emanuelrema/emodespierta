import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/30 py-6">
      <div className="mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row text-sm text-muted-foreground container">
        <p>&copy; {new Date().getFullYear()} EmoDespierta. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <Link href="/settings" className="hover:text-foreground transition-colors">
            Privacidad
          </Link>
          <Link href="/settings" className="hover:text-foreground transition-colors">
            Términos
          </Link>
          <Link href="/settings" className="hover:text-foreground transition-colors">
            Soporte
          </Link>
        </div>
      </div>
    </footer>
  );
}
