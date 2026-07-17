"use client";

import { useState, useCallback, useTransition, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface LetterModuleProps {
  personaId: string;
  initialContent: string;
  onRemove: () => void;
}

export function LetterModule({ personaId, initialContent, onRemove }: LetterModuleProps) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const save = useCallback(
    (text: string) => {
      startTransition(async () => {
        await fetch(`/api/admin/personas/${personaId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "save-letter", content: text }),
        });
        setSaved(true);
      });
    },
    [personaId]
  );

  // Autosave with debounce
  useEffect(() => {
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(content), 1500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [content, save]);

  return (
    <div className="border border-[#1d1e3d] bg-[#0a0b18]">
      {/* Module header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1d1e3d]">
        <span className="text-base">💌</span>
        <span className="font-heading text-sm text-white tracking-wide">Carta</span>
        <div className="ml-auto flex items-center gap-2">
          {/* Word count */}
          <span className="text-[10px] font-mono text-[#9ca3af] border border-[#1d1e3d] px-2 py-0.5">
            {wordCount} palabras
          </span>
          {/* Save status */}
          <span
            className={`text-[10px] font-mono border px-2 py-0.5 transition-colors ${
              isPending
                ? "border-[#ffe600]/30 text-[#ffe600]"
                : saved
                ? "border-[#22c55e]/30 text-[#22c55e]"
                : "border-[#9ca3af]/20 text-[#9ca3af]/50"
            }`}
          >
            {isPending ? "Guardando..." : saved ? "✓ Guardado" : "Sin guardar"}
          </span>
          {/* Preview toggle */}
          <button
            onClick={() => setPreview(!preview)}
            className="text-[10px] font-mono border border-[#1d1e3d] hover:border-[#8b5cf6]/40 text-[#9ca3af] hover:text-white px-2 py-0.5 transition-all"
          >
            {preview ? "✏️ Editar" : "👁️ Vista Previa"}
          </button>
          {/* Remove module */}
          <button
            onClick={() => {
              if (confirm("¿Eliminar la carta? Esta acción no se puede deshacer.")) onRemove();
            }}
            className="text-[10px] font-mono border border-transparent hover:border-[#ff003c]/30 text-[#9ca3af] hover:text-[#ff003c] px-2 py-0.5 transition-all"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {preview ? (
          <div className="min-h-[280px] font-serif text-sm text-[#e5e7eb] leading-relaxed whitespace-pre-wrap bg-[#0d0e26] p-5 border border-[#1d1e3d]">
            {content || <span className="text-[#9ca3af]/40 italic">La carta está vacía...</span>}
          </div>
        ) : (
          <textarea
            id="letter-editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Escribe la carta aquí...\n\nPresiona Enter para nuevas líneas. El texto se guardará automáticamente.`}
            className="w-full min-h-[280px] bg-[#0d0e26] border border-[#1d1e3d] focus:border-[#ff003c]/40 text-[#e5e7eb] text-sm leading-relaxed font-mono placeholder-[#9ca3af]/30 p-4 resize-y outline-none transition-all duration-200"
          />
        )}
      </div>

      {/* Footer hint */}
      {!preview && (
        <div className="px-4 py-2 border-t border-[#1d1e3d] bg-[#0d0e26]/40">
          <p className="text-[10px] font-mono text-[#9ca3af]/40">
            El texto se guarda automáticamente · Soporte para saltos de línea · Haz clic en Vista Previa para ver el resultado
          </p>
        </div>
      )}
    </div>
  );
}
