"use client";

import React, { useState } from "react";
import { Persona, MemoryModule } from "@/types";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { MusicDiscPlayer } from "@/components/gallery/music-disc-player";
import { ModuleCarousel } from "@/components/gallery/module-carousel";
import { LetterViewer } from "@/components/gallery/viewers/letter-viewer";
import { VideoViewer } from "@/components/gallery/viewers/video-viewer";
import { GalleryViewer } from "@/components/gallery/viewers/gallery-viewer";
import { AudioViewer } from "@/components/gallery/viewers/audio-viewer";
import { playOpenEnvelopeSound, playCloseEnvelopeSound, playHoverSound, playClickSound } from "@/lib/sounds";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PersonaCardProps {
  persona: Persona;
}

export function PersonaCard({ persona }: PersonaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModule, setActiveModule] = useState<MemoryModule | null>(null);

  const toggleExpand = () => {
    if (isExpanded) {
      playCloseEnvelopeSound();
      setIsExpanded(false);
    } else {
      playOpenEnvelopeSound();
      setIsExpanded(true);
    }
  };

  const handleModuleClick = (module: MemoryModule) => {
    setActiveModule(module);
  };

  const handleCloseViewer = () => {
    setActiveModule(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* 3D Envelope Card Container */}
      <motion.div
        layout
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "w-full border-4 border-border bg-card pixel-border transition-all duration-300 relative overflow-hidden select-none",
          isExpanded ? "glow-spider-strong border-primary" : "hover:border-primary/60 pixel-border-hover glow-spider"
        )}
      >
        {/* Closed / Header Face of the Envelope */}
        <div
          onClick={toggleExpand}
          onMouseEnter={playHoverSound}
          className="relative p-6 sm:p-8 cursor-pointer flex flex-col items-center justify-center min-h-[220px] text-center gap-4 group"
        >
          {/* Top Flap Visual Indicator for 3D effect */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-primary/20 pointer-events-none" />
          
          {/* Envelope Seal Icon */}
          <motion.div 
            animate={isExpanded ? { scale: 0.9, rotate: 180 } : { scale: [1, 1.05, 1], rotate: 0 }}
            transition={isExpanded ? { duration: 0.4 } : { repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className={cn(
              "w-16 h-16 border-2 flex items-center justify-center text-primary bg-zinc-950/60 shadow-inner",
              isExpanded ? "border-primary" : "border-border group-hover:border-primary"
            )}
          >
            <PixelIcon name="spider" size={32} />
          </motion.div>

          <div className="space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary">
              Feliz cumpleaños Emo
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight leading-none">
              De parte de: {persona.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 border border-border bg-muted/30 px-3 py-1 text-xs font-sans text-muted-foreground group-hover:text-primary group-hover:border-primary transition-colors">
            <PixelIcon name="envelope" size={14} />
            <span>{isExpanded ? "Cerrar Sobre" : "Abrir Sobre"}</span>
          </div>
        </div>

        {/* Envelope Content Reveal Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: "auto", 
                opacity: 1,
                transition: { height: { duration: 0.5 }, opacity: { delay: 0.1, duration: 0.3 } }
              }}
              exit={{ 
                height: 0, 
                opacity: 0,
                transition: { opacity: { duration: 0.2 }, height: { duration: 0.4 } }
              }}
              className="border-t-4 border-border/80 bg-zinc-950/50"
            >
              <div className="p-6 sm:p-8 space-y-8">
                {/* 1. The Falling Content Animation wrapper */}
                <motion.div
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 15, delay: 0.1 }}
                  className="space-y-8"
                >
                  {/* Music Disc Player section */}
                  {persona.musicUrl && persona.musicTitle && (
                    <div className="w-full">
                      <MusicDiscPlayer
                        musicUrl={persona.musicUrl}
                        musicTitle={persona.musicTitle}
                        artistName={persona.name}
                        themeColor={persona.themeColor}
                      />
                    </div>
                  )}

                  {/* Memory Carousel Modules section */}
                  {persona.modules && persona.modules.length > 0 && (
                    <ModuleCarousel
                      modules={persona.modules}
                      onModuleClick={handleModuleClick}
                      themeColor={persona.themeColor}
                    />
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Media Overlay Viewer modals */}
      {activeModule && (
        <>
          {/* Letter/Written Message */}
          {activeModule.type === "message" && (
            <LetterViewer
              isOpen={activeModule !== null}
              onClose={handleCloseViewer}
              title={activeModule.title}
              text={activeModule.content.text || ""}
              sender={persona.name}
            />
          )}

          {/* Video Player */}
          {activeModule.type === "video" && (
            <VideoViewer
              isOpen={activeModule !== null}
              onClose={handleCloseViewer}
              title={activeModule.title}
              videoUrl={activeModule.content.mediaUrl || ""}
            />
          )}

          {/* Photo Gallery Lightbox */}
          {activeModule.type === "photos" && (
            <GalleryViewer
              isOpen={activeModule !== null}
              onClose={handleCloseViewer}
              title={activeModule.title}
              images={activeModule.content.images || []}
            />
          )}

          {/* Audio Message */}
          {activeModule.type === "audio" && (
            <AudioViewer
              isOpen={activeModule !== null}
              onClose={handleCloseViewer}
              title={activeModule.title}
              audioUrl={activeModule.content.mediaUrl || ""}
              sender={persona.name}
            />
          )}
        </>
      )}
    </div>
  );
}
