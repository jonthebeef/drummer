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
  const handleStepChange = useCallback((step: number) => {
    // Play metronome click if enabled
    // For 8th note patterns (8 steps), quarter notes are on steps 0, 2, 4, 6
    if (metronomeEnabled && step % 2 === 0) {
      const isAccent = step === 0; // Accent beat 1
      playMetronomeClick(isAccent);
    }

    // Find which drums hit on this step (1-indexed in pattern data)
    const patternStep = selectedPattern.steps.find(s => s.step === step + 1);
    if (patternStep && patternStep.hit.length > 0) {
      // Play all drums that hit on this step
      patternStep.hit.forEach(drum => {
        playDrum(drum);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold">🎵 Pattern Browser</h1>
        <p className="text-blue-100 mt-2">
          Explore different drum patterns and hear how they sound.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pattern list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
            <h2 className="font-bold text-gray-800 mb-3">Patterns</h2>
            <div className="space-y-2">
              {patterns.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => {
                    stop();
                    setSelectedPattern(pattern);
                  }}
                  className={`
                    w-full text-left p-3 rounded-lg border-2 transition-all
                    ${selectedPattern.id === pattern.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="font-semibold text-gray-800 text-sm mb-1">
                    {pattern.name}
                  </div>
                  <div
                    className={`
                      inline-block text-xs px-2 py-0.5 rounded border font-semibold capitalize
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

        {/* Pattern details and player */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pattern info */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedPattern.name}
              </h2>
              <span
                className={`
                  px-3 py-1 rounded-full border-2 text-sm font-semibold capitalize
                  ${getDifficultyColor(selectedPattern.difficulty)}
                `}
              >
                {selectedPattern.difficulty}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {selectedPattern.description}
            </p>
          </div>

          {/* Drum grid */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <DrumGrid
              pattern={selectedPattern}
              currentStep={isPlaying ? currentStep : undefined}
              showCounting={true}
            />
          </div>

          {/* Simple playback controls */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
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
    </div>
  );
}
