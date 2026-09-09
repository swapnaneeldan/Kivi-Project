"use client";

import { useEffect } from "react";
import type { CaptureShortcut } from "@/SettingsContext";

interface UseCaptureShortcutOptions {
  shortcut: CaptureShortcut;
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}

function matchesShortcut(event: KeyboardEvent, shortcut: CaptureShortcut) {
  if (shortcut === "Fn") return event.key === "Fn" || event.code === "Fn";
  if (shortcut === "Option + Space") return event.altKey && !event.metaKey && !event.ctrlKey && (event.key === " " || event.code === "Space");
  if (shortcut === "Cmd + K") return event.metaKey && !event.ctrlKey && event.key.toLowerCase() === "k";
  return event.ctrlKey && !event.metaKey && event.key.toLowerCase() === "k";
}

/** Toggles the shared capture state using the shortcut selected in Settings. */
export function useCaptureShortcut({ shortcut, isRecording, onStart, onStop }: UseCaptureShortcutOptions) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector("[data-shortcut-recording='true']") || event.repeat || !matchesShortcut(event, shortcut)) return;
      event.preventDefault();
      if (isRecording) onStop();
      else onStart();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isRecording, onStart, onStop, shortcut]);
}
