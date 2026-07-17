import { AdminShell } from "@/components/admin/layout/AdminShell";

export const dynamic = "force-dynamic";

export default function PreviewPage() {
  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#9ca3af] text-xs font-mono mb-6">
          <a href="/admin" className="hover:text-white transition-colors">Inicio</a>
          <span>›</span>
          <span className="text-white">Vista Previa</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl text-white tracking-wider">👁️ Vista Previa</h1>
            <p className="text-[#9ca3af] text-sm mt-1">
              Vista en vivo de la aplicación pública sin necesidad de publicar.
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-[#1d1e3d] hover:border-[#ff003c]/40 text-[#9ca3af] hover:text-white text-sm font-mono transition-all duration-150"
          >
            ↗ Abrir en nueva pestaña
          </a>
        </div>

        {/* Browser chrome mockup */}
        <div className="border border-[#1d1e3d] overflow-hidden">
          {/* URL bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0d0e26] border-b border-[#1d1e3d]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff003c]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffe600]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/60" />
            </div>
            <div className="flex-1 bg-[#04040c] border border-[#1d1e3d] px-3 py-1 text-[#9ca3af] text-xs font-mono">
              localhost:3000
            </div>
          </div>

          {/* iframe */}
          <iframe
            src="/"
            title="Vista previa de EmoDespierta"
            className="w-full bg-white"
            style={{ height: "70vh", minHeight: "500px" }}
          />
        </div>

        {/* Quick links */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-[#9ca3af] text-xs font-mono py-2">Páginas rápidas:</span>
          {[
            { href: "/", label: "Inicio" },
            { href: "/?reset=true", label: "Reiniciar sesión" },
            { href: "/?cheat=victory", label: "🎂 Pantalla de celebración" },
          ].map((link) => (
            <a
              key={link.href}
              href={`javascript:document.querySelector('iframe[title]').src='${link.href}'`}
              className="text-xs font-mono border border-[#1d1e3d] hover:border-[#ff003c]/30 text-[#9ca3af] hover:text-white px-3 py-1.5 transition-all duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
