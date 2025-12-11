/**
 * ExerciseView Component
 *
 * This is the main view for practicing an exercise.
 * It combines:
 * - Exercise instructions (with markdown)
 * - The drum grid visualization
 * - Transport controls (play/pause, tempo)
 * - Practice controls (listen vs tap mode)
 */

"use client";

import { useState, useCallback } from "react";
import { Exercise, Pattern } from "@/types";
import { getPatternById } from "@/data/patterns";
import { useSequencer } from "@/hooks/useSequencer";
import { useDrumInput } from "@/hooks/useDrumInput";
import { playDrum, playMetronomeClick, resumeAudioContext } from "@/utils/drumSynth";
import DrumGrid from "./DrumGrid";
import TransportControls from "./TransportControls";
import PracticeControls from "./PracticeControls";

interface ExerciseViewProps {
  exercise: Exercise;
  onComplete?: () => void;
  onNext?: () => void;
}

export default function ExerciseView({
  exercise,
  onComplete,
  onNext,
}: ExerciseViewProps) {
  // Get the pattern for this exercise
  const pattern: Pattern | undefined = exercise.patternId
    ? getPatternById(exercise.patternId)
    : exercise.pattern;

  // Practice mode state
  const [practiceMode, setPracticeMode] = useState<"listen" | "tap">("listen");
  const [isCompleted, setIsCompleted] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);

  // Get the pattern or throw error if not found
  if (!pattern) {
    return (
      <div className="text-center p-8 text-red-600">
        Error: Pattern not found for this exercise.
      </div>
    );
  }

  // Callback to play drum sounds when the step changes
  const handleStepChange = useCallback((step: number) => {
    // Play metronome click if enabled
    // For 8th note patterns (8 steps), quarter notes are on steps 0, 2, 4, 6
    if (metronomeEnabled && step % 2 === 0) {
      const isAccent = step === 0; // Accent beat 1
      playMetronomeClick(isAccent);
    }

    // Find which drums hit on this step (1-indexed in pattern data)
    const patternStep = pattern.steps.find(s => s.step === step + 1);
    if (patternStep && patternStep.hit.length > 0) {
      // Play all drums that hit on this step
      patternStep.hit.forEach(drum => {
        playDrum(drum);
      });
    }
  }, [pattern, metronomeEnabled]);

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

  // Drum input hook for tap-along mode
  const { currentHit, hitDrum } = useDrumInput();

  // Wrapper for play that also resumes audio context
  const handlePlay = useCallback(() => {
    resumeAudioContext();
    play();
  }, [play]);

  // Mark as complete handler
  const handleMarkComplete = () => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  // Simple markdown-to-HTML converter (basic implementation)
  const renderMarkdown = (markdown: string) => {
    let html = markdown
      // Bold: **text** -> <strong>text</strong>
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic: *text* -> <em>text</em>  (but not if it's part of **)
      .replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, '<em>$1</em>')
      // Code: `code` -> <code>code</code>
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br />');

    return `<p class="mb-3">${html}</p>`;
  };

  return (
    <div className="space-y-0">
      {/* ============ PLAYER SECTION (Theater Mode) ============ */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b-4 border-blue-500">
        {/* Exercise header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                Level {exercise.level}
              </span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {exercise.type}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{exercise.title}</h1>
          </div>
        </div>

        {/* Player controls area */}
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
          {/* Drum Grid */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <DrumGrid
              pattern={pattern}
              currentStep={isPlaying ? currentStep : undefined}
              userHit={practiceMode === "tap" ? currentHit : null}
              showCounting={true}
            />
          </div>

          {/* Controls row */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Transport Controls */}
            <TransportControls
              isPlaying={isPlaying}
              bpm={bpm}
              defaultBpm={exercise.tempoBpm}
              onPlay={handlePlay}
              onPause={pause}
              onStop={stop}
              onBpmChange={setBpm}
              metronomeEnabled={metronomeEnabled}
              onMetronomeToggle={setMetronomeEnabled}
            />

            {/* Practice Controls */}
            <PracticeControls
              mode={practiceMode}
              onModeChange={setPracticeMode}
              onDrumHit={hitDrum}
            />
          </div>
        </div>
      </div>

      {/* ============ CONTENT SECTION ============ */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Counting guide */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
          <div className="text-sm text-blue-700 font-semibold mb-1">Count along:</div>
          <div className="text-2xl font-mono font-bold text-blue-900">
            {exercise.counting}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">📖 Instructions</h2>
          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(exercise.instructions) }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          {!isCompleted ? (
            <button
              onClick={handleMarkComplete}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
            >
              ✓ Mark as Done
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-green-600 font-semibold">✓ Completed!</span>
              {onNext && (
                <button
                  onClick={onNext}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                  Next Exercise →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
