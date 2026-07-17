"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ModuleType } from "@/types/admin";

interface AddContentMenuProps {
  open: boolean;
  onClose: () => void;
  existingModules: ModuleType[];
  onAdd: (moduleType: ModuleType) => void;
}

const MODULE_OPTIONS: { type: ModuleType; icon: string; label: string; description: string }[] = [
  { type: "letter", icon: "💌", label: "Carta", description: "Editor de texto con vista previa" },
  { type: "photos", icon: "📷", label: "Fotos", description: "Galería con drag & drop" },
  { type: "video", icon: "🎥", label: "Video", description: "Sube y previsualiza un video" },
  { type: "music", icon: "🎵", label: "Canción", description: "MP3 de fondo con autoplay" },
  { type: "audio", icon: "🎤", label: "Audio", description: "Nota de voz o mensaje de audio" },
];

export function AddContentMenu({ open, onClose, existingModules, onAdd }: AddContentMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <div
              className="w-full max-w-sm border border-[#1d1e3d] bg-[#0a0b18] shadow-2xl shadow-purple-900/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1d1e3d]">
                <h2 className="font-heading text-sm tracking-wider text-white">
                  Agregar contenido
                </h2>
                <button
                  onClick={onClose}
                  className="text-[#9ca3af] hover:text-white text-lg leading-none font-mono transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Options */}
              <ul className="p-3 space-y-1">
                {MODULE_OPTIONS.map((opt, i) => {
                  const alreadyExists = existingModules.includes(opt.type);
                  return (
                    <motion.li
                      key={opt.type}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <button
                        onClick={() => {
                          if (!alreadyExists) {
                            onAdd(opt.type);
                            onClose();
                          }
                        }}
                        disabled={alreadyExists}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150
                          ${
                            alreadyExists
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:bg-[#1d1e3d] hover:border-[#ff003c]/20 cursor-pointer"
                          }
                          border border-transparent
                        `}
                      >
                        <span className="text-xl leading-none w-6 text-center">{opt.icon}</span>
                        <div>
                          <div className="text-sm text-white font-medium">{opt.label}</div>
                          <div className="text-xs text-[#9ca3af] font-mono">{opt.description}</div>
                        </div>
                        {alreadyExists && (
                          <span className="ml-auto text-[10px] font-mono text-[#22c55e] border border-[#22c55e]/30 px-2 py-0.5">
                            YA EXISTE
                          </span>
                        )}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
