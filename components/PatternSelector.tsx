/**
 * PatternSelector Component
 *
 * This component allows browsing and playing drum patterns outside of exercises.
 * It shows:
 * - A list of available patterns
 * - Pattern details (name, difficulty, description)
 * - The drum grid for the selected pattern
 * - Simple playback controls
 */

"use client";

import { useState, useCallback } from "react";
import { Pattern } from "@/types";
import { patterns } from "@/data/patterns";
import { useSequencer } from "@/hooks/useSequencer";
import { playDrum, playMetronomeClick, resumeAudioContext } from "@/utils/drumSynth";
import DrumGrid from "./DrumGrid";

export default function PatternSelector() {
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(patterns[0]);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);

  // Callback to play drum sounds when the step changes
  // Uses lookahead scheduling - 'time' is when the audio should play
  const handleStepChange = useCallback((step: number, time: number) => {
    // Play metronome click if enabled (schedule at exact time)
    // For 8th note patterns (8 steps), quarter notes are on steps 0, 2, 4, 6
    if (metronomeEnabled && step % 2 === 0) {
      const isAccent = step === 0; // Accent beat 1
      playMetronomeClick(isAccent, time);
    }

    // Find which drums hit on this step (1-indexed in pattern data)
    const patternStep = selectedPattern.steps.find(s => s.step === step + 1);
    if (patternStep && patternStep.hit.length > 0) {
      // Play all drums that hit on this step (schedule at exact time)
      patternStep.hit.forEach(drum => {
        playDrum(drum, time);
      });
    }
  }, [selectedPattern, metronomeEnabled]);

  // Sequencer for the selected pattern
  const {
    currentStep,
    isPlaying,
    bpm,
    play,
    pause,
    stop,
    setBpm,
  } = useSequencer({
    totalSteps: selectedPattern.steps.length,
    initialBpm: selectedPattern.defaultTempoBpm,
    onStepChange: handleStepChange,
  });

  // Wrapper for play that also resumes audio context
  const handlePlay = useCallback(() => {
    resumeAudioContext();
    play();
  }, [play]);

  // Difficulty badge colors
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "hard":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="space-y-0">
      {/* ============ PLAYER SECTION (Theater Mode) ============ */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b-4 border-cyan-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">🎵 {selectedPattern.name}</h1>
                <p className="text-blue-100 mt-1 text-sm">
                  {selectedPattern.description}
                </p>
              </div>
              <span
                className={`
                  hidden sm:inline-block px-3 py-1 rounded-full border-2 border-white border-opacity-30 text-sm font-semibold capitalize
                  bg-white bg-opacity-20
                `}
              >
                {selectedPattern.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Player controls area */}
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
          {/* Drum Grid */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <DrumGrid
              pattern={selectedPattern}
              currentStep={isPlaying ? currentStep : undefined}
              showCounting={true}
            />
          </div>

          {/* Playback controls */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              {!isPlaying ? (
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </button>
              ) : (
                <button
                  onClick={pause}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </svg>
                  Pause
                </button>
              )}

              <button
                onClick={stop}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Tempo: <span className="text-blue-600">{bpm} BPM</span>
                </label>
                {bpm !== selectedPattern.defaultTempoBpm && (
                  <button
                    onClick={() => setBpm(selectedPattern.defaultTempoBpm)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              <input
                type="range"
                min={40}
                max={160}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Metronome toggle */}
            <div className="pt-4 mt-4 border-t-2 border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={metronomeEnabled}
                  onChange={(e) => setMetronomeEnabled(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎵</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Metronome</div>
                    <div className="text-xs text-gray-500">Click on beats 1, 2, 3, 4</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ============ CONTENT SECTION ============ */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 text-lg">Select a Pattern</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {patterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => {
                  stop();
                  setSelectedPattern(pattern);
                }}
                className={`
                  text-left p-4 rounded-lg border-2 transition-all
                  ${selectedPattern.id === pattern.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div className="font-semibold text-gray-800 mb-2">
                  {pattern.name}
                </div>
                <div
                  className={`
                    inline-block text-xs px-2 py-1 rounded border font-semibold capitalize
                    ${getDifficultyColor(pattern.difficulty)}
                  `}
                >
                  {pattern.difficulty}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
