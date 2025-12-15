# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Drummer is an interactive web app for teaching kids (ages 6-13) drum patterns. Built for Seb's 12th birthday (Dec 15, 2025) with the goal of teaching counting, grooves, and eventually fills.

**Key Design Principles:**
- All musical content is data-driven (not hardcoded in JSX)
- Simple, well-commented code for non-expert parents to customize
- One concept per exercise
- "Lego model" learning - start simple, build towards mastery
- Slow tempo progression (Level 1: 50-60 BPM only)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## App Routes

```
/                                    - Landing page (kid-focused homepage with demo)
/accounts                            - Account selection/creation
/levels/[levelId]                    - Level map (lesson selection with stars/locking)
/levels/[levelId]/exercise/[id]      - Exercise player
/patterns                            - Pattern browser (all patterns)
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
   - References patterns by ID
   - Contains markdown instructions
   - Specifies tempo, duration, counting guide
   - Type: "groove", "fill", "timing", or "song"
   - Level 1 tempos: 50→52→53→54→55→56→57→58→59→60 BPM (very gradual)
   - `countingMode`: "quarters" or "eighths" (see Pedagogy section below)

3. **Levels** (`data/levels.ts`) - Groups of exercises in sequence
   - Simple arrays of exercise IDs
   - Defines progression structure

### Account & Progress System

**Accounts** (`utils/accounts.ts`):
- Multiple user accounts stored in localStorage
- Each account has: id, name, avatar (emoji), createdAt
- `getCurrentAccount()`, `signInToAccount()`, `createAccount()`

**Progress** (`utils/progress.ts`):
- Stars (0-3) earned per exercise, stored per account
- Exercise unlocking: must complete previous exercise first
- `getExerciseStars()`, `setExerciseStars()`, `isExerciseUnlocked()`

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

### Layout System

**Consistent max-width pattern across all pages:**
```tsx
<div className="max-w-6xl mx-auto px-4">
```

**LevelMap** - Angry Birds style level selection:
- Shows all exercises with number badges
- Stars displayed for completed exercises
- Locked exercises show padlock, require previous completion
- Progress bar only appears after first exercise completed

**ExerciseView** - Theater mode layout:
1. Top Section (dark): Title, DrumGrid, Controls
2. Bottom Section (light, scrollable): Instructions, counting guide

## Key Interactions

### User Input
`useDrumInput` hook captures:
- Keyboard: F (kick), J (snare), Space (hihat)
- Mobile: Tap buttons in PracticeControls component
- Plays sound immediately and sets `currentHit` for visual feedback

### Keyboard Shortcuts
- **F** = Kick drum
- **J** = Snare drum
- **Space** = Hi-hat
- **Arrow Up/Down** = Adjust tempo ±5 BPM
- **M** = Toggle metronome

### Visual Feedback
`DrumGrid` component shows:
- Current step (green border, scale-up during playback)
- Drum hits (colored circles - cyan/amber/purple)
- User correct hits (green ring flash when hit matches step)
- Optional `showKeyLegend` prop to hide keyboard shortcuts

### Practice Flow
1. **Listen phase**: Pattern plays 4 loops automatically
2. **Practice phase**: User taps along, gets visual feedback
3. **Scoring**: Stars awarded based on accuracy (via `useScoring` hook)

## Adding New Musical Content

### New Pattern
Add to `data/patterns.ts`:
```typescript
{
  id: "new-pattern",
  name: "Pattern Name",
  difficulty: "easy" | "medium" | "hard",
  description: "Kid-friendly description",
  defaultTempoBpm: 55,  // Keep slow for beginners
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
  tempoBpm: 65,  // Level 2 can be slightly faster
  durationBars: 4,
  patternId: "pattern-id"
}
```

### New Level
Add to `data/levels.ts`:
```typescript
{
  id: "level-2",
  levelNumber: 2,
  name: "Level 2: Rock Grooves",
  description: "What kids will learn",
  exerciseIds: ["level-2-ex-1", "level-2-ex-2"]
}
```

## Component Hierarchy

```
app/
├── page.tsx (landing page with demo DrumGrid)
├── accounts/page.tsx (account selection/creation)
├── levels/[levelId]/
│   ├── page.tsx (uses LevelMap component)
│   └── exercise/[exerciseId]/page.tsx (uses ExerciseView)
└── patterns/page.tsx (pattern browser)

