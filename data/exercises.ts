/**
 * Exercises
 *
 * Exercises are the learning steps that wrap drum patterns with instructions.
 * Each exercise teaches one concept at a time.
 *
 * Level 1 follows a carefully designed pedagogical sequence:
 * 1. Pulse/counting → 2-4. Individual limbs → 5-8. Simple grooves → 9-10. Eighth notes
 */

import { Exercise } from "@/types";

export const exercises: Exercise[] = [
  // ============ LEVEL 1: SLOW BEGINNER PATH (15 EXERCISES) ============
  // 3 exercises per musical idea for repetition and practice time
  // Same patternId within each set, gentle tempo progression, longer bars for later attempts

  // SET A: Hi-hat quarters only (3 exercises)
  {
    id: "l1-01-hihat-intro",
    title: "Keeping Time with Hi Hat",
    level: 1,
    type: "timing",
    instructions: `
Welcome to drumming!

Let's start with the **hi hat** - the shimmery cymbal you tap with one hand.

**What to do:**
- Listen to the pattern
- Then tap along: **1, 2, 3, 4**
- Keep it steady like a clock ticking

Use **Spacebar** or tap the **Hi Hat button**.

Don't worry about being perfect - just feel the beat!
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 50,
    durationBars: 4,
    patternId: "l1-hihat-quarters",
  },

  {
    id: "l1-02-hihat-again",
    title: "Hi Hat Again - Make It Steady",
    level: 1,
    type: "timing",
    instructions: `
Great start! Let's practice the hi hat again.

This time, **count out loud** as you play: "1, 2, 3, 4".

**Focus on:**
- Keeping the same speed between each hit
- Relaxed hands
- Breathing steadily

Try this again - you're building your rhythm!
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 50,
    durationBars: 8,
    patternId: "l1-hihat-quarters",
  },

  {
    id: "l1-03-hihat-longer",
    title: "Hi Hat - Longer Practice",
    level: 1,
    type: "timing",
    instructions: `
One more time with the hi hat!

**Challenge:**
- Play for longer without stopping
- Keep it steady all the way through
- Feel the groove

You're getting the hang of it!
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 51,
    durationBars: 8,
    patternId: "l1-hihat-quarters",
  },

  // SET B: Hi-hat quarters + kick on 1 (3 exercises)
  {
    id: "l1-04-kick-intro",
    title: "Adding the Kick Drum",
    level: 1,
    type: "groove",
    instructions: `
Time to add your **foot**!

**What to do:**
- Hi hat on **1, 2, 3, 4** (Spacebar)
- Kick **only on beat 1** (F key)

So beat 1 is **both at once**, then just hi hat for 2, 3, 4.

This is called playing **two things together**!
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 52,
    durationBars: 4,
    patternId: "l1-downbeat-intro",
  },

  {
    id: "l1-05-kick-again",
    title: "Kick on 1 - Try Again",
    level: 1,
    type: "groove",
    instructions: `
Let's practice that kick on beat 1 again.

**Focus on:**
- Both drums hitting at the **same time** on beat 1
- Hi hat staying steady on 2, 3, 4
- Keeping your foot relaxed

Count out loud: "**BOTH**, 2, 3, 4"
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 52,
    durationBars: 8,
    patternId: "l1-downbeat-intro",
  },

  {
    id: "l1-06-kick-longer",
    title: "Kick on 1 - Longer Practice",
    level: 1,
    type: "groove",
    instructions: `
One more go with kick on beat 1!

**Challenge:**
- Make it feel natural and relaxed
- Don't rush - keep it steady
- Enjoy the rhythm you're making

You're doing brilliant!
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 53,
    durationBars: 8,
    patternId: "l1-downbeat-intro",
  },

  // SET C: Hi-hat quarters + kick 1 + snare 3 (3 exercises)
  {
    id: "l1-07-snare-intro",
    title: "Adding the Snare Drum",
    level: 1,
    type: "groove",
    instructions: `
Now let's add the **snare** - that sharp cracking sound!

**What to do:**
- Hi hat on **1, 2, 3, 4** (Spacebar)
- Kick on **beat 1** (F key)
- Snare on **beat 3** (J key)

**1** (kick + hi hat) → **2** (hi hat) → **3** (snare + hi hat) → **4** (hi hat)

This is your first proper groove!
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 54,
    durationBars: 4,
    patternId: "l1-first-groove",
  },

  {
    id: "l1-08-snare-again",
    title: "First Groove - Try Again",
    level: 1,
    type: "groove",
    instructions: `
Let's practice that first groove again!

**Focus on:**
- Kick on **1**, snare on **3**
- Hi hat staying steady throughout
- All three drums working together

Count: "**Kick** hi-hat, hi-hat, **Snare** hi-hat, hi-hat"
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 54,
    durationBars: 8,
    patternId: "l1-first-groove",
  },

  {
    id: "l1-09-snare-longer",
    title: "First Groove - Make It Flow",
    level: 1,
    type: "groove",
    instructions: `
One more round with your first groove!

**Challenge:**
- Let it flow naturally
- Don't think too hard - feel the pattern
- Keep breathing and stay relaxed

You're really drumming now!
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 55,
    durationBars: 8,
    patternId: "l1-first-groove",
  },

  // SET D: Classic rock groove in quarters (kick 1&3, snare 2&4) (3 exercises)
  {
    id: "l1-10-rock-intro",
    title: "Classic Rock Groove",
    level: 1,
    type: "groove",
    instructions: `
🎸 **The classic rock beat!**

This is what you hear in loads of songs.

**What to do:**
- Hi hat on **1, 2, 3, 4** (Spacebar)
- Kick on **beats 1 and 3** (F key)
- Snare on **beats 2 and 4** (J key)

Say: "**Kick**, **Snare**, **Kick**, **Snare**"
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 56,
    durationBars: 4,
    patternId: "beginner-groove-quarters",
  },

  {
    id: "l1-11-rock-again",
    title: "Rock Groove - Try Again",
    level: 1,
    type: "groove",
    instructions: `
Let's practice that classic rock groove again!

**Focus on:**
- Kick on **1 and 3**
- Snare on **2 and 4**
- Hi hat staying perfectly steady

This is the most important beat in rock music!
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 56,
    durationBars: 8,
    patternId: "beginner-groove-quarters",
  },

  {
    id: "l1-12-rock-longer",
    title: "Rock Groove - Make It Rock",
    level: 1,
    type: "groove",
    instructions: `
One more time with the classic rock groove!

**Challenge:**
- Make it feel solid and powerful
- Keep the same energy all the way through
- Imagine you're playing with a band

You're playing a real rock beat!
    `,
    counting: "1 2 3 4",
    countingMode: "quarters",
    tempoBpm: 57,
    durationBars: 8,
    patternId: "beginner-groove-quarters",
  },

  // SET E: Same groove but hi-hat eighths (3 exercises)
  {
    id: "l1-13-eighths-intro",
    title: "Rock Groove with Eighth Notes",
    level: 1,
    type: "groove",
    instructions: `
Ready to play **faster**?

Same groove, but now the hi hat goes **twice as fast**!

**What to do:**
- Hi hat: **1 and 2 and 3 and 4 and** (eight times)
- Kick on **beats 1 and 3** (F key)
- Snare on **beats 2 and 4** (J key)

The hi hat sounds like a galloping horse! 🐴
    `,
    counting: "1 & 2 & 3 & 4 &",
    countingMode: "eighths",
    tempoBpm: 58,
    durationBars: 4,
    patternId: "boots-and-cats",
  },

  {
    id: "l1-14-eighths-again",
    title: "Eighth Notes - Try Again",
    level: 1,
    type: "groove",
    instructions: `
Let's practice that eighth note groove again!

**Focus on:**
- Hi hat going **1 and 2 and 3 and 4 and**
- Kick and snare staying on the main beats
- Keeping it all smooth and even

Count out loud with the "ands"!
    `,
    counting: "1 & 2 & 3 & 4 &",
    countingMode: "eighths",
    tempoBpm: 58,
    durationBars: 8,
    patternId: "boots-and-cats",
  },

  {
    id: "l1-15-eighths-master",
    title: "Eighth Notes - You've Got This!",
    level: 1,
    type: "groove",
    instructions: `
Final practice with eighth notes!

**Challenge:**
- Make it flow without thinking
- Feel the rhythm in your body
- Enjoy the sound you're making

This is the sound of real rock music! You've completed Level 1! 🎉
    `,
    counting: "1 & 2 & 3 & 4 &",
    countingMode: "eighths",
    tempoBpm: 59,
    durationBars: 8,
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
