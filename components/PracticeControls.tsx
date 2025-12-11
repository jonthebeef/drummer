/**
 * PracticeControls Component
 *
 * This component provides:
 * - Mode toggle: "Listen" vs "Tap along"
 * - Mobile tap buttons for Kick, Snare, Hi Hat
 * - Instructions for the current mode
 */

import { DrumType } from "@/types";

interface PracticeControlsProps {
  mode: "listen" | "tap";
  onModeChange: (mode: "listen" | "tap") => void;
  onDrumHit: (drum: DrumType) => void;
}

export default function PracticeControls({
  mode,
  onModeChange,
  onDrumHit,
}: PracticeControlsProps) {
  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Practice Mode
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange("listen")}
            className={`
              flex-1 py-2 px-4 rounded-lg font-semibold transition-all
              ${mode === "listen"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            👂 Listen
          </button>
          <button
            onClick={() => onModeChange("tap")}
            className={`
              flex-1 py-2 px-4 rounded-lg font-semibold transition-all
              ${mode === "tap"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            🥁 Tap Along
          </button>
        </div>

        {/* Mode instructions */}
        <div className="mt-3 text-sm">
          {mode === "listen" ? (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-blue-800 font-semibold mb-1">Listen Mode:</p>
              <p className="text-blue-700">The drums play automatically. Learn the pattern by watching and listening!</p>
            </div>
          ) : (
            <div className="bg-purple-50 border border-purple-200 rounded p-3">
              <p className="text-purple-800 font-semibold mb-1">Tap Along Mode:</p>
              <p className="text-purple-700">You play the drums! Hit <strong>Play</strong>, then tap along. Complete 4 loops to get scored!</p>
            </div>
          )}
        </div>
      </div>

      {/* Tap buttons (visible in tap mode or on mobile) */}
      {mode === "tap" && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Tap the Drums
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onDrumHit("kick")}
              className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-6 rounded-lg transition-all active:scale-95 shadow-lg"
            >
              <div className="text-2xl mb-1">🦵</div>
              <div className="text-sm">Kick</div>
              <div className="text-xs opacity-75 mt-1">(F)</div>
            </button>

            <button
              onClick={() => onDrumHit("snare")}
              className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-6 rounded-lg transition-all active:scale-95 shadow-lg"
            >
              <div className="text-2xl mb-1">🥁</div>
              <div className="text-sm">Snare</div>
              <div className="text-xs opacity-75 mt-1">(J)</div>
            </button>

            <button
              onClick={() => onDrumHit("hihat")}
              className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-bold py-6 rounded-lg transition-all active:scale-95 shadow-lg"
            >
              <div className="text-2xl mb-1">🔔</div>
              <div className="text-sm">Hi Hat</div>
              <div className="text-xs opacity-75 mt-1">(Space)</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
