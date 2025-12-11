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
    description: "Learn the steady beat, control each limb, and play your first real drum grooves!",
    exerciseIds: [
      "l1-01-counting",           // 1. Counting 1 2 3 4
      "l1-02-hihat-quarters",     // 2. Hi hat on every beat
      "l1-03-snare-quarters",     // 3. Snare on every beat
      "l1-04-kick-quarters",      // 4. Kick on every beat
      "l1-05-backbeat-intro",     // 5. Hi hat steady, snare on 3
      "l1-06-downbeat-intro",     // 6. Hi hat steady, kick on 1
      "l1-07-first-groove",       // 7. First groove: kick 1, snare 3
      "l1-08-groove-variation",   // 8. Groove variation: kick 1 and 3
      "l1-09-hihat-eighths",      // 9. Introducing the "and": hi hat eighth notes
      "l1-10-and-kick-groove",    // 10. First groove with an "and" kick
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
