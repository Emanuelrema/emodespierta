"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { PersonaCard } from "./PersonaCard";
import type { PersonaMetadata } from "@/types/admin";

interface PersonaGridProps {
  initialPersonas: PersonaMetadata[];
}

export function PersonaGrid({ initialPersonas }: PersonaGridProps) {
  const [personas, setPersonas] = useState(initialPersonas);

  function handleDelete(id: string) {
    setPersonas((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      {/* Add button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-mono text-[11px] text-[#9ca3af] tracking-widest uppercase">
            {personas.length} persona{personas.length !== 1 ? "s" : ""}
          </div>
        </div>
        <Link
          href="/admin/personas/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#ff003c] hover:bg-[#cc0030] text-white text-sm font-mono tracking-wider transition-colors duration-150"
        >
          <span className="text-base leading-none">➕</span>
          Nueva persona
        </Link>
      </div>

      {/* Grid */}
      <AnimatePresence>
        {personas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-dashed border-[#1d1e3d] p-12 text-center"
          >
            <div className="text-4xl mb-3">💌</div>
            <p className="text-[#9ca3af] font-mono text-sm mb-4">
              Aún no hay personas en el proyecto
            </p>
            <Link
              href="/admin/personas/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff003c] text-white text-sm font-mono"
            >
              ➕ Agregar primera persona
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {personas.map((persona, i) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                index={i}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
