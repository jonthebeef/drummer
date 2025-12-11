"use client";

/**
 * Landing Page
 * Route: /
 * Main homepage - marketing page to sign up
 */

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-950 border-b-2 border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-3xl font-logo text-white tracking-wide">
              <svg width="32" height="32" viewBox="0 0 1200 1200" className="fill-zinc-600">
                <path d="m921.98 269.68 200.68-154.69c12-9 14.016-26.016 5.0156-38.016s-26.016-14.016-38.016-5.0156l-236.02 181.69c-79.312-15.656-167.34-23.672-253.69-23.672-86.344 0-174.66 8.3438-253.69 23.672l-235.92-181.31c-12-9-29.016-6.9844-38.016 5.0156s-6.9844 29.016 5.0156 38.016l200.68 154.69c-123.32 33.984-211.31 89.344-211.31 164.34v495c0 132 272.68 203.34 529.69 204 257.34 1.3125 537.66-71.016 537-204v-495c0-75-87.984-130.31-211.31-164.34zm156.98 299.02c0 70.688-204.98 149.68-479.02 149.68-273.98 0-479.02-78.984-479.02-149.68v-41.344c92.672 72.328 290.02 111 479.02 111s386.68-38.344 479.02-111zm-510 203.68v306.32c-102.33-2.3438-193.69-15.328-267-34.688v-304.31c80.672 19.688 174 30.984 267 33zm54.328 0c95.672-1.6875 192-12.656 275.02-33.328v304.31c-75 20.016-169.31 33.328-275.02 35.016v-306.32zm-290.34-460.31 133.69 102.98c11.672 9 29.016 6.9844 38.016-5.0156s6.9844-29.016-5.0156-38.016l-95.344-73.312c59.016-9 125.02-14.344 195.66-14.344 70.688 0 136.31 5.3438 195.66 14.344l-95.344 73.312c-12 9-14.016 26.016-5.0156 38.016 9.3281 12 26.344 14.016 38.016 5.0156l133.69-102.98c129.66 29.344 212.02 77.344 212.02 122.02 0 70.688-204.98 149.68-479.02 149.68-273.94-0.046875-478.97-78.75-478.97-149.39 0-44.672 82.312-92.672 212.02-122.02zm-211.97 617.29v-267.32c31.688 24.656 75.328 45.328 126.98 62.016v303c-79.312-27.984-126.98-63.984-126.98-97.688zm831.66 97.688v-303c51.328-16.688 95.016-37.312 126.66-62.016v267.32c0 33.984-47.344 69.656-126.66 97.688z"/>
              </svg>
              DRUMMER.
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

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/concert-stage.jpg')",
            backgroundPosition: "center 40%"
          }}
        >
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32 w-full">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-logo text-white tracking-wide leading-tight drop-shadow-2xl">
              LEARN DRUMS<br />
              <span className="text-[#00ff88]">LIKE A ROCKSTAR.</span>
            </h1>

            <p className="text-2xl md:text-3xl text-white max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
              Interactive drum lessons for kids ages 6-13. Master timing, grooves, and fills one beat at a time.
            </p>

            <div className="pt-8">
              <Link
                href="/accounts"
                className="inline-block bg-[#ff9100] hover:bg-[#ffd600] text-black font-bold text-3xl px-16 py-8 rounded-2xl shadow-2xl transition-all transform hover:scale-105 border-4 border-[#ff9100] hover:border-[#ffd600]"
              >
                CREATE NEW ACCOUNT 🎸
              </Link>
              <p className="text-zinc-400 mt-6 text-lg drop-shadow-md">Free • No login required • Start in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gradient-to-b from-black via-zinc-950 to-black py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-logo text-center text-white mb-16">
            WHY <span className="text-[#00d9ff]">DRUMMER?</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-900 rounded-2xl p-8 border-2 border-[#00ff88] hover:border-[#00d9ff] transition-all hover:scale-105 transform">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-3xl font-bold text-[#00ff88] mb-4">Learn by Doing</h3>
              <p className="text-zinc-300 text-xl leading-relaxed">
                Watch the pattern, then play it yourself. Get instant visual feedback as you drum along.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900 rounded-2xl p-8 border-2 border-[#ff9100] hover:border-[#ffd600] transition-all hover:scale-105 transform">
              <div className="text-6xl mb-6">⭐</div>
              <h3 className="text-3xl font-bold text-[#ff9100] mb-4">Earn Stars</h3>
              <p className="text-zinc-300 text-xl leading-relaxed">
                Hit the beats accurately to earn stars. Track your progress and unlock new lessons.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900 rounded-2xl p-8 border-2 border-[#00d9ff] hover:border-[#00ff88] transition-all hover:scale-105 transform">
              <div className="text-6xl mb-6">🎵</div>
              <h3 className="text-3xl font-bold text-[#00d9ff] mb-4">Real Patterns</h3>
              <p className="text-zinc-300 text-xl leading-relaxed">
                Master the steady beat, control each limb, and play your first real drum grooves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-5xl font-logo text-center text-white mb-16">
            HOW IT <span className="text-[#ff9100]">WORKS</span>
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-6 bg-zinc-900 p-8 rounded-2xl border-l-4 border-[#00ff88]">
              <div className="flex-shrink-0 w-16 h-16 bg-[#00ff88] text-black rounded-full flex items-center justify-center text-3xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Pick a Lesson</h3>
                <p className="text-zinc-300 text-xl">Choose from timing exercises, grooves, and fills. Start at your level.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-zinc-900 p-8 rounded-2xl border-l-4 border-[#ff9100]">
              <div className="flex-shrink-0 w-16 h-16 bg-[#ff9100] text-black rounded-full flex items-center justify-center text-3xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Watch & Play</h3>
                <p className="text-zinc-300 text-xl">Watch the pattern twice, then rock out! Play 4 loops to get your score.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-zinc-900 p-8 rounded-2xl border-l-4 border-[#00d9ff]">
              <div className="flex-shrink-0 w-16 h-16 bg-[#00d9ff] text-black rounded-full flex items-center justify-center text-3xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Get Stars & Progress</h3>
                <p className="text-zinc-300 text-xl">Earn up to 3 stars based on accuracy. Unlock new lessons as you improve!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-logo text-white mb-6">
            READY TO <span className="text-[#00ff88]">ROCK?</span>
          </h2>
          <p className="text-2xl text-zinc-300 mb-10">
            Create your account and start drumming in seconds. No email, no hassle.
          </p>
          <Link
            href="/accounts"
            className="inline-block bg-[#ff9100] hover:bg-[#ffd600] text-black font-bold text-3xl px-16 py-8 rounded-2xl shadow-2xl transition-all transform hover:scale-105 border-4 border-[#ff9100] hover:border-[#ffd600]"
          >
            CREATE NEW ACCOUNT 🤘
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t-2 border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-500 text-lg">Made for young rockers • Keep drumming! 🎸</p>
        </div>
      </footer>
    </div>
  );
}
