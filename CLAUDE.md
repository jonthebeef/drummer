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

`useSequencer` hook (`hooks/useSequencer.ts`) handles all timing with **lookahead scheduling**:
- Uses `requestAnimationFrame` for accurate step progression
- **Lookahead scheduling**: Schedules audio events ahead of time for precise timing
- Calculates step duration from BPM (for 8th notes: 60000 / bpm / 2)
- Provides `onStepChange(step, time)` callback where:
  - `step`: Current step index (0-7)
  - `time`: AudioContext time when this step should sound (for scheduling)
- Audio synthesis uses `time` parameter: `playDrum(drum, time)`, `playMetronomeClick(accent, time)`
- Sequencer is 0-indexed (step 0-7), pattern data is 1-indexed (step 1-8)

**Why lookahead scheduling?**
- Prevents audio glitches and timing drift
- Ensures drums play at exact scheduled times regardless of JavaScript execution
- Web Audio API schedules events precisely on the audio thread

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

**ExerciseView** - State-driven lesson flow with responsive layouts:

**Lesson States:**
1. **READY**: Instructions + Start button (side-by-side on mobile landscape)
2. **COUNTDOWN_LISTEN**: 3-2-1 countdown before listen phase (fullscreen on mobile)
3. **LISTEN**: Auto-play pattern for 4 loops (fullscreen game mode on mobile)
4. **COUNTDOWN_PRACTICE**: "Your turn!" countdown (fullscreen on mobile)
5. **PRACTICE**: User plays along for 4 loops (fullscreen game mode on mobile)
6. **RESULTS**: Stars display + continue button

**Mobile Landscape Layout (< 768px, landscape orientation):**
- **Fullscreen immersive mode** during LISTEN/PRACTICE/COUNTDOWN states
- Header hidden during gameplay (shows only on READY/RESULTS)
- `fixed inset-0` positioning fills entire viewport
- Safe area support: `pt-safe` / `pb-safe` classes for notched devices

**PRACTICE/LISTEN Game Layout:**
```
┌────────────────────────────────┐
│ 🥁 2/4 ████  60 ▶             │ ← Slim bar (40px)
├────┬───────────────────────┬───┤
│    │                       │   │
│🦵  │                       │🔔 │
│F   │   HUGE DRUM GRID      │SPC│ ← Fills viewport
│────│   (maximized)         │   │
│🥁  │                       │   │
│J   │                       │   │
└────┴───────────────────────┴───┘
```

- 3-column grid: `[80px buttons | 1fr grid | 80px buttons]`
- Left sidebar: KICK (top) + SNARE (bottom) stacked
- Right sidebar: HIHAT (full height)
- Center grid: Takes all remaining space
- LISTEN mode: Buttons dimmed (opacity-30) but visible for layout consistency

**Desktop Layout (≥ 768px):**
- Header always visible
- Traditional vertical stack: Banner → Grid → Buttons below
- Unchanged from original design

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
- **Current step**: Green border, scale-up during playback
- **Drum hits**: Colored circles
  - Cyan = Hi-hat
  - Amber = Snare
  - Purple = Kick
- **User correct hits**: Green ring flash when hit matches step
- **Step feedback**: `stepFeedback` prop shows correct/incorrect per step during practice
- **Counting labels**: Displays above grid, respects `countingMode`
  - "quarters" mode: Shows only "1 2 3 4"
  - "eighths" mode: Shows "1 & 2 & 3 & 4 &"
- **Keyboard legend**: Optional `showKeyLegend` prop (default: true)
  - Set to `false` on mobile to hide keyboard shortcuts from touch users

### Practice Flow

**Complete Lesson Sequence:**
1. **READY**: Read instructions, press "START LESSON"
2. **COUNTDOWN_LISTEN**: 3-2-1 countdown (fullscreen on mobile)
3. **LISTEN**: Pattern auto-plays for 4 loops
   - Drums play automatically using scheduled audio
   - Grid highlights current step
   - On mobile: Buttons dimmed but visible (layout consistency)
4. **COUNTDOWN_PRACTICE**: "Your turn! 3-2-1-GO!" (fullscreen on mobile)
5. **PRACTICE**: User plays along for 4 loops
   - Tap drums using keyboard or touch buttons
   - Visual feedback (green ring) on correct hits
   - Grid shows step feedback
   - Progress bar updates as loops complete
