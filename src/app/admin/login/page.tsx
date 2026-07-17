"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        if (res.ok) {
          router.push("/admin");
          router.refresh();
        } else {
          const data = await res.json();
          setError(data.error ?? "Contraseña incorrecta");
        }
      } catch {
        setError("Error de conexión. Intenta de nuevo.");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Atmospheric gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04040c] via-[#0a0826] to-[#04040c]" />
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="border border-[#1d1e3d] bg-[#0a0b18]/90 backdrop-blur-sm p-8 shadow-2xl shadow-purple-900/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="font-heading text-4xl mb-2"
            >
              🕷️💌
            </motion.div>
            <h1 className="font-heading text-2xl text-white tracking-wider">
              EmoDespierta Studio
            </h1>
            <p className="text-[#9ca3af] text-sm mt-1 font-mono">
              Área privada · Acceso restringido
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[#1d1e3d]" />
            <span className="text-[#9ca3af] text-xs font-mono tracking-widest">
              CONTRASEÑA
            </span>
            <div className="h-px flex-1 bg-[#1d1e3d]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                autoFocus
                className="w-full bg-[#0d0e26] border border-[#1d1e3d] text-white placeholder-[#9ca3af]/50 px-4 py-3 font-mono text-sm outline-none focus:border-[#ff003c] focus:ring-1 focus:ring-[#ff003c]/30 transition-all duration-200"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-[#ff003c] text-xs font-mono border border-[#ff003c]/30 bg-[#ff003c]/5 px-3 py-2"
                >
                  ⚠ {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isPending || !password}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-[#ff003c] hover:bg-[#cc0030] disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading tracking-widest text-sm py-3 transition-all duration-200 uppercase"
            >
              {isPending ? "Verificando..." : "Entrar al Studio"}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-[#9ca3af]/40 text-xs font-mono mt-6">
            EmoDespierta · Proyecto privado
          </p>
        </div>

        {/* Pixel accent lines */}
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff003c] to-transparent" />
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent" />
      </motion.div>
    </div>
  );
}
