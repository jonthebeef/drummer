# Drummer V2 Roadmap

## Current Status (v1 - Dec 15, 2025 Launch)

✅ **Core Features Complete:**
- Multi-account system (localStorage-based)
- Level 1 with 10 lessons (quarters-first pedagogy)
- Star-based progression and unlocking
- Keyboard input (F/J/Space)
- Desktop tap buttons (in PRACTICE state)
- Web Audio synthesis (kick, snare, hihat, metronome)
- Proper Next.js routing
- Analytics (PostHog with GDPR consent)

⚠️ **Known Issues:**
- Mobile layout is poor in portrait mode
- Tap buttons exist but layout breaks on small screens
- DrumGrid not responsive for mobile
- No MIDI drum input support yet

---

## V2 Feature Roadmap

### 1. Mobile-First Responsive Design 🎯 HIGH PRIORITY

**Problem:**
- Portrait mode: Layout looks "awful" (user feedback)
- Landscape mode: Better but tap controls still awkward
- DrumGrid designed for desktop (fixed widths, no mobile adaptation)
- Buttons exist but need better mobile UX

**Solution - Mobile Theater Mode:**

#### Portrait Mode (320px - 768px):
```
┌─────────────────┐
│ LEVEL 1 | GROOVE│ <- Compact header
├─────────────────┤
│   DRUM GRID     │ <- Smaller, scrollable if needed
│  (responsive)   │
├─────────────────┤
│ ▶ Play | 60 BPM│ <- Minimal transport
├─────────────────┤
│  [KICK] 🦵      │ <- Full-width tap buttons
│  [SNARE] 🥁     │    (vertical stack)
│  [HIHAT] 🔔     │
├─────────────────┤
│ Instructions ▼  │ <- Collapsible (starts closed)
└─────────────────┘
```

#### Landscape Mode (768px+):
```
┌───────────────────────────────────────┐
│ LEVEL 1 | GROOVE | ▶ 60BPM | Metro   │
├─────────────────┬─────────────────────┤
│   DRUM GRID     │  [K] [S] [H]       │
│   (centered)    │  Tap buttons       │
│                 │  (horizontal)      │
│                 ├────────────────────│
│                 │ Loop 2/4 ████░░    │
└─────────────────┴─────────────────────┘
```

**Implementation Tasks:**
- [ ] Add responsive breakpoints to DrumGrid
  - Scale column widths based on viewport
  - Adjust font sizes and spacing
  - Consider horizontal scroll for very small screens
- [ ] Redesign ExerciseView layout with mobile-first approach
  - Use CSS Grid with breakpoints
  - Sticky header and tap controls
  - Collapsible instructions panel
- [ ] Make tap buttons touch-optimized
  - Minimum 48px touch targets
  - Better spacing between buttons
  - Haptic feedback (if available)
- [ ] Test on actual devices (iPhone, iPad, Android)
- [ ] Consider PWA installation for fullscreen mode

---

### 2. Sticking Training (Hand Patterns) 🥁

**Concept:**
Teach students which *hand* to use for each drum hit (right/left).

**Common Patterns:**
- **RLRL** - Alternating (single stroke roll)
- **RRLL** - Double stroke roll
- **RLRR LRLL** - Paradiddle
- **RLRL RRLL** - Combination patterns

**Data Model Changes:**

```typescript
// Current:
{ step: 1, countLabel: "1", hit: ["hihat"] }

// With sticking:
{
  step: 1,
  countLabel: "1",
  hit: [
    { drum: "hihat", hand: "R" }  // R = right, L = left
  ]
}

// Exercise metadata:
{
  id: "sticking-paradiddle",
  title: "Paradiddle Pattern",
  type: "sticking",  // New exercise type
  focusHands: true,  // Enable hand tracking/scoring
  // ...
}
```

**Input Options:**

