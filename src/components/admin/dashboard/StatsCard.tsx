"use client";

import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: string;
  color?: "red" | "purple" | "yellow" | "blue" | "green";
  delay?: number;
}

const colorMap = {
  red: {
    border: "border-[#ff003c]/30",
    glow: "shadow-[#ff003c]/10",
    value: "text-[#ff003c]",
    icon: "bg-[#ff003c]/10",
  },
  purple: {
    border: "border-[#8b5cf6]/30",
    glow: "shadow-[#8b5cf6]/10",
    value: "text-[#8b5cf6]",
    icon: "bg-[#8b5cf6]/10",
  },
  yellow: {
    border: "border-[#ffe600]/30",
    glow: "shadow-[#ffe600]/10",
    value: "text-[#ffe600]",
    icon: "bg-[#ffe600]/10",
  },
  blue: {
    border: "border-[#3b82f6]/30",
    glow: "shadow-[#3b82f6]/10",
    value: "text-[#3b82f6]",
    icon: "bg-[#3b82f6]/10",
  },
  green: {
    border: "border-[#22c55e]/30",
    glow: "shadow-[#22c55e]/10",
    value: "text-[#22c55e]",
    icon: "bg-[#22c55e]/10",
  },
};

export function StatsCard({ label, value, icon, color = "purple", delay = 0 }: StatsCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={`border ${c.border} bg-[#0a0b18] p-5 shadow-lg ${c.glow} relative overflow-hidden group cursor-default`}
    >
      {/* Pixel corner accent */}
      <div className={`absolute top-0 left-0 w-1 h-full ${c.value.replace("text-", "bg-").replace("[", "[").replace("]", "]")} opacity-60`} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] text-[#9ca3af] tracking-widest uppercase mb-2">
            {label}
          </div>
          <div className={`font-heading text-3xl ${c.value} leading-none`}>
            {value}
          </div>
        </div>
        <div className={`w-10 h-10 ${c.icon} flex items-center justify-center text-xl shrink-0`}>
          {icon}
        </div>
      </div>

      {/* Hover shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    </motion.div>
  );
}
