import { AdminShell } from "@/components/admin/layout/AdminShell";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { ProgressTimeline } from "@/components/admin/dashboard/ProgressTimeline";
import { getAllPersonas } from "@/lib/admin/content-manager";
import type { DashboardStats, TimelineItem } from "@/types/admin";

export const dynamic = "force-dynamic";

async function getDashboardData(): Promise<{
  stats: DashboardStats;
  timeline: TimelineItem[];
}> {
  const personas = await getAllPersonas();

  let totalLetters = 0;
  let totalPhotos = 0;
  let totalVideos = 0;
  let totalAudios = 0;
  let totalSongs = 0;

  const timeline: TimelineItem[] = [];

  for (const p of personas) {
    for (const module of p.modules) {
      const isDone = p.status !== "draft";
      const label = `${p.name} · ${module}`;

      timeline.push({
        personaName: p.name,
        personaId: p.id,
        module,
        status: isDone ? "done" : "pending",
        label,
      });

      if (module === "letter") totalLetters++;
      if (module === "photos") totalPhotos++;
      if (module === "video") totalVideos++;
      if (module === "audio") totalAudios++;
      if (module === "music") totalSongs++;
    }
  }

  // Completion = personas with status "complete" / total
  const completed = personas.filter((p) => p.status === "complete").length;
  const completionPercent =
    personas.length === 0
      ? 0
      : Math.round((completed / personas.length) * 100);

  return {
    stats: {
      totalPersonas: personas.length,
      totalLetters,
      totalPhotos,
      totalVideos,
      totalAudios,
      totalSongs,
      completionPercent,
    },
    timeline,
  };
}

export default async function AdminDashboard() {
  const { stats, timeline } = await getDashboardData();

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-heading text-3xl">🕷️💌</span>
            <div>
              <h1 className="font-heading text-2xl text-white tracking-wider">
                EmoDespierta Studio
              </h1>
              <p className="text-[#9ca3af] text-sm font-mono tracking-wide">
                Panel de control del proyecto
              </p>
            </div>
          </div>

          {/* Completion bar */}
          <div className="mt-5 border border-[#1d1e3d] bg-[#0a0b18] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#9ca3af] tracking-widest uppercase">
                Progreso del Regalo
              </span>
              <span className="font-heading text-lg text-[#22c55e]">
                {stats.completionPercent}%
              </span>
            </div>
            <div className="h-2 bg-[#1d1e3d] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff003c] to-[#8b5cf6] transition-all duration-1000"
                style={{ width: `${stats.completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          <StatsCard
            label="Personas"
            value={stats.totalPersonas}
            icon="👥"
            color="purple"
            delay={0}
          />
          <StatsCard
            label="Cartas"
            value={stats.totalLetters}
            icon="💌"
            color="red"
            delay={0.05}
          />
          <StatsCard
            label="Fotos"
            value={stats.totalPhotos}
            icon="📷"
            color="yellow"
            delay={0.1}
          />
          <StatsCard
            label="Videos"
            value={stats.totalVideos}
            icon="🎥"
            color="blue"
            delay={0.15}
          />
          <StatsCard
            label="Audios"
            value={stats.totalAudios}
            icon="🎤"
            color="green"
            delay={0.2}
          />
          <StatsCard
            label="Canciones"
            value={stats.totalSongs}
            icon="🎵"
            color="purple"
            delay={0.25}
          />
        </div>

        {/* Timeline */}
        <ProgressTimeline items={timeline} />

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href="/admin/personas"
            className="border border-[#ff003c]/30 bg-[#ff003c]/5 hover:bg-[#ff003c]/10 p-4 flex items-center gap-3 transition-all duration-200 group"
          >
            <span className="text-xl">💌</span>
            <div>
              <div className="text-white text-sm font-medium">Gestionar Personas</div>
              <div className="text-[#9ca3af] text-xs font-mono">Agregar cartas, fotos y más</div>
            </div>
            <span className="ml-auto text-[#ff003c] text-lg opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </span>
          </a>
          <a
            href="/admin/birthday"
            className="border border-[#8b5cf6]/30 bg-[#8b5cf6]/5 hover:bg-[#8b5cf6]/10 p-4 flex items-center gap-3 transition-all duration-200 group"
          >
            <span className="text-xl">🎂</span>
            <div>
              <div className="text-white text-sm font-medium">Config. Cumpleaños</div>
              <div className="text-[#9ca3af] text-xs font-mono">Pastel, canción, textos</div>
            </div>
            <span className="ml-auto text-[#8b5cf6] text-lg opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </span>
          </a>
        </div>
      </div>
    </AdminShell>
  );
}
