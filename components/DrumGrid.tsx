/**
 * DrumGrid Component
 *
 * This is the main visual display for drum patterns.
 * Shows a 3-row (hi hat, snare, kick) by 8-column (steps) grid.
 *
 * Features:
 * - Highlights the current step during playback
 * - Shows which drums hit on each step
 * - Provides visual feedback when user hits a drum correctly
 */

import { Pattern, DrumType } from "@/types";

interface DrumGridProps {
  pattern: Pattern;
  currentStep?: number;      // 0-indexed (0-7 for 8 steps), highlights this column
  userHit?: DrumType | null; // Which drum the user just hit (for visual feedback)
  showCounting?: boolean;    // Show counting labels above (1 & 2 & 3 & 4 &)
  showKeyLegend?: boolean;   // Show keyboard shortcut legend below grid
  stepFeedback?: (step: number) => "correct" | "incorrect" | null; // Scoring feedback per step
}

export default function DrumGrid({
  pattern,
  currentStep,
  userHit,
  showCounting = true,
  showKeyLegend = true,
  stepFeedback,
}: DrumGridProps) {
  // Get the count label for a step (1, &, 2, &, etc.)
  const getCountLabel = (stepIndex: number): string => {
    const step = pattern.steps.find(s => s.step === stepIndex + 1);
    return step?.countLabel || "";
  };

  // Check if a drum hits on a specific step
  const isDrumHit = (stepIndex: number, drum: DrumType): boolean => {
    const step = pattern.steps.find(s => s.step === stepIndex + 1);
    return step?.hit.includes(drum) || false;
  };

  // Check if user's hit matches the current step
  const isCorrectHit = (stepIndex: number, drum: DrumType): boolean => {
    return (
      currentStep === stepIndex &&
      userHit === drum &&
      isDrumHit(stepIndex, drum)
    );
  };

  // Drum labels
  const drums: { type: DrumType; label: string; color: string }[] = [
    { type: "hihat", label: "Hi Hat", color: "bg-cyan-500" },
    { type: "snare", label: "Snare", color: "bg-amber-500" },
    { type: "kick", label: "Kick", color: "bg-purple-600" },
  ];

  // Generate array of step indices (0 to totalSteps - 1)
  const steps = Array.from({ length: pattern.steps.length }, (_, i) => i);

  return (
    <div className="w-full">
      {/* Counting labels row */}
      {showCounting && (
        <div className="flex items-center mb-2">
          {/* Empty cell for drum labels column */}
          <div className="w-24 flex-shrink-0"></div>

          {/* Count labels */}
          <div className="flex-1 flex">
            {steps.map((stepIndex) => (
              <div
                key={stepIndex}
                className="flex-1 text-center text-lg font-mono font-bold text-zinc-400"
              >
                {getCountLabel(stepIndex)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="space-y-2">
        {drums.map((drum) => (
          <div key={drum.type} className="flex items-center">
            {/* Drum label */}
            <div className="w-24 flex-shrink-0 text-lg font-bold text-zinc-300">
              {drum.label}
            </div>

            {/* Step cells */}
            <div className="flex-1 flex gap-1">
              {steps.map((stepIndex) => {
                const isHit = isDrumHit(stepIndex, drum.type);
                const isCurrent = currentStep === stepIndex;
                const isCorrect = isCorrectHit(stepIndex, drum.type);
                const feedback = stepFeedback ? stepFeedback(stepIndex) : null;

                return (
                  <div
                    key={stepIndex}
                    className={`
                      flex-1 aspect-square rounded-lg border-2 flex items-center justify-center
                      transition-all duration-200
                      ${isCurrent ? "border-[#00ff88] bg-zinc-800 scale-105 shadow-lg shadow-[#00ff88]/50" : "border-zinc-700 bg-black"}
                      ${isCurrent && !isHit ? "bg-zinc-900" : ""}
                      ${feedback === "correct" && isHit ? "bg-green-900 border-[#00ff88]" : ""}
                      ${feedback === "incorrect" && isHit ? "bg-red-900 border-[#ff1744]" : ""}
                    `}
                  >
                    {/* Drum hit circle */}
                    {isHit && (
                      <div
                        className={`
                          w-8 h-8 rounded-full
                          ${drum.color}
                          ${isCurrent ? "ring-4 ring-blue-300" : ""}
                          ${isCorrect ? "ring-4 ring-green-400 scale-110" : ""}
                          ${feedback === "correct" ? "ring-2 ring-green-500" : ""}
                          ${feedback === "incorrect" ? "ring-2 ring-red-500 opacity-60" : ""}
                          transition-all duration-200
                        `}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Key legend */}
      {showKeyLegend && (
        <div className="mt-6 text-xl text-zinc-300 text-center font-bold">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="font-mono bg-zinc-900 px-4 py-2 rounded-lg border-2 border-[#2979ff] text-[#2979ff] shadow-lg">F</span>
            <span>= Kick</span>
            <span className="mx-2 text-zinc-700">•</span>
            <span className="font-mono bg-zinc-900 px-4 py-2 rounded-lg border-2 border-[#ff1744] text-[#ff1744] shadow-lg">J</span>
            <span>= Snare</span>
            <span className="mx-2 text-zinc-700">•</span>
            <span className="font-mono bg-zinc-900 px-4 py-2 rounded-lg border-2 border-[#00d9ff] text-[#00d9ff] shadow-lg">Space</span>
            <span>= Hi Hat</span>
          </div>
        </div>
      )}
    </div>
  );
}