**Option A: Dual Keyboard Keys (Easiest to implement)**
```
Right hand:  K (hihat), L (snare), ; (kick)
Left hand:   D (hihat), F (snare), C (kick)
```
- Pros: Works immediately, no hardware needed
- Cons: Awkward for absolute beginners, doesn't match real drums

**Option B: Visual-Only Teaching Mode**
```
Show R/L labels on DrumGrid
Accept any hit, just show correct sticking
Don't enforce during scoring (educational only)
```
- Pros: Simple, teaches concept without pressure
- Cons: No validation, limited learning feedback

**Option C: MIDI-Based (Most realistic)**
```
Real drum pads naturally show which hand
Velocity/position can indicate hand
Or use dual-zone pads (left/right zones)
```
- Pros: Most natural, works with real drumming
- Cons: Requires MIDI implementation (v2.1)

**Recommended Approach for v2:**
1. Start with **Option B** (visual-only mode)
   - Add `hand: "R" | "L"` to pattern data
   - Show R/L labels on DrumGrid when `exercise.focusHands === true`
   - Don't score hands initially, just teach the concept
2. Add **Option A** (dual keyboard) for intermediate students
   - Optional mode, not required for stars
   - "Hard mode" challenge for keyboard players
3. Defer **Option C** (MIDI) until MIDI integration done

**Implementation Tasks:**
- [ ] Extend PatternNote interface to support hand specification
- [ ] Add `hand?: "R" | "L"` field (optional for backwards compatibility)
- [ ] Update DrumGrid to show R/L labels when present
- [ ] Add `focusHands` flag to Exercise type
- [ ] Create 3-5 sticking exercises for Level 2 or Level 3
- [ ] (Optional) Add dual-keyboard input mode
- [ ] (Future) Integrate with MIDI when available

**Pedagogical Notes:**
- Not critical for Level 1 (absolute beginners)
- Important for Level 2+ (developing proper technique)
- Essential for Level 3+ (speed, endurance, rudiments)

---

### 3. MIDI Drum Input Support 🎹

**Goal:**
Support real electronic drum kits (Roland TD-11, Alesis, etc.)

**TD-11 Testing:**
- User has TD-11 available week of Dec 16
- Test MIDI mapping, latency, velocity handling

**Web MIDI API:**
```typescript
// Browser support: Chrome, Edge (NOT Safari on iOS)
if (navigator.requestMIDIAccess) {
  const midiAccess = await navigator.requestMIDIAccess();
  midiAccess.inputs.forEach(input => {
    input.onmidimessage = (msg) => {
      // Parse MIDI note -> drum mapping
      const drum = mapMidiNoteToDrum(msg.data[1]);
      const velocity = msg.data[2];

      // Call existing hitDrum() abstraction
      hitDrum(drum, { velocity, timestamp: msg.timeStamp });
    };
  });
}
```

**Implementation Tasks:**
- [ ] Research Web MIDI API basics
- [ ] Create MIDI input hook (`useMidiInput`)
- [ ] Map MIDI note numbers to drums (configurable)
- [ ] Handle velocity for dynamic feedback
- [ ] Add MIDI device selection UI
- [ ] Test latency compensation
- [ ] Fall back to keyboard/tap if no MIDI
- [ ] Settings page: MIDI device mapping configurator
- [ ] Test on TD-11 (week of Dec 16)

**Challenges:**
- Safari iOS doesn't support Web MIDI (iPad users stuck with tap/keyboard)
- Latency varies by device
- Need drum→note mapping UI (different kits = different mappings)

---

### 4. Additional Levels & Content 📚

**Level 2: Eighth Notes & Rock Grooves (10 lessons)**
- More eighth-note patterns
- Syncopation introduction
- Classic rock beats
- Tempo range: 60-80 BPM

**Level 3: Fills & Dynamics (10 lessons)**
- Simple 1-bar fills
- Dynamic control (soft/loud)
- Transitions between grooves and fills
- Tempo range: 70-100 BPM

