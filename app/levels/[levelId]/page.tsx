/**
 * Level Map Page
 * Route: /levels/[levelId]
 * Shows all exercises in a level with progress
 */

"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import LevelMap from "@/components/LevelMap";
import { getExercisesByLevel } from "@/data/exercises";
import { getLevelByNumber } from "@/data/levels";
import { getExerciseStars } from "@/utils/progress";
import { trackLevelViewed } from "@/utils/analytics";
import type { Exercise } from "@/types";

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = parseInt(params.levelId as string);

  const level = getLevelByNumber(levelId);
  const exercises = getExercisesByLevel(levelId);

  // Track level view
  useEffect(() => {
    if (level && exercises.length > 0) {
      const completed = exercises.filter(e => getExerciseStars(e.id) > 0).length;
      trackLevelViewed(levelId, completed, exercises.length);
    }
  }, [level, levelId, exercises]);

  if (!level) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Level not found</h1>
          <Link href="/" className="text-[#00d9ff] hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const handleSelectExercise = (exercise: Exercise) => {
    router.push(`/levels/${levelId}/exercise/${exercise.id}`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header navigation */}
      <header className="bg-zinc-950 shadow-lg border-b-2 border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-3xl font-logo text-white hover:text-[#00d9ff] transition-colors tracking-wide"
            >
              <svg width="32" height="32" viewBox="0 0 1200 1200" className="fill-zinc-600">
                <path d="m921.98 269.68 200.68-154.69c12-9 14.016-26.016 5.0156-38.016s-26.016-14.016-38.016-5.0156l-236.02 181.69c-79.312-15.656-167.34-23.672-253.69-23.672-86.344 0-174.66 8.3438-253.69 23.672l-235.92-181.31c-12-9-29.016-6.9844-38.016 5.0156s-6.9844 29.016 5.0156 38.016l200.68 154.69c-123.32 33.984-211.31 89.344-211.31 164.34v495c0 132 272.68 203.34 529.69 204 257.34 1.3125 537.66-71.016 537-204v-495c0-75-87.984-130.31-211.31-164.34zm156.98 299.02c0 70.688-204.98 149.68-479.02 149.68-273.98 0-479.02-78.984-479.02-149.68v-41.344c92.672 72.328 290.02 111 479.02 111s386.68-38.344 479.02-111zm-510 203.68v306.32c-102.33-2.3438-193.69-15.328-267-34.688v-304.31c80.672 19.688 174 30.984 267 33zm54.328 0c95.672-1.6875 192-12.656 275.02-33.328v304.31c-75 20.016-169.31 33.328-275.02 35.016v-306.32zm-290.34-460.31 133.69 102.98c11.672 9 29.016 6.9844 38.016-5.0156s6.9844-29.016-5.0156-38.016l-95.344-73.312c59.016-9 125.02-14.344 195.66-14.344 70.688 0 136.31 5.3438 195.66 14.344l-95.344 73.312c-12 9-14.016 26.016-5.0156 38.016 9.3281 12 26.344 14.016 38.016 5.0156l133.69-102.98c129.66 29.344 212.02 77.344 212.02 122.02 0 70.688-204.98 149.68-479.02 149.68-273.94-0.046875-478.97-78.75-478.97-149.39 0-44.672 82.312-92.672 212.02-122.02zm-211.97 617.29v-267.32c31.688 24.656 75.328 45.328 126.98 62.016v303c-79.312-27.984-126.98-63.984-126.98-97.688zm831.66 97.688v-303c51.328-16.688 95.016-37.312 126.66-62.016v267.32c0 33.984-47.344 69.656-126.66 97.688z"/>
              </svg>
              DRUMMER.
            </Link>

            <nav className="flex gap-2">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg font-bold transition-all text-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-[#00ff88]"
              >
                Home
              </Link>
              <Link
                href="/levels/1"
                className="px-4 py-2 rounded-lg font-bold transition-all text-lg bg-[#00d9ff] text-black"
              >
                Level 1
              </Link>
              <Link
                href="/patterns"
                className="px-4 py-2 rounded-lg font-bold transition-all text-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-[#ff9100]"
              >
                Patterns
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <LevelMap
        exercises={exercises}
        levelName={level.name}
        levelDescription={level.description}
        onSelectExercise={handleSelectExercise}
      />

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-lg text-zinc-600 font-semibold">
        <p>Made for young rockers • Keep drumming! 🤘</p>
      </footer>
    </div>
  );
}
