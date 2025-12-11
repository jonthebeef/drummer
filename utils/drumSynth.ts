/**
 * Drum Sound Synthesizer
 *
 * Uses the Web Audio API to generate realistic drum sounds programmatically.
 * No external audio files needed!
 *
 * How it works:
 * - Kick: Low frequency sine wave with envelope (boom!)
 * - Snare: White noise + tone with quick decay (crack!)
 * - Hi-hat: Filtered high-frequency noise (tss!)
 */

import { DrumType } from "@/types";

/**
 * Create an AudioContext (singleton pattern)
 */
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Generate a kick drum sound
 * Classic "boom" sound using a low sine wave with pitch envelope
 */
function playKick(context: AudioContext, time: number) {
  // Oscillator for the main "boom"
  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.type = 'sine';

  // Pitch envelope: start at 150Hz, quickly drop to 40Hz
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.05);

  // Amplitude envelope: start loud, decay quickly
  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

  osc.connect(gain);
  gain.connect(context.destination);

  osc.start(time);
  osc.stop(time + 0.3);
}

/**
 * Generate a snare drum sound
 * Combination of white noise (the "crack") and tone (the body)
 */
function playSnare(context: AudioContext, time: number) {
  // White noise for the "snap"
  const bufferSize = context.sampleRate * 0.2; // 200ms
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill buffer with random noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = context.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;

  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(1, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(context.destination);

  // Tonal component (gives snare some pitch)
  const osc = context.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = 180;

  const oscGain = context.createGain();
  oscGain.gain.setValueAtTime(0.3, time);
  oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

  osc.connect(oscGain);
  oscGain.connect(context.destination);

  // Start both components
  noise.start(time);
  noise.stop(time + 0.2);
  osc.start(time);
  osc.stop(time + 0.1);
}

/**
 * Generate a hi-hat sound
 * Short burst of high-frequency filtered noise
 */
function playHiHat(context: AudioContext, time: number) {
  // White noise
  const bufferSize = context.sampleRate * 0.1; // 100ms
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill with random noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = context.createBufferSource();
  noise.buffer = buffer;

  // High-pass filter to make it "tinny"
  const filter = context.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 7000;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  noise.start(time);
  noise.stop(time + 0.1);
}

/**
 * Generate a metronome click
 * Short, sharp "tick" sound to help keep time
 */
function generateMetronomeClick(context: AudioContext, time: number, accent: boolean = false) {
  // Two sine waves for a "wood block" click sound
  const osc1 = context.createOscillator();
  const osc2 = context.createOscillator();
  const gain = context.createGain();

  // Higher frequencies for a sharp click
  osc1.type = 'sine';
  osc2.type = 'sine';
  osc1.frequency.value = accent ? 1200 : 800;  // Accent beat 1 with higher pitch
  osc2.frequency.value = accent ? 1800 : 1200;

  // Very short, sharp envelope
  gain.gain.setValueAtTime(accent ? 0.4 : 0.25, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(context.destination);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.03);
  osc2.stop(time + 0.03);
}

/**
 * Play a drum sound
 * @param drum - Which drum to play
 * @param time - When to play it (in AudioContext time). If not provided, plays immediately.
 */
export function playDrum(drum: DrumType, time?: number) {
  try {
    const context = getAudioContext();
    const playTime = time !== undefined ? time : context.currentTime;

    switch (drum) {
      case 'kick':
        playKick(context, playTime);
        break;
      case 'snare':
        playSnare(context, playTime);
        break;
      case 'hihat':
        playHiHat(context, playTime);
        break;
    }
  } catch (error) {
    console.error('Error playing drum sound:', error);
  }
}

/**
 * Play a metronome click
 * @param accent - If true, plays a higher pitched "accent" click (for beat 1)
 */
export function playMetronomeClick(accent: boolean = false) {
  try {
    const context = getAudioContext();
    generateMetronomeClick(context, context.currentTime, accent);
  } catch (error) {
    console.error('Error playing metronome click:', error);
  }
}

/**
 * Resume the audio context if it's suspended
 * (Required by some browsers after user interaction)
 */
export function resumeAudioContext() {
  const context = getAudioContext();
  if (context.state === 'suspended') {
    context.resume();
  }
}
