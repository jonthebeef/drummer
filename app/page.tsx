"use client";

/**
 * Main App Page
 *
 * This is the entry point of the app. It manages navigation between:
 * - Home screen (with "Start today's session" button)
 * - Practice session (exercises one by one)
 * - Pattern browser
 */

import { useState } from "react";
import ExerciseView from "@/components/ExerciseView";
import PatternSelector from "@/components/PatternSelector";
import LevelMap from "@/components/LevelMap";
import { exercises, getExerciseById, getExercisesByLevel } from "@/data/exercises";
import { levels, getLevelByNumber } from "@/data/levels";
import { isExerciseUnlocked } from "@/utils/progress";
import type { Exercise } from "@/types";

type AppView = "home" | "levelMap" | "exercise" | "patterns";

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [sessionExercises, setSessionExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Navigate to Level 1 map
  const goToLevelMap = () => {
    setCurrentView("levelMap");
  };

  // Select an exercise from the map
  const selectExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCurrentView("exercise");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Go to next exercise
  const goToNextExercise = () => {
    if (!currentExercise) return;

    const levelExercises = getExercisesByLevel(currentExercise.level);
    const exerciseIds = levelExercises.map(e => e.id);
    const currentIndex = levelExercises.findIndex(e => e.id === currentExercise.id);

    // If there's a next exercise, check if it's unlocked before loading it
    if (currentIndex >= 0 && currentIndex < levelExercises.length - 1) {
      const nextExercise = levelExercises[currentIndex + 1];

      // Only allow navigation if the next exercise is unlocked
      if (isExerciseUnlocked(nextExercise.id, exerciseIds)) {
        selectExercise(nextExercise);
      } else {
        // Next exercise is locked, go back to map
        returnToMap();
      }
    } else {
      // Last exercise in level, go back to map
      returnToMap();
    }
  };

  // Return to level map
  const returnToMap = () => {
    setCurrentExercise(null);
    setCurrentView("levelMap");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header navigation */}
      <header className="bg-zinc-950 shadow-lg border-b-2 border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView("home")}
              className="flex items-center gap-3 text-3xl font-logo text-white hover:text-[#00d9ff] transition-colors tracking-wide"
            >
              <svg width="32" height="32" viewBox="0 0 1200 1200" className="fill-zinc-600">
                <path d="m921.98 269.68 200.68-154.69c12-9 14.016-26.016 5.0156-38.016s-26.016-14.016-38.016-5.0156l-236.02 181.69c-79.312-15.656-167.34-23.672-253.69-23.672-86.344 0-174.66 8.3438-253.69 23.672l-235.92-181.31c-12-9-29.016-6.9844-38.016 5.0156s-6.9844 29.016 5.0156 38.016l200.68 154.69c-123.32 33.984-211.31 89.344-211.31 164.34v495c0 132 272.68 203.34 529.69 204 257.34 1.3125 537.66-71.016 537-204v-495c0-75-87.984-130.31-211.31-164.34zm156.98 299.02c0 70.688-204.98 149.68-479.02 149.68-273.98 0-479.02-78.984-479.02-149.68v-41.344c92.672 72.328 290.02 111 479.02 111s386.68-38.344 479.02-111zm-510 203.68v306.32c-102.33-2.3438-193.69-15.328-267-34.688v-304.31c80.672 19.688 174 30.984 267 33zm54.328 0c95.672-1.6875 192-12.656 275.02-33.328v304.31c-75 20.016-169.31 33.328-275.02 35.016v-306.32zm-290.34-460.31 133.69 102.98c11.672 9 29.016 6.9844 38.016-5.0156s6.9844-29.016-5.0156-38.016l-95.344-73.312c59.016-9 125.02-14.344 195.66-14.344 70.688 0 136.31 5.3438 195.66 14.344l-95.344 73.312c-12 9-14.016 26.016-5.0156 38.016 9.3281 12 26.344 14.016 38.016 5.0156l133.69-102.98c129.66 29.344 212.02 77.344 212.02 122.02 0 70.688-204.98 149.68-479.02 149.68-273.94-0.046875-478.97-78.75-478.97-149.39 0-44.672 82.312-92.672 212.02-122.02zm-211.97 617.29v-267.32c31.688 24.656 75.328 45.328 126.98 62.016v303c-79.312-27.984-126.98-63.984-126.98-97.688zm831.66 97.688v-303c51.328-16.688 95.016-37.312 126.66-62.016v267.32c0 33.984-47.344 69.656-126.66 97.688z"/>
              </svg>
              DRUMMER.
            </button>

            <nav className="flex gap-2">
              <button
                onClick={() => setCurrentView("home")}
                className={`
                  px-4 py-2 rounded-lg font-bold transition-all text-lg
                  ${currentView === "home"
                    ? "bg-[#00ff88] text-black"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-[#00ff88]"
                  }
                `}
              >
                Home
              </button>
              <button
                onClick={goToLevelMap}
                className={`
                  px-4 py-2 rounded-lg font-bold transition-all text-lg
                  ${currentView === "levelMap" || currentView === "exercise"
                    ? "bg-[#00d9ff] text-black"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-[#00d9ff]"
                  }
                `}
              >
                Level 1
              </button>
              <button
                onClick={() => setCurrentView("patterns")}
                className={`
                  px-4 py-2 rounded-lg font-bold transition-all text-lg
                  ${currentView === "patterns"
                    ? "bg-[#ff9100] text-black"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-[#ff9100]"
                  }
                `}
              >
                Patterns
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={currentView === "home" ? "max-w-6xl mx-auto px-4 py-8" : ""}>
        {/* HOME VIEW */}
        {currentView === "home" && (
          <div className="space-y-8">
            {/* Welcome card */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-2xl shadow-2xl p-12 text-center border-2 border-zinc-800">
              <div className="text-7xl mb-6 animate-pulse">🥁</div>
              <h1 className="text-5xl font-logo text-[#00ff88] mb-4 tracking-wide">
                DRUMMER
              </h1>
              <p className="text-2xl text-zinc-300 mb-10 font-bold">
                Rock out one beat at a time
              </p>

              <button
                onClick={goToLevelMap}
                className="bg-[#ff9100] hover:bg-[#ffd600] text-black font-bold text-2xl px-16 py-8 rounded-2xl shadow-2xl transition-all transform hover:scale-105 border-4 border-[#ff9100] hover:border-[#ffd600]"
              >
                START ROCKING 🎸
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 rounded-xl shadow-xl p-8 border-2 border-[#00ff88] hover:border-[#00d9ff] transition-all">
                <div className="text-5xl mb-3">📚</div>
                <div className="text-4xl font-bold text-[#00ff88]">{levels.length}</div>
                <div className="text-lg text-zinc-400 font-semibold">Levels</div>
              </div>

              <div className="bg-zinc-900 rounded-xl shadow-xl p-8 border-2 border-[#00d9ff] hover:border-[#ff9100] transition-all">
                <div className="text-5xl mb-3">🎯</div>
                <div className="text-4xl font-bold text-[#00d9ff]">{exercises.length}</div>
                <div className="text-lg text-zinc-400 font-semibold">Exercises</div>
              </div>

              <div className="bg-zinc-900 rounded-xl shadow-xl p-8 border-2 border-[#ff9100] hover:border-[#ffd600] transition-all">
                <div className="text-5xl mb-3">🎵</div>
                <div className="text-4xl font-bold text-[#ff9100]">3</div>
                <div className="text-lg text-zinc-400 font-semibold">Patterns</div>
              </div>
            </div>

            {/* Quick tip */}
            <div className="bg-zinc-900 border-2 border-[#ff0080] rounded-xl p-8">
              <h2 className="text-2xl font-bold text-[#ff0080] mb-3 flex items-center gap-2">
                💡 Rocker Tip
              </h2>
              <p className="text-zinc-300 text-lg font-medium">
                Start slow! It's better to play a pattern slowly and correctly than fast and messy.
                Speed comes with practice! 🤘
              </p>
            </div>
          </div>
        )}

        {/* LEVEL MAP VIEW */}
        {currentView === "levelMap" && (
          <LevelMap
            exercises={getExercisesByLevel(1)}
            levelName="Level 1: Your First Groove"
            levelDescription="Learn the steady beat, control each limb, and play your first real drum grooves!"
            onSelectExercise={selectExercise}
          />
        )}

        {/* EXERCISE VIEW */}
        {currentView === "exercise" && currentExercise && (
          <ExerciseView
            key={currentExercise.id}
            exercise={currentExercise}
            onComplete={goToNextExercise}
          />
        )}

        {/* PATTERN BROWSER VIEW */}
        {currentView === "patterns" && (
          <PatternSelector />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-lg text-zinc-600 font-semibold">
        <p>Made for young rockers • Keep drumming! 🤘</p>
      </footer>
    </div>
  );
}
