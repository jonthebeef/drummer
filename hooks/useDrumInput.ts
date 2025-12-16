/**
 * useDrumInput Hook
 *
 * This hook handles user input for playing along with patterns.
 * It listens for keyboard keys (F, J, Space) and tracks when drums are hit.
 *
 * How to use:
 * - Call this hook in a component
 * - It returns the currently pressed drum (if any)
 * - You can check if the hit matches the current step's pattern
 */

import { useEffect, useState, useCallback } from "react";
import { DrumType } from "@/types";
import { playDrum, resumeAudioContext } from "@/utils/drumSynth";

interface UseDrumInputReturn {
  currentHit: DrumType | null;     // Which drum was just hit (or null)
  hitDrum: (drum: DrumType) => void;  // Function to manually trigger a hit (for buttons)
  clearHit: () => void;               // Clear the current hit
}

// Key mappings
const KEY_TO_DRUM: Record<string, DrumType> = {
  'f': 'kick',
  'F': 'kick',
  'j': 'snare',
  'J': 'snare',
  ' ': 'hihat',  // Spacebar
};

export function useDrumInput(): UseDrumInputReturn {
  const [currentHit, setCurrentHit] = useState<DrumType | null>(null);

  /**
   * Manually trigger a drum hit (for tap buttons)
   */
  const hitDrum = useCallback((drum: DrumType) => {
    // Resume audio context if needed (required by browsers)
    resumeAudioContext();

    // Play the sound
    playDrum(drum);

    // Set visual feedback
    setCurrentHit(drum);

    // Auto-clear after a short time so the visual feedback disappears
    setTimeout(() => {
      setCurrentHit(null);
    }, 150);
  }, []);

  /**
   * Clear the current hit
   */
  const clearHit = useCallback(() => {
    setCurrentHit(null);
  }, []);

  /**
   * Listen for keyboard events
   */
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Ignore repeated keydown events when key is held down
      if (event.repeat) return;

      const drum = KEY_TO_DRUM[event.key];
      if (drum) {
        event.preventDefault(); // Prevent spacebar from scrolling, etc.
        hitDrum(drum);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hitDrum]);

  return {
    currentHit,
    hitDrum,
    clearHit,
  };
}
