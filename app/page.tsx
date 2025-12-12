"use client";

/**
 * Landing Page
 * Route: /
 * Kid-focused homepage that shows the product in action
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DrumGrid from "@/components/DrumGrid";
import { Pattern } from "@/types";
import { playDrum, playMetronomeClick, resumeAudioContext } from "@/utils/drumSynth";

// Simple demo pattern for the landing page
const DEMO_PATTERN: Pattern = {
  id: "demo",
  name: "Demo Beat",
  difficulty: "easy",
  description: "A simple beat to show how it works",
  defaultTempoBpm: 70,
  timeSignature: "4/4",
  subdivision: "eighth",
  steps: [
    { step: 1, countLabel: "1", hit: ["hihat", "kick"] },
    { step: 2, countLabel: "&", hit: ["hihat"] },
    { step: 3, countLabel: "2", hit: ["hihat"] },
    { step: 4, countLabel: "&", hit: ["hihat"] },
    { step: 5, countLabel: "3", hit: ["hihat", "snare"] },
    { step: 6, countLabel: "&", hit: ["hihat"] },
    { step: 7, countLabel: "4", hit: ["hihat"] },
    { step: 8, countLabel: "&", hit: ["hihat"] },
  ],
};

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState<number | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-play the demo pattern
  const startDemo = useCallback(() => {
    if (!hasInteracted) {
      resumeAudioContext();
      setHasInteracted(true);
    }
    setIsPlaying(true);
    setCurrentStep(0);
  }, [hasInteracted]);

  // Stop the demo
  const stopDemo = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(undefined);
  }, []);

  // Sequencer effect for demo playback
  useEffect(() => {
    if (!isPlaying) return;

    const bpm = 70;
    const stepDuration = (60 / bpm / 2) * 1000; // 8th notes

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev === undefined ? 0 : (prev + 1) % 8;

        // Play sounds
        if (nextStep % 2 === 0) {
          playMetronomeClick(nextStep === 0);
        }

        const patternStep = DEMO_PATTERN.steps.find(s => s.step === nextStep + 1);
        if (patternStep) {
          patternStep.hit.forEach(drum => playDrum(drum));
        }

        return nextStep;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-950 border-b-2 border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-3xl font-logo text-white tracking-wide">
              <svg width="32" height="32" viewBox="0 0 1200 1200" className="fill-[#00d9ff]">
                <path d="m921.98 269.68 200.68-154.69c12-9 14.016-26.016 5.0156-38.016s-26.016-14.016-38.016-5.0156l-236.02 181.69c-79.312-15.656-167.34-23.672-253.69-23.672-86.344 0-174.66 8.3438-253.69 23.672l-235.92-181.31c-12-9-29.016-6.9844-38.016 5.0156s-6.9844 29.016 5.0156 38.016l200.68 154.69c-123.32 33.984-211.31 89.344-211.31 164.34v495c0 132 272.68 203.34 529.69 204 257.34 1.3125 537.66-71.016 537-204v-495c0-75-87.984-130.31-211.31-164.34zm156.98 299.02c0 70.688-204.98 149.68-479.02 149.68-273.98 0-479.02-78.984-479.02-149.68v-41.344c92.672 72.328 290.02 111 479.02 111s386.68-38.344 479.02-111zm-510 203.68v306.32c-102.33-2.3438-193.69-15.328-267-34.688v-304.31c80.672 19.688 174 30.984 267 33zm54.328 0c95.672-1.6875 192-12.656 275.02-33.328v304.31c-75 20.016-169.31 33.328-275.02 35.016v-306.32zm-290.34-460.31 133.69 102.98c11.672 9 29.016 6.9844 38.016-5.0156s6.9844-29.016-5.0156-38.016l-95.344-73.312c59.016-9 125.02-14.344 195.66-14.344 70.688 0 136.31 5.3438 195.66 14.344l-95.344 73.312c-12 9-14.016 26.016-5.0156 38.016 9.3281 12 26.344 14.016 38.016 5.0156l133.69-102.98c129.66 29.344 212.02 77.344 212.02 122.02 0 70.688-204.98 149.68-479.02 149.68-273.94-0.046875-478.97-78.75-478.97-149.39 0-44.672 82.312-92.672 212.02-122.02zm-211.97 617.29v-267.32c31.688 24.656 75.328 45.328 126.98 62.016v303c-79.312-27.984-126.98-63.984-126.98-97.688zm831.66 97.688v-303c51.328-16.688 95.016-37.312 126.66-62.016v267.32c0 33.984-47.344 69.656-126.66 97.688z"/>
              </svg>
              DRUMMER
            </div>
            <Link
              href="/accounts"
              className="px-6 py-3 rounded-lg font-bold text-lg bg-[#00ff88] hover:bg-[#00d9ff] text-black transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Compact */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/concert-stage.jpg')",
            backgroundPosition: "center 40%"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-logo text-white tracking-wide leading-tight drop-shadow-2xl">
              LEARN DRUMS<br />
              <span className="text-[#00ff88]">LIKE A ROCKSTAR.</span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg">
              Watch. Play. Earn stars. It's that easy.
            </p>

            <div className="pt-4">
              <Link
                href="/accounts"
                className="inline-block bg-[#ff9100] hover:bg-[#ffd600] text-black font-bold text-2xl md:text-3xl px-12 md:px-16 py-6 md:py-8 rounded-2xl shadow-2xl transition-all transform hover:scale-105 border-4 border-[#ff9100] hover:border-[#ffd600]"
              >
                START PLAYING
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Drum Grid Demo Section */}
      <section className="py-16 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-logo text-white mb-4">
              CHECK <span className="text-[#00d9ff]">THIS OUT</span>
            </h2>
            <p className="text-xl text-zinc-400">
              This is what you'll be playing. Pretty cool, right?
            </p>
          </div>

          {/* The actual drum grid */}
          <div className="bg-zinc-900 rounded-3xl p-6 md:p-10 border-4 border-[#00d9ff] shadow-2xl shadow-[#00d9ff]/20">
            <DrumGrid
              pattern={DEMO_PATTERN}
              currentStep={currentStep}
              showCounting={true}
            />

            {/* Play/Stop button */}
            <div className="mt-8 text-center">
              {!isPlaying ? (
                <button
                  onClick={startDemo}
                  className="bg-[#00ff88] hover:bg-[#00d9ff] text-black font-bold text-2xl px-12 py-5 rounded-xl transition-all transform hover:scale-105 shadow-xl"
                >
                  Watch It Play
                </button>
              ) : (
                <button
                  onClick={stopDemo}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-2xl px-12 py-5 rounded-xl transition-all shadow-xl"
                >
                  Stop
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-2xl text-[#00ff88] font-bold mt-8">
            Think you can do that? Let's find out!
          </p>
        </div>
      </section>

      {/* How It Works - Visual Flow */}
      <section className="py-16 bg-black">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-logo text-center text-white mb-16">
            IT'S <span className="text-[#ff9100]">EASY</span>
          </h2>

          {/* Desktop: horizontal layout */}
          <div className="hidden md:flex items-center justify-center gap-4">
            {/* Step 1: Watch */}
            <div className="text-center p-6 flex-1">
              <div className="text-8xl mb-6">👀</div>
              <div className="bg-[#00d9ff] text-black text-3xl font-bold py-3 px-6 rounded-xl inline-block mb-4">
                WATCH
              </div>
              <p className="text-xl text-zinc-300">
                See the pattern play.<br />Learn the beat.
              </p>
            </div>

            {/* Arrow 1 */}
            <div className="text-6xl text-[#ff9100] flex-shrink-0">→</div>

            {/* Step 2: Play */}
            <div className="text-center p-6 flex-1">
              <div className="text-8xl mb-6">🥁</div>
              <div className="bg-[#ff9100] text-black text-3xl font-bold py-3 px-6 rounded-xl inline-block mb-4">
                PLAY
              </div>
              <p className="text-xl text-zinc-300">
                Copy the beat.<br />Tap the drums!
              </p>
            </div>

            {/* Arrow 2 */}
            <div className="text-6xl text-[#ff9100] flex-shrink-0">→</div>

            {/* Step 3: Win */}
            <div className="text-center p-6 flex-1">
              <div className="text-8xl mb-6">⭐</div>
              <div className="bg-[#00ff88] text-black text-3xl font-bold py-3 px-6 rounded-xl inline-block mb-4">
                WIN
              </div>
              <p className="text-xl text-zinc-300">
                Earn stars.<br />Unlock more levels!
              </p>
            </div>
          </div>

          {/* Mobile: vertical layout */}
          <div className="md:hidden flex flex-col items-center gap-4">
            {/* Step 1: Watch */}
            <div className="text-center p-6">
              <div className="text-7xl mb-4">👀</div>
              <div className="bg-[#00d9ff] text-black text-2xl font-bold py-3 px-6 rounded-xl inline-block mb-3">
                WATCH
              </div>
              <p className="text-lg text-zinc-300">
                See the pattern play. Learn the beat.
              </p>
            </div>

            <div className="text-4xl text-[#ff9100]">↓</div>

            {/* Step 2: Play */}
            <div className="text-center p-6">
              <div className="text-7xl mb-4">🥁</div>
              <div className="bg-[#ff9100] text-black text-2xl font-bold py-3 px-6 rounded-xl inline-block mb-3">
                PLAY
              </div>
              <p className="text-lg text-zinc-300">
                Copy the beat. Tap the drums!
              </p>
            </div>

            <div className="text-4xl text-[#ff9100]">↓</div>

            {/* Step 3: Win */}
            <div className="text-center p-6">
              <div className="text-7xl mb-4">⭐</div>
              <div className="bg-[#00ff88] text-black text-2xl font-bold py-3 px-6 rounded-xl inline-block mb-3">
                WIN
              </div>
              <p className="text-lg text-zinc-300">
                Earn stars. Unlock more levels!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Level Progression Preview */}
      <section className="py-16 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-logo text-center text-white mb-6">
            LEVEL <span className="text-[#00ff88]">UP</span>
          </h2>
          <p className="text-xl text-zinc-400 text-center mb-12">
            Start easy. Get better. Unlock new challenges!
          </p>

          <div className="space-y-4">
            {/* Level 1 - Unlocked */}
            <div className="flex items-center gap-4 bg-zinc-900 p-6 rounded-2xl border-2 border-[#00ff88] shadow-lg shadow-[#00ff88]/20">
              <div className="w-16 h-16 bg-[#00ff88] text-black rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#00ff88]">Your First Beats</h3>
                <p className="text-zinc-400">Learn to keep the beat steady</p>
              </div>
              <div className="flex gap-1">
                <span className="text-3xl">⭐</span>
                <span className="text-3xl">⭐</span>
                <span className="text-3xl opacity-30">⭐</span>
              </div>
            </div>

            {/* Level 2 - Locked */}
            <div className="flex items-center gap-4 bg-zinc-950 p-6 rounded-2xl border-2 border-zinc-800 opacity-60">
              <div className="w-16 h-16 bg-zinc-800 text-zinc-500 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-zinc-500">Rock Grooves</h3>
                <p className="text-zinc-600">Play real drum patterns</p>
              </div>
              <div className="text-4xl">🔒</div>
            </div>

            {/* Level 3 - Locked */}
            <div className="flex items-center gap-4 bg-zinc-950 p-6 rounded-2xl border-2 border-zinc-800 opacity-40">
              <div className="w-16 h-16 bg-zinc-800 text-zinc-600 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-zinc-600">Pro Mode</h3>
                <p className="text-zinc-700">Master the fills</p>
              </div>
              <div className="text-4xl">🔒</div>
            </div>
          </div>

          <p className="text-center text-xl text-[#ff9100] font-bold mt-8">
            Complete lessons to unlock the next level!
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-logo text-white mb-6">
            READY TO <span className="text-[#00ff88]">ROCK?</span>
          </h2>
          <p className="text-2xl text-zinc-300 mb-10">
            Your first lesson is just one click away.
          </p>
          <Link
            href="/accounts"
            className="inline-block bg-[#ff9100] hover:bg-[#ffd600] text-black font-bold text-3xl px-16 py-8 rounded-2xl shadow-2xl transition-all transform hover:scale-105 border-4 border-[#ff9100] hover:border-[#ffd600]"
          >
            LET'S GO!
          </Link>
          <p className="text-zinc-500 mt-6 text-lg">Free • No email needed • Start in seconds</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t-2 border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-500 text-lg">Made for young drummers everywhere</p>
        </div>
      </footer>
    </div>
  );
}
