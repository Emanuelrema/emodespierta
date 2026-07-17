import { AdminShell } from "@/components/admin/layout/AdminShell";
import { getSiteConfig } from "@/lib/admin/content-manager";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const config = await getSiteConfig();

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#9ca3af] text-xs font-mono mb-6">
          <a href="/admin" className="hover:text-white transition-colors">Inicio</a>
          <span>›</span>
          <span className="text-white">Configuración General</span>
        </div>

        <div className="mb-8">
          <h1 className="font-heading text-2xl text-white tracking-wider">⚙️ Configuración General</h1>
          <p className="text-[#9ca3af] text-sm mt-1">Branding, paleta de colores y sonidos.</p>
        </div>

        {/* Branding info */}
        <div className="border border-[#1d1e3d] bg-[#0a0b18] p-5 mb-4">
          <div className="font-mono text-[11px] text-[#9ca3af] tracking-widest uppercase mb-4">
            Identidad Visual
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[#9ca3af] text-xs font-mono mb-1">Logo</div>
              <div className="text-white text-2xl">{config?.branding.logo}</div>
            </div>
            <div>
              <div className="text-[#9ca3af] text-xs font-mono mb-1">Nombre del sitio</div>
              <div className="text-white">{config?.branding.siteName}</div>
            </div>
            <div>
              <div className="text-[#9ca3af] text-xs font-mono mb-1">Tipografía principal</div>
              <div className="text-white font-mono">{config?.branding.fontHeading}</div>
            </div>
            <div>
              <div className="text-[#9ca3af] text-xs font-mono mb-1">Tipografía cuerpo</div>
              <div className="text-white font-mono">{config?.branding.fontBody}</div>
            </div>
          </div>
        </div>

        {/* Color palette */}
        <div className="border border-[#1d1e3d] bg-[#0a0b18] p-5 mb-4">
          <div className="font-mono text-[11px] text-[#9ca3af] tracking-widest uppercase mb-4">
            Paleta de Colores
          </div>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(config?.branding.palette ?? {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 border border-[#1d1e3d]"
                  style={{ backgroundColor: value }}
                />
                <div>
                  <div className="text-white text-xs capitalize">{key}</div>
                  <div className="text-[#9ca3af]/60 text-[10px] font-mono">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sounds */}
        <div className="border border-[#1d1e3d] bg-[#0a0b18] p-5 mb-6">
          <div className="font-mono text-[11px] text-[#9ca3af] tracking-widest uppercase mb-4">
            Sonidos
          </div>
          <div className="space-y-2">
            {[
              { key: "clickEnabled", label: "Sonido al hacer clic" },
              { key: "hoverEnabled", label: "Sonido al pasar el mouse" },
              { key: "ambientEnabled", label: "Música ambiental" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-[#1d1e3d] last:border-0">
                <span className="text-sm text-[#9ca3af]">{label}</span>
                <span className={`text-xs font-mono ${config?.sounds[key as keyof typeof config.sounds] ? "text-[#22c55e]" : "text-[#9ca3af]/40"}`}>
                  {config?.sounds[key as keyof typeof config.sounds] ? "ACTIVO" : "INACTIVO"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info notice */}
        <div className="border border-[#ffe600]/20 bg-[#ffe600]/5 p-4 text-sm text-[#ffe600]/80 font-mono">
          ℹ La configuración de branding y tipografía se gestiona directamente en el código fuente.
          Para cambiar colores, fuentes o sonidos, edita{" "}
          <code className="text-[#ffe600]">src/app/globals.css</code> y{" "}
          <code className="text-[#ffe600]">content/config.json</code>.
        </div>
      </div>
    </AdminShell>
  );
}
