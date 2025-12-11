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
}

export default function DrumGrid({
  pattern,
  currentStep,
  userHit,
  showCounting = true,
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
                className="flex-1 text-center text-sm font-mono font-semibold text-gray-600"
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
            <div className="w-24 flex-shrink-0 text-sm font-semibold text-gray-700">
              {drum.label}
            </div>

            {/* Step cells */}
            <div className="flex-1 flex gap-1">
              {steps.map((stepIndex) => {
                const isHit = isDrumHit(stepIndex, drum.type);
                const isCurrent = currentStep === stepIndex;
                const isCorrect = isCorrectHit(stepIndex, drum.type);

                return (
                  <div
                    key={stepIndex}
                    className={`
                      flex-1 aspect-square rounded-lg border-2 flex items-center justify-center
                      transition-all duration-100
                      ${isCurrent ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-200"}
                      ${isCurrent && !isHit ? "bg-gray-50" : ""}
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
                          transition-all duration-100
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
      <div className="mt-6 text-sm text-gray-600 text-center">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">F</span>
          <span>= Kick</span>
          <span className="mx-2">•</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">J</span>
          <span>= Snare</span>
          <span className="mx-2">•</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">Space</span>
          <span>= Hi Hat</span>
        </div>
      </div>
    </div>
  );
}
