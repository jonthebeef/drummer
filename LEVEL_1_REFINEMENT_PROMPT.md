# Level 1 Refinement Prompt for Claude

**Context**: You are continuing work on an existing drum-learning web app repository.

The app already has:
- An 8-step sequencer (1 & 2 & 3 & 4 &)
- Pattern → exercise → level data structures
- Level pages and exercise routes
- Star scoring and locking concepts
- Keyboard and tap-button input
- A theatre-style drum grid UI

**Your job is not to redesign the app.**

Your job is to refine the pedagogy, counting, and scoring so Level 1 feels correct for absolute beginners.

You must preserve the existing architecture and make small, incremental changes only.

---

## 1. Fix the "jumping ahead" problem without changing the sequencer

We will keep the 8-step grid internally.

However, Level 1 lessons must feel like they start with:
- `1 2 3 4`
- Then later earn `1 & 2 & 3 & 4 &`

**To do this:**
- Quarter-note lessons should only place hits on steps 1, 3, 5, 7
- "And" steps (2, 4, 6, 8) should be visually de-emphasised or hidden early on
- The sequencer timing stays exactly as it is

You should introduce a simple counting display mode per exercise, for example:
- `"quarters"` → show labels `1 2 3 4`
- `"eighths"` → show labels `1 & 2 & 3 & 4 &`

This affects UI only, not timing or scoring logic.

---

## 2. Lock Level 1 lesson order to the agreed 10-lesson structure

**Do not invent or reorder lessons.**

Level 1 consists of exactly these lessons, in this order:

1. Counting 1 2 3 4 (tap anything)
2. Hi hat on every beat
3. Snare on every beat
4. Kick on every beat
5. Hi hat steady, snare on 3
6. Hi hat steady, kick on 1
7. First groove: kick 1, snare 3
8. Groove variation: kick 1 and 3
9. Introducing the "and": hi hat eighth notes
10. First groove with an "and" kick

**Your task is to:**
- Ensure the data reflects this progression
- Ensure lessons unlock strictly in this order
- Ensure the UI reinforces the sense of gradual build-up
- Reuse existing patterns where possible, but prioritise pedagogical clarity

---

## 3. Introduce a generic drum-event layer (launchable now)

**Do not assume MIDI or a real drum kit exists yet.**

All scoring must be based on normalised drum events, shaped like:

```typescript
{
  drum: "kick" | "snare" | "hihat",
  timestamp: number
}
```

**For now:**
- These events come from keyboard input and on-screen tap buttons

**Later:**
- MIDI or real drum input will feed into the same event layer

**Important:**
- Scoring must depend only on these normalised events
- Do not couple scoring logic directly to keyboard handlers
- This keeps the app fully launchable now and future-proof later

---

## 4. Scoring philosophy for Level 1 (kids + real drums later)

Scoring is about **timing and intent**, not perfection.

**Guidelines:**

A hit is "correct" if:
- The correct drum was hit
- The hit occurred within a generous timing window of the expected step

Extra hits can usually be ignored rather than punished.

Missing a required hit matters more than hitting an extra one.

**Stars should be awarded roughly like this:**
- ⭐ basic completion and engagement
- ⭐⭐ good timing across most steps
- ⭐⭐⭐ very consistent timing across multiple loops

Bias the system toward encouragement.

---

## 5. Counting and scoring must align visually

For early Level 1 lessons:
- The grid should visually reinforce `1 2 3 4`
- Do not emphasise "and" steps until lesson 9
- Step highlights, labels, and feedback should match what the child is counting in their head

This is critical for learning transfer to a real drum kit.

---

## 6. How to implement changes safely

Whenever you implement changes:
- Do not refactor unrelated files
- Prefer extending data and props over rewriting logic
- Comment clearly where pedagogy drives UI decisions
- Keep TypeScript strict and readable
- Explain trade-offs if there is more than one safe approach

If something feels like a large change, pause and explain before proceeding.

---

## 7. Your role

In this repo, you are acting as:
- A beginner drum teacher designing correct learning progression
- A frontend engineer making minimal, safe changes
- A game designer reinforcing progress through stars and locking

**Your success criteria is simple:**

A 7-year-old should be able to open Level 1, understand what to count, feel steady on the beat, and feel proud when they earn stars – **even before a real drum kit is plugged in**.

---

## Additional Notes

### Lesson Content Authorship
- The 10 Level 1 lessons are already defined above
- You should implement these lessons exactly as specified
- For future levels (Level 2+), expect human input for pedagogical decisions
- Your role is to implement the data structure correctly, not to design curriculum

### Real Drum Integration (Future)
- TD-11 MIDI integration will be tested separately (week of Dec 16)
- Current implementation must work perfectly with keyboard/tap buttons
- The generic drum-event layer ensures MIDI can be swapped in later
- Do not block current launch on MIDI functionality

### Testing Approach
- Verify each lesson displays correct counting labels
- Test that quarter-note lessons feel different from eighth-note lessons
- Ensure star thresholds are achievable for a beginner
- Check that lesson unlocking works in strict sequence
