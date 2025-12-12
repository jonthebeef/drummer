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
  // ============ LEVEL 1: YOUR FIRST GROOVE ============

  {
    id: "l1-01-counting",
    title: "Counting 1 2 3 4",
    level: 1,
    type: "timing",
    instructions: `
Welcome to your first drumming lesson!

Before we play any drums, we need to learn the **steady beat**.

**What to do:**
- Listen to the metronome click
- Tap along on any drum (or just clap!) on beats **1, 2, 3, 4**
- Keep it steady and relaxed

The metronome will click four times: **1, 2, 3, 4**. Try to tap exactly when you hear each click.

Don't worry about which drum - just feel that steady pulse!
    `,
    counting: "1 2 3 4",
    tempoBpm: 50,
    durationBars: 4,
    patternId: "l1-counting",
  },

  {
    id: "l1-02-hihat-quarters",
    title: "Hi Hat on Every Beat",
    level: 1,
    type: "groove",
    instructions: `
Now let's play your **first real drum**: the hi hat!

The hi hat is the shimmery cymbal you play with your right hand (or left if you're left-handed).

**What to do:**
- Play the hi hat four times: **1, 2, 3, 4**
- Keep it steady like a clock ticking
- Use your keyboard **Spacebar** or tap the **Hi Hat button** below

Listen first, then try playing along. It's OK if you don't hit every beat perfectly - that will come with practice!
    `,
    counting: "1 2 3 4",
    tempoBpm: 52,
    durationBars: 4,
    patternId: "l1-hihat-quarters",
  },

  {
    id: "l1-03-snare-quarters",
    title: "Snare on Every Beat",
    level: 1,
    type: "groove",
    instructions: `
Time to learn the **snare drum**!

The snare is the sharp, cracking sound. You play it with your left hand (or right if you're left-handed).

**What to do:**
- Play the snare four times: **1, 2, 3, 4**
- It's just like the hi hat, but with a different drum
- Use your keyboard **J key** or tap the **Snare button** below

Keep it steady. If you miss a beat, don't stop - just keep going!
    `,
    counting: "1 2 3 4",
    tempoBpm: 53,
    durationBars: 4,
    patternId: "l1-snare-quarters",
  },

  {
    id: "l1-04-kick-quarters",
    title: "Kick on Every Beat",
    level: 1,
    type: "groove",
    instructions: `
Now for the **kick drum** - the big bass drum you play with your foot!

The kick makes that deep "boom" sound that you feel in your chest.

**What to do:**
- Play the kick four times: **1, 2, 3, 4**
- Use your keyboard **F key** or tap the **Kick button** below
- Nice and steady - boom, boom, boom, boom!

On a real drum kit, you'd use your right foot on a pedal. For now, just press F!
    `,
    counting: "1 2 3 4",
    tempoBpm: 54,
    durationBars: 4,
    patternId: "l1-kick-quarters",
  },

  {
    id: "l1-05-backbeat-intro",
    title: "Hi Hat Steady, Snare on 3",
    level: 1,
    type: "groove",
    instructions: `
Now we're going to play **two things at once**!

This is called the **backbeat** - it's super important in rock and pop music.

**What to do:**
- Play hi hat on **1, 2, 3, 4** (right hand, Spacebar)
- Play snare **only on beat 3** (left hand, J key)

So it goes:
**1** (hi hat) → **2** (hi hat) → **3** (hi hat + snare together!) → **4** (hi hat)

Start slow. Listen to the pattern first, then join in. You're doing great!
    `,
    counting: "1 2 3 4",
    tempoBpm: 55,
    durationBars: 4,
    patternId: "l1-backbeat-intro",
  },

  {
    id: "l1-06-downbeat-intro",
    title: "Hi Hat Steady, Kick on 1",
    level: 1,
    type: "groove",
    instructions: `
Time to bring in your **foot**!

**What to do:**
- Play hi hat on **1, 2, 3, 4** (right hand, Spacebar)
- Play kick **only on beat 1** (foot, F key)

So it goes:
**1** (hi hat + kick together!) → **2** (hi hat) → **3** (hi hat) → **4** (hi hat)

Beat 1 is called the **downbeat** - it's where the groove lands. Feel that solid thump at the start!
    `,
    counting: "1 2 3 4",
    tempoBpm: 56,
    durationBars: 4,
    patternId: "l1-downbeat-intro",
  },

  {
    id: "l1-07-first-groove",
    title: "First Groove: Kick 1, Snare 3",
    level: 1,
    type: "groove",
    instructions: `
🎉 **This is your first proper groove!**

Now we put it all together:

**What to do:**
- Hi hat on **1, 2, 3, 4** (right hand, Spacebar)
- Kick on **beat 1** (foot, F key)
- Snare on **beat 3** (left hand, J key)

So:
**1** (hi hat + kick) → **2** (hi hat only) → **3** (hi hat + snare) → **4** (hi hat only)

This is a **real drum beat**! Take your time, and remember: steady wins!
    `,
    counting: "1 2 3 4",
    tempoBpm: 57,
    durationBars: 4,
    patternId: "l1-first-groove",
  },

  {
    id: "l1-08-groove-variation",
    title: "Groove Variation: Kick 1 and 3",
    level: 1,
    type: "groove",
    instructions: `
Let's make that groove a bit **fuller**!

Same as before, but now we add a kick on beat 3 as well.

**What to do:**
- Hi hat on **1, 2, 3, 4** (Spacebar)
- Kick on **beats 1 and 3** (F key)
- Snare on **beat 3** (J key)

Beat 3 is the trickiest: you play **kick and snare at the same time**!
On a keyboard, press F and J together. On a drum kit, it's left hand and right foot together.

You've got this!
    `,
    counting: "1 2 3 4",
    tempoBpm: 58,
    durationBars: 4,
    patternId: "l1-groove-variation",
  },

  {
    id: "l1-09-hihat-eighths",
    title: "Introducing the \"And\": Hi Hat Eighth Notes",
    level: 1,
    type: "timing",
    instructions: `
Ready to go **twice as fast**?

Up until now, the hi hat has played four times: **1, 2, 3, 4**.

Now we're going to play it **eight times** by adding the **"and"** in between each beat:

**1 and 2 and 3 and 4 and**

**What to do:**
- Play hi hat eight times (Spacebar)
- Count out loud: "1 and 2 and 3 and 4 and"
- Keep it smooth and even

This is called **eighth notes**. It sounds like a galloping horse! 🐴
    `,
    counting: "1 & 2 & 3 & 4 &",
    tempoBpm: 59,
    durationBars: 4,
    patternId: "l1-hihat-eighths",
  },

  {
    id: "l1-10-and-kick-groove",
    title: "First Groove with an \"And\" Kick",
    level: 1,
    type: "groove",
    instructions: `
🎸 **Your first proper rock beat!**

Now we combine everything:
- Hi hat playing eighth notes (1 and 2 and 3 and 4 and)
- Kick on beat 1 AND on the "and" after beat 3
- Snare on beat 3

**What to do:**
- Hi hat: eight times (Spacebar) - "1 and 2 and 3 and 4 and"
- Kick: on **1** and on **"and"** after 3 (F key twice)
- Snare: on **3** (J key)

The kick on the **"and"** gives the beat that driving rock feel!

This is the sound of real rock music. You're a drummer now! 🥁
    `,
    counting: "1 & 2 & 3 & 4 &",
    tempoBpm: 60,
    durationBars: 4,
    patternId: "l1-and-kick-groove",
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
