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
export const AUTH_USER_STORAGE_KEY = "vampforge-auth-user";

export type StoredAuthUser = {
  email: string;
  displayName: string;
};

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

export function getNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || email;
}

export function getInitialsFromName(value: string) {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "VF";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function readAuthenticatedUser(): StoredAuthUser | null {
  try {
    const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;

    return JSON.parse(raw) as StoredAuthUser;
  } catch {
    return null;
  }
}

export function storeAuthenticatedUser(profile: Partial<StoredAuthUser> & { email: string }) {
  try {
    const email = profile.email.trim();
    const displayName = (profile.displayName || getNameFromEmail(email)).trim();

    window.localStorage.setItem(
      AUTH_USER_STORAGE_KEY,
      JSON.stringify({
        email,
        displayName,
      })
    );
  } catch {
    // Ignore storage failures. Firebase Auth still owns the session.
  }
}
