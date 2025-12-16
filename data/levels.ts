/**
 * Levels
 *
 * Levels group exercises together into a learning progression.
 *
 * HOW TO ADD A NEW LEVEL:
 * 1. Copy an existing level object
 * 2. Increment the levelNumber
 * 3. Give it a clear name and description
 * 4. List the exercise IDs from exercises.ts in the order you want them taught
 */

import { Level } from "@/types";

export const levels: Level[] = [
  {
    id: "level-1",
    levelNumber: 1,
    name: "Level 1: Your First Groove",
    description: "Build your first rock beat through practice and repetition. Take your time!",
    exerciseIds: [
      // Set A: Hi-hat quarters (3 exercises)
      "l1-01-hihat-intro",
      "l1-02-hihat-again",
      "l1-03-hihat-longer",
      // Set B: Add kick on 1 (3 exercises)
      "l1-04-kick-intro",
      "l1-05-kick-again",
      "l1-06-kick-longer",
      // Set C: Add snare on 3 (3 exercises)
      "l1-07-snare-intro",
      "l1-08-snare-again",
      "l1-09-snare-longer",
      // Set D: Classic rock groove quarters (3 exercises)
      "l1-10-rock-intro",
      "l1-11-rock-again",
      "l1-12-rock-longer",
      // Set E: Same groove with eighths (3 exercises)
      "l1-13-eighths-intro",
      "l1-14-eighths-again",
      "l1-15-eighths-master",
    ],
  },
];

/**
 * Get a level by ID
 */
export function getLevelById(id: string): Level | undefined {
  return levels.find(l => l.id === id);
}

/**
 * Get a level by level number
 */
export function getLevelByNumber(levelNumber: number): Level | undefined {
  return levels.find(l => l.levelNumber === levelNumber);
}
