"use client";

export type StoredUserProfile = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
};

export const USER_PROFILE_STORAGE_KEY = "vampforge-user-profile";

export function readStoredUserProfile(): Partial<StoredUserProfile> | null {
  try {
    const raw = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (!raw) return null;

    return JSON.parse(raw) as Partial<StoredUserProfile>;
  } catch {
    return null;
  }
}

export function storeUserProfile(profile: Partial<StoredUserProfile>) {
  try {
    const current = readStoredUserProfile() ?? {};
    const next = {
      ...current,
      ...Object.fromEntries(
        Object.entries(profile).filter(([, value]) => typeof value === "string")
      ),
    };

    window.localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures. The form should keep working without persistence.
  }
}
