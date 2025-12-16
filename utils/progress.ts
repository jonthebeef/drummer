/**
 * Progress Storage Utilities
 *
 * Handles saving and loading exercise progress to/from localStorage.
 * Now supports per-account progress tracking.
 */

import { ExerciseProgress, Stars } from "@/types";
import { getCurrentAccount } from "./accounts";

/**
 * Get storage key for current account
 */
function getStorageKey(): string {
  const currentAccount = getCurrentAccount();
  if (!currentAccount) {
    // No account signed in - use legacy key for backwards compatibility
    return "drummer-progress";
  }
  return `drummer-progress-${currentAccount.id}`;
}

/**
 * Get all progress from localStorage for current account
 */
export function getAllProgress(): Record<string, ExerciseProgress> {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(getStorageKey());
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error loading progress:", error);
    return {};
  }
}

/**
 * Get progress for a specific exercise
 */
export function getExerciseProgress(exerciseId: string): ExerciseProgress | null {
  const allProgress = getAllProgress();
  return allProgress[exerciseId] || null;
}

/**
 * Save progress for an exercise
 * Automatically updates if this is a better result than previous attempts
 */
export function saveExerciseProgress(
  exerciseId: string,
  stars: Stars,
  accuracy: number
): void {
  if (typeof window === "undefined") return;

  const allProgress = getAllProgress();
  const existing = allProgress[exerciseId];

  // Create or update progress
  const updated: ExerciseProgress = {
    exerciseId,
    stars: (existing ? Math.max(existing.stars, stars) : stars) as Stars,  // Keep best stars
    lastPractisedAt: new Date().toISOString(),
    attempts: existing ? existing.attempts + 1 : 1,
    bestAccuracy: existing ? Math.max(existing.bestAccuracy, accuracy) : accuracy,
  };

  allProgress[exerciseId] = updated;

  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(allProgress));
    console.log(`✓ Progress saved to localStorage for ${exerciseId}:`, updated);
  } catch (error) {
    console.error("Error saving progress:", error);
  }
}

/**
 * Check if an exercise is unlocked
 * An exercise is unlocked if:
 * 1. It's the first exercise in the level, OR
 * 2. The previous exercise has been completed:
 *    - Level 1: Requires at least 2 stars (slower progression for beginners)
 *    - Other levels: Requires at least 1 star
 */
export function isExerciseUnlocked(
  exerciseId: string,
  allExerciseIds: string[],
  levelNumber?: number
): boolean {
  const index = allExerciseIds.indexOf(exerciseId);

  // First exercise is always unlocked
  if (index === 0) return true;

  // Check if previous exercise has been completed
  const previousExerciseId = allExerciseIds[index - 1];
  const previousProgress = getExerciseProgress(previousExerciseId);

  // Level 1 requires 2 stars, other levels require 1 star
  const starsRequired = levelNumber === 1 ? 2 : 1;
  const isUnlocked = previousProgress !== null && previousProgress.stars >= starsRequired;

  console.log(`Checking if ${exerciseId} is unlocked: previous=${previousExerciseId}, progress=`, previousProgress, `level=${levelNumber}, starsRequired=${starsRequired}, unlocked=${isUnlocked}`);

  return isUnlocked;
}

/**
 * Get stars for an exercise (0 if not started)
 */
export function getExerciseStars(exerciseId: string): Stars {
  const progress = getExerciseProgress(exerciseId);
  return progress ? progress.stars : 0;
}

/**
 * Clear all progress for current account (for testing/reset)
 */
export function clearAllProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getStorageKey());
}