6. **RESULTS**: Stars awarded based on accuracy
   - 0 stars: "Back to Level Map" (no progression)
   - 1+ stars: "Next Lesson" button unlocks next exercise
   - Accuracy threshold: 50% = 1★, 70% = 2★, 90% = 3★

**Scoring:**
- Uses `useScoring` hook to track hits across 4 loops
- Compares user input timing vs expected pattern
- Timing window: 150ms for regular exercises, 200ms for timing exercises
- `isTimingExercise` mode accepts any drum on marked steps (for counting practice)

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
├── PracticeControls.tsx (listen/tap mode + mobile buttons)
├── PostHogProvider.tsx (analytics consent management)
└── CookieConsentBanner.tsx (GDPR-compliant consent UI)
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

   **Portrait Mode:**
   - `RotatePrompt` component detects portrait orientation (height > width) on mobile
   - Shows fullscreen overlay: "Please Rotate Your Device"
   - Animated phone icon and visual hints
   - Listens to `resize` and `orientationchange` events
   - Auto-hides when user rotates to landscape

   **Landscape Mode (< 768px width):**
   - **Fullscreen immersive game mode** during LISTEN/PRACTICE/COUNTDOWN
   - `fixed inset-0` positioning removes all browser chrome
   - Header hidden during gameplay (only visible on READY/RESULTS)
   - Safe area support with Tailwind classes: `pt-safe` / `pb-safe`
   - 3-column game layout: buttons flanking centered grid
   - Left sidebar (80px): KICK + SNARE stacked vertically
   - Right sidebar (80px): HIHAT full height
   - Center: Grid fills all remaining space (~85% of viewport)
   - Slim top bar (40px): Progress bar + BPM + play status

   **READY State Mobile:**
   - Side-by-side layout in landscape: Instructions (scrollable) | Start button
   - Uses `landscape:flex-row` for horizontal layout
   - Stacked vertical on portrait (if rotation prompt bypassed)

   **Input:**
   - Touch buttons always visible during PRACTICE (hidden on desktop if keyboard detected)
   - Keyboard shortcuts work alongside tap buttons
   - Touch targets: 80px wide x 50% height (buttons), minimum 48px per iOS guidelines

   **Desktop (≥ 768px):**
   - Traditional layout unchanged (vertical stack)
   - Header always visible
   - No fullscreen mode

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

## Mobile Implementation Details

### RotatePrompt Component
Located in `components/RotatePrompt.tsx`:
- Detects orientation using `window.innerHeight > window.innerWidth`
- Only shows on mobile widths (< 768px) in portrait mode
- `fixed inset-0 z-50` for fullscreen overlay
- Animated bounce icon and visual phone rotation hint
- Auto-hides when conditions no longer met

### Fullscreen Game Mode
Key CSS patterns for mobile landscape:
```tsx
// Fullscreen container (LISTEN/PRACTICE/COUNTDOWN)
<div className="lg:hidden fixed inset-0 bg-black flex flex-col pt-safe">
  {/* Slim top bar */}
  <div className="flex-shrink-0 px-4 py-2">...</div>

  {/* Game content fills remaining space */}
  <div className="flex-1 grid grid-cols-[80px_1fr_80px] gap-2 p-2">
    {/* Left buttons */}
    {/* Center grid */}
    {/* Right buttons */}
  </div>
</div>
```

Safe area classes (from `globals.css`):
```css
.pt-safe { padding-top: env(safe-area-inset-top); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
```

### Responsive Breakpoints
- Mobile: `< 768px` (uses `lg:hidden` for mobile-only content)
- Desktop: `≥ 768px` (uses `hidden lg:block` for desktop-only content)
- Landscape detection: `landscape:` prefix modifier (Tailwind)

## Future Development Notes

Currently v1 for Seb's birthday (Dec 15, 2025). See `V2_ROADMAP.md` for detailed plans.

**Planned v2 features:**
- MIDI drum input support (Roland TD-11 testing week of Dec 16)
- Sticking training (left/right hand patterns: RLRL, RRLL, paradiddles)
- More levels (fills, dynamics, timing exercises)
- Portrait mode optimization (currently landscape-only)
- Practice tools (looper, slow-motion, recording)
- Better onboarding for Matilda (age 6) - simpler exercises

**Known Issues:**
- See `MOBILE_ISSUES.md` for detailed mobile UX analysis
- Safe area insets may need testing on more devices (iPhone notches, etc.)
- DrumGrid text sizing could be more responsive for very small screens
