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
import { exercises, getExerciseById } from "@/data/exercises";
import { levels, getLevelByNumber } from "@/data/levels";

type AppView = "home" | "session" | "patterns";

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [sessionExercises, setSessionExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Start a practice session
  const startSession = () => {
    // For v1, hard-code the exercises from Level 1
    const level1 = getLevelByNumber(1);
    if (level1) {
      setSessionExercises(level1.exerciseIds);
      setCurrentExerciseIndex(0);
      setCurrentView("session");
    }
  };

  // Move to next exercise in session
  const nextExercise = () => {
    if (currentExerciseIndex < sessionExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Session complete!
      setCurrentView("home");
      setCurrentExerciseIndex(0);
    }
  };

  // Get current exercise
  const currentExercise = sessionExercises.length > 0
    ? getExerciseById(sessionExercises[currentExerciseIndex])
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header navigation */}
      <header className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView("home")}
              className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              🥁 Drummer
            </button>

            <nav className="flex gap-2">
              <button
                onClick={() => setCurrentView("home")}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-all
                  ${currentView === "home"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView("patterns")}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-all
                  ${currentView === "patterns"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* HOME VIEW */}
        {currentView === "home" && (
          <div className="space-y-8">
            {/* Welcome card */}
            <div className="bg-white rounded-xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">🥁</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">
                Welcome to Drummer!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Learn to play the drums one beat at a time.
              </p>

              <button
                onClick={startSession}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-xl px-12 py-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                Start Today's Session
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-200">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-2xl font-bold text-gray-800">{levels.length}</div>
                <div className="text-sm text-gray-600">Levels</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-2 border-purple-200">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-gray-800">{exercises.length}</div>
                <div className="text-sm text-gray-600">Exercises</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-2 border-pink-200">
                <div className="text-3xl mb-2">🎵</div>
                <div className="text-2xl font-bold text-gray-800">3</div>
                <div className="text-sm text-gray-600">Patterns</div>
              </div>
            </div>

            {/* Quick tip */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-blue-900 mb-2">💡 Quick Tip</h2>
              <p className="text-blue-800">
                Start slow! It's better to play a pattern slowly and correctly than fast and messy.
                You can always speed up the tempo as you get more comfortable.
              </p>
            </div>
          </div>
        )}

        {/* SESSION VIEW */}
        {currentView === "session" && currentExercise && (
          <div>
            {/* Progress indicator */}
            <div className="mb-6 bg-white rounded-lg border-2 border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Session Progress
                </span>
                <span className="text-sm text-gray-600">
                  Exercise {currentExerciseIndex + 1} of {sessionExercises.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentExerciseIndex + 1) / sessionExercises.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Current exercise */}
            <ExerciseView
              exercise={currentExercise}
              onNext={nextExercise}
            />
          </div>
        )}

        {/* PATTERN BROWSER VIEW */}
        {currentView === "patterns" && (
          <PatternSelector />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-sm text-gray-500">
        <p>Made for young drummers • Keep practicing! 🎵</p>
      </footer>
    </div>
  );
}
