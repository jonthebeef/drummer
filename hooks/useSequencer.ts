/**
 * useSequencer Hook
 *
 * This hook handles the timing and playback of drum patterns.
 * It keeps track of which step we're on and triggers updates at the right tempo.
 *
 * How it works:
 * - Uses requestAnimationFrame for smooth, accurate timing
 * - Calculates when each step should happen based on BPM
 * - Loops continuously through all steps
 * - Provides play/pause controls and current step index
 */

import { useEffect, useRef, useState, useCallback } from "react";

interface UseSequencerProps {
  totalSteps: number;     // Usually 8 for eighth notes, 16 for sixteenth notes
  initialBpm: number;     // Starting tempo
  onStepChange?: (step: number) => void;  // Callback when step changes
}

interface UseSequencerReturn {
  currentStep: number;    // Current step (0-indexed, so 0-7 for 8 steps)
  isPlaying: boolean;
  bpm: number;
  play: () => void;
  pause: () => void;
  stop: () => void;       // Pause and reset to step 0
  setBpm: (bpm: number) => void;
  setStep: (step: number) => void;  // Manually set current step
}

export function useSequencer({
  totalSteps,
  initialBpm,
  onStepChange,
}: UseSequencerProps): UseSequencerReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpmState] = useState(initialBpm);

  // Refs to track timing without causing re-renders
  const startTimeRef = useRef<number>(0);
  const lastStepTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  /**
   * Calculate how long each step should take in milliseconds
   * For 8th notes at 120 BPM:
   * - 120 beats per minute = 2 beats per second
   * - 1 beat = 2 eighth notes
   * - So 4 eighth notes per second
   * - Each eighth note = 250ms
   */
  const getStepDuration = useCallback((currentBpm: number) => {
    // For 8th notes: one quarter note = 60000/bpm ms, one 8th note = half that
    // For 8 steps per bar (2 eighths per beat * 4 beats), each step is 1 eighth note
    const millisecondsPerBeat = 60000 / currentBpm;
    const millisecondsPerEighthNote = millisecondsPerBeat / 2;
    return millisecondsPerEighthNote;
  }, []);

  /**
   * The main sequencer loop
   * Checks if enough time has passed to move to the next step
   */
  const tick = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      lastStepTimeRef.current = timestamp;
    }

    const elapsed = timestamp - lastStepTimeRef.current;
    const stepDuration = getStepDuration(bpm);

    // Time to move to next step?
    if (elapsed >= stepDuration) {
      setCurrentStep((prevStep) => {
        const nextStep = (prevStep + 1) % totalSteps;

        // Trigger callback
        if (onStepChange) {
          onStepChange(nextStep);
        }

        return nextStep;
      });

      // Update last step time (accounting for any drift)
      lastStepTimeRef.current = timestamp;
    }

    // Keep the loop going
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [bpm, totalSteps, getStepDuration, onStepChange]);

  /**
   * Start playback
   */
  const play = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
      startTimeRef.current = 0; // Reset timing
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  }, [isPlaying, tick]);

  /**
   * Pause playback (keeps current position)
   */
  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  /**
   * Stop playback (pause and reset to beginning)
   */
  const stop = useCallback(() => {
    pause();
    setCurrentStep(0);
    startTimeRef.current = 0;
    lastStepTimeRef.current = 0;
  }, [pause]);

  /**
   * Set BPM
   */
  const setBpm = useCallback((newBpm: number) => {
    // Clamp BPM to reasonable range
    const clampedBpm = Math.max(40, Math.min(200, newBpm));
    setBpmState(clampedBpm);
  }, []);

  /**
   * Manually set the current step
   */
  const setStep = useCallback((step: number) => {
    const clampedStep = Math.max(0, Math.min(totalSteps - 1, step));
    setCurrentStep(clampedStep);
    // Reset timing
    startTimeRef.current = 0;
    lastStepTimeRef.current = 0;
  }, [totalSteps]);

  /**
   * Cleanup: cancel animation frame when component unmounts
   */
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    currentStep,
    isPlaying,
    bpm,
    play,
    pause,
    stop,
    setBpm,
    setStep,
  };
}
