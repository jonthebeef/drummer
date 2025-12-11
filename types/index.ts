/**
 * Type definitions for the Drummer app
 *
 * These types define the structure of drum patterns, exercises, and learning progression.
 * Parents can edit the data files (in /data folder) following these type structures.
 */

// ============================================================================
// DRUM TYPES
// ============================================================================

/**
 * The three drums we're teaching
 */
export type DrumType = "kick" | "snare" | "hihat";

/**
 * Time signature (currently only 4/4 supported)
 */
export type TimeSignature = "4/4";

/**
 * Subdivision of the beat
 */
export type Subdivision = "eighth" | "sixteenth";

/**
 * Difficulty levels for patterns
 */
export type Difficulty = "easy" | "medium" | "hard";

// ============================================================================
// PATTERN TYPES
// ============================================================================

/**
 * A single note in a pattern
 * Specifies which step (1-8 or 1-16) and which drums hit on that step
 */
export interface PatternNote {
  step: number;           // Which step in the bar (1-8 for eighth notes, 1-16 for sixteenth)
  countLabel: string;     // Label like "1", "&", "2", "e", "a" etc
  hit: DrumType[];        // Which drums hit on this step
}

/**
 * A drum pattern - the fundamental musical content
 *
 * Example: "Boots and Cats Rock Beat"
 */
export interface Pattern {
  id: string;
  name: string;
  difficulty: Difficulty;
  description: string;    // Kid-friendly description like "This is the classic rock beat!"
  defaultTempoBpm: number;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  steps: PatternNote[];   // All the notes in the pattern
}

// ============================================================================
// EXERCISE TYPES
// ============================================================================

/**
 * Type of exercise
 */
export type ExerciseType = "groove" | "fill" | "timing" | "song";

/**
 * An exercise wraps a pattern (or inline pattern) into a learning step
 * with instructions, tempo, and duration
 */
export interface Exercise {
  id: string;
  title: string;
  level: number;           // Which level this belongs to (1, 2, 3...)
  type: ExerciseType;
  instructions: string;    // Markdown string with instructions for kid + parent
  counting: string;        // Counting guide like "1 & 2 & 3 & 4 &"
  tempoBpm: number;        // Starting tempo for this exercise
  durationBars: number;    // How many bars to practice (for looping)

  // Either reference a pattern by ID or provide an inline pattern
  patternId?: string;
  pattern?: Pattern;
}

// ============================================================================
// LEVEL / LESSON TYPES
// ============================================================================

/**
 * A level groups together related exercises
 *
 * Example: "Level 1: First Groove"
 */
export interface Level {
  id: string;
  levelNumber: number;
  name: string;
  description: string;     // What kids will learn in this level
  exerciseIds: string[];   // IDs of exercises in this level (in order)
}

// ============================================================================
// USER PROGRESS TYPES
// ============================================================================

/**
 * Progress status for an exercise
 */
export type ProgressStatus = "not_started" | "in_progress" | "completed";

/**
 * Tracks user progress on an exercise
 * (Not implemented in v1, but structure is ready for later)
 */
export interface UserProgress {
  userId: string;
  exerciseId: string;
  status: ProgressStatus;
  lastPractisedAt?: Date;
  bestTempoBpm?: number;   // Highest tempo they successfully played at
}

// ============================================================================
// SESSION TYPES
// ============================================================================

/**
 * A practice session - a sequence of exercises
 */
export interface PracticeSession {
  id: string;
  date: Date;
  exerciseIds: string[];
  currentExerciseIndex: number;
}
