/**
 * LevelMap Component
 *
 * Shows all lessons in a level with progress, stars, and locking.
 * Similar to an Angry Birds style level select screen.
 */

"use client";

import { Exercise, Stars } from "@/types";
import { getExerciseStars, isExerciseUnlocked } from "@/utils/progress";

interface LevelMapProps {
  exercises: Exercise[];
  levelName: string;
  levelDescription: string;
  onSelectExercise: (exercise: Exercise) => void;
}

/**
 * Render stars for an exercise
 */
function StarDisplay({ stars }: { stars: Stars }) {
  return (
    <div className="flex gap-1 justify-center mt-2">
      {[1, 2, 3].map((starNum) => (
        <svg
          key={starNum}
          width="24"
          height="24"
          viewBox="0 0 1200 1200"
          className={`${
            starNum <= stars ? "fill-[#ff9100] opacity-100" : "fill-zinc-700 opacity-20"
          }`}
        >
          <path d="m786.62 894.43c4.6445 0.066406 9.0742-1.9258 12.035-5.4102 2.9609-3.4844 4.1367-8.0859 3.1914-12.516l-41.496-196.43 152.3-135.14v0.003906c2.9336-2.5859 4.7266-6.1719 5.0039-10.012 0.27344-3.8438-0.98828-7.6367-3.5273-10.594-2.5352-2.957-6.1484-4.8398-10.086-5.2617l-204.94-22.328-85.199-182.58c-1.6484-3.457-4.5938-6.1719-8.2344-7.582-3.6406-1.4062-7.6992-1.4062-11.34 0-3.6406 1.4102-6.5859 4.125-8.2344 7.582l-85.199 182.58-204.94 22.328h-0.003906c-3.9336 0.42188-7.5469 2.3047-10.086 5.2617-2.5352 2.957-3.7969 6.75-3.5234 10.59 0.27734 3.8438 2.0703 7.4297 5.0039 10.016l152.3 135.14-41.496 196.43-0.003906-0.003907c-0.8125 3.7734-0.09375 7.7031 2.0117 10.973 2.1016 3.2656 5.4219 5.6133 9.2656 6.5508 3.8438 0.93359 7.9102 0.38672 11.348-1.5312l179.23-99.07 179.23 99.074 0.003907-0.003906c2.2539 1.2422 4.8008 1.9102 7.3945 1.9336zm-21.633-44.117-157.38-87.051c-4.7188-2.625-10.512-2.625-15.23 0l-157.38 87.051 36.418-172.49c1.1172-5.1523-0.64453-10.5-4.6328-14.059l-133.76-118.71 179.89-19.645h-0.003907c5.3516-0.57031 10-3.832 12.25-8.5859l74.824-160.58 74.824 160.58h0.003906c2.25 4.7539 6.8984 8.0117 12.25 8.5859l179.89 19.645-133.76 118.71h-0.003907c-3.9883 3.5586-5.75 8.9062-4.6328 14.059z"/>
        </svg>
      ))}
    </div>
  );
}

export default function LevelMap({
  exercises,
  levelName,
  levelDescription,
  onSelectExercise,
}: LevelMapProps) {
  const exerciseIds = exercises.map(e => e.id);

  return (
    <div className="min-h-screen bg-black py-6 sm:py-10 pb-16 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-white mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-logo mb-3 sm:mb-4 tracking-wide">
            <span className="text-[#00ff88]">{levelName.split(":")[0].toUpperCase()}:</span>
            <br />
            <span className="text-white">{levelName.split(":")[1]?.trim().toUpperCase()}</span>
          </h1>
          <p className="text-zinc-300 text-base sm:text-xl font-bold">{levelDescription}</p>
        </div>

        {/* Progress summary - only show if user has completed at least one exercise */}
        {exercises.filter(e => getExerciseStars(e.id) > 0).length > 0 && (
          <div className="mb-10 bg-gradient-to-r from-zinc-900 to-zinc-950 rounded-xl p-4 border border-[#ff0080]/50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {exercises.filter(e => getExerciseStars(e.id) >= 3).length >= exercises.length
                    ? "🏆"
                    : "🥁"}
                </span>
                <div>
                  <p className="text-[#ff0080] font-bold text-lg">Your Progress</p>
                  <p className="text-zinc-400 text-sm">
                    {exercises.filter(e => getExerciseStars(e.id) > 0).length} of {exercises.length} lessons rocked!
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-zinc-950 rounded-full h-4 border border-zinc-800">
                  <div
                    className="bg-gradient-to-r from-[#00ff88] via-[#00d9ff] to-[#ff9100] h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${(exercises.filter(e => getExerciseStars(e.id) > 0).length / exercises.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How to practice guide */}
        <div className="mb-6 sm:mb-8 text-zinc-400 text-sm sm:text-lg">
          Pick a lesson → Watch 2x → Play 4 loops → Get stars!
        </div>

        {/* Lesson grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {exercises.map((exercise, index) => {
            const stars = getExerciseStars(exercise.id);
            const isUnlocked = isExerciseUnlocked(exercise.id, exerciseIds);
            const isCompleted = stars > 0;

            return (
              <button
                key={exercise.id}
                onClick={() => isUnlocked && onSelectExercise(exercise)}
                disabled={!isUnlocked}
                className={`
                  relative p-5 sm:p-8 rounded-2xl border-4 transition-all transform hover:scale-105 shadow-2xl
                  ${isUnlocked
                    ? "bg-gradient-to-br from-zinc-900 to-black border-[#00d9ff] hover:border-[#00ff88] hover:shadow-[#00ff88]/50 cursor-pointer"
                    : "bg-zinc-950 border-zinc-800 opacity-40 cursor-not-allowed"
                  }
                  ${isCompleted ? "ring-4 ring-[#ffd600] shadow-[#ffd600]/50" : ""}
                `}
              >
                {/* Lesson number badge */}
                <div className={`
                  absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
                  font-bold text-xl sm:text-2xl shadow-2xl border-4
                  ${isCompleted ? "bg-[#ffd600] text-black border-[#ffd600]" : "bg-[#00d9ff] text-black border-[#00d9ff]"}
                `}>
                  {index + 1}
                </div>

                {/* Lock icon for locked lessons */}
                {!isUnlocked && (
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-3xl sm:text-4xl opacity-50">
                    🔒
                  </div>
                )}

                {/* Title */}
                <h3 className={`
                  text-lg sm:text-xl font-bold mb-2 sm:mb-3 mt-3 sm:mt-4
                  ${isUnlocked ? "text-[#00ff88]" : "text-zinc-600"}
                `}>
                  {exercise.title}
                </h3>

                {/* Short description from pattern */}
                <p className={`
                  text-sm sm:text-base mb-4 sm:mb-6 font-semibold
                  ${isUnlocked ? "text-zinc-400" : "text-zinc-700"}
                `}>
                  {exercise.type === "timing" ? "⏱️ Learn timing" : "🥁 Practice groove"}
                </p>

                {/* Stars */}
                {isUnlocked && <StarDisplay stars={stars} />}

                {/* Unlock hint */}
                {!isUnlocked && index > 0 && (
                  <p className="text-sm sm:text-base text-zinc-600 mt-3 sm:mt-4 font-semibold">
                    Complete lesson {index} first!
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
