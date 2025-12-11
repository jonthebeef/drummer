/**
 * Account Selection Page
 * Route: /accounts
 * Kids can choose their account or create a new one
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllAccounts, signInToAccount, createAccount } from "@/utils/accounts";
import type { Account } from "@/types";

// Fun avatars for kids to choose from
const AVATARS = [
  "🎸", "🥁", "🎹", "🎺", "🎵",
  "🦖", "🦕", "🐉", "🦄", "🐯",
  "🚀", "⚡", "🌟", "🔥", "💎",
  "🍕", "🍩", "🌈", "🎨", "🏀",
];

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  useEffect(() => {
    setAccounts(getAllAccounts());
  }, []);

  const handleSelectAccount = (accountId: string) => {
    signInToAccount(accountId);
    router.push("/");
  };

  const handleCreateAccount = () => {
    if (!newName.trim()) {
      alert("Please enter a name!");
      return;
    }

    const account = createAccount(newName, selectedAvatar);
    signInToAccount(account.id);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 shadow-2xl border-b-2 border-zinc-600">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <svg width="48" height="48" viewBox="0 0 1200 1200" className="fill-[#00d9ff]">
              <path d="m921.98 269.68 200.68-154.69c12-9 14.016-26.016 5.0156-38.016s-26.016-14.016-38.016-5.0156l-236.02 181.69c-79.312-15.656-167.34-23.672-253.69-23.672-86.344 0-174.66 8.3438-253.69 23.672l-235.92-181.31c-12-9-29.016-6.9844-38.016 5.0156s-6.9844 29.016 5.0156 38.016l200.68 154.69c-123.32 33.984-211.31 89.344-211.31 164.34v495c0 132 272.68 203.34 529.69 204 257.34 1.3125 537.66-71.016 537-204v-495c0-75-87.984-130.31-211.31-164.34zm156.98 299.02c0 70.688-204.98 149.68-479.02 149.68-273.98 0-479.02-78.984-479.02-149.68v-41.344c92.672 72.328 290.02 111 479.02 111s386.68-38.344 479.02-111zm-510 203.68v306.32c-102.33-2.3438-193.69-15.328-267-34.688v-304.31c80.672 19.688 174 30.984 267 33zm54.328 0c95.672-1.6875 192-12.656 275.02-33.328v304.31c-75 20.016-169.31 33.328-275.02 35.016v-306.32zm-290.34-460.31 133.69 102.98c11.672 9 29.016 6.9844 38.016-5.0156s6.9844-29.016-5.0156-38.016l-95.344-73.312c59.016-9 125.02-14.344 195.66-14.344 70.688 0 136.31 5.3438 195.66 14.344l-95.344 73.312c-12 9-14.016 26.016-5.0156 38.016 9.3281 12 26.344 14.016 38.016 5.0156l133.69-102.98c129.66 29.344 212.02 77.344 212.02 122.02 0 70.688-204.98 149.68-479.02 149.68-273.94-0.046875-478.97-78.75-478.97-149.39 0-44.672 82.312-92.672 212.02-122.02zm-211.97 617.29v-267.32c31.688 24.656 75.328 45.328 126.98 62.016v303c-79.312-27.984-126.98-63.984-126.98-97.688zm831.66 97.688v-303c51.328-16.688 95.016-37.312 126.66-62.016v267.32c0 33.984-47.344 69.656-126.66 97.688z"/>
            </svg>
            <h1 className="text-5xl font-logo text-white tracking-wide">
              DRUMMER
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {!isCreating ? (
          // Account Selection Screen
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-[#00ff88] mb-3">
                Who's Rocking Today?
              </h2>
              <p className="text-xl text-zinc-400">
                Pick your account to start drumming!
              </p>
            </div>

            {/* Existing Accounts */}
            {accounts.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleSelectAccount(account.id)}
                    className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 border-4 border-[#00d9ff] hover:border-[#00ff88] transition-all transform hover:scale-105 shadow-2xl hover:shadow-[#00ff88]/50"
                  >
                    <div className="text-7xl mb-4">{account.avatar}</div>
                    <div className="text-2xl font-bold text-white">{account.name}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Create New Account Button */}
            <div className="text-center">
              <button
                onClick={() => setIsCreating(true)}
                className="bg-[#ff9100] hover:bg-[#ffd600] text-black font-bold text-2xl px-12 py-6 rounded-2xl shadow-2xl transition-all transform hover:scale-105 border-4 border-[#ff9100] hover:border-[#ffd600]"
              >
                ➕ Create New Account
              </button>
            </div>
          </div>
        ) : (
          // Account Creation Screen
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-[#ff9100] mb-3">
                Create Your Account
              </h2>
              <p className="text-xl text-zinc-400">
                Pick a cool avatar and tell us your name!
              </p>
            </div>

            {/* Avatar Selection */}
            <div className="bg-zinc-900 rounded-2xl p-8 border-2 border-[#00d9ff]">
              <h3 className="text-2xl font-bold text-[#00d9ff] mb-6 text-center">
                Choose Your Avatar
              </h3>
              <div className="grid grid-cols-5 gap-4">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`
                      text-6xl p-4 rounded-xl transition-all transform hover:scale-110
                      ${selectedAvatar === avatar
                        ? "bg-[#00ff88] scale-110 shadow-2xl ring-4 ring-[#00ff88]"
                        : "bg-zinc-800 hover:bg-zinc-700"
                      }
                    `}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="bg-zinc-900 rounded-2xl p-8 border-2 border-[#ff9100]">
              <h3 className="text-2xl font-bold text-[#ff9100] mb-6 text-center">
                What's Your Name?
              </h3>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={20}
                className="w-full text-3xl font-bold text-center px-6 py-4 rounded-xl bg-black text-white border-4 border-zinc-700 focus:border-[#00ff88] focus:outline-none transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName.trim()) {
                    handleCreateAccount();
                  }
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewName("");
                  setSelectedAvatar(AVATARS[0]);
                }}
                className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-2xl px-12 py-6 rounded-2xl transition-all shadow-2xl hover:scale-105 border-4 border-zinc-700 hover:border-zinc-600"
              >
                ⬅️ Back
              </button>
              <button
                onClick={handleCreateAccount}
                disabled={!newName.trim()}
                className={`
                  font-bold text-2xl px-12 py-6 rounded-2xl transition-all shadow-2xl border-4
                  ${newName.trim()
                    ? "bg-[#00ff88] hover:bg-[#00d9ff] text-black hover:scale-105 border-[#00ff88] hover:border-[#00d9ff]"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed border-zinc-800"
                  }
                `}
              >
                🎸 Start Rocking!
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-lg text-zinc-600 font-semibold">
        <p>Made for young rockers • Keep drumming! 🤘</p>
      </footer>
    </div>
  );
}
