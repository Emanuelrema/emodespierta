"use client";

import { motion } from "framer-motion";
import type { TimelineItem } from "@/types/admin";

interface ProgressTimelineProps {
  items: TimelineItem[];
}

const moduleLabels: Record<string, string> = {
  letter: "Carta",
  photos: "Fotos",
  video: "Video",
  music: "Canción",
  audio: "Audio",
};

export function ProgressTimeline({ items }: ProgressTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="border border-[#1d1e3d] bg-[#0a0b18] p-6 text-center">
        <p className="text-[#9ca3af] text-sm font-mono">
          No hay contenido registrado todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#1d1e3d] bg-[#0a0b18] p-5">
      <div className="font-mono text-[11px] text-[#9ca3af] tracking-widest uppercase mb-4">
        Timeline del Proyecto
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <motion.li
            key={`${item.personaId}-${item.module}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="flex items-center gap-3 py-1.5 border-l-2 pl-3 transition-colors"
            style={{
              borderColor: item.status === "done" ? "#22c55e" : "#1d1e3d",
            }}
          >
            <span className="text-sm leading-none shrink-0">
              {item.status === "done" ? "✅" : "⏳"}
            </span>
            <span className="text-sm text-white font-medium">
              {item.personaName}
            </span>
            <span className="text-[#9ca3af] text-xs font-mono">
              {moduleLabels[item.module] ?? item.module}
            </span>
            <span
              className={`ml-auto text-[10px] font-mono tracking-wider ${
                item.status === "done"
                  ? "text-[#22c55e]"
                  : "text-[#9ca3af]/50"
              }`}
            >
              {item.status === "done" ? "LISTO" : "PENDIENTE"}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
