import { AdminShell } from "@/components/admin/layout/AdminShell";
import { PersonaGrid } from "@/components/admin/personas/PersonaGrid";
import { getAllPersonas } from "@/lib/admin/content-manager";

export const dynamic = "force-dynamic";

export default async function PersonasPage() {
  const personas = await getAllPersonas();

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#9ca3af] text-xs font-mono mb-2">
            <a href="/admin" className="hover:text-white transition-colors">Inicio</a>
            <span>›</span>
            <span className="text-white">Personas</span>
          </div>
          <h1 className="font-heading text-2xl text-white tracking-wider">
            💌 Personas
          </h1>
          <p className="text-[#9ca3af] text-sm mt-1">
            Gestiona el contenido de cada persona del proyecto.
          </p>
        </div>

        <PersonaGrid initialPersonas={personas} />
      </div>
    </AdminShell>
  );
}
