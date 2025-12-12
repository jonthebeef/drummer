/**
 * PostHog Analytics Provider
 *
 * Handles PostHog initialization with cookie consent management.
 * Only initializes tracking after user gives consent.
 */

"use client";

import { useEffect, createContext, useContext, useState, ReactNode } from "react";
import posthog from "posthog-js";

// Cookie consent status
type ConsentStatus = "pending" | "granted" | "denied";

interface PostHogContextType {
  consentStatus: ConsentStatus;
  grantConsent: () => void;
  denyConsent: () => void;
}

const PostHogContext = createContext<PostHogContextType | null>(null);

const CONSENT_KEY = "drummer_analytics_consent";
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

export function PostHogProvider({ children }: { children: ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending");
  const [initialized, setInitialized] = useState(false);

  // Check for existing consent on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (savedConsent === "granted") {
      setConsentStatus("granted");
    } else if (savedConsent === "denied") {
      setConsentStatus("denied");
    }
    // If no saved consent, status remains "pending" and banner shows
  }, []);

  // Initialize PostHog when consent is granted
  useEffect(() => {
    if (consentStatus === "granted" && !initialized && POSTHOG_KEY) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        persistence: "localStorage+cookie",
        // Respect Do Not Track
        respect_dnt: true,
        // EU hosting for GDPR compliance
        ui_host: "https://eu.posthog.com",
      });
      setInitialized(true);
    }
  }, [consentStatus, initialized]);

  const grantConsent = () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    setConsentStatus("granted");
  };

  const denyConsent = () => {
    localStorage.setItem(CONSENT_KEY, "denied");
    setConsentStatus("denied");
    // Opt out of PostHog if it was somehow initialized
    if (initialized) {
      posthog.opt_out_capturing();
    }
  };

  return (
    <PostHogContext.Provider value={{ consentStatus, grantConsent, denyConsent }}>
      {children}
    </PostHogContext.Provider>
  );
}

export function usePostHogConsent() {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error("usePostHogConsent must be used within a PostHogProvider");
  }
  return context;
}

/**
 * Track a custom event (only if consent granted)
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && localStorage.getItem(CONSENT_KEY) === "granted") {
    posthog.capture(eventName, properties);
  }
}

/**
 * Identify a user (only if consent granted)
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && localStorage.getItem(CONSENT_KEY) === "granted") {
    posthog.identify(userId, properties);
  }
}
