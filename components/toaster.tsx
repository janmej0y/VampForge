"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ToastVariant = "success" | "error" | "info";

type ToastPayload = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastItem = Required<ToastPayload> & {
  id: string;
};

const TOAST_EVENT = "vampforge:toast";

export function showToast(payload: ToastPayload) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<ToastPayload>(TOAST_EVENT, {
      detail: {
        variant: "info",
        description: "",
        ...payload,
      },
    })
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastPayload>).detail;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const nextToast: ToastItem = {
        id,
        title: detail.title,
        description: detail.description ?? "",
        variant: detail.variant ?? "info",
      };

      setToasts((current) => [nextToast, ...current].slice(0, 4));
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 4200);
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-4 z-[90] grid w-[min(24rem,calc(100vw-2rem))] gap-3">
      {toasts.map((toast) => {
        const Icon =
          toast.variant === "success"
            ? CheckCircle2
            : toast.variant === "error"
              ? AlertCircle
              : Info;
        const tone =
          toast.variant === "success"
            ? "border-emerald-300/25 bg-emerald-50 text-emerald-950"
            : toast.variant === "error"
              ? "border-rose-300/25 bg-rose-50 text-rose-950"
              : "border-sky-300/25 bg-sky-50 text-sky-950";

        return (
          <div
            key={toast.id}
            className={`rounded-2xl border p-4 shadow-[0_20px_60px_rgba(15,23,42,0.16)] ${tone}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{toast.title}</div>
                {toast.description ? (
                  <div className="mt-1 text-sm leading-5 opacity-80">
                    {toast.description}
                  </div>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-current hover:bg-black/5"
                onClick={() =>
                  setToasts((current) =>
                    current.filter((item) => item.id !== toast.id)
                  )
                }
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
