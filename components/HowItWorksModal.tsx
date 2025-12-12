/**
 * HowItWorksModal Component
 *
 * Explains the no-signup, localStorage-based account system to parents.
 * Keeps the fun visual style but with clear, parent-friendly content.
 */

"use client";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-3xl border-2 border-[#00d9ff] shadow-2xl shadow-[#00d9ff]/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-3xl font-bold transition-colors"
        >
          ×
        </button>

        {/* Content */}
        <div className="p-8 md:p-10">
          <h2 className="text-3xl md:text-4xl font-logo text-[#00ff88] mb-2">
            HOW IT WORKS
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            A quick note for parents
          </p>

          {/* Key points */}
          <div className="space-y-6">
            {/* No sign-up */}
            <div className="flex gap-4">
              <div className="text-4xl flex-shrink-0">🚀</div>
              <div>
                <h3 className="text-xl font-bold text-[#00d9ff] mb-1">
                  No sign-ups. No emails. Just play.
                </h3>
                <p className="text-zinc-300">
                  We don't collect any personal information. Your child just picks a name and a fun avatar, and they're ready to start learning drums.
                </p>
              </div>
            </div>

            {/* Multiple accounts */}
            <div className="flex gap-4">
              <div className="text-4xl flex-shrink-0">👨‍👩‍👧‍👦</div>
              <div>
                <h3 className="text-xl font-bold text-[#ff9100] mb-1">
                  Multiple kids? No problem.
                </h3>
                <p className="text-zinc-300">
                  Each child can have their own account with their own progress. Just create a profile for each of them on this device.
                </p>
              </div>
            </div>

            {/* Local storage */}
            <div className="flex gap-4">
              <div className="text-4xl flex-shrink-0">💾</div>
              <div>
                <h3 className="text-xl font-bold text-[#00ff88] mb-1">
                  Everything stays on your device.
                </h3>
                <p className="text-zinc-300">
                  All progress and account data is saved in your browser's local storage. Nothing is sent to any server. Your data stays private.
                </p>
              </div>
            </div>

            {/* The caveat */}
            <div className="flex gap-4 bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
              <div className="text-4xl flex-shrink-0">⚠️</div>
              <div>
                <h3 className="text-xl font-bold text-[#ffd600] mb-1">
                  One thing to know...
                </h3>
                <p className="text-zinc-300">
                  Because data is stored locally, clearing your browser data (cookies, cache, etc.) will also clear your child's progress. On the plus side, there's nothing to hack, no passwords to remember, and no accounts to manage!
                </p>
              </div>
            </div>

            {/* Why we built it this way */}
            <div className="flex gap-4">
              <div className="text-4xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="text-xl font-bold text-[#ff0080] mb-1">
                  Why did we build it this way?
                </h3>
                <p className="text-zinc-300">
                  We wanted to make a fun, frictionless learning tool that kids could jump straight into. No barriers, no waiting for confirmation emails, no forgotten passwords. Just drums.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={onClose}
              className="bg-[#00ff88] hover:bg-[#00d9ff] text-black font-bold text-xl px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Got it, let's rock!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
