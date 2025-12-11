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
    description: "Learn to feel the beat, count along, and play your first drum pattern!",
    exerciseIds: [
      "level-1-ex-1",  // Listen and Feel the Beat
      "level-1-ex-2",  // Count Along
      "level-1-ex-3",  // Say 'Boots and Cats'
      "level-1-ex-4",  // Play Along: Kick Drum
      "level-1-ex-5",  // Play Along: All Together
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
