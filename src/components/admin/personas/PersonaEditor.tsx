"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AddContentMenu } from "./AddContentMenu";
import { LetterModule } from "./modules/LetterModule";
import { PhotosModule } from "./modules/PhotosModule";
import { MediaModule } from "./modules/MediaModule";
import type { PersonaWithContent, ModuleType, PersonaStatus } from "@/types/admin";

interface PersonaEditorProps {
  persona: PersonaWithContent;
}

const statusOptions: { value: PersonaStatus; label: string; color: string }[] = [
  { value: "draft", label: "Borrador", color: "#9ca3af" },
  { value: "in-progress", label: "En progreso", color: "#ffe600" },
  { value: "complete", label: "Completo", color: "#22c55e" },
];

export function PersonaEditor({ persona: initialPersona }: PersonaEditorProps) {
  const [persona, setPersona] = useState(initialPersona);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleAddModule(moduleType: ModuleType) {
    const res = await fetch(`/api/admin/personas/${persona.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add-module", moduleType }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPersona((prev) => ({ ...prev, modules: updated.modules }));
    }
  }

  async function handleRemoveModule(moduleType: ModuleType) {
    const res = await fetch(`/api/admin/personas/${persona.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove-module", moduleType }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPersona((prev) => ({
        ...prev,
        modules: updated.modules,
        letterContent: moduleType === "letter" ? "" : prev.letterContent,
        photos: moduleType === "photos" ? [] : prev.photos,
        videoFile: moduleType === "video" ? undefined : prev.videoFile,
        musicFile: moduleType === "music" ? undefined : prev.musicFile,
        audioFile: moduleType === "audio" ? undefined : prev.audioFile,
      }));
    }
  }

  function handleStatusChange(status: PersonaStatus) {
    startTransition(async () => {
      await fetch(`/api/admin/personas/${persona.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setPersona((prev) => ({ ...prev, status }));
    });
  }

  return (
    <>
      <AddContentMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        existingModules={persona.modules}
        onAdd={handleAddModule}
      />

      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#9ca3af] text-xs font-mono mb-6">
          <a href="/admin" className="hover:text-white transition-colors">Inicio</a>
          <span>›</span>
          <a href="/admin/personas" className="hover:text-white transition-colors">Personas</a>
          <span>›</span>
          <span className="text-white">{persona.name}</span>
        </div>

        {/* Persona info card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#1d1e3d] bg-[#0a0b18] p-6 mb-6"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-3xl text-white tracking-wider">
                {persona.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-[#9ca3af] text-xs font-mono">
                  Creado: {new Date(persona.createdAt).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-[#9ca3af]/30 text-xs font-mono">·</span>
                <span className="text-[#9ca3af]/60 text-xs font-mono">
                  ID: {persona.id}
                </span>
              </div>
            </div>

            {/* Status selector */}
            <div className="flex items-center gap-1">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  disabled={isPending}
                  className={`text-[10px] font-mono tracking-wider px-3 py-1.5 border transition-all duration-150 ${
                    persona.status === opt.value
                      ? "text-white border-current bg-white/5"
                      : "text-[#9ca3af]/50 border-[#1d1e3d] hover:text-[#9ca3af]"
                  }`}
                  style={{ color: persona.status === opt.value ? opt.color : undefined }}
                >
                  {opt.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Modules */}
        <div className="space-y-4 mb-6">
          <AnimatePresence>
            {persona.modules.includes("letter") && (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <LetterModule
                  personaId={persona.id}
                  initialContent={persona.letterContent ?? ""}
                  onRemove={() => handleRemoveModule("letter")}
                />
              </motion.div>
            )}

            {persona.modules.includes("photos") && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <PhotosModule
                  personaId={persona.id}
                  initialPhotos={persona.photos ?? []}
                  onRemove={() => handleRemoveModule("photos")}
                />
              </motion.div>
            )}

            {persona.modules.includes("video") && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <MediaModule
                  personaId={persona.id}
                  moduleType="video"
                  initialFile={persona.videoFile}
                  onRemove={() => handleRemoveModule("video")}
                />
              </motion.div>
            )}

            {persona.modules.includes("music") && (
              <motion.div
                key="music"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <MediaModule
                  personaId={persona.id}
                  moduleType="music"
                  initialFile={persona.musicFile}
                  onRemove={() => handleRemoveModule("music")}
                />
              </motion.div>
            )}

            {persona.modules.includes("audio") && (
              <motion.div
                key="audio"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <MediaModule
                  personaId={persona.id}
                  moduleType="audio"
                  initialFile={persona.audioFile}
                  onRemove={() => handleRemoveModule("audio")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Content button */}
        <motion.button
          onClick={() => setMenuOpen(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full border-2 border-dashed border-[#1d1e3d] hover:border-[#ff003c]/40 py-5 text-[#9ca3af] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 text-sm font-mono group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform duration-200">➕</span>
          Agregar contenido
        </motion.button>
      </div>
    </>
  );
}
