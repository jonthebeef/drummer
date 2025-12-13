/**
 * ExerciseView Component - Game-Like Lesson Flow
 *
 * Flow: READY → COUNTDOWN → LISTEN (2 loops) → COUNTDOWN → PRACTICE (4 loops) → RESULTS
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Exercise, Pattern } from "@/types";
import { getPatternById } from "@/data/patterns";
import { useSequencer } from "@/hooks/useSequencer";
import { useDrumInput } from "@/hooks/useDrumInput";
import { useScoring } from "@/hooks/useScoring";
import { playDrum, playMetronomeClick, resumeAudioContext } from "@/utils/drumSynth";
import { saveExerciseProgress } from "@/utils/progress";
import { trackTempoChanged, trackMetronomeToggled, trackListenPhaseStarted, trackPracticePhaseStarted } from "@/utils/analytics";
import DrumGrid from "./DrumGrid";
import RotatePrompt from "./RotatePrompt";

interface ExerciseViewProps {
  exercise: Exercise;
  onComplete?: () => void;
}

type LessonState =
  | "READY"              // Big START button
  | "COUNTDOWN_LISTEN"   // 3...2...1...WATCH!
  | "LISTEN"             // Auto-play 2 loops
  | "COUNTDOWN_PRACTICE" // Your turn! 3...2...1...GO!
  | "PRACTICE"           // User plays 4 loops
  | "RESULTS";           // Stars and celebration

export default function ExerciseView({
  exercise,
  onComplete,
}: ExerciseViewProps) {
  // Get the pattern for this exercise
  const pattern: Pattern | undefined = exercise.patternId
    ? getPatternById(exercise.patternId)
    : exercise.pattern;

  // Lesson state machine
  const [lessonState, setLessonState] = useState<LessonState>("READY");
  const [countdown, setCountdown] = useState(3);
  const [listenLoops, setListenLoops] = useState(0);
  const [metronomeEnabled, setMetronomeEnabled] = useState(true);

  // Get the pattern or throw error if not found
  if (!pattern) {
    return (
      <div className="text-center p-8 text-red-600">
        Error: Pattern not found for this exercise.
      </div>
    );
  }

  // Step change callback - plays drums and metronome
  const handleStepChange = useCallback((step: number) => {
    // Play metronome on quarter notes if enabled
    if (metronomeEnabled && step % 2 === 0) {
      const isAccent = step === 0; // Accent beat 1
      playMetronomeClick(isAccent);
    }

    // Find which drums hit on this step
    const patternStep = pattern.steps.find(s => s.step === step + 1);

    // In LISTEN mode, auto-play the drums
    if (lessonState === "LISTEN" && patternStep && patternStep.hit.length > 0) {
      patternStep.hit.forEach(drum => {
        playDrum(drum);
      });
    }
  }, [pattern, lessonState, metronomeEnabled]);

  // Sequencer hook for timing
  const {
    currentStep,
    isPlaying,
    bpm,
    play,
    pause,
    stop,
    setBpm,
  } = useSequencer({
    totalSteps: pattern.steps.length,
    initialBpm: exercise.tempoBpm,
    onStepChange: handleStepChange,
  });

  // Scoring hook to track hits and calculate results
  const {
    recordHit,
    getStepFeedback,
    getScoringResult,
    resetScoring,
    loopsCompleted,
  } = useScoring({
    pattern,
    isPlaying: isPlaying && lessonState === "PRACTICE",
    currentStep,
    bpm,
    isTimingExercise: exercise.type === "timing",
  });

  // Drum input hook for tap-along mode
  const { currentHit, hitDrum } = useDrumInput();

  // When user hits a drum in practice mode, record it for scoring
  useEffect(() => {
    if (currentHit && lessonState === "PRACTICE") {
      recordHit(currentHit);
    }
  }, [currentHit, lessonState, recordHit]);

  // Keyboard shortcuts: Arrow keys for tempo, 'M' for metronome
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const newBpm = Math.min(160, bpm + 5);
        setBpm(newBpm);
        trackTempoChanged(exercise.id, bpm, newBpm);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const newBpm = Math.max(40, bpm - 5);
        setBpm(newBpm);
        trackTempoChanged(exercise.id, bpm, newBpm);
      } else if (event.key === "m" || event.key === "M") {
        event.preventDefault();
        setMetronomeEnabled(prev => {
          trackMetronomeToggled(!prev, exercise.id);
          return !prev;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setBpm, bpm, exercise.id]);

  // Track loops in LISTEN mode
  const lastStepRef = useRef(-1);
  useEffect(() => {
    if (lessonState === "LISTEN" && isPlaying) {
      // Detect loop completion (step goes from last to 0)
      if (lastStepRef.current === pattern.steps.length - 1 && currentStep === 0) {
        const newLoops = listenLoops + 1;
        setListenLoops(newLoops);

        // After 4 listen loops, move to practice
        if (newLoops >= 4) {
          pause();
          setLessonState("COUNTDOWN_PRACTICE");
        }
      }
      lastStepRef.current = currentStep;
    }
  }, [lessonState, isPlaying, currentStep, listenLoops, pattern.steps.length, pause]);

  // Check for scoring results after 4 loops in PRACTICE mode
  useEffect(() => {
    if (loopsCompleted >= 4 && lessonState === "PRACTICE") {
      const result = getScoringResult();
      if (result) {
        pause();
        setLessonState("RESULTS");
      }
    }
  }, [loopsCompleted, lessonState, getScoringResult, pause]);

  // Countdown timer
  useEffect(() => {
    if (lessonState === "COUNTDOWN_LISTEN" || lessonState === "COUNTDOWN_PRACTICE") {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Countdown finished
        if (lessonState === "COUNTDOWN_LISTEN") {
          setLessonState("LISTEN");
          trackListenPhaseStarted(exercise.id);
          resumeAudioContext();
          play();
        } else if (lessonState === "COUNTDOWN_PRACTICE") {
          setLessonState("PRACTICE");
          trackPracticePhaseStarted(exercise.id);
          resetScoring();
          resumeAudioContext();
          play();
        }
      }
    }
  }, [lessonState, countdown, play, resetScoring]);

  // Start lesson handler
  const handleStart = useCallback(() => {
    setCountdown(3);
    setListenLoops(0);
    setLessonState("COUNTDOWN_LISTEN");
  }, []);

  // Retry handler
  const handleRetry = useCallback(() => {
    stop();
    setCountdown(3);
    setListenLoops(0);
    setLessonState("COUNTDOWN_LISTEN");
  }, [stop]);

  // Save progress and return to level map
  const handleContinue = useCallback(() => {
    const result = getScoringResult();
    if (result && result.stars > 0) {
      console.log(`Saving progress for ${exercise.id}: ${result.stars} stars, ${result.accuracy}% accuracy`);
      saveExerciseProgress(exercise.id, result.stars, result.accuracy);
      console.log(`Progress saved successfully`);
    } else {
      console.warn(`No progress to save - result:`, result);
    }
    if (onComplete) {
      onComplete();
    }
  }, [exercise.id, getScoringResult, onComplete]);

  // Render different screens based on state
  return (
    <div className="min-h-screen bg-black">
      {/* Show rotation prompt on mobile portrait */}
      <RotatePrompt />

      {/* Header - Hidden on mobile landscape during LISTEN/PRACTICE, shown on desktop */}
      <div className={`bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white shadow-2xl border-b-2 border-zinc-600 ${
        (lessonState === "LISTEN" || lessonState === "PRACTICE") ? "hidden lg:block" : ""
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-6">
          <div className="flex items-center justify-between gap-3 md:gap-6">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white truncate">{exercise.title}</h1>
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <span className="bg-[#00d9ff] text-black px-2 md:px-4 py-1 md:py-2 rounded-full text-sm md:text-lg font-bold">
                L{exercise.level}
              </span>
              <span className="hidden sm:inline-block bg-[#ff9100] text-black px-2 md:px-4 py-1 md:py-2 rounded-full text-sm md:text-lg font-bold uppercase">
                {exercise.type}
              </span>
              <button
                onClick={() => {
                  trackMetronomeToggled(!metronomeEnabled, exercise.id);
                  setMetronomeEnabled(!metronomeEnabled);
                }}
                className={`px-2 md:px-4 py-1 md:py-2 rounded-full text-sm md:text-lg font-bold transition-all ${
                  metronomeEnabled
                    ? "bg-[#00ff88] text-black"
                    : "bg-zinc-700 text-zinc-400"
                }`}
                title={metronomeEnabled ? "Metronome ON (Press M to toggle)" : "Metronome OFF (Press M to toggle)"}
              >
                🎵 <span className="hidden sm:inline">{metronomeEnabled ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${(lessonState === "LISTEN" || lessonState === "PRACTICE") ? "" : "max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8"}`}>
        {/* READY STATE - Big Start Button */}
        {lessonState === "READY" && (
          <div className="space-y-8">
            {/* Instructions */}
            <div className="bg-zinc-900 rounded-2xl border-2 border-[#00d9ff] p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-[#00d9ff] mb-4 flex items-center gap-2">
                📖 What You'll Learn
              </h2>
              <div className="text-zinc-300 text-lg leading-relaxed">
                <div dangerouslySetInnerHTML={{
                  __html: exercise.instructions
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#00ff88]">$1</strong>')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                    .replace(/\n/g, '<br />')
                }} />
              </div>
            </div>

            {/* Big Start Button */}
            <div className="text-center">
              <button
                onClick={handleStart}
                className="bg-[#ff9100] hover:bg-[#ffd600] text-black font-bold text-4xl px-20 py-10 rounded-2xl shadow-2xl transition-all transform hover:scale-105 border-4 border-[#ff9100] hover:border-[#ffd600]"
              >
                🚀 START LESSON
              </button>
            </div>

            {/* Counting guide */}
            <div className="bg-black border-2 border-[#ff0080] rounded-xl p-6 text-center">
              <div className="text-xl text-[#ff0080] font-bold mb-2">Count along:</div>
              <div className="text-4xl font-mono font-bold text-white">
                {exercise.counting}
              </div>
            </div>
          </div>
        )}

        {/* COUNTDOWN STATES - Responsive sizing */}
        {(lessonState === "COUNTDOWN_LISTEN" || lessonState === "COUNTDOWN_PRACTICE") && (
          <div className="flex items-center justify-center min-h-[50vh] md:min-h-[60vh]">
            <div className="text-center">
              {countdown > 0 ? (
                <>
                  <div className="text-8xl md:text-[200px] font-bold text-[#00ff88] mb-6 md:mb-12 animate-pulse">
                    {countdown}
                  </div>
                  <div className="text-2xl md:text-5xl font-bold text-zinc-300">
                    {lessonState === "COUNTDOWN_LISTEN" ? "👂 Get ready to watch..." : "🥁 Your turn!"}
                  </div>
                </>
              ) : (
                <div className="text-6xl md:text-9xl font-bold text-[#ff9100] animate-pulse">
                  {lessonState === "COUNTDOWN_LISTEN" ? "WATCH!" : "GO!"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LISTEN STATE */}
        {lessonState === "LISTEN" && (
          <>
            {/* MOBILE LANDSCAPE: Fullscreen game mode */}
            <div className="lg:hidden fixed inset-0 bg-black flex flex-col">
              {/* Slim top bar */}
              <div className="bg-gradient-to-r from-[#00d9ff] to-[#2979ff] text-black px-4 py-2 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">👂</span>
                  <span className="text-sm font-bold">{listenLoops + 1}/4</span>
                  <div className="w-24 bg-black bg-opacity-30 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((listenLoops + 1) / 4) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-bold">WATCH & LISTEN</div>
              </div>

              {/* Full-screen drum grid (no side buttons in listen mode) */}
              <div className="flex-1 p-2">
                <div className="h-full bg-zinc-900 rounded-lg shadow-2xl p-4 border-2 border-[#00d9ff] flex items-center justify-center">
                  <DrumGrid
                    pattern={pattern}
                    currentStep={isPlaying ? currentStep : undefined}
                    userHit={null}
                    showCounting={true}
                    countingMode={exercise.countingMode}
                  />
                </div>
              </div>
            </div>

            {/* DESKTOP: Original layout */}
            <div className="hidden lg:block space-y-6">
              {/* Banner */}
              <div className="bg-gradient-to-r from-[#00d9ff] to-[#2979ff] text-black text-center py-6 rounded-2xl shadow-2xl border-4 border-[#00d9ff]">
                <div className="text-4xl font-bold mb-2">👂 WATCH & LISTEN</div>
                <div className="text-2xl font-bold">Loop {listenLoops + 1} of 4</div>
              </div>

              {/* Drum Grid */}
              <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 border-4 border-[#00d9ff]">
                <DrumGrid
                  pattern={pattern}
                  currentStep={isPlaying ? currentStep : undefined}
                  userHit={null}
                  showCounting={true}
                  countingMode={exercise.countingMode}
                />
              </div>
            </div>
          </>
        )}

        {/* PRACTICE STATE */}
        {lessonState === "PRACTICE" && (
          <>
            {/* MOBILE LANDSCAPE: Fullscreen game mode */}
            <div className="lg:hidden fixed inset-0 bg-black flex flex-col">
              {/* Slim top bar */}
              <div className="bg-gradient-to-r from-[#ff9100] to-[#ff1744] text-black px-4 py-2 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">🥁</span>
                  <span className="text-sm font-bold">{loopsCompleted + 1}/4</span>
                  <div className="w-24 bg-black bg-opacity-30 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(loopsCompleted / 4) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-bold flex items-center gap-2">
                  <span>{bpm}</span>
                  <span>{isPlaying ? "▶" : "⏸"}</span>
                </div>
              </div>

              {/* 3-column game layout: Left buttons | Grid | Right button */}
              <div className="flex-1 grid grid-cols-[80px_1fr_80px] gap-2 p-2">
                {/* Left sidebar: KICK + SNARE */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => hitDrum("kick")}
                    className="flex-1 bg-gradient-to-br from-[#2979ff] to-[#0050d0] active:scale-95 text-white font-bold rounded-lg transition-all shadow-xl border-2 border-[#2979ff] flex flex-col items-center justify-center"
                  >
                    <div className="text-3xl mb-1">🦵</div>
                    <div className="text-xs">KICK</div>
                    <div className="text-xs opacity-75">F</div>
                  </button>

                  <button
                    onClick={() => hitDrum("snare")}
                    className="flex-1 bg-gradient-to-br from-[#ff1744] to-[#c0001a] active:scale-95 text-white font-bold rounded-lg transition-all shadow-xl border-2 border-[#ff1744] flex flex-col items-center justify-center"
                  >
                    <div className="text-3xl mb-1">🥁</div>
                    <div className="text-xs">SNARE</div>
                    <div className="text-xs opacity-75">J</div>
                  </button>
                </div>

                {/* Center: HUGE drum grid */}
                <div className="bg-zinc-900 rounded-lg shadow-2xl p-3 border-2 border-[#ff9100] flex items-center justify-center overflow-hidden">
                  <DrumGrid
                    pattern={pattern}
                    currentStep={isPlaying ? currentStep : undefined}
                    userHit={currentHit}
                    showCounting={true}
                    countingMode={exercise.countingMode}
                    stepFeedback={getStepFeedback}
                  />
                </div>

                {/* Right sidebar: HIHAT */}
                <div className="flex flex-col">
                  <button
                    onClick={() => hitDrum("hihat")}
                    className="flex-1 bg-gradient-to-br from-[#00d9ff] to-[#00a0c0] active:scale-95 text-black font-bold rounded-lg transition-all shadow-xl border-2 border-[#00d9ff] flex flex-col items-center justify-center"
                  >
                    <div className="text-3xl mb-1">🔔</div>
                    <div className="text-xs">HIHAT</div>
                    <div className="text-xs opacity-75">SPC</div>
                  </button>
                </div>
              </div>
            </div>

            {/* DESKTOP: Original layout (≥ 768px) */}
            <div className="hidden lg:block space-y-6">
              {/* Banner with progress */}
              <div className="bg-gradient-to-r from-[#ff9100] to-[#ff1744] text-black rounded-2xl shadow-2xl p-6 border-4 border-[#ff9100]">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl font-bold">🥁 YOU'RE ROCKING!</div>
                  <div className="text-3xl font-bold">Loop {loopsCompleted + 1} / 4</div>
                </div>
                <div className="w-full bg-black bg-opacity-30 rounded-full h-5 border-2 border-black">
                  <div
                    className="bg-black h-5 rounded-full transition-all duration-300"
                    style={{ width: `${(loopsCompleted / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Drum Grid with feedback */}
              <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 border-4 border-[#ff9100]">
                <DrumGrid
                  pattern={pattern}
                  currentStep={isPlaying ? currentStep : undefined}
                  userHit={currentHit}
                  showCounting={true}
                  countingMode={exercise.countingMode}
                  stepFeedback={getStepFeedback}
                />
              </div>

              {/* Tap buttons */}
              <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-8 shadow-2xl">
                <div className="text-center mb-6 text-zinc-300 text-xl font-bold">
                  Hit the drums! 🤘
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <button
                    onClick={() => hitDrum("kick")}
                    className="bg-gradient-to-br from-[#2979ff] to-[#0050d0] hover:from-[#0050d0] hover:to-[#2979ff] active:scale-95 text-white font-bold py-12 rounded-2xl transition-all shadow-2xl border-4 border-[#2979ff]"
                  >
                    <div className="text-5xl mb-3">🦵</div>
                    <div className="text-2xl">KICK</div>
                    <div className="text-lg opacity-75 mt-2">(F)</div>
                  </button>

                  <button
                    onClick={() => hitDrum("snare")}
                    className="bg-gradient-to-br from-[#ff1744] to-[#c0001a] hover:from-[#c0001a] hover:to-[#ff1744] active:scale-95 text-white font-bold py-12 rounded-2xl transition-all shadow-2xl border-4 border-[#ff1744]"
                  >
                    <div className="text-5xl mb-3">🥁</div>
                    <div className="text-2xl">SNARE</div>
                    <div className="text-lg opacity-75 mt-2">(J)</div>
                  </button>

                  <button
                    onClick={() => hitDrum("hihat")}
                    className="bg-gradient-to-br from-[#00d9ff] to-[#00a0c0] hover:from-[#00a0c0] hover:to-[#00d9ff] active:scale-95 text-black font-bold py-12 rounded-2xl transition-all shadow-2xl border-4 border-[#00d9ff]"
                  >
                    <div className="text-5xl mb-3">🔔</div>
                    <div className="text-2xl">HI HAT</div>
                    <div className="text-lg opacity-75 mt-2">(Space)</div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* RESULTS STATE */}
        {lessonState === "RESULTS" && (() => {
          const result = getScoringResult();
          if (!result) return null;

          return (
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-4 border-[#00d9ff] rounded-2xl p-12 text-center shadow-2xl">
                <h2 className="text-6xl font-bold text-[#00ff88] mb-10">
                  {result.stars === 3 ? "🎉 ROCK LEGEND!" : result.stars === 2 ? "🌟 AWESOME!" : result.stars === 1 ? "👍 NICE START!" : "🎯 KEEP ROCKING!"}
                </h2>

                {/* Stars display with animation */}
                <div className="flex justify-center gap-6 mb-10">
                  {[1, 2, 3].map((starNum) => (
                    <svg
                      key={starNum}
                      width="120"
                      height="120"
                      viewBox="0 0 1200 1200"
                      className={`transition-all duration-500 ${
                        starNum <= result.stars ? "fill-[#ff9100] opacity-100 scale-125" : "fill-zinc-600 opacity-60 scale-100"
                      }`}
                      style={{
                        animation: starNum <= result.stars ? `starPop 0.5s ease-out ${starNum * 0.2}s` : 'none'
                      }}
                    >
                      <path d="m786.62 894.43c4.6445 0.066406 9.0742-1.9258 12.035-5.4102 2.9609-3.4844 4.1367-8.0859 3.1914-12.516l-41.496-196.43 152.3-135.14v0.003906c2.9336-2.5859 4.7266-6.1719 5.0039-10.012 0.27344-3.8438-0.98828-7.6367-3.5273-10.594-2.5352-2.957-6.1484-4.8398-10.086-5.2617l-204.94-22.328-85.199-182.58c-1.6484-3.457-4.5938-6.1719-8.2344-7.582-3.6406-1.4062-7.6992-1.4062-11.34 0-3.6406 1.4102-6.5859 4.125-8.2344 7.582l-85.199 182.58-204.94 22.328h-0.003906c-3.9336 0.42188-7.5469 2.3047-10.086 5.2617-2.5352 2.957-3.7969 6.75-3.5234 10.59 0.27734 3.8438 2.0703 7.4297 5.0039 10.016l152.3 135.14-41.496 196.43-0.003906-0.003907c-0.8125 3.7734-0.09375 7.7031 2.0117 10.973 2.1016 3.2656 5.4219 5.6133 9.2656 6.5508 3.8438 0.93359 7.9102 0.38672 11.348-1.5312l179.23-99.07 179.23 99.074 0.003907-0.003906c2.2539 1.2422 4.8008 1.9102 7.3945 1.9336zm-21.633-44.117-157.38-87.051c-4.7188-2.625-10.512-2.625-15.23 0l-157.38 87.051 36.418-172.49c1.1172-5.1523-0.64453-10.5-4.6328-14.059l-133.76-118.71 179.89-19.645h-0.003907c5.3516-0.57031 10-3.832 12.25-8.5859l74.824-160.58 74.824 160.58h0.003906c2.25 4.7539 6.8984 8.0117 12.25 8.5859l179.89 19.645-133.76 118.71h-0.003907c-3.9883 3.5586-5.75 8.9062-4.6328 14.059z"/>
                    </svg>
                  ))}
                </div>

                {/* Accuracy */}
                <div className="text-6xl font-bold text-[#ff9100] mb-6">
                  {result.accuracy}% Accurate
                </div>

                {/* Encouraging feedback */}
                <p className="text-3xl text-zinc-300 mb-16 max-w-3xl mx-auto font-bold">
                  {result.feedback}
                </p>

                {/* Action buttons */}
                <div className="flex gap-8 justify-center">
                  <button
                    onClick={handleRetry}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-2xl px-16 py-8 rounded-2xl transition-all shadow-2xl hover:scale-105 border-4 border-zinc-700 hover:border-zinc-600"
                  >
                    🔄 Try Again
                  </button>

                  {result.stars >= 1 ? (
                    <button
                      onClick={handleContinue}
                      className="bg-[#00ff88] hover:bg-[#00d9ff] text-black font-bold text-2xl px-16 py-8 rounded-2xl transition-all shadow-2xl hover:scale-105 border-4 border-[#00ff88] hover:border-[#00d9ff]"
                    >
                      ➡️ Next Lesson
                    </button>
                  ) : (
                    <button
                      onClick={() => onComplete && onComplete()}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-2xl px-16 py-8 rounded-2xl transition-all shadow-2xl hover:scale-105 border-4 border-zinc-800 hover:border-zinc-700"
                    >
                      ⬅️ Back to Level Map
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Star animation keyframes */}
      <style jsx>{`
        @keyframes starPop {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.3) rotate(180deg);
          }
          100% {
            transform: scale(1.25) rotate(360deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
