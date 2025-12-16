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
    description: "Start with quarter notes and build up to a classic rock beat, one step at a time!",
    exerciseIds: [
      "beginner-01-timekeeping",        // 1. Quarter note timekeeping (hi-hat only)
      "beginner-02-add-kick",           // 2. Add kick on beat 1
      "beginner-03-add-snare",          // 3. Add snare on beat 3
      "beginner-04-rock-groove-quarters", // 4. First groove in quarters (kick 1&3, snare 2&4)
      "beginner-05-rock-groove-eighths",  // 5. Same groove in eighths
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
