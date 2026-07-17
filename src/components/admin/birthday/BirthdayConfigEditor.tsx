"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import type { SiteConfig } from "@/types/admin";

interface BirthdayConfigEditorProps {
  initialConfig: SiteConfig;
}

export function BirthdayConfigEditor({ initialConfig }: BirthdayConfigEditorProps) {
  const [config, setConfig] = useState(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function updateBirthday(key: keyof SiteConfig["birthday"], value: string) {
    setConfig((prev) => ({
      ...prev,
      birthday: { ...prev.birthday, [key]: value },
    }));
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaved(true);
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[#9ca3af] text-xs font-mono mb-6">
        <a href="/admin" className="hover:text-white transition-colors">Inicio</a>
        <span>›</span>
        <span className="text-white">Configuración del Cumpleaños</span>
      </div>

      <div className="mb-6">
        <h1 className="font-heading text-2xl text-white tracking-wider">🎂 Configuración del Cumpleaños</h1>
        <p className="text-[#9ca3af] text-sm mt-1">
          Edita el nombre, textos, pastel y canción principal de la experiencia.
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <Field label="Nombre del cumpleañero" id="birthday-name">
          <input
            id="birthday-name"
            type="text"
            value={config.birthday.name}
            onChange={(e) => updateBirthday("name", e.target.value)}
            className={inputClass}
            placeholder="Emily"
          />
        </Field>

        {/* Date */}
        <Field label="Fecha y hora del cumpleaños" id="birthday-date">
          <input
            id="birthday-date"
            type="datetime-local"
            value={config.birthday.date.slice(0, 16)}
            onChange={(e) => updateBirthday("date", e.target.value)}
            className={inputClass}
          />
        </Field>

        {/* Main text */}
        <Field label="Texto principal (título de la celebración)" id="birthday-maintext">
          <input
            id="birthday-maintext"
            type="text"
            value={config.birthday.mainText}
            onChange={(e) => updateBirthday("mainText", e.target.value)}
            className={inputClass}
            placeholder="Feliz Cumpleaños"
          />
        </Field>

        {/* Subtitle */}
        <Field label="Subtítulo de la pantalla de celebración" id="birthday-subtitle">
          <textarea
            id="birthday-subtitle"
            value={config.birthday.subtitle}
            onChange={(e) => updateBirthday("subtitle", e.target.value)}
            className={`${inputClass} resize-none`}
            rows={2}
            placeholder="Esperamos que disfrutes este pequeño regalo..."
          />
        </Field>

        {/* Cake image */}
        <Field
          label="URL o ruta de imagen del pastel"
          id="birthday-cake"
          hint="Deja vacío para usar el pastel SVG animado por defecto"
        >
          <input
            id="birthday-cake"
            type="text"
            value={config.birthday.cakeImageUrl}
            onChange={(e) => updateBirthday("cakeImageUrl", e.target.value)}
            className={inputClass}
            placeholder="/images/pastel.png"
          />
        </Field>

        {/* Main song URL */}
        <Field
          label="URL o ruta de la canción principal"
          id="birthday-song"
          hint="MP3 que sonará durante la escena de celebración final"
        >
          <input
            id="birthday-song"
            type="text"
            value={config.birthday.mainSongUrl}
            onChange={(e) => updateBirthday("mainSongUrl", e.target.value)}
            className={inputClass}
            placeholder="/audio/cancion-principal.mp3"
          />
        </Field>

        {/* Song title */}
        <Field label="Nombre de la canción" id="birthday-song-title">
          <input
            id="birthday-song-title"
            type="text"
            value={config.birthday.mainSongTitle}
            onChange={(e) => updateBirthday("mainSongTitle", e.target.value)}
            className={inputClass}
            placeholder="Título de la canción"
          />
        </Field>

        {/* Fireworks toggle */}
        <div className="border border-[#1d1e3d] bg-[#0a0b18] p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[11px] text-[#9ca3af] tracking-widest uppercase">
                Fuegos Artificiales
              </div>
              <div className="text-[#9ca3af]/60 text-xs mt-0.5">
                Animación de fuegos en la escena final
              </div>
            </div>
            <button
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  fireworks: { ...prev.fireworks, enabled: !prev.fireworks.enabled },
                }))
              }
              className={`w-12 h-6 border transition-all duration-200 flex items-center px-0.5 ${
                config.fireworks.enabled
                  ? "bg-[#22c55e]/20 border-[#22c55e]/40"
                  : "bg-[#1d1e3d] border-[#1d1e3d]"
              }`}
            >
              <motion.div
                animate={{ x: config.fireworks.enabled ? 24 : 0 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                className={`w-5 h-5 ${config.fireworks.enabled ? "bg-[#22c55e]" : "bg-[#9ca3af]/40"}`}
              />
            </button>
          </div>
        </div>

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          disabled={isPending}
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          className={`w-full py-3 font-heading tracking-widest text-sm uppercase transition-all duration-200 ${
            saved
              ? "bg-[#22c55e] text-white"
              : "bg-[#ff003c] hover:bg-[#cc0030] text-white"
          } disabled:opacity-50`}
        >
          {isPending ? "Guardando..." : saved ? "✓ Guardado" : "Guardar Cambios"}
        </motion.button>
      </div>
    </div>
  );
}

const inputClass =
  "w-full bg-[#0d0e26] border border-[#1d1e3d] focus:border-[#ff003c]/50 text-white placeholder-[#9ca3af]/40 px-4 py-2.5 text-sm font-mono outline-none transition-all duration-200";

function Field({
  label,
  id,
  hint,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#1d1e3d] bg-[#0a0b18] p-4">
      <label
        htmlFor={id}
        className="block font-mono text-[11px] text-[#9ca3af] tracking-widest uppercase mb-2"
      >
        {label}
      </label>
      {hint && (
        <p className="text-[#9ca3af]/50 text-xs font-mono mb-2">{hint}</p>
      )}
      {children}
    </div>
  );
}