components/
├── DrumGrid.tsx (visual pattern display, respects countingMode)
├── LevelMap.tsx (level selection with stars/locking)
├── ExerciseView.tsx (full exercise player, mobile fullscreen mode)
├── RotatePrompt.tsx (prompts mobile users to rotate to landscape)
├── TransportControls.tsx (play/pause/tempo/metronome)
└── PracticeControls.tsx (listen/tap mode + mobile buttons)
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
   - **Landscape-only gameplay**: `RotatePrompt` component prompts users to rotate phone
   - **Fullscreen immersive mode**: During LISTEN/PRACTICE states on mobile:
     - Header is hidden
     - Content fills entire viewport (no padding/browser chrome)
     - Slim top bar with progress/BPM only
   - Tap buttons always visible in "tap along" mode
   - Keyboard shortcuts work alongside tap buttons
   - Desktop layout unchanged (header always visible)

5. **Learning Progression**:
   - Level 1 tempos stay in 50s (50-60 BPM max)
   - 4 listen loops before practice phase
   - One concept per exercise

## Pedagogy: Quarters-First Approach

The app teaches counting in stages, matching how kids naturally learn:

### Counting Modes

**`countingMode: "quarters"`** (Lessons 1-8):
- Grid only shows "1 2 3 4" labels (hides "&" symbols)
- "And" beat columns dimmed to 30% opacity
- All hits land on quarter notes only (steps 1, 3, 5, 7)
- Kids count "1, 2, 3, 4" in their heads

**`countingMode: "eighths"`** (Lessons 9-10):
- Full grid with "1 & 2 & 3 & 4 &" labels
- All 8 columns shown at full opacity
- Introduces hits on "and" beats
- Kids learn to count "1 and 2 and 3 and 4 and"

### Why This Matters

This mirrors real drum teaching: you don't teach eighth notes on day one. The visual grid reinforces what the child counts in their head, making transfer to a real drum kit easier.

### Technical Implementation

- `types/index.ts`: `CountingMode = "quarters" | "eighths"`
- `DrumGrid.tsx`: Accepts `countingMode` prop, dims/hides "&" columns in quarters mode
- `ExerciseView.tsx`: Passes `countingMode` from exercise data to DrumGrid
- Sequencer timing unchanged (always 8 steps internally)

## Analytics (PostHog)

Privacy-first analytics with GDPR-compliant consent management.

**Setup:**
1. Create account at https://eu.posthog.com (EU hosting)
2. Copy `.env.local.example` to `.env.local`
3. Add your PostHog project key

**Key files:**
- `components/PostHogProvider.tsx` - Consent management, PostHog init
- `components/CookieConsentBanner.tsx` - User-facing consent UI
- `utils/analytics.ts` - Event tracking functions

**Events tracked:**
- `account_created` / `account_signed_in` - User identity
- `exercise_started` / `exercise_completed` - Learning journey
- `level_viewed` - Navigation
- `tempo_changed` / `metronome_toggled` - Practice behavior

**Consent flow:**
- Cookie banner shows on first visit
- PostHog only initializes after explicit consent
- "No thanks" opts out completely
- Consent stored in localStorage (`drummer_analytics_consent`)

## Future Development Notes

Currently v1 for Seb's birthday. See `V2_ROADMAP.md` for detailed plans.

Planned expansions:
- More levels (fills, dynamics, timing exercises)
- Portrait mode support for mobile (currently landscape-only)
- Accuracy scoring refinements
- Better onboarding for Matilda (age 6) - simpler exercises

Known issues documented in `MOBILE_ISSUES.md`.
