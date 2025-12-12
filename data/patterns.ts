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
  // ============ LEVEL 1 PATTERNS ============
  // These follow the pedagogical progression for absolute beginners

  // Lesson 1: Counting pulse (student can tap anything on quarter notes)
  {
    id: "l1-counting",
    name: "Counting 1 2 3 4",
    difficulty: "easy",
    description: "Just tap along with the beat. Feel the steady pulse!",
    defaultTempoBpm: 50,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["hihat"] },  // Use hihat as visual guide, but accept any drum
      { step: 2, countLabel: "&", hit: [] },
      { step: 3, countLabel: "2", hit: ["hihat"] },
      { step: 4, countLabel: "&", hit: [] },
      { step: 5, countLabel: "3", hit: ["hihat"] },
      { step: 6, countLabel: "&", hit: [] },
      { step: 7, countLabel: "4", hit: ["hihat"] },
      { step: 8, countLabel: "&", hit: [] },
    ],
  },

  // Lesson 2: Hi hat on every beat (quarter notes)
  {
    id: "l1-hihat-quarters",
    name: "Hi Hat on Every Beat",
    difficulty: "easy",
    description: "Play the hi hat four times - 1, 2, 3, 4. Keep it steady!",
    defaultTempoBpm: 55,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["hihat"] },
      { step: 2, countLabel: "&", hit: [] },
      { step: 3, countLabel: "2", hit: ["hihat"] },
      { step: 4, countLabel: "&", hit: [] },
      { step: 5, countLabel: "3", hit: ["hihat"] },
      { step: 6, countLabel: "&", hit: [] },
      { step: 7, countLabel: "4", hit: ["hihat"] },
      { step: 8, countLabel: "&", hit: [] },
    ],
  },

  // Lesson 3: Snare on every beat
  {
    id: "l1-snare-quarters",
    name: "Snare on Every Beat",
    difficulty: "easy",
    description: "Now try the snare. Hit it four times - 1, 2, 3, 4.",
    defaultTempoBpm: 55,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["snare"] },
      { step: 2, countLabel: "&", hit: [] },
      { step: 3, countLabel: "2", hit: ["snare"] },
      { step: 4, countLabel: "&", hit: [] },
      { step: 5, countLabel: "3", hit: ["snare"] },
      { step: 6, countLabel: "&", hit: [] },
      { step: 7, countLabel: "4", hit: ["snare"] },
      { step: 8, countLabel: "&", hit: [] },
    ],
  },

  // Lesson 4: Kick on every beat
  {
    id: "l1-kick-quarters",
    name: "Kick on Every Beat",
    difficulty: "easy",
    description: "Time for your foot! Kick drum on 1, 2, 3, 4.",
    defaultTempoBpm: 55,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["kick"] },
      { step: 2, countLabel: "&", hit: [] },
      { step: 3, countLabel: "2", hit: ["kick"] },
      { step: 4, countLabel: "&", hit: [] },
      { step: 5, countLabel: "3", hit: ["kick"] },
      { step: 6, countLabel: "&", hit: [] },
      { step: 7, countLabel: "4", hit: ["kick"] },
      { step: 8, countLabel: "&", hit: [] },
    ],
  },

  // Lesson 5: Hi hat steady, snare on 3
  {
    id: "l1-backbeat-intro",
    name: "Hi Hat Steady, Snare on 3",
    difficulty: "easy",
    description: "Hi hat goes 1, 2, 3, 4. Snare only on beat 3. This is the backbeat!",
    defaultTempoBpm: 60,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["hihat"] },
      { step: 2, countLabel: "&", hit: [] },
      { step: 3, countLabel: "2", hit: ["hihat"] },
      { step: 4, countLabel: "&", hit: [] },
      { step: 5, countLabel: "3", hit: ["hihat", "snare"] },  // Backbeat!
      { step: 6, countLabel: "&", hit: [] },
      { step: 7, countLabel: "4", hit: ["hihat"] },
      { step: 8, countLabel: "&", hit: [] },
    ],
  },

  // Lesson 6: Hi hat steady, kick on 1
  {
    id: "l1-downbeat-intro",
    name: "Hi Hat Steady, Kick on 1",
    difficulty: "easy",
    description: "Hi hat on 1, 2, 3, 4. Kick only on beat 1. Feel that downbeat!",
    defaultTempoBpm: 60,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["hihat", "kick"] },  // Downbeat!
      { step: 2, countLabel: "&", hit: [] },
      { step: 3, countLabel: "2", hit: ["hihat"] },
      { step: 4, countLabel: "&", hit: [] },
      { step: 5, countLabel: "3", hit: ["hihat"] },
      { step: 6, countLabel: "&", hit: [] },
      { step: 7, countLabel: "4", hit: ["hihat"] },
      { step: 8, countLabel: "&", hit: [] },
    ],
  },

  // Lesson 7: First groove - kick 1, snare 3
  {
    id: "l1-first-groove",
    name: "First Groove: Kick 1, Snare 3",
    difficulty: "easy",
    description: "Your first full groove! Hi hat steady, kick on 1, snare on 3.",
    defaultTempoBpm: 60,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["hihat", "kick"] },
      { step: 2, countLabel: "&", hit: [] },
      { step: 3, countLabel: "2", hit: ["hihat"] },
      { step: 4, countLabel: "&", hit: [] },
      { step: 5, countLabel: "3", hit: ["hihat", "snare"] },
      { step: 6, countLabel: "&", hit: [] },
      { step: 7, countLabel: "4", hit: ["hihat"] },
      { step: 8, countLabel: "&", hit: [] },
    ],
  },

  // Lesson 8: Groove variation - kick 1 and 3
  {
    id: "l1-groove-variation",
    name: "Groove Variation: Kick 1 and 3",
    difficulty: "easy",
    description: "Same as before, but now kick on beat 1 AND beat 3 with the snare.",
    defaultTempoBpm: 65,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["hihat", "kick"] },
      { step: 2, countLabel: "&", hit: [] },
      { step: 3, countLabel: "2", hit: ["hihat"] },
      { step: 4, countLabel: "&", hit: [] },
      { step: 5, countLabel: "3", hit: ["hihat", "kick", "snare"] },  // Both kick and snare!
      { step: 6, countLabel: "&", hit: [] },
      { step: 7, countLabel: "4", hit: ["hihat"] },
      { step: 8, countLabel: "&", hit: [] },
    ],
  },

  // Lesson 9: Hi hat eighth notes
  {
    id: "l1-hihat-eighths",
    name: "Introducing the \"And\": Hi Hat Eighth Notes",
    difficulty: "easy",
    description: "Now the hi hat plays twice as fast: 1 and 2 and 3 and 4 and!",
    defaultTempoBpm: 60,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["hihat"] },
      { step: 2, countLabel: "&", hit: ["hihat"] },  // The "and"!
      { step: 3, countLabel: "2", hit: ["hihat"] },
      { step: 4, countLabel: "&", hit: ["hihat"] },
      { step: 5, countLabel: "3", hit: ["hihat"] },
      { step: 6, countLabel: "&", hit: ["hihat"] },
      { step: 7, countLabel: "4", hit: ["hihat"] },
      { step: 8, countLabel: "&", hit: ["hihat"] },
    ],
  },

  // Lesson 10: First groove with an "and" kick
  {
    id: "l1-and-kick-groove",
    name: "First Groove with an \"And\" Kick",
    difficulty: "easy",
    description: "Hi hat eighth notes, kick on 1 and the 'and' of 3, snare on 3. A real rock beat!",
    defaultTempoBpm: 70,
    timeSignature: "4/4",
    subdivision: "eighth",
    steps: [
      { step: 1, countLabel: "1", hit: ["hihat", "kick"] },
      { step: 2, countLabel: "&", hit: ["hihat"] },
      { step: 3, countLabel: "2", hit: ["hihat"] },
      { step: 4, countLabel: "&", hit: ["hihat"] },
      { step: 5, countLabel: "3", hit: ["hihat", "snare"] },
      { step: 6, countLabel: "&", hit: ["hihat", "kick"] },  // The "and" kick!
      { step: 7, countLabel: "4", hit: ["hihat"] },
      { step: 8, countLabel: "&", hit: ["hihat"] },
    ],
  },

  // ============ OTHER PATTERNS (from original app) ============

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
