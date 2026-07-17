"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSidebar } from "./AdminSidebar";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main content */}
      <motion.main
        layout
        className="flex-1 min-w-0 overflow-auto"
        animate={{ marginLeft: sidebarOpen ? 0 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-6 py-3 border-b border-[#1d1e3d] bg-[#04040c]/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#9ca3af] hover:text-white transition-colors w-8 h-8 flex items-center justify-center border border-transparent hover:border-[#1d1e3d]"
          >
            <span className="font-mono text-lg leading-none">{sidebarOpen ? "←" : "→"}</span>
          </button>
          <div className="h-4 w-px bg-[#1d1e3d]" />
          <span className="font-heading text-sm text-[#9ca3af] tracking-wider">
            EmoDespierta Studio
          </span>
          <span className="ml-auto font-mono text-xs text-[#9ca3af]/50">v1.0</span>
        </div>

        {/* Page content */}
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
