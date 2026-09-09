"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePersistentState } from "@/usePersistentState";

export const captureShortcutOptions = ["Fn", "Option + Space", "Cmd + K", "Ctrl + K"] as const;
export type CaptureShortcut = (typeof captureShortcutOptions)[number];

interface SettingsContextValue {
  captureShortcut: CaptureShortcut;
  setCaptureShortcut: (shortcut: CaptureShortcut) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [captureShortcut, setCaptureShortcut] = usePersistentState<CaptureShortcut>("kivi:settings:capture-shortcut", "Fn");
  return <SettingsContext.Provider value={{ captureShortcut, setCaptureShortcut }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error("useSettings must be used inside SettingsProvider");
  return settings;
}
