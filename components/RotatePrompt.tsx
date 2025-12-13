/**
 * RotatePrompt Component
 *
 * Shows a fullscreen prompt asking mobile users to rotate to landscape.
 * Only appears on small screens (< 768px) in portrait orientation.
 */

"use client";

import { useEffect, useState } from "react";

export default function RotatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    function checkOrientation() {
      // Only show on mobile-sized screens (< 768px width)
      const isMobileWidth = window.innerWidth < 768;

      // Check if portrait (height > width)
      const isPortrait = window.innerHeight > window.innerWidth;

      // Show prompt only if mobile-sized AND portrait
      setShowPrompt(isMobileWidth && isPortrait);
    }

    // Check on mount
    checkOrientation();

    // Listen for resize and orientation changes
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-6">
      <div className="text-center">
        {/* Rotation icon animation */}
        <div className="mb-8 animate-bounce">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#00d9ff] mx-auto"
          >
            {/* Phone icon */}
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
            {/* Rotation arrow */}
            <path d="M8 2 L16 2 M16 2 L14 4 M16 2 L14 0" className="animate-pulse" />
          </svg>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Please Rotate Your Device
        </h2>
        <p className="text-xl text-zinc-300 mb-2">
          This app works best in <strong className="text-[#00d9ff]">landscape mode</strong>
        </p>
        <p className="text-lg text-zinc-400">
          Turn your phone sideways to continue
        </p>

        {/* Visual rotation hint */}
        <div className="mt-12 flex items-center justify-center gap-8">
          <div className="text-6xl opacity-50">📱</div>
          <div className="text-4xl text-[#00d9ff]">→</div>
          <div className="text-6xl transform rotate-90">📱</div>
        </div>
      </div>
    </div>
  );
}