**Level 4: Advanced Grooves (10 lessons)**
- Funk, reggae, shuffle feels
- Ghost notes
- More complex syncopation
- Tempo range: 80-120 BPM

**Implementation Tasks:**
- [ ] Design Level 2 pedagogical progression
- [ ] Create 10 patterns for Level 2
- [ ] Write 10 exercises with kid-friendly instructions
- [ ] Add Level 2 to data/levels.ts
- [ ] Repeat for Levels 3 & 4

---

### 5. Improved Scoring & Feedback 🎯

**Current Issues:**
- Timing window might be too strict/loose
- No differentiation between "close" and "way off"
- No feedback during practice (only after 4 loops)

**Enhancements:**
- [ ] Real-time visual feedback (green/yellow/red step borders)
- [ ] Show timing offset (-50ms, +30ms, etc.)
- [ ] Adaptive timing window (easier for slow tempos)
- [ ] Velocity scoring (did you hit hard/soft as intended?)
- [ ] Combo counter (streak of correct hits)
- [ ] "Almost there!" vs "Way off!" messaging

---

### 6. Practice Tools & Features 🛠️

**Looper:**
- [ ] Set custom loop count (not fixed at 4)
- [ ] Loop single bars or sections
- [ ] Slow-motion practice (0.5x, 0.75x speed)

**Click Track Variations:**
- [ ] Silent click (visual only)
- [ ] Accent patterns (1-e-&-a with accents on different beats)
- [ ] Custom subdivisions (triplets, 16th notes)

**Recording & Playback:**
- [ ] Record practice attempts
- [ ] Playback with pattern overlay
- [ ] Compare to perfect version
- [ ] Export recordings (audio or MIDI)

**Challenges:**
- [ ] Daily challenges (specific pattern + tempo goal)
- [ ] Speed goals (nail a pattern at increasing tempos)
- [ ] Accuracy goals (maintain 95%+ over 10 loops)

---

### 7. Progress Tracking & Analytics 📊

**Current:** Basic stars per exercise (localStorage)

