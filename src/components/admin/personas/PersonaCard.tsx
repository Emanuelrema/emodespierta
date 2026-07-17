"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTransition } from "react";
import type { PersonaMetadata } from "@/types/admin";

interface PersonaCardProps {
  persona: PersonaMetadata;
  index: number;
  onDelete: (id: string) => void;
}

const moduleIcons: Record<string, string> = {
  letter: "💌",
  photos: "📷",
  video: "🎥",
  music: "🎵",
  audio: "🎤",
};

const statusColors = {
  draft: { text: "text-[#9ca3af]", bg: "bg-[#9ca3af]/10", border: "border-[#9ca3af]/20", label: "Borrador" },
  "in-progress": { text: "text-[#ffe600]", bg: "bg-[#ffe600]/10", border: "border-[#ffe600]/20", label: "En progreso" },
  complete: { text: "text-[#22c55e]", bg: "bg-[#22c55e]/10", border: "border-[#22c55e]/20", label: "Completo" },
};

export function PersonaCard({ persona, index, onDelete }: PersonaCardProps) {
  const [isPending, startTransition] = useTransition();
  const status = statusColors[persona.status];

  function handleDelete() {
    if (!confirm(`¿Eliminar a ${persona.name}? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/personas/${persona.id}`, { method: "DELETE" });
      if (res.ok) {
        onDelete(persona.id);
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-[#1d1e3d] bg-[#0a0b18] hover:border-[#ff003c]/30 transition-all duration-200 group relative overflow-hidden"
    >
      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ff003c] to-[#8b5cf6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-heading text-xl text-white tracking-wide leading-tight">
              {persona.name}
            </h3>
            <div className="font-mono text-[10px] text-[#9ca3af]/60 mt-0.5">
              /{persona.id}
            </div>
          </div>
          <span
            className={`text-[10px] font-mono tracking-widest px-2 py-1 border ${status.bg} ${status.border} ${status.text} shrink-0`}
          >
            {status.label.toUpperCase()}
          </span>
        </div>

        {/* Module badges */}
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[28px]">
          {persona.modules.length === 0 ? (
            <span className="text-[#9ca3af]/40 text-xs font-mono">Sin contenido</span>
          ) : (
            persona.modules.map((m) => (
              <span
                key={m}
                className="text-xs px-2 py-0.5 bg-[#1d1e3d] text-[#9ca3af] border border-[#1d1e3d] font-mono flex items-center gap-1"
              >
                {moduleIcons[m]} {m}
              </span>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="text-[#9ca3af] text-xs font-mono mb-4">
          {persona.modules.length} módulo{persona.modules.length !== 1 ? "s" : ""} ·{" "}
          {new Date(persona.createdAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Link
            href={`/admin/personas/${persona.id}`}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#ff003c] hover:bg-[#cc0030] text-white text-xs font-mono tracking-wider transition-colors duration-150"
          >
            ✏️ Editar
          </Link>
          <Link
            href={`/admin/preview?persona=${persona.id}`}
            className="px-3 py-2 border border-[#1d1e3d] hover:border-[#8b5cf6]/40 text-[#9ca3af] hover:text-white text-xs font-mono transition-colors duration-150"
          >
            👁️
          </Link>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-3 py-2 border border-[#1d1e3d] hover:border-[#ff003c]/40 text-[#9ca3af] hover:text-[#ff003c] text-xs font-mono transition-colors duration-150 disabled:opacity-50"
          >
            🗑️
          </button>
        </div>
      </div>
    </motion.div>
  );
}
