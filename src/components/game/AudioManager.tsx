"use client";

import { useEffect, useRef } from "react";
import { ENDING_CONFIG } from "@/game/endingConfig";

let globalAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!globalAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      globalAudioCtx = new AudioContextClass();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === "suspended") {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("emodespierta-muted") === "true";
}

// ─── Procedural Fallback Sound Synthesizers ──────────────────────────────────

/**
 * Synthesizes a firework explosion: low thump + sparkling noise crackle.
 */
function playProceduralFirework() {
  const ctx = getAudioContext();
  if (!ctx || isMuted()) return;

  const now = ctx.currentTime;

  // 1. Bass Thump
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(10, now + 0.5);
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);

  // 2. High Sparkle Crackle (Noise)
  const bufferSize = ctx.sampleRate * 0.8;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1800, now);
  filter.frequency.exponentialRampToValueAtTime(500, now + 0.8);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.12, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  noiseNode.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseNode.start(now);
  noiseNode.stop(now + 0.8);
}

/**
 * Synthesizes a confetti pop: rapid high pitch blip noise.
 */
function playProceduralConfetti() {
  const ctx = getAudioContext();
  if (!ctx || isMuted()) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

/**
 * Synthesizes cake rising chime: rising arpeggio chord.
 */
function playProceduralCake() {
  const ctx = getAudioContext();
  if (!ctx || isMuted()) return;

  const now = ctx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.5]; // C major scale rise

  notes.forEach((freq, idx) => {
    const timeOffset = idx * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + timeOffset);

    gain.gain.setValueAtTime(0.0, now + timeOffset);
    gain.gain.linearRampToValueAtTime(0.15, now + timeOffset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + timeOffset);
    osc.stop(now + timeOffset + 0.4);
  });
}

/**
 * Synthesizes button click.
 */
function playProceduralClick() {
  const ctx = getAudioContext();
  if (!ctx || isMuted()) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.12);
}

/**
 * Synthesizes transition slide.
 */
function playProceduralTransition() {
  const ctx = getAudioContext();
  if (!ctx || isMuted()) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 1.2);

  gain.gain.setValueAtTime(0.0, now);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.2);
}

/**
 * Synthesizes ambient background music: alternating warm synth chords.
 */
let proceduralMusicOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
let proceduralMusicInterval: ReturnType<typeof setInterval> | null = null;

function startProceduralMusic() {
  const ctx = getAudioContext();
  if (!ctx || isMuted()) return;

  stopProceduralMusic();

  const chordProgression = [
    [130.81, 164.81, 196.00, 261.63], // C3, E3, G3, C4
    [146.83, 174.61, 220.00, 293.66], // D3, F3, A3, D4
    [110.07, 130.81, 164.81, 220.00], // A2, C3, E3, A3
    [130.81, 164.81, 196.00, 261.63], // C3, E3, G3, C4
  ];

  let progressionIndex = 0;

  function playNextChord() {
    const now = ctx!.currentTime;
    const notes = chordProgression[progressionIndex]!;
    progressionIndex = (progressionIndex + 1) % chordProgression.length;

    notes.forEach((freq) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      // Slow fade in and fade out
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 2.0); // very soft
      gain.gain.linearRampToValueAtTime(0, now + 5.8);

      osc.connect(gain);
      gain.connect(ctx!.destination);
      osc.start(now);
      osc.stop(now + 6.0);

      proceduralMusicOscs.push({ osc, gain });
    });
  }

  playNextChord();
  proceduralMusicInterval = setInterval(playNextChord, 5800);
}

function stopProceduralMusic() {
  if (proceduralMusicInterval) {
    clearInterval(proceduralMusicInterval);
    proceduralMusicInterval = null;
  }
  proceduralMusicOscs.forEach(({ osc }) => {
    try {
      osc.stop();
    } catch (_) {}
  });
  proceduralMusicOscs = [];
}

// ─── Public SFX Helpers ──────────────────────────────────────────────────────

export function playFireworkSFX() {
  const { firework } = ENDING_CONFIG.assets.sfx;
  if (!firework) {
    playProceduralFirework();
    return;
  }
  const audio = new Audio(firework);
  audio.volume = 0.45;
  audio.play().catch(() => playProceduralFirework());
}

export function playConfettiSFX() {
  const { confetti } = ENDING_CONFIG.assets.sfx;
  if (!confetti) {
    playProceduralConfetti();
    return;
  }
  const audio = new Audio(confetti);
  audio.volume = 0.5;
  audio.play().catch(() => playProceduralConfetti());
}

export function playCakeSFX() {
  const { cake } = ENDING_CONFIG.assets.sfx;
  if (!cake) {
    playProceduralCake();
    return;
  }
  const audio = new Audio(cake);
  audio.volume = 0.6;
  audio.play().catch(() => playProceduralCake());
}

export function playClickSFX() {
  const { click } = ENDING_CONFIG.assets.sfx;
  if (!click) {
    playProceduralClick();
    return;
  }
  const audio = new Audio(click);
  audio.volume = 0.5;
  audio.play().catch(() => playProceduralClick());
}

export function playTransitionSFX() {
  const { transition } = ENDING_CONFIG.assets.sfx;
  if (!transition) {
    playProceduralTransition();
    return;
  }
  const audio = new Audio(transition);
  audio.volume = 0.6;
  audio.play().catch(() => playProceduralTransition());
}

// ─── AudioManager Component ──────────────────────────────────────────────────

interface AudioManagerProps {
  playMusic: boolean;
}

/**
 * AudioManager — Handles background music loading and fade-in/fade-out.
 * Automatically falls back to high fidelity synthesized ambient music using Web Audio API
 * if the designated background music URL fails to load.
 */
export function AudioManager({ playMusic }: AudioManagerProps) {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playMusic) {
      // Turn off everything
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      }
      stopProceduralMusic();
      return;
    }

    if (isMuted()) return;

    const { musicUrl } = ENDING_CONFIG.assets;
    if (!musicUrl) {
      startProceduralMusic();
      return;
    }

    // Attempt to load and fade in musicUrl
    const music = new Audio(musicUrl);
    musicRef.current = music;
    music.loop = true;
    music.volume = 0;

    let fadeVolume = 0;
    const targetVolume = 0.55;
    const fadeDurationMs = 3000;
    const intervalTimeMs = 50;
    const step = targetVolume / (fadeDurationMs / intervalTimeMs);

    music.play()
      .then(() => {
        fadeIntervalRef.current = setInterval(() => {
          fadeVolume = Math.min(targetVolume, fadeVolume + step);
          music.volume = fadeVolume;
          if (fadeVolume >= targetVolume) {
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
              fadeIntervalRef.current = null;
            }
          }
        }, intervalTimeMs);
      })
      .catch((err) => {
        console.warn("Audio file playback failed. Falling back to synthesized chords.", err);
        startProceduralMusic();
      });

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
      stopProceduralMusic();
    };
  }, [playMusic]);

  return null;
}
