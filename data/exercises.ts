/**
 * Exercises
 *
 * Exercises are the learning steps that wrap drum patterns with instructions.
 * Each exercise teaches one concept at a time.
 *
 * HOW TO ADD A NEW EXERCISE:
 * 1. Copy an existing exercise object
 * 2. Give it a unique id
 * 3. Set the level number (1, 2, 3...)
 * 4. Write clear instructions in markdown
 * 5. Either:
 *    - Use patternId to reference a pattern from patterns.ts
 *    - OR provide an inline pattern object
 * 6. Add the exercise ID to the relevant level in levels.ts
 */

import { Exercise } from "@/types";

export const exercises: Exercise[] = [
  {
    id: "level-1-ex-1",
    title: "Listen and Feel the Beat",
    level: 1,
    type: "groove",
    instructions: `
Welcome to your first drum lesson!

**Listen** to the simple pattern playing. Notice how the drums work together:
- The **hi hat** (top) keeps steady time
- The **snare** (middle) gives the backbeat
- The **kick** (bottom) is the heartbeat

Just listen for now. Can you tap your foot along with the beat?

Press play and close your eyes. Feel the groove!
    `,
    counting: "1 & 2 & 3 & 4 &",
    tempoBpm: 70,
    durationBars: 4,
    patternId: "simple-quarters",
  },

  {
    id: "level-1-ex-2",
    title: "Count Along",
    level: 1,
    type: "timing",
    instructions: `
Now let's **count along** with the beat!

Say the numbers out loud: **"1, 2, 3, 4"** over and over.

The **hi hat** and **kick** happen on the numbers.
The **snare** happens on 2 and 4.

👉 **Try it**: Count "1, 2, 3, 4" whilst the pattern plays. Keep counting even if you lose track - you'll get it!
    `,
    counting: "1 & 2 & 3 & 4 &",
    tempoBpm: 70,
    durationBars: 4,
    patternId: "simple-quarters",
  },

  {
    id: "level-1-ex-3",
    title: "Say 'Boots and Cats'",
    level: 1,
    type: "groove",
    instructions: `
Here's a fun trick drummers use!

Instead of counting, say:
**"Boots and Cats and Boots and Cats and..."**

- **Boots** = kick drum (the low boom)
- **Cats** = snare drum (the sharp crack)
- **and** = hi hat in between

Press play and try saying it. It's okay if you mess up - that's part of learning!
    `,
    counting: "1 & 2 & 3 & 4 &",
    tempoBpm: 75,
    durationBars: 4,
    patternId: "boots-and-cats",
  },

  {
    id: "level-1-ex-4",
    title: "Play Along: Kick Drum",
    level: 1,
    type: "groove",
    instructions: `
Time to play! Let's start with just the **kick drum**.

**On a computer**: Press the **F key** when you see the kick drum light up.

**On a tablet**: Tap the **Kick button** below the grid.

Don't worry about being perfect. Just try to press when you see the kick notes!

👉 **Tip**: Count "1, 2, 3, 4" and press F on **1** and **3**.
    `,
    counting: "1 & 2 & 3 & 4 &",
    tempoBpm: 70,
    durationBars: 4,
    patternId: "boots-and-cats",
  },

  {
    id: "level-1-ex-5",
    title: "Play Along: All Together",
    level: 1,
    type: "groove",
    instructions: `
Brilliant! Now let's try **all three drums**:

- **F key** = Kick (or tap Kick button)
- **J key** = Snare (or tap Snare button)
- **Spacebar** = Hi hat (or tap Hi hat button)

Start slow. It's totally fine to miss some notes!

The hi hat is the trickiest because it plays on every "&". Try focusing on just the **kick and snare** first (F and J keys), then add the hi hat (spacebar) when you feel ready.

Remember: **Boots and Cats!**
    `,
    counting: "1 & 2 & 3 & 4 &",
    tempoBpm: 75,
    durationBars: 4,
    patternId: "boots-and-cats",
  },
];

/**
 * Get an exercise by ID
 */
export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}

/**
 * Get all exercises for a specific level
 */
export function getExercisesByLevel(level: number): Exercise[] {
  return exercises.filter(e => e.level === level);
}
