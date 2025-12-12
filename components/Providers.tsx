/**
 * Client-side Providers Wrapper
 *
 * Wraps the app with necessary client-side providers (PostHog, etc.)
 */

"use client";

import { ReactNode } from "react";
import { PostHogProvider } from "./PostHogProvider";
import CookieConsentBanner from "./CookieConsentBanner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider>
      {children}
      <CookieConsentBanner />
    </PostHogProvider>
  );
}