**Enhancements:**
- [ ] Practice time tracking
- [ ] Streak counter (days in a row)
- [ ] Progress charts (accuracy over time)
- [ ] Best tempo achieved per pattern
- [ ] Achievement badges
- [ ] Parent dashboard (review kid's progress)

**Privacy:**
- Keep data local (localStorage) for privacy
- Optional: sync to cloud (parent account, GDPR-compliant)

---

### 8. Visual & Audio Improvements 🎨

**Visual:**
- [ ] Animated drummer character (shows sticking, timing)
- [ ] Better celebration animations (3-star fireworks)
- [ ] Dark/light mode toggle
- [ ] Customizable color themes
- [ ] Accessibility: high contrast mode, larger text

**Audio:**
- [ ] Better drum samples (real recorded drums)
- [ ] Multiple kit sounds (rock kit, jazz kit, electronic)
- [ ] Backing tracks for exercises (bass + guitar)
- [ ] User-uploadable samples

---

### 9. Social & Sharing Features 🌍

**Multiplayer:**
- [ ] Two-player mode (split screen or turn-based)
- [ ] Challenge friends (send a pattern, compare scores)

**Sharing:**
- [ ] Share progress on social media
- [ ] Export certificate (Level completed!)
- [ ] Shareable exercise URLs

**Community:**
- [ ] Pattern library (user-submitted patterns)
- [ ] Leaderboards (optional, privacy-aware)

---

### 10. Platform & Deployment 🚀

**Current:** Web app only (Next.js hosted)

**Future Platforms:**
- [ ] PWA (installable, offline mode)
- [ ] Electron app (desktop, better MIDI support)
- [ ] Native iOS app (if Web MIDI not sufficient)
- [ ] Native Android app
- [ ] Embed in educational platforms (Canvas, Google Classroom)

**Hosting:**
- [ ] Add custom domain
- [ ] CDN for global performance
- [ ] Database for multi-device sync (optional)

---

## Version Priorities

### V2.0 - "Mobile & MIDI" (Target: Jan 2026)
1. Mobile responsive design (HIGH PRIORITY)
2. MIDI drum input
3. Sticking training (visual-only mode)
4. Level 2 content (10 exercises)

### V2.1 - "Practice Tools" (Target: Mar 2026)
1. Improved scoring with real-time feedback
2. Practice looper and speed control
3. Level 3 content

### V2.2 - "Audio & Visual Polish" (Target: Jun 2026)
1. Real drum samples
2. Animated drummer character
3. Accessibility improvements
4. Level 4 content

### V3.0 - "Social & Platform" (Target: Late 2026)
1. Multiplayer features
2. Community pattern library
3. Native mobile apps (if needed)
4. Parent dashboard

---

## Future Ambitions (Post-V2, Optional)

This section captures longer-term direction for the product. These are north stars, not commitments. None of these ideas are in active development, and they should only be pursued if the product proves useful and the value is clear.

The app may eventually evolve from a local, self-contained learning tool into a lightly connected learning product for families. This evolution should be staged, optional, and value-driven.

---

### 1. Distributed Content (Not Yet Required)

Lessons, patterns, and levels are currently data-driven and stored in the repo. This works well while content is relatively stable and single-author.

In future, content could move to a database or headless CMS. This would enable:
- Updating lessons without redeploying
- Adding or adjusting levels dynamically
- Scheduling content drops for returning users

This is an enabler, not a goal. It only becomes valuable when content velocity or multiple contributors justify the infrastructure.

---

### 2. User Accounts Beyond Local Storage

Current local accounts are intentional and privacy-first. They require no signup, no passwords, and no data leaves the device.

In future, optional cloud-backed accounts could enable:
- Progress syncing across devices (phone, tablet, laptop)
- Parent dashboards showing what their child has achieved
- Certificates and summaries tied to an email address

If implemented, early versions should favour email-first or magic-link authentication, not passwords. Avoid committing to full authentication systems prematurely. Local-only accounts should always remain a valid option.

---

### 3. Progress, Certificates, and Summaries

The app may later generate:
- Level completion certificates (printable, shareable)
- Weekly or milestone summaries (what was practised, what was achieved)
- Gentle practice reminders (optional, parent-controlled)

These should be computed by the app itself, not external tools. External services (email, PDF generation) are delivery mechanisms only. The app remains the source of truth for progress.

---

### 4. Email as a Support Channel (Not Marketing)

If email is ever introduced, it should be framed as:
- Reassurance for parents ("Your child completed Level 2 this week")
- Celebration for kids ("You earned 3 stars on Rock Beat!")
- Continuity between practice sessions ("Ready to try the next lesson?")

Email is not for funnels, growth hacks, or gamification pressure. Personalisation should be explicit and data-driven (child's name, current level, recent achievements). Email tooling should not become a source of truth—it only reflects what the app already knows.

---

### 5. Product Principles for Future Expansion

Any future expansion must:

- **Preserve simplicity for children.** The core experience should remain playful, focused, and distraction-free. More features should not mean more complexity for the child.

- **Avoid increasing operational burden for parents.** Parents should not need to manage accounts, moderate content, or troubleshoot infrastructure. The app should remain low-maintenance.

- **Remain readable and tweakable by non-expert adults.** The codebase should stay simple enough that a parent with basic coding skills can add an exercise, adjust a tempo, or customise content for their child.

- **Introduce infrastructure only when it unlocks clear learning or motivation value.** Databases, authentication, email systems, and external APIs all add complexity and maintenance burden. They should only be adopted when the benefit to learners is obvious and significant.

---

## Notes

- v1 is launchable Dec 15, 2025 for Seb's birthday
- v2 focus = make it work great on mobile + real drums
- Keep codebase simple and well-commented for parent customization
- Privacy-first approach (local storage, optional sync)
- Educational focus, not gamification overload
