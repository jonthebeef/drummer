# 🥁 Drummer

A fun, interactive web app that helps kids (ages 7-13) learn beginner drum patterns through a simple "levels and lessons" progression.

## Quick Start

### Running the App

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in your browser**:
   Go to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Features

- **Interactive drum grid** - Visual 3-row (hi hat, snare, kick) by 8-column grid showing patterns
- **Practice modes** - Switch between "Listen" mode and "Tap along" mode
- **Keyboard support** - F = Kick, J = Snare, Spacebar = Hi Hat
- **Mobile friendly** - Large tap buttons for tablets and phones
- **Tempo control** - Adjustable BPM slider (40-160 BPM)
- **Guided exercises** - Step-by-step instructions with markdown support
- **Pattern browser** - Explore and play different drum patterns
- **Session flow** - "Start today's session" button for structured practice

## How to Add New Content

All musical content is stored as data (not hard-coded), making it easy to add new patterns, exercises, and levels.

### Adding a New Drum Pattern

1. Open `data/patterns.ts`
2. Copy an existing pattern object
3. Update the fields:
   - `id`: Unique identifier (e.g., "funky-beat")
   - `name`: Display name (e.g., "Funky Groove")
   - `difficulty`: "easy", "medium", or "hard"
   - `description`: Kid-friendly description
   - `defaultTempoBpm`: Starting tempo (60-100 for beginners)
   - `steps`: Array of notes (see below)

#### Understanding Steps and Counting Pedagogy

The app uses an **8-step grid** internally to represent one bar of music:
- Steps 1-8 can represent: "1 & 2 & 3 & 4 &" (eighth notes)
- Step 1 = beat 1, step 2 = the "&", step 3 = beat 2, etc.

**Important for beginners (Level 1):**
- Early exercises use **quarter notes only** - students count "1 2 3 4"
- Patterns place hits only on steps 1, 3, 5, 7 (the main beats)
- The visual grid de-emphasizes the "and" steps (shown dimmed)
- Only in lessons 9-10 do we introduce eighth notes ("1 & 2 & 3 & 4 &")

This "quarters first, eighths later" approach helps absolute beginners focus on steady timing before subdividing.

**Example quarter-note pattern:**
```typescript
steps: [
  { step: 1, countLabel: "1", hit: ["kick", "hihat"] },  // Beat 1
  { step: 2, countLabel: "&", hit: [] },                 // Empty (not counted yet)
  { step: 3, countLabel: "2", hit: ["snare", "hihat"] }, // Beat 2
  { step: 4, countLabel: "&", hit: [] },                 // Empty
  { step: 5, countLabel: "3", hit: ["hihat"] },          // Beat 3
  { step: 6, countLabel: "&", hit: [] },                 // Empty
  { step: 7, countLabel: "4", hit: ["hihat"] },          // Beat 4
  { step: 8, countLabel: "&", hit: [] },                 // Empty
]
```

**Example eighth-note pattern (later lessons):**
```typescript
steps: [
  { step: 1, countLabel: "1", hit: ["kick", "hihat"] },
  { step: 2, countLabel: "&", hit: ["hihat"] },          // Now we use the "&"
  { step: 3, countLabel: "2", hit: ["snare", "hihat"] },
  { step: 4, countLabel: "&", hit: ["hihat"] },
  // ... and so on
]
```

### Adding a New Exercise

1. Open `data/exercises.ts`
2. Copy an existing exercise object
3. Update the fields:
   - `id`: Unique identifier
   - `title`: Exercise name
   - `level`: Which level this belongs to (1, 2, 3...)
   - `type`: "groove", "fill", "timing", or "song"
   - `instructions`: Markdown text with clear, positive instructions
   - `counting`: The counting guide shown in UI (e.g., "1 2 3 4" or "1 & 2 & 3 & 4 &")
   - `countingMode`: Visual display mode - "quarters" (shows 1 2 3 4) or "eighths" (shows 1 & 2 & 3 & 4 &)
   - `tempoBpm`: Starting tempo for this exercise
   - `durationBars`: How many bars to loop (usually 4)
   - `patternId`: Reference a pattern by ID from `patterns.ts`

**Example quarter-note exercise (Level 1, lessons 1-8):**
```typescript
{
  id: "level-1-ex-3",
  title: "Snare on Every Beat",
  level: 1,
  type: "groove",
  instructions: `
Hit the snare drum four times: **1, 2, 3, 4**

Keep it steady!
  `,
  counting: "1 2 3 4",
  countingMode: "quarters",  // Hides "and" steps visually
  tempoBpm: 53,
  durationBars: 4,
  patternId: "l1-snare-quarters",
}
```

