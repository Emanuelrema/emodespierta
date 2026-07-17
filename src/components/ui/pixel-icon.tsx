"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type PixelIconName =
  | "spider"
  | "envelope"
  | "letter"
  | "video"
  | "photos"
  | "audio"
  | "vinyl"
  | "sound-on"
  | "sound-off"
  | "close"
  | "play"
  | "pause"
  | "dino";

interface PixelIconProps extends React.SVGProps<SVGSVGElement> {
  name: PixelIconName;
  className?: string;
  size?: number;
}

export function PixelIcon({ name, className, size = 24, ...props }: PixelIconProps) {
  // We use standard 16x16 grid for pixel art look
  const renderIconContent = () => {
    switch (name) {
      case "spider":
        return (
          <>
            {/* Body */}
            <rect x="6" y="5" width="4" height="6" fill="currentColor" />
            {/* Head */}
            <rect x="7" y="3" width="2" height="2" fill="currentColor" />
            {/* Eyes */}
            <rect x="6" y="2" width="1" height="1" fill="#ffe600" />
            <rect x="9" y="2" width="1" height="1" fill="#ffe600" />
            {/* Legs Left */}
            <path d="M5,5 H2 V4" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M5,7 H1 V6" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M5,9 H1 V10" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M5,11 H2 V13" stroke="currentColor" strokeWidth="1" fill="none" />
            {/* Legs Right */}
            <path d="M10,5 H13 V4" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M10,7 H14 V6" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M10,9 H14 V10" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M10,11 H13 V13" stroke="currentColor" strokeWidth="1" fill="none" />
          </>
        );
      case "envelope":
        return (
          <>
            {/* Outer Border */}
            <rect x="1" y="2" width="14" height="11" fill="none" stroke="currentColor" strokeWidth="1" />
            {/* Seal Point */}
            <rect x="7" y="7" width="2" height="2" fill="currentColor" />
            {/* Flap lines */}
            <path d="M2,3 L7,8 L13,3" stroke="currentColor" strokeWidth="1" fill="none" />
            {/* Bottom corner folds */}
            <path d="M2,12 L6,8 M10,8 L13,12" stroke="currentColor" strokeWidth="1" fill="none" />
          </>
        );
      case "letter":
        return (
          <>
            {/* Paper Shape */}
            <rect x="2" y="1" width="12" height="13" fill="none" stroke="currentColor" strokeWidth="1" />
            {/* Lines */}
            <line x1="4" y1="4" x2="11" y2="4" stroke="currentColor" strokeWidth="1" />
            <line x1="4" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1" />
            <line x1="4" y1="10" x2="9" y2="10" stroke="currentColor" strokeWidth="1" />
            {/* Folded Corner */}
            <rect x="11" y="11" width="3" height="3" fill="currentColor" />
          </>
        );
      case "video":
        return (
          <>
            {/* Camera Body */}
            <rect x="1" y="3" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x="3" y="5" width="5" height="5" fill="currentColor" />
            {/* Lens Cone */}
            <path d="M10,6 L14,3 V12 L10,9 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" />
            {/* Recording light */}
            <rect x="2" y="1" width="2" height="1" fill="#ff003c" />
          </>
        );
      case "photos":
        return (
          <>
            {/* Polaroid Frame */}
            <rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" />
            {/* Inner Image Boundary */}
            <rect x="3" y="3" width="10" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
            {/* Mountain */}
            <path d="M3,10 L7,6 L10,9 L12,7 L13,8" stroke="currentColor" strokeWidth="1" fill="none" />
            {/* Sun */}
            <rect x="10" y="4" width="2" height="2" fill="currentColor" />
          </>
        );
      case "audio":
        return (
          <>
            {/* Microphone head */}
            <rect x="6" y="2" width="4" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x="7" y="3" width="2" height="5" fill="currentColor" />
            {/* Stand */}
            <path d="M4,7 V9 C4,11 12,11 12,9 V7" stroke="currentColor" strokeWidth="1" fill="none" />
            <line x1="8" y1="11" x2="8" y2="13" stroke="currentColor" strokeWidth="1" />
            <line x1="5" y1="14" x2="11" y2="14" stroke="currentColor" strokeWidth="1" />
          </>
        );
      case "vinyl":
        return (
          <>
            {/* Outer Ring */}
            <rect x="1" y="1" width="14" height="14" rx="7" fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x="2" y="2" width="12" height="12" rx="6" fill="currentColor" opacity="0.15" />
            {/* Grooves */}
            <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
            <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
            {/* Center Hole */}
            <circle cx="8" cy="8" r="1.2" fill="currentColor" />
            {/* Pixel arm hint */}
            <path d="M11,1 L13,3 V7 L10,8" stroke="currentColor" strokeWidth="0.75" fill="none" />
          </>
        );
      case "sound-on":
        return (
          <>
            {/* Speaker body */}
            <rect x="1" y="5" width="3" height="6" fill="currentColor" />
            <path d="M4,5 L8,2 V14 L4,11" stroke="currentColor" strokeWidth="1" fill="currentColor" />
            {/* Waves */}
            <path d="M11,5 Q13,8 11,11" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M13,3 Q16,8 13,13" stroke="currentColor" strokeWidth="1" fill="none" />
          </>
        );
      case "sound-off":
        return (
          <>
            {/* Speaker body */}
            <rect x="1" y="5" width="3" height="6" fill="currentColor" />
            <path d="M4,5 L8,2 V14 L4,11" stroke="currentColor" strokeWidth="1" fill="currentColor" />
            {/* X */}
            <line x1="11" y1="6" x2="15" y2="10" stroke="#ff003c" strokeWidth="1" />
            <line x1="15" y1="6" x2="11" y2="10" stroke="#ff003c" strokeWidth="1" />
          </>
        );
      case "close":
        return (
          <>
            <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="2" />
            <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="2" />
          </>
        );
      case "play":
        return (
          <>
            <path d="M4,2 V14 L13,8 Z" fill="currentColor" />
          </>
        );
      case "pause":
        return (
          <>
            <rect x="3" y="2" width="3" height="12" fill="currentColor" />
            <rect x="10" y="2" width="3" height="12" fill="currentColor" />
          </>
        );
      case "dino":
        return (
          <>
            {/* Retro Pixel Dino */}
            {/* Head & snout */}
            <rect x="6" y="2" width="6" height="4" fill="currentColor" />
            <rect x="11" y="4" width="2" height="1" fill="currentColor" />
            <rect x="7" y="3" width="1" height="1" fill="#000" /> {/* Eye */}
            {/* Neck */}
            <rect x="6" y="6" width="3" height="2" fill="currentColor" />
            {/* Body */}
            <rect x="3" y="8" width="8" height="4" fill="currentColor" />
            {/* Spikes */}
            <rect x="5" y="5" width="1" height="1" fill="#ff003c" />
            <rect x="4" y="7" width="1" height="1" fill="#ff003c" />
            <rect x="2" y="9" width="1" height="1" fill="#ff003c" />
            {/* Tail */}
            <rect x="1" y="10" width="2" height="2" fill="currentColor" />
            {/* Legs */}
            <rect x="4" y="12" width="2" height="2" fill="currentColor" />
            <rect x="8" y="12" width="2" height="2" fill="currentColor" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={cn("select-none text-current shrink-0", className)}
      shapeRendering="crispEdges"
      {...props}
    >
      {renderIconContent()}
    </svg>
  );
}
