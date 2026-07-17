"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "react";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  pixelIcon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Inicio", icon: "🏠", pixelIcon: "▪" },
  { href: "/admin/personas", label: "Personas", icon: "💌", pixelIcon: "▫" },
  { href: "/admin/birthday", label: "Cumpleaños", icon: "🎂", pixelIcon: "◆" },
  { href: "/admin/settings", label: "Configuración", icon: "⚙️", pixelIcon: "◇" },
  { href: "/admin/preview", label: "Vista Previa", icon: "👁️", pixelIcon: "◈" },
];

interface AdminSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ open }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    });
  }

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.aside
          key="sidebar"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="border-r border-[#1d1e3d] bg-[#04040c] flex flex-col shrink-0 overflow-hidden"
        >
          {/* Logo */}
          <div className="px-5 py-5 border-b border-[#1d1e3d]">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl">🕷️💌</span>
              <div>
                <div className="font-heading text-sm text-white tracking-wider leading-tight">
                  EmoDespierta
                </div>
                <div className="font-mono text-[10px] text-[#ff003c] tracking-widest">
                  STUDIO
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3">
            <div className="mb-2 px-2">
              <span className="font-mono text-[10px] text-[#9ca3af]/50 tracking-[0.2em] uppercase">
                Menú
              </span>
            </div>
            <ul className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        group flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150
                        ${
                          isActive
                            ? "bg-[#ff003c]/10 text-white border-l-2 border-[#ff003c]"
                            : "text-[#9ca3af] hover:text-white hover:bg-[#0d0e26] border-l-2 border-transparent"
                        }
                      `}
                    >
                      <span className="text-base w-5 text-center leading-none">
                        {item.icon}
                      </span>
                      <span className="font-sans text-sm tracking-wide whitespace-nowrap">
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="ml-auto font-mono text-[#ff003c] text-xs"
                        >
                          ▶
                        </motion.span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-[#1d1e3d]">
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="w-full flex items-center gap-2 px-3 py-2 text-[#9ca3af] hover:text-[#ff003c] hover:bg-[#ff003c]/5 transition-all duration-150 text-sm border border-transparent hover:border-[#ff003c]/20"
            >
              <span className="text-base">🚪</span>
              <span className="font-mono text-xs tracking-wider">
                {isPending ? "Saliendo..." : "Cerrar Sesión"}
              </span>
            </button>

            {/* Version badge */}
            <div className="mt-3 px-3 py-2 bg-[#0d0e26] border border-[#1d1e3d]">
              <div className="font-mono text-[10px] text-[#9ca3af]/40 tracking-wider">
                EmoDespierta Studio
              </div>
              <div className="font-mono text-[10px] text-[#8b5cf6]/50">
                v1.0.0 · File-based CMS
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
