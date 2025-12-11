# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Drummer is an interactive web app for teaching kids (ages 7-13) drum patterns. Built for Seb's 12th birthday (Dec 15, 2025) with the goal of teaching counting, grooves, and eventually fills.

**Key Design Principles:**
- All musical content is data-driven (not hardcoded in JSX)
- Simple, well-commented code for non-expert parents to customize
- One concept per exercise
- "Theater mode" layout with drum grid player at top, content scrolling beneath

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## Architecture

### Data-Driven Content System

The app separates musical content from UI completely:

1. **Patterns** (`data/patterns.ts`) - The raw drum patterns
   - Each pattern defines which drums hit on which steps
   - Steps are 1-indexed in data (step 1 = first eighth note)
   - For 8th notes: 8 steps per bar = "1 & 2 & 3 & 4 &"
   - DrumType: "kick", "snare", "hihat"

2. **Exercises** (`data/exercises.ts`) - Learning activities wrapping patterns
   - References patterns by ID or includes inline pattern
   - Contains markdown instructions
   - Specifies tempo, duration, counting guide
   - Type: "groove", "fill", "timing", or "song"

3. **Levels** (`data/levels.ts`) - Groups of exercises in sequence
   - Simple arrays of exercise IDs
   - Defines progression structure

### Audio System

All drum sounds are synthesized using Web Audio API (`utils/drumSynth.ts`):
- **Kick**: Low sine wave (150Hz → 40Hz) with envelope
- **Snare**: White noise + 180Hz triangle wave
- **Hi-hat**: High-pass filtered noise (7000Hz)
- **Metronome**: Dual-tone click with accent on beat 1

No external audio files needed. Sounds are generated in real-time.

### Timing System

`useSequencer` hook (`hooks/useSequencer.ts`) handles all timing:
- Uses `requestAnimationFrame` for accurate step progression
- Calculates step duration from BPM (for 8th notes: 60000 / bpm / 2)
- Provides `onStepChange` callback that triggers drum sounds
- Sequencer is 0-indexed (step 0-7), pattern data is 1-indexed (step 1-8)

### Layout System - "Theater Mode"

**ExerciseView & PatternSelector** both use this layout:

1. **Top Section** (dark background, full-width):
   - Title/description bar (gradient header)
   - Drum grid (white card, prominent)
   - Controls (transport, practice mode, metronome)

2. **Bottom Section** (light background, scrollable):
   - Instructions, counting guide, pattern selector
   - Content can scroll while player stays fixed-like at top

This mimics YouTube theater mode - player is primary focus.

### State Management

No external state management. All state lives in:
- `app/page.tsx` - View routing (home/session/patterns), session progress
- Individual components - Local UI state (playing, tempo, metronome, etc.)

Session flow: Home → Level 1 exercises (hardcoded for v1) → Complete

## Key Interactions

### User Input
`useDrumInput` hook captures:
- Keyboard: F (kick), J (snare), Space (hihat)
- Mobile: Tap buttons in PracticeControls component
- Plays sound immediately and sets `currentHit` for visual feedback

### Visual Feedback
`DrumGrid` component shows:
- Current step (blue border, scale-up during playback)
- Drum hits (colored circles - cyan/amber/purple)
- User correct hits (green ring flash when hit matches step)

### Practice Modes
- **Listen**: Just play pattern, no input tracking
- **Tap along**: Shows visual feedback when user hits match pattern

## Adding New Musical Content

### New Pattern
Add to `data/patterns.ts`:
```typescript
{
  id: "new-pattern",
  name: "Pattern Name",
  difficulty: "easy" | "medium" | "hard",
  description: "Kid-friendly description",
  defaultTempoBpm: 80,
  timeSignature: "4/4",
  subdivision: "eighth",
  steps: [
    { step: 1, countLabel: "1", hit: ["kick", "hihat"] },
    { step: 2, countLabel: "&", hit: ["hihat"] },
    // ... 8 steps total for eighth notes
  ]
}
```

### New Exercise
Add to `data/exercises.ts`, then add its ID to a level in `data/levels.ts`:
```typescript
{
  id: "level-2-ex-1",
  title: "Exercise Title",
  level: 2,
  type: "groove",
  instructions: "Markdown text for kids + parents",
  counting: "1 & 2 & 3 & 4 &",
  tempoBpm: 80,
  durationBars: 4,
  patternId: "boots-and-cats"  // or inline pattern object
}
```

### New Level
Add to `data/levels.ts`:
```typescript
{
  id: "level-2",
  levelNumber: 2,
  name: "Level 2: Faster Beats",
  description: "What kids will learn",
  exerciseIds: ["level-2-ex-1", "level-2-ex-2"]
}
```

## Component Hierarchy

```
page.tsx (routing: home/session/patterns)
├── ExerciseView
│   ├── DrumGrid (visual pattern display)
│   ├── TransportControls (play/pause/tempo/metronome)
│   └── PracticeControls (listen/tap mode + mobile buttons)
│
└── PatternSelector
    ├── DrumGrid
    └── Transport controls inline
```

## Important Constraints

1. **Step Indexing Mismatch**:
   - Pattern data: 1-indexed (step 1-8)
   - Sequencer/UI: 0-indexed (step 0-7)
   - Always convert when matching: `pattern.steps.find(s => s.step === stepIndex + 1)`

2. **Metronome Timing**:
   - Plays on quarter notes (steps 0, 2, 4, 6 for 8-step patterns)
   - Accents beat 1 (step 0) with higher pitch

3. **Audio Context Resume**:
   - Must call `resumeAudioContext()` on first user interaction
   - Already wired into play buttons and drum input

4. **Mobile Considerations**:
   - Tap buttons always visible in "tap along" mode
   - Keyboard shortcuts work alongside tap buttons
   - Responsive grid layout adjusts for small screens

## Future Development Notes

Currently v1 for Seb's birthday. Planned expansions:
- More levels (fills, dynamics, timing exercises)
- Progress tracking (localStorage or backend)
- Accuracy scoring for "tap along" mode
- Better onboarding for Matilda (age 6) - simpler exercises
