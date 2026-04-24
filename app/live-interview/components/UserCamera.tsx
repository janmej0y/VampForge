"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VoiceWaveform } from "./VoiceWaveform";

type UserCameraProps = {
  stream: MediaStream;
  isListening: boolean;
  isCameraEnabled: boolean;
  transcript: string;
  onCameraLost: () => void;
  onEyeContactSample?: (score: number) => void;
};

export function UserCamera({
  stream,
  isListening,
  isCameraEnabled,
  transcript,
  onCameraLost,
  onEyeContactSample,
}: UserCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [eyeContactScore, setEyeContactScore] = useState(8.4);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    const videoTracks = stream.getVideoTracks();
    const handleEnded = () => {
      setCameraActive(false);
      onCameraLost();
    };

    videoTracks.forEach((track) => {
      track.addEventListener("ended", handleEnded);
    });

    return () => {
      videoTracks.forEach((track) => {
        track.removeEventListener("ended", handleEnded);
      });
    };
  }, [onCameraLost, stream]);

  useEffect(() => {
    if (!isListening) return;

    const interval = window.setInterval(() => {
      const video = videoRef.current;
      const active = Boolean(video && !video.paused && video.readyState >= 2);
      const nextScore = active ? 8 + Math.random() * 1.4 : 3.5;
      setEyeContactScore(Number(nextScore.toFixed(1)));
      onEyeContactSample?.(nextScore);
    }, 2500);

    return () => window.clearInterval(interval);
  }, [isListening, onEyeContactSample]);

  return (
    <div className="relative min-h-[360px] w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.35)] md:min-h-[460px] xl:min-h-[520px]">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full min-h-[360px] w-full max-w-full object-cover md:min-h-[460px] xl:min-h-[520px]"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.74))]" />

      {!isCameraEnabled ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/92">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
            <Video className="h-9 w-9 text-slate-400" />
          </div>
        </div>
      ) : null}

      <div className="absolute left-4 right-4 top-4 flex min-w-0 flex-wrap gap-2">
        <Badge variant={cameraActive ? "success" : "secondary"} className="gap-2">
          <Video className="h-3.5 w-3.5" />
          {isCameraEnabled ? "Camera on" : "Camera off"}
        </Badge>
        <Badge variant="secondary" className="gap-2 border-white/10 bg-slate-950/65 text-slate-100">
          <Eye className="h-3.5 w-3.5 text-primary" />
          Eye contact {eyeContactScore.toFixed(1)}
        </Badge>
      </div>

      <div className="absolute inset-x-4 bottom-4">
        <div className="mx-auto w-full max-w-2xl rounded-xl border border-white/10 bg-slate-950/58 px-4 py-3 shadow-[0_16px_50px_rgba(2,6,23,0.28)] backdrop-blur-xl">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
                {isListening ? "Listening" : "Voice capture paused"}
              </div>
              <div className="mt-1 line-clamp-2-safe text-sm leading-6 text-slate-100">
                {transcript || "Your spoken answer appears here as live captions."}
              </div>
            </div>
            <VoiceWaveform
              active={isListening}
              tone="emerald"
              bars={10}
              className="hidden shrink-0 sm:flex"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
