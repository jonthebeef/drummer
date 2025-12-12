/**
 * Analytics Event Tracking
 *
 * Centralized tracking for key user journey events.
 * All tracking respects user consent (handled by PostHogProvider).
 */

import { trackEvent, identifyUser } from "@/components/PostHogProvider";

/**
 * Track when a new account is created
 */
export function trackAccountCreated(accountId: string, avatar: string) {
  identifyUser(accountId, { avatar });
  trackEvent("account_created", { avatar });
}

/**
 * Track when a user signs into an existing account
 */
export function trackAccountSignIn(accountId: string) {
  identifyUser(accountId);
  trackEvent("account_signed_in");
}

/**
 * Track when a user views the level map
 */
export function trackLevelViewed(levelNumber: number, exercisesCompleted: number, totalExercises: number) {
  trackEvent("level_viewed", {
    level_number: levelNumber,
    exercises_completed: exercisesCompleted,
    total_exercises: totalExercises,
    completion_percentage: Math.round((exercisesCompleted / totalExercises) * 100),
  });
}

/**
 * Track when an exercise is started
 */
export function trackExerciseStarted(exerciseId: string, exerciseTitle: string, levelNumber: number) {
  trackEvent("exercise_started", {
    exercise_id: exerciseId,
    exercise_title: exerciseTitle,
    level_number: levelNumber,
  });
}

/**
 * Track when listen phase begins
 */
export function trackListenPhaseStarted(exerciseId: string) {
  trackEvent("listen_phase_started", {
    exercise_id: exerciseId,
  });
}

/**
 * Track when practice phase begins
 */
export function trackPracticePhaseStarted(exerciseId: string) {
  trackEvent("practice_phase_started", {
    exercise_id: exerciseId,
  });
}

/**
 * Track when an exercise is completed
 */
export function trackExerciseCompleted(
  exerciseId: string,
  exerciseTitle: string,
  levelNumber: number,
  starsEarned: number,
  accuracy?: number
) {
  trackEvent("exercise_completed", {
    exercise_id: exerciseId,
    exercise_title: exerciseTitle,
    level_number: levelNumber,
    stars_earned: starsEarned,
    accuracy_percentage: accuracy,
  });
}

/**
 * Track when a pattern is viewed in the pattern browser
 */
export function trackPatternViewed(patternId: string, patternName: string) {
  trackEvent("pattern_viewed", {
    pattern_id: patternId,
    pattern_name: patternName,
  });
}

/**
 * Track tempo changes during practice
 */
export function trackTempoChanged(exerciseId: string, oldTempo: number, newTempo: number) {
  trackEvent("tempo_changed", {
    exercise_id: exerciseId,
    old_tempo: oldTempo,
    new_tempo: newTempo,
    direction: newTempo > oldTempo ? "increased" : "decreased",
  });
}

/**
 * Track when metronome is toggled
 */
export function trackMetronomeToggled(enabled: boolean, exerciseId?: string) {
  trackEvent("metronome_toggled", {
    enabled,
    exercise_id: exerciseId,
  });
}

/**
 * Track navigation to key pages
 */
export function trackPageView(pageName: string, properties?: Record<string, unknown>) {
  trackEvent("page_viewed", {
    page_name: pageName,
    ...properties,
  });
}
