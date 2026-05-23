import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import { getFirebaseClientConfig } from "@/lib/firebase-client";

function getConfiguredFirebaseApp(): FirebaseApp {
  const config = getFirebaseClientConfig();

  if (!config) {
    throw new Error("Firebase config is missing. Add the NEXT_PUBLIC_FIREBASE_* values.");
  }

  return getApps().length ? getApp() : initializeApp(config);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getConfiguredFirebaseApp());
}

export function isFirebaseEmailSignInLink(url: string): boolean {
  return isSignInWithEmailLink(getFirebaseAuth(), url);
}

export async function sendFirebaseEmailSignInLink(email: string): Promise<void> {
  await sendSignInLinkToEmail(getFirebaseAuth(), email, {
    url: `${window.location.origin}/login`,
    handleCodeInApp: true,
  });

  window.localStorage.setItem("vampforgeEmailForSignIn", email);
}

export async function completeFirebaseEmailSignIn(url: string, email: string): Promise<UserCredential> {
  return signInWithEmailLink(getFirebaseAuth(), email, url);
}

export async function signInWithFirebaseGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  return signInWithPopup(getFirebaseAuth(), provider);
}
