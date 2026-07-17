"use client";

let audioCtx: AudioContext | null = null;
let isMuted = false;

// Initialize audio context lazily on user interaction
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // Standard AudioContext or webkit fallback
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  
  return audioCtx;
}

export function setMuteState(muted: boolean) {
  isMuted = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("emodespierta-muted", muted ? "true" : "false");
  }
}

export function getMuteState(): boolean {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("emodespierta-muted");
    if (saved !== null) {
      isMuted = saved === "true";
    }
  }
  return isMuted;
}

// 1. Hover Sound: Quick retro pitch slide upwards
export function playHoverSound() {
  if (getMuteState()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(450, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.08);

  gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

// 2. Click Sound: Retro 8-bit blip click
export function playClickSound() {
  if (getMuteState()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

// 3. Open Envelope Sound: Positive rising chords + paper slide
export function playOpenEnvelopeSound() {
  if (getMuteState()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Synthesize positive chime chord C5 - E5 - G5 - C6
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + idx * 0.05);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.05 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.05);
    osc.stop(now + idx * 0.05 + 0.3);
  });

  // Paper rustle sound overlay
  playPaperSound(0.2);
}

// 4. Close Envelope Sound: Falling notes
export function playCloseEnvelopeSound() {
  if (getMuteState()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [783.99, 659.25, 523.25]; // G5, E5, C5
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 0.25);
  });

  playPaperSound(0.15);
}

// 5. Paper rustling sound: Synthesized white noise with bandpass filtering
export function playPaperSound(duration = 0.25) {
  if (getMuteState()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate white noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  // Filter to make noise sound more like rustling paper (bandpass between 800Hz and 3000Hz)
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1800, now);
  filter.frequency.exponentialRampToValueAtTime(1000, now + duration);
  filter.Q.setValueAtTime(1.5, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.linearRampToValueAtTime(0.12, now + duration * 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noiseNode.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noiseNode.start(now);
  noiseNode.stop(now + duration);
}

// 6. Vinyl crackle overlay: Small clicks and turntable hum
export function playVinylSound() {
  if (getMuteState()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Low hum (Turntable motor hum)
  const humOsc = ctx.createOscillator();
  const humGain = ctx.createGain();
  humOsc.type = "sine";
  humOsc.frequency.setValueAtTime(60, now); // 60Hz hum
  
  humGain.gain.setValueAtTime(0.03, now);
  humGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
  
  humOsc.connect(humGain);
  humGain.connect(ctx.destination);
  humOsc.start(now);
  humOsc.stop(now + 1.2);

  // Crackling needle scratch
  for (let i = 0; i < 6; i++) {
    const triggerTime = now + i * 0.15 + Math.random() * 0.08;
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    
    clickOsc.type = "triangle";
    clickOsc.frequency.setValueAtTime(Math.random() * 3000 + 1000, triggerTime);
    
    clickGain.gain.setValueAtTime(0.015, triggerTime);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, triggerTime + 0.01);
    
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    
    clickOsc.start(triggerTime);
    clickOsc.stop(triggerTime + 0.012);
  }
}

// 7. Confetti pop sound: A quick burst of pop notes
export function playConfettiSound() {
  if (getMuteState()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  for (let i = 0; i < 8; i++) {
    const triggerTime = now + Math.random() * 0.25;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = "sine";
    const baseFreq = Math.random() * 400 + 300; // 300Hz - 700Hz pop
    osc.frequency.setValueAtTime(baseFreq, triggerTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, triggerTime + 0.08);

    gain.gain.setValueAtTime(0.05, triggerTime);
    gain.gain.linearRampToValueAtTime(0.001, triggerTime + 0.08);

    if (panner) {
      panner.pan.setValueAtTime(Math.random() * 2 - 1, triggerTime); // Random stereo direction
      osc.connect(panner);
      panner.connect(gain);
    } else {
      osc.connect(gain);
    }
    
    gain.connect(ctx.destination);

    osc.start(triggerTime);
    osc.stop(triggerTime + 0.08);
  }
}

// 8. Fireworks sound: Deep explosions and high frequency crackling trails
export function playFireworksSound() {
  if (getMuteState()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Deep Boom (Explosion base)
  const boomOsc = ctx.createOscillator();
  const boomGain = ctx.createGain();
  
  boomOsc.type = "sine";
  boomOsc.frequency.setValueAtTime(160, now);
  boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

  boomGain.gain.setValueAtTime(0.25, now);
  boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  boomOsc.connect(boomGain);
  boomGain.connect(ctx.destination);

  boomOsc.start(now);
  boomOsc.stop(now + 0.5);

  // 2. Sparkle noise trail decaimiento (High pitch pops)
  for (let i = 0; i < 15; i++) {
    const triggerTime = now + 0.1 + Math.random() * 0.6;
    const sparkOsc = ctx.createOscillator();
    const sparkGain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    sparkOsc.type = "sawtooth";
    sparkOsc.frequency.setValueAtTime(Math.random() * 2000 + 800, triggerTime);

    sparkGain.gain.setValueAtTime(0.02, triggerTime);
    sparkGain.gain.exponentialRampToValueAtTime(0.0001, triggerTime + 0.04);

    if (panner) {
      panner.pan.setValueAtTime(Math.random() * 2 - 1, triggerTime);
      sparkOsc.connect(panner);
      panner.connect(sparkGain);
    } else {
      sparkOsc.connect(sparkGain);
    }
    
    sparkGain.connect(ctx.destination);

    sparkOsc.start(triggerTime);
    sparkOsc.stop(triggerTime + 0.04);
  }
}
