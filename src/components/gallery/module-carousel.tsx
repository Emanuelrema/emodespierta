"use client";

import React from "react";
import { MemoryModule, ModuleType } from "@/types";
import { PixelIcon, PixelIconName } from "@/components/ui/pixel-icon";
import { playClickSound, playHoverSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

interface ModuleCarouselProps {
  modules: MemoryModule[];
  onModuleClick: (module: MemoryModule) => void;
  themeColor: string;
}

export function ModuleCarousel({ modules, onModuleClick, themeColor }: ModuleCarouselProps) {
  const getIconName = (type: ModuleType): PixelIconName => {
    switch (type) {
      case "message":
        return "letter";
      case "video":
        return "video";
      case "photos":
        return "photos";
      case "audio":
        return "audio";
      default:
        return "letter";
    }
  };

  const getLabel = (type: ModuleType) => {
    switch (type) {
      case "message":
        return "Carta Escrita";
      case "video":
        return "Grabación";
      case "photos":
        return "Galería Fotos";
      case "audio":
        return "Nota de Voz";
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary">Módulos de Recuerdos</h4>
        <span className="text-[10px] font-sans text-muted-foreground/60 select-none hidden sm:inline">Desliza para ver más &rarr;</span>
      </div>

      {/* Horizontal Swiper Track */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-2 scrollbar-none snap-x snap-mandatory">
        {modules.map((module) => (
          <div 
            key={module.id} 
            className="snap-start shrink-0 w-[240px] sm:w-[260px]" 
            onClick={() => {
              playClickSound();
              onModuleClick(module);
            }}
            onMouseEnter={playHoverSound}
          >
            <div
              className={cn(
                "h-44 flex flex-col justify-between p-5 border-4 border-border bg-card pixel-border cursor-pointer select-none transition-colors",
                "hover:border-primary"
              )}
            >
              <div>
                <div className="inline-flex items-center justify-center p-2 border-2 border-border bg-muted text-primary mb-3">
                  <PixelIcon name={getIconName(module.type)} size={20} />
                </div>
                <h5 className="text-sm font-heading font-bold line-clamp-1 text-white">{module.title}</h5>
                <span className="text-[9px] font-sans font-bold tracking-wider uppercase text-primary mt-0.5 block">
                  {getLabel(module.type)}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
