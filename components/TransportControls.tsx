/**
 * TransportControls Component
 *
 * This component provides playback controls:
 * - Play / Pause button
 * - Stop button (resets to beginning)
 * - Tempo (BPM) slider
 * - Reset tempo button
 */

interface TransportControlsProps {
  isPlaying: boolean;
  bpm: number;
  defaultBpm: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onBpmChange: (bpm: number) => void;
  minBpm?: number;
  maxBpm?: number;
  metronomeEnabled?: boolean;
  onMetronomeToggle?: (enabled: boolean) => void;
}

export default function TransportControls({
  isPlaying,
  bpm,
  defaultBpm,
  onPlay,
  onPause,
  onStop,
  onBpmChange,
  minBpm = 40,
  maxBpm = 160,
  metronomeEnabled = false,
  onMetronomeToggle,
}: TransportControlsProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
      {/* Play/Pause and Stop buttons */}
      <div className="flex items-center gap-3">
        {!isPlaying ? (
          <button
            onClick={onPlay}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
            Pause
          </button>
        )}

        <button
          onClick={onStop}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z" />
          </svg>
          Stop
        </button>
      </div>

      {/* Tempo controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            Tempo: <span className="text-blue-600">{bpm} BPM</span>
          </label>
          {bpm !== defaultBpm && (
            <button
              onClick={() => onBpmChange(defaultBpm)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
            >
              Reset to {defaultBpm} BPM
            </button>
          )}
        </div>

        {/* Tempo +/- buttons */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onBpmChange(Math.max(minBpm, bpm - 5))}
            disabled={bpm <= minBpm}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            − Slower
          </button>
          <button
            onClick={() => onBpmChange(Math.min(maxBpm, bpm + 5))}
            disabled={bpm >= maxBpm}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Faster +
          </button>
        </div>

        <input
          type="range"
          min={minBpm}
          max={maxBpm}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>{minBpm} BPM (Slower)</span>
          <span>{maxBpm} BPM (Faster)</span>
        </div>
      </div>

      {/* Metronome toggle */}
      {onMetronomeToggle && (
        <div className="pt-2 border-t-2 border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={metronomeEnabled}
              onChange={(e) => onMetronomeToggle(e.target.checked)}
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
      )}
    </div>
  );
}
