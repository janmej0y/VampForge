"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { BrandLockup } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseClientConfig, getGoogleClientId } from "@/lib/firebase-client";

type LoginStep = "email" | "otp" | "ready";

export default function LoginPage() {
  const firebaseConfig = useMemo(() => getFirebaseClientConfig(), []);
  const googleClientId = useMemo(() => getGoogleClientId(), []);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<LoginStep>("email");
  const [message, setMessage] = useState("");

  const configReady = Boolean(firebaseConfig);

  const handleEmailContinue = () => {
    if (!email.trim() || !email.includes("@")) {
      setMessage("Enter a valid email to continue.");
      return;
    }

    if (!configReady) {
      setMessage("Firebase config is missing. Add the NEXT_PUBLIC_FIREBASE_* values to enable live OTP.");
      setStep("otp");
      return;
    }

    setMessage("OTP request is ready for Firebase Auth wiring. Add Firebase SDK or backend endpoint to send the real code.");
    setStep("otp");
  };

  const handleVerifyOtp = () => {
    if (otp.trim().length < 4) {
      setMessage("Enter the OTP code from your email.");
      return;
    }

    setMessage("Login verified locally. Connect Firebase Auth to create the real session.");
    setStep("ready");
  };

  const handleGoogleLogin = () => {
    if (!googleClientId || !firebaseConfig) {
      setMessage("Add Firebase config and NEXT_PUBLIC_GOOGLE_CLIENT_ID before enabling Google login.");
      return;
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/login`);
    const scope = encodeURIComponent("openid email profile");
    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=select_account`;
  };

  return (
    <main className="vampforge-surface min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-grid bg-[size:76px_76px] opacity-[0.05]" />
      <div className="pointer-events-none fixed left-[-8rem] top-10 h-96 w-96 rounded-full bg-sky-300/28 blur-3xl" />
      <div className="pointer-events-none fixed right-[-8rem] top-24 h-[30rem] w-[30rem] rounded-full bg-blue-300/22 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-col">
        <nav className="flex items-center justify-between gap-4">
          <Link href="/">
            <BrandLockup subtitle="Secure workspace access" />
          </Link>
          <Button asChild variant="secondary">
            <Link href="/">
              Back Home
            </Link>
          </Button>
        </nav>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.7fr)]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Firebase-ready auth
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-7xl">
              Login to your VampForge workspace.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Email OTP and Google sign-in UI are ready for Firebase. Add your Firebase project keys to make the login flow live.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Portfolio drafts", "Resume exports", "Deploy history"].map((item) => (
                <div key={item} className="border-l-2 border-sky-300 bg-white/55 px-4 py-3 text-sm font-semibold text-slate-800">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="section-card border-sky-200/70 bg-white/90 p-5 shadow-[0_28px_90px_rgba(14,116,144,0.16)] sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Sign in</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Use email OTP or continue with Google.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              {step !== "email" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">OTP code</label>
                  <Input
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="123456"
                    inputMode="numeric"
                  />
                </div>
              ) : null}

              {step === "email" ? (
                <Button className="w-full" onClick={handleEmailContinue}>
                  <Mail className="h-4 w-4" />
                  Send Email OTP
                </Button>
              ) : step === "otp" ? (
                <Button className="w-full" onClick={handleVerifyOtp}>
                  <CheckCircle2 className="h-4 w-4" />
                  Verify OTP
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/dashboard">
                    Continue to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}

              <Button variant="secondary" className="w-full" onClick={handleGoogleLogin}>
                Continue with Google
              </Button>

              {message ? (
                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-800">
                  {message}
                </div>
              ) : null}

              <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-xs leading-6 text-slate-500">
                Firebase package install was not completed in this environment because npm hit a network reset. The page is prepared for Firebase keys and can be connected once the dependency/backend endpoint is available.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
