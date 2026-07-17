"use client";

import { useState, useRef } from "react";

interface MediaModuleProps {
  personaId: string;
  moduleType: "video" | "music" | "audio";
  initialFile?: string;
  onRemove: () => void;
}

const MODULE_CONFIG = {
  video: { icon: "🎥", label: "Video", accept: "video/*", prefix: "video" },
  music: { icon: "🎵", label: "Canción", accept: "audio/*", prefix: "music" },
  audio: { icon: "🎤", label: "Audio", accept: "audio/*", prefix: "audio" },
};

function VideoPreview({ personaId, filename }: { personaId: string; filename: string }) {
  return (
    <video
      src={`/content/${personaId}/${filename}`}
      controls
      className="w-full max-h-64 bg-black border border-[#1d1e3d]"
    />
  );
}

function AudioPreview({ personaId, filename }: { personaId: string; filename: string }) {
  return (
    <audio
      src={`/content/${personaId}/${filename}`}
      controls
      className="w-full"
    />
  );
}

export function MediaModule({ personaId, moduleType, initialFile, onRemove }: MediaModuleProps) {
  const [file, setFile] = useState(initialFile);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cfg = MODULE_CONFIG[moduleType];

  async function uploadFile(selectedFile: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("moduleType", moduleType);

    const res = await fetch(`/api/admin/personas/${personaId}/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const ext = selectedFile.name.split(".").pop();
      setFile(`${cfg.prefix}.${ext}`);
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) uploadFile(f);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) uploadFile(f);
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar el ${cfg.label.toLowerCase()}?`)) return;
    await fetch(`/api/admin/personas/${personaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove-module", moduleType }),
    });
    onRemove();
  }

  return (
    <div className="border border-[#1d1e3d] bg-[#0a0b18]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1d1e3d]">
        <span className="text-base">{cfg.icon}</span>
        <span className="font-heading text-sm text-white tracking-wide">{cfg.label}</span>
        {file && (
          <span className="text-[10px] font-mono text-[#22c55e] border border-[#22c55e]/30 px-2 py-0.5">
            ✓ Cargado
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {file && (
            <button
              onClick={() => inputRef.current?.click()}
              className="text-[10px] font-mono border border-[#1d1e3d] hover:border-[#ff003c]/30 text-[#9ca3af] hover:text-white px-2 py-0.5 transition-all"
            >
              Reemplazar
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-[10px] font-mono border border-transparent hover:border-[#ff003c]/30 text-[#9ca3af] hover:text-[#ff003c] px-2 py-0.5 transition-all"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Preview */}
        {file && (
          <div className="mb-4">
            {moduleType === "video" ? (
              <VideoPreview personaId={personaId} filename={file} />
            ) : (
              <AudioPreview personaId={personaId} filename={file} />
            )}
            <p className="text-[10px] font-mono text-[#9ca3af]/50 mt-1.5 truncate">{file}</p>
          </div>
        )}

        {/* Drop zone */}
        {!file && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
            className={`
              border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200
              ${dragOver
                ? "border-[#ff003c] bg-[#ff003c]/5"
                : "border-[#1d1e3d] hover:border-[#ff003c]/40 hover:bg-[#0d0e26]"
              }
            `}
          >
            <div className="text-3xl mb-2">{uploading ? "⏳" : cfg.icon}</div>
            <p className="text-[#9ca3af] text-sm font-mono">
              {uploading
                ? `Subiendo ${cfg.label.toLowerCase()}...`
                : `Arrastra el ${cfg.label.toLowerCase()} aquí o haz clic`}
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={cfg.accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
