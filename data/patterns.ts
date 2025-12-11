/**
 * Drum Patterns
 *
 * This file contains all the drum patterns used in the app.
 * Each pattern is one bar (4 beats) of a drum groove.
 *
 * HOW TO ADD A NEW PATTERN:
 * 1. Copy an existing pattern object
 * 2. Give it a unique id (like "simple-beat-2")
 * 3. Update the name and description
 * 4. Set the defaultTempoBpm (slower = easier, try 60-80 for beginners)
 * 5. Update the steps array:
 *    - For 8th notes: steps 1-8 represent "1 & 2 & 3 & 4 &"
 *    - step 1 = beat 1, step 2 = the &, step 3 = beat 2, etc.
 *    - For each step, list which drums hit: "kick", "snare", "hihat"
 */

import { Pattern } from "@/types";

export const patterns: Pattern[] = [
  {
    id: "boots-and-cats",
    name: "Boots and Cats Rock Beat",
    difficulty: "easy",
    description: "This is the classic rock beat you hear in loads of songs. Say 'boots' on the kick and 'cats' on the snare!",
    defaultTempoBpm: 80,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["kick", "hihat"] },
      { step: 2, countLabel: "&", hit: ["hihat"] },
      { step: 3, countLabel: "2", hit: ["snare", "hihat"] },
      { step: 4, countLabel: "&", hit: ["hihat"] },
      { step: 5, countLabel: "3", hit: ["kick", "hihat"] },
      { step: 6, countLabel: "&", hit: ["hihat"] },
      { step: 7, countLabel: "4", hit: ["snare", "hihat"] },
      { step: 8, countLabel: "&", hit: ["hihat"] },
    ],
  },

  {
    id: "simple-quarters",
    name: "Quarter Note Groove",
    difficulty: "easy",
    description: "An easier pattern to start with. Hi hats on the main beats only, perfect for getting the feel.",
    defaultTempoBpm: 70,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["kick", "hihat"] },
      { step: 2, countLabel: "&", hit: [] },
      { step: 3, countLabel: "2", hit: ["snare", "hihat"] },
      { step: 4, countLabel: "&", hit: [] },
      { step: 5, countLabel: "3", hit: ["kick", "hihat"] },
      { step: 6, countLabel: "&", hit: [] },
      { step: 7, countLabel: "4", hit: ["snare", "hihat"] },
      { step: 8, countLabel: "&", hit: [] },
    ],
  },

  {
    id: "busy-rock",
    name: "Busy Rock Beat",
    difficulty: "medium",
    description: "Same as Boots and Cats, but with an extra kick before beat 3. This adds a bit of drive!",
    defaultTempoBpm: 85,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["kick", "hihat"] },
      { step: 2, countLabel: "&", hit: ["hihat"] },
      { step: 3, countLabel: "2", hit: ["snare", "hihat"] },
      { step: 4, countLabel: "&", hit: ["hihat"] },
      { step: 5, countLabel: "3", hit: ["kick", "hihat"] },
      { step: 6, countLabel: "&", hit: ["kick", "hihat"] },  // Extra kick here!
      { step: 7, countLabel: "4", hit: ["snare", "hihat"] },
      { step: 8, countLabel: "&", hit: ["hihat"] },
    ],
  },
];

/**
 * Get a pattern by ID
 */
export function getPatternById(id: string): Pattern | undefined {
  return patterns.find(p => p.id === id);
}
