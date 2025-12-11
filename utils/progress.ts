/**
 * Progress Storage Utilities
 *
 * Handles saving and loading exercise progress to/from localStorage.
 * Simple key-value store: exerciseId -> ExerciseProgress
 */

import { ExerciseProgress, Stars } from "@/types";

const STORAGE_KEY = "drummer-progress";

/**
 * Get all progress from localStorage
 */
export function getAllProgress(): Record<string, ExerciseProgress> {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error("Error saving progress:", error);
  }
}

/**
 * Check if an exercise is unlocked
 * An exercise is unlocked if:
 * 1. It's the first exercise in the level, OR
 * 2. The previous exercise has been completed (has at least 1 star)
 */
export function isExerciseUnlocked(
  exerciseId: string,
  allExerciseIds: string[]
): boolean {
  const index = allExerciseIds.indexOf(exerciseId);

  // First exercise is always unlocked
  if (index === 0) return true;

  // Check if previous exercise has been completed
  const previousExerciseId = allExerciseIds[index - 1];
  const previousProgress = getExerciseProgress(previousExerciseId);

  return previousProgress !== null && previousProgress.stars >= 1;
}

/**
 * Get stars for an exercise (0 if not started)
 */
export function getExerciseStars(exerciseId: string): Stars {
  const progress = getExerciseProgress(exerciseId);
  return progress ? progress.stars : 0;
}

/**
 * Clear all progress (for testing/reset)
 */
export function clearAllProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
