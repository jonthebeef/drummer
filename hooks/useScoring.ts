/**
 * Scoring Hook
 *
 * Tracks user drum hits and scores them against the expected pattern.
 * Provides real-time feedback and calculates stars earned.
 *
 * How it works:
 * 1. Listens for drum hit events (from keyboard or tap buttons)
 * 2. Compares hits to the expected pattern at each step
 * 3. Tracks which steps were hit correctly
 * 4. After several loops, calculates accuracy and stars
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { Pattern, DrumType, ScoringResult, Stars } from "@/types";

interface UseScoringProps {
  pattern: Pattern;
  isPlaying: boolean;
  currentStep: number;       // 0-indexed step from sequencer
  bpm: number;
  isTimingExercise?: boolean; // If true, accept any drum on marked steps
}

interface UseScoringReturn {
  recordHit: (drum: DrumType) => void;  // Call this when user hits a drum
  getStepFeedback: (step: number) => "correct" | "incorrect" | null;  // Visual feedback per step
  getScoringResult: () => ScoringResult | null;  // Get final result after enough loops
  resetScoring: () => void;  // Start fresh
  loopsCompleted: number;    // How many full loops have been played
}

// How many loops to score before giving results
const LOOPS_TO_SCORE = 4;

// Timing window for a hit to be considered "correct" (milliseconds)
// Generous window for kids + mobile touch latency
// At 50 BPM, an eighth note is 600ms, so 350ms is ~60% of the step
const TIMING_WINDOW_MS = 350;

/**
 * Calculate stars from accuracy percentage
 * Kid-friendly thresholds - encouraging but still challenging
 */
function calculateStars(accuracy: number): Stars {
  if (accuracy >= 90) return 3;  // ⭐⭐⭐ Excellent!
  if (accuracy >= 70) return 2;  // ⭐⭐ Great!
  if (accuracy >= 50) return 1;  // ⭐ Good try!
  return 0;  // Keep practicing
}

/**
 * Get encouraging feedback based on stars earned
 */
function getFeedback(stars: Stars): string {
  const messages = {
    3: [
      "Amazing! You're a natural drummer!",
      "Perfect timing! That was brilliant!",
      "Wow! You absolutely nailed it!",
      "Incredible! Your rhythm is spot on!",
    ],
    2: [
      "Excellent work! You've got this beat down!",
      "Great job! Your timing is really improving!",
      "Brilliant! Keep up that steady rhythm!",
      "Well done! You're getting the hang of it!",
    ],
    1: [
      "Good effort! You're on the right track!",
      "Nice try! Practice makes perfect!",
      "You're getting there! Keep practising!",
      "Well done for having a go! Try it again!",
    ],
    0: [
      "Give it another try! You can do this!",
      "Keep practising! You'll get it!",
      "Don't give up! Every drummer started here!",
      "Try again! Focus on keeping steady!",
    ],
  };

  const options = messages[stars];
  return options[Math.floor(Math.random() * options.length)];
}

