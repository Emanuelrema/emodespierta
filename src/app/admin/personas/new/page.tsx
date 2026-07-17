"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NewPersonaPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");

    startTransition(async () => {
      const res = await fetch("/api/admin/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        const persona = await res.json();
        router.push(`/admin/personas/${persona.id}`);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Error al crear la persona");
      }
    });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back */}
        <a
          href="/admin/personas"
          className="inline-flex items-center gap-1.5 text-[#9ca3af] hover:text-white text-xs font-mono transition-colors mb-6"
        >
          ← Volver a Personas
        </a>

        <div className="border border-[#1d1e3d] bg-[#0a0b18] p-8">
          <div className="text-center mb-8">
            <span className="font-heading text-3xl">💌</span>
            <h1 className="font-heading text-xl text-white tracking-wider mt-2">
              Nueva Persona
            </h1>
            <p className="text-[#9ca3af] text-sm mt-1">
              Ingresa solo el nombre. Podrás agregar contenido después.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="persona-name"
                className="block font-mono text-[11px] text-[#9ca3af] tracking-widest uppercase mb-2"
              >
                Nombre
              </label>
              <input
                id="persona-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Walter, Mamá, Gabo..."
                autoFocus
                className="w-full bg-[#0d0e26] border border-[#1d1e3d] text-white placeholder-[#9ca3af]/40 px-4 py-3 text-sm outline-none focus:border-[#ff003c] focus:ring-1 focus:ring-[#ff003c]/20 transition-all duration-200"
              />
            </div>

            {error && (
              <p className="text-[#ff003c] text-xs font-mono border border-[#ff003c]/30 bg-[#ff003c]/5 px-3 py-2">
                ⚠ {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={isPending || !name.trim()}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-[#ff003c] hover:bg-[#cc0030] disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading tracking-widest text-sm py-3 transition-all duration-200 uppercase"
            >
              {isPending ? "Creando..." : "✅ Guardar"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
