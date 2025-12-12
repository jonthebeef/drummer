/**
 * Cookie Consent Banner
 *
 * GDPR-compliant consent banner that explains our analytics tracking.
 * Matches the app's fun visual style but with clear, parent-friendly content.
 */

"use client";

import { useState } from "react";
import { usePostHogConsent } from "./PostHogProvider";

export default function CookieConsentBanner() {
  const { consentStatus, grantConsent, denyConsent } = usePostHogConsent();
  const [showDetails, setShowDetails] = useState(false);

  // Don't show if consent already given or denied
  if (consentStatus !== "pending") {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-2xl border-2 border-[#00d9ff] shadow-2xl shadow-[#00d9ff]/20 overflow-hidden">
        <div className="p-6">
          {/* Main content */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🍪</span>
                <h3 className="text-xl font-bold text-[#00d9ff]">
                  Quick question for parents!
                </h3>
              </div>
              <p className="text-zinc-300">
                Can we use cookies to see how kids use Drummer? This helps us make it better.
                No personal data leaves your device.{" "}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[#00ff88] hover:text-[#00d9ff] underline underline-offset-2"
                >
                  {showDetails ? "Hide details" : "Learn more"}
                </button>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={denyConsent}
                className="px-6 py-3 rounded-xl font-bold text-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
              >
                No thanks
              </button>
              <button
                onClick={grantConsent}
                className="px-6 py-3 rounded-xl font-bold text-lg bg-[#00ff88] hover:bg-[#00d9ff] text-black transition-all transform hover:scale-105"
              >
                Sure, that's fine
              </button>
            </div>
          </div>

          {/* Expanded details */}
          {showDetails && (
            <div className="mt-6 pt-6 border-t border-zinc-800 space-y-4 text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <h4 className="font-bold text-[#00ff88] mb-2 flex items-center gap-2">
                    <span>✓</span> What we track
                  </h4>
                  <ul className="text-zinc-400 space-y-1">
                    <li>• Which lessons are popular</li>
                    <li>• Where kids get stuck</li>
                    <li>• How long practice sessions last</li>
                    <li>• General usage patterns</li>
                  </ul>
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <h4 className="font-bold text-[#ff0080] mb-2 flex items-center gap-2">
                    <span>✗</span> What we DON'T track
                  </h4>
                  <ul className="text-zinc-400 space-y-1">
                    <li>• Names or personal details</li>
                    <li>• Location data</li>
                    <li>• Anything that identifies your child</li>
                    <li>• We don't sell any data. Ever.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-4">
                <h4 className="font-bold text-[#ff9100] mb-2 flex items-center gap-2">
                  <span>🔒</span> Privacy-first analytics
                </h4>
                <p className="text-zinc-400">
                  We use <a href="https://posthog.com" target="_blank" rel="noopener noreferrer" className="text-[#00d9ff] hover:underline">PostHog</a> with
                  EU hosting for GDPR compliance. Your data stays in Europe, never touches Google or Facebook,
                  and we can't identify individual users. It's just aggregate data to help us understand
                  what's working and what isn't.
                </p>
              </div>

              <p className="text-zinc-500 text-xs">
                You can change your mind anytime by clearing your browser cookies.
                This will reset your consent choice (and unfortunately, your child's progress too -
                that's the tradeoff of keeping everything local!).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