**Example eighth-note exercise (Level 1, lessons 9-10 onwards):**
```typescript
{
  id: "level-2-ex-1",
  title: "Your First Eighth Note Groove",
  level: 2,
  type: "groove",
  instructions: `
Now we're counting **1 & 2 & 3 & 4 &**

Try counting along while you play.
  `,
  counting: "1 & 2 & 3 & 4 &",
  countingMode: "eighths",  // Shows all steps including "and" beats
  tempoBpm: 65,
  durationBars: 4,
  patternId: "boots-and-cats",
}
```

### Adding a New Level

1. Open `data/levels.ts`
2. Copy an existing level object
3. Update the fields:
   - `id`: Unique identifier
   - `levelNumber`: The level number (2, 3, 4...)
   - `name`: Display name (e.g., "Level 2: Faster Beats")
   - `description`: What kids will learn
   - `exerciseIds`: Array of exercise IDs in order

Example:
```typescript
{
  id: "level-2",
  levelNumber: 2,
  name: "Level 2: Faster Beats",
  description: "Speed up your grooves and try new patterns!",
  exerciseIds: [
    "level-2-ex-1",
    "level-2-ex-2",
    "level-2-ex-3",
  ],
}
```

## Project Structure

```
drummer/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main app (home, session, patterns)
├── components/
│   ├── DrumGrid.tsx         # Visual drum pattern grid
│   ├── ExerciseView.tsx     # Exercise display with instructions
│   ├── PatternSelector.tsx  # Pattern browser
│   ├── PracticeControls.tsx # Listen/Tap mode toggle + tap buttons
│   └── TransportControls.tsx # Play/pause/tempo controls
├── data/
│   ├── exercises.ts         # All exercises (with instructions)
│   ├── levels.ts            # Level groupings
│   └── patterns.ts          # Drum patterns (the musical content)
├── hooks/
│   ├── useDrumInput.ts      # Keyboard/tap input handler
│   └── useSequencer.ts      # Timing and playback logic
└── types/
    └── index.ts             # TypeScript type definitions
```

## Tips for Parents and Educators

### Level 1 Pedagogy (Quarter Notes First!)

Level 1 uses a carefully designed "quarters first, eighths later" approach:

- **Lessons 1-8**: Students count **"1 2 3 4"** (quarter notes only)
  - Visual grid dims the "and" beats to avoid confusion
  - All drum hits happen only on the main beats (1, 2, 3, 4)
  - Tempo stays very slow (50-60 BPM)

- **Lessons 9-10**: Students learn **"1 & 2 & 3 & 4 &"** (introducing eighth notes)
  - Visual grid now shows all 8 steps prominently
  - The "and" beats are introduced with clear explanation
  - Patterns start using hits on the "and" beats

This progression prevents the common mistake of "jumping ahead" to subdivisions before students have internalized the steady pulse.

### Teaching Approach

1. **Start slow** - It's better to play correctly at 60 BPM than messily at 120 BPM
2. **One thing at a time** - Each exercise introduces only one new concept
3. **Count out loud** - Visual counting matches what students should say in their heads
4. **Celebrate progress** - Stars earned unlock new exercises
5. **Practice in short bursts** - 5-10 minutes per exercise is plenty

### Keyboard Controls

- **F** - Kick drum (bass drum, the low boom)
- **J** - Snare drum (the sharp crack)
- **Spacebar** - Hi hat (the shimmery cymbals)

### Practice Modes

- **Listen mode**: Just hear the pattern and feel the rhythm
- **Tap along mode**: Press keys or tap buttons to play along

### Tempo Tips

- Start at the default tempo for each exercise
- Only increase by 5-10 BPM at a time
- If you make mistakes, slow it back down

## Technical Details

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Timing**: `requestAnimationFrame` for accurate sequencing
- **No dependencies**: Pure React hooks for all functionality

## Future Ideas

- Add sound playback (actual drum samples)
- Track user progress in localStorage or a database
- Add more levels (fills, dynamics, different time signatures)
- Create a "Free Play" mode
- Add achievement badges
- Export practice sessions

## Contributing

This codebase is intentionally simple and well-commented so non-expert parents can customize it. Feel free to:

- Add new patterns in `data/patterns.ts`
- Write new exercises in `data/exercises.ts`
- Create new levels in `data/levels.ts`
- Tweak the styling in component files
- Adjust tempo ranges in `TransportControls.tsx`

## License

This project is free to use and modify for educational purposes.

---

**Made with ❤️ for young drummers everywhere**

Keep practicing! 🎵
