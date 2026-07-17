"use client";

import { useState, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotosModuleProps {
  personaId: string;
  initialPhotos: string[]; // filenames
  onRemove: () => void;
}

export function PhotosModule({ personaId, initialPhotos, onRemove }: PhotosModuleProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newPhotos: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("moduleType", "photos");

      const res = await fetch(`/api/admin/personas/${personaId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Extract filename from URL
        const filename = data.url.split("/").pop() as string;
        newPhotos.push(filename);
      }
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }

  function handleDeletePhoto(filename: string) {
    startTransition(async () => {
      // We remove by patching a "remove-photo" action
      await fetch(`/api/admin/personas/${personaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove-photo", filename }),
      });
      setPhotos((prev) => prev.filter((p) => p !== filename));
    });
  }

  return (
    <div className="border border-[#1d1e3d] bg-[#0a0b18]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1d1e3d]">
        <span className="text-base">📷</span>
        <span className="font-heading text-sm text-white tracking-wide">Fotos</span>
        <span className="text-[10px] font-mono text-[#9ca3af] border border-[#1d1e3d] px-2 py-0.5">
          {photos.length} foto{photos.length !== 1 ? "s" : ""}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="text-[10px] font-mono border border-[#ff003c]/40 text-[#ff003c] hover:bg-[#ff003c]/10 px-2 py-0.5 transition-all"
          >
            + Agregar
          </button>
          <button
            onClick={() => {
              if (confirm("¿Eliminar todas las fotos?")) onRemove();
            }}
            className="text-[10px] font-mono border border-transparent hover:border-[#ff003c]/30 text-[#9ca3af] hover:text-[#ff003c] px-2 py-0.5 transition-all"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 mb-4
            ${dragOver
              ? "border-[#ff003c] bg-[#ff003c]/5"
              : "border-[#1d1e3d] hover:border-[#ff003c]/40 hover:bg-[#0d0e26]"
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => uploadFiles(e.target.files)}
          />
          <div className="text-3xl mb-2">{uploading ? "⏳" : "📁"}</div>
          <p className="text-[#9ca3af] text-sm font-mono">
            {uploading
              ? "Subiendo imágenes..."
              : "Arrastra imágenes aquí o haz clic para seleccionar"}
          </p>
          <p className="text-[#9ca3af]/40 text-xs font-mono mt-1">
            JPG, PNG, WebP, GIF
          </p>
        </div>

        {/* Photo grid */}
        <AnimatePresence>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {photos.map((filename) => (
                <motion.div
                  key={filename}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group aspect-square bg-[#0d0e26] border border-[#1d1e3d] overflow-hidden"
                >
                  <img
                    src={`/content/${personaId}/photos/${filename}`}
                    alt={filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDeletePhoto(filename)}
                      disabled={isPending}
                      className="text-white text-sm font-mono border border-white/30 px-2 py-1 hover:border-[#ff003c] hover:text-[#ff003c] transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[8px] font-mono text-white/70 truncate">{filename}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