export function useScoring({
  pattern,
  isPlaying,
  currentStep,
  bpm,
  isTimingExercise = false,
}: UseScoringProps): UseScoringReturn {
  // Track hits for each step across all loops
  // Key: "loop-step" e.g. "0-3" = loop 0, step 3
  const [hitRecord, setHitRecord] = useState<Record<string, { expected: DrumType[], actual: DrumType[] }>>({});

  // Track loops completed
  const [loopsCompleted, setLoopsCompleted] = useState(0);

  // Track the last step we saw (to detect loop completion)
  const lastStepRef = useRef(-1);

  // Track when each step happens (for timing window)
  const stepTimestampRef = useRef(0);

  /**
   * Detect when a loop completes (step goes from 7 to 0)
   */
  useEffect(() => {
    if (!isPlaying) return;

    if (lastStepRef.current === pattern.steps.length - 1 && currentStep === 0) {
      setLoopsCompleted(prev => prev + 1);
    }

    lastStepRef.current = currentStep;
    stepTimestampRef.current = performance.now();
  }, [currentStep, isPlaying, pattern.steps.length]);

  /**
   * Record a drum hit from the user
   */
  const recordHit = useCallback((drum: DrumType) => {
    if (!isPlaying || loopsCompleted >= LOOPS_TO_SCORE) return;

    // Check timing - was this hit within the window?
    const now = performance.now();
    const timeSinceStep = now - stepTimestampRef.current;

    // Get expected drums for this step
    const currentStepData = pattern.steps.find(s => s.step === currentStep + 1);
    const expectedDrums = currentStepData?.hit || [];

    // Timing window - extra generous for timing exercises
    const windowMs = isTimingExercise ? 450 : TIMING_WINDOW_MS;

    if (timeSinceStep > windowMs) {
      // Hit was too late, don't count it
      return;
    }

    // Record this hit
    const key = `${loopsCompleted}-${currentStep}`;
    setHitRecord(prev => {
      const existing = prev[key] || { expected: expectedDrums, actual: [] };
      return {
        ...prev,
        [key]: {
          ...existing,
          actual: [...existing.actual, drum],
        },
      };
    });
  }, [isPlaying, loopsCompleted, currentStep, pattern.steps]);

  /**
   * Get visual feedback for a specific step
   * Returns "correct" if all expected drums were hit, null otherwise
   */
  const getStepFeedback = useCallback((step: number) => {
    if (loopsCompleted === 0) return null;

    // Check the most recent loop
    const key = `${loopsCompleted - 1}-${step}`;
    const record = hitRecord[key];

    if (!record) return null;

    // For timing exercises, just check if SOMETHING was hit (accept any drum)
    if (isTimingExercise && record.expected.length > 0) {
      return record.actual.length > 0 ? "correct" : null;
    }

    // For regular exercises, check if all expected drums were hit
    const allHit = record.expected.every(drum => record.actual.includes(drum));
    return allHit ? "correct" : "incorrect";
  }, [hitRecord, loopsCompleted, isTimingExercise]);

  /**
   * Calculate the final scoring result after enough loops
   */
  const getScoringResult = useCallback((): ScoringResult | null => {
    if (loopsCompleted < LOOPS_TO_SCORE) return null;

    // Count correct hits across all loops
    let totalExpectedHits = 0;
    let correctHits = 0;

    for (let loop = 0; loop < LOOPS_TO_SCORE; loop++) {
      for (let step = 0; step < pattern.steps.length; step++) {
        const patternStep = pattern.steps.find(s => s.step === step + 1);
        const expectedDrums = patternStep?.hit || [];

        // Skip steps with no expected drums
        if (expectedDrums.length === 0) continue;

        const key = `${loop}-${step}`;
        const record = hitRecord[key];
        const actualDrums = record?.actual || [];

        if (isTimingExercise) {
          // For timing exercises, count steps where SOMETHING was hit (accept any drum)
          totalExpectedHits += 1;
          if (actualDrums.length > 0) {
            correctHits += 1;
          }
        } else {
          // For regular exercises, count specific drum hits
          totalExpectedHits += expectedDrums.length;

          // Check if all expected drums were hit (allowing for extras)
          const allCorrect = expectedDrums.every(drum => actualDrums.includes(drum));
          if (allCorrect) {
            correctHits += expectedDrums.length;
          }
        }
      }
    }

    // Calculate accuracy
    const accuracy = totalExpectedHits > 0
      ? Math.round((correctHits / totalExpectedHits) * 100)
      : 0;

    const stars = calculateStars(accuracy);

    return {
      totalSteps: totalExpectedHits,
      correctHits,
      accuracy,
      stars,
      feedback: getFeedback(stars),
    };
  }, [loopsCompleted, pattern.steps.length, hitRecord, pattern.steps, isTimingExercise]);

  /**
   * Reset scoring to start fresh
   */
  const resetScoring = useCallback(() => {
    setHitRecord({});
    setLoopsCompleted(0);
    lastStepRef.current = -1;
  }, []);

  return {
    recordHit,
    getStepFeedback,
    getScoringResult,
    resetScoring,
    loopsCompleted,
  };
}
