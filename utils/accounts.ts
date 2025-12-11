/**
 * Account Management Utilities
 * Handles account creation, selection, and localStorage persistence
 */

import { Account } from "@/types";

const ACCOUNTS_KEY = "drummer-accounts";
const CURRENT_ACCOUNT_KEY = "drummer-current-account";

/**
 * Get all accounts
 */
export function getAllAccounts(): Account[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading accounts:", error);
    return [];
  }
}

/**
 * Get account by ID
 */
export function getAccountById(id: string): Account | null {
  const accounts = getAllAccounts();
  return accounts.find(acc => acc.id === id) || null;
}

/**
 * Get currently signed-in account
 */
export function getCurrentAccount(): Account | null {
  if (typeof window === "undefined") return null;

  try {
    const currentId = localStorage.getItem(CURRENT_ACCOUNT_KEY);
    if (!currentId) return null;
    return getAccountById(currentId);
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
}

/**
 * Create a new account
 */
export function createAccount(name: string, avatar: string): Account {
  const newAccount: Account = {
    id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    avatar,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  };

  const accounts = getAllAccounts();
  accounts.push(newAccount);

  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    console.log("Created account:", newAccount);
    return newAccount;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}

/**
 * Sign in to an account (set as current)
 */
export function signInToAccount(accountId: string): void {
  if (typeof window === "undefined") return;

  const account = getAccountById(accountId);
  if (!account) {
    throw new Error("Account not found");
  }

  // Update last used timestamp
  const accounts = getAllAccounts();
  const updated = accounts.map(acc =>
    acc.id === accountId
      ? { ...acc, lastUsed: new Date().toISOString() }
      : acc
  );

  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));
    localStorage.setItem(CURRENT_ACCOUNT_KEY, accountId);
    console.log("Signed in to account:", account.name);
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

/**
 * Sign out (clear current account)
 */
export function signOut(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_ACCOUNT_KEY);
  console.log("Signed out");
}

/**
 * Delete an account and all its progress
 */
export function deleteAccount(accountId: string): void {
  const accounts = getAllAccounts();
  const filtered = accounts.filter(acc => acc.id !== accountId);

  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));

    // If this was the current account, sign out
    const currentId = localStorage.getItem(CURRENT_ACCOUNT_KEY);
    if (currentId === accountId) {
      signOut();
    }

    // Delete account's progress
    const progressKey = `drummer-progress-${accountId}`;
    localStorage.removeItem(progressKey);

    console.log("Deleted account:", accountId);
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
}

/**
 * Update account details
 */
export function updateAccount(accountId: string, updates: Partial<Pick<Account, 'name' | 'avatar'>>): void {
  const accounts = getAllAccounts();
  const updated = accounts.map(acc =>
    acc.id === accountId
      ? { ...acc, ...updates }
      : acc
  );

  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));
    console.log("Updated account:", accountId, updates);
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
}
