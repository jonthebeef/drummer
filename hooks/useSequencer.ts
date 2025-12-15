/**
 * useSequencer Hook - Lookahead Scheduler
 *
 * This hook handles precise timing for drum pattern playback using the
 * Web Audio API's high-resolution clock and lookahead scheduling.
 *
 * How it works:
 * - Uses the AudioContext clock (not requestAnimationFrame) for timing
 * - Schedules audio events 100ms ahead for sample-accurate playback
 * - Visual updates are scheduled via setTimeout to sync with audio
 * - This ensures audio and visuals are perfectly synchronized
 *
 * Why lookahead scheduling?
 * - requestAnimationFrame is tied to screen refresh (~16ms at 60fps)
 * - JavaScript timers are not precise enough for music
 * - Web Audio's scheduling is sample-accurate when scheduled ahead
 * - This is how DAWs, rhythm games, and music apps handle timing
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { getAudioContext } from "@/utils/drumSynth";

// Timing constants (in seconds)
const LOOKAHEAD = 0.1;         // Schedule 100ms ahead
const SCHEDULE_INTERVAL = 25;  // Run scheduler every 25ms

interface UseSequencerProps {
  totalSteps: number;     // Usually 8 for eighth notes
  initialBpm: number;     // Starting tempo
  onStepChange?: (step: number, time: number) => void;  // Callback with scheduled time
}

interface UseSequencerReturn {
  currentStep: number;    // Current step for visual display (0-indexed)
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
  // Visual state (updated via setTimeout to sync with scheduled audio)
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpmState] = useState(initialBpm);

  // Refs for scheduler state (don't trigger re-renders)
  const nextStepTimeRef = useRef<number>(0);      // When the next step should play (audio time)
  const schedulerStepRef = useRef<number>(0);     // Which step the scheduler is on
  const schedulerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bpmRef = useRef(initialBpm);              // Current BPM for scheduler
  const onStepChangeRef = useRef(onStepChange);   // Callback ref to avoid stale closures

  // Keep refs in sync with state/props
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    onStepChangeRef.current = onStepChange;
  }, [onStepChange]);

  /**
   * Calculate step duration in seconds
   * For 8th notes at 60 BPM:
   * - 60 quarter notes per minute = 1 quarter note per second
   * - 1 eighth note = 0.5 seconds
   */
  const getStepDuration = useCallback((currentBpm: number): number => {
    const secondsPerBeat = 60 / currentBpm;
    const secondsPerEighthNote = secondsPerBeat / 2;
    return secondsPerEighthNote;
  }, []);

  /**
   * The lookahead scheduler
   * Runs every SCHEDULE_INTERVAL ms and schedules any events
   * that fall within the LOOKAHEAD window
   */
  const scheduler = useCallback(() => {
    const audioContext = getAudioContext();
    const stepDuration = getStepDuration(bpmRef.current);
    const currentTime = audioContext.currentTime;

    // Schedule all steps that fall within the lookahead window
    while (nextStepTimeRef.current < currentTime + LOOKAHEAD) {
      const step = schedulerStepRef.current;
      const scheduledTime = nextStepTimeRef.current;

      // Only schedule if the time is in the future (or very close to now)
      // This prevents scheduling sounds in the past on first run
      if (scheduledTime >= currentTime - 0.01) {
        // Schedule audio via callback (pass the exact time for Web Audio scheduling)
        if (onStepChangeRef.current) {
          onStepChangeRef.current(step, scheduledTime);
        }

        // Schedule visual update to happen when audio plays
        // Calculate delay from now until scheduled time
        const delayMs = Math.max(0, (scheduledTime - currentTime) * 1000);

        // Capture step value for the timeout closure
        const stepToShow = step;
        setTimeout(() => {
          setCurrentStep(stepToShow);
        }, delayMs);
      }

      // Advance to next step
      nextStepTimeRef.current += stepDuration;
      schedulerStepRef.current = (schedulerStepRef.current + 1) % totalSteps;
    }
  }, [totalSteps, getStepDuration]);

  /**
   * Start playback
   */
  const play = useCallback(() => {
    if (isPlaying) return;

    const audioContext = getAudioContext();

    // Resume audio context if suspended (required after user interaction)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Start from current step, scheduling from "now"
    // Add a tiny offset so first note isn't in the past
    nextStepTimeRef.current = audioContext.currentTime + 0.05;
    schedulerStepRef.current = currentStep;

    // Start the scheduler loop
    schedulerIntervalRef.current = setInterval(scheduler, SCHEDULE_INTERVAL);

    // Run scheduler immediately to queue up first notes
    scheduler();

    setIsPlaying(true);
  }, [isPlaying, currentStep, scheduler]);

  /**
   * Pause playback (keeps current position)
   */
  const pause = useCallback(() => {
    if (schedulerIntervalRef.current) {
      clearInterval(schedulerIntervalRef.current);
      schedulerIntervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  /**
   * Stop playback (pause and reset to beginning)
   */
  const stop = useCallback(() => {
    pause();
    setCurrentStep(0);
    schedulerStepRef.current = 0;
  }, [pause]);

  /**
   * Set BPM (clamped to 40-200)
   */
  const setBpm = useCallback((newBpm: number) => {
    const clampedBpm = Math.max(40, Math.min(200, newBpm));
    setBpmState(clampedBpm);
  }, []);

  /**
   * Manually set the current step
   */
  const setStep = useCallback((step: number) => {
    const clampedStep = Math.max(0, Math.min(totalSteps - 1, step));
    setCurrentStep(clampedStep);
    schedulerStepRef.current = clampedStep;
  }, [totalSteps]);

  /**
   * Cleanup: stop scheduler when component unmounts
   */
  useEffect(() => {
    return () => {
      if (schedulerIntervalRef.current) {
        clearInterval(schedulerIntervalRef.current);
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
