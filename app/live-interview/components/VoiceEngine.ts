"use client";

export function selectInterviewVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => /google|microsoft|natural|english/i.test(voice.name)) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
    null
  );
}

export function applyInterviewVoice(utterance: SpeechSynthesisUtterance) {
  const voice = selectInterviewVoice();
  if (voice) {
    utterance.voice = voice;
  }
}
