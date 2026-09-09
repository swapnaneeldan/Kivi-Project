"use client";

import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePersistentState } from "@/usePersistentState";
import { captureShortcutOptions, useSettings } from "@/SettingsContext";

export type Appearance = "dark" | "light" | "system";
type RecordingTarget = "heyKivi" | "pasteKey" | null;
type TextSize = "small" | "medium" | "large";

interface SettingsModalProps {
  appearance: Appearance;
  isOpen: boolean;
  onAppearanceChange: (appearance: Appearance) => void;
  onClose: () => void;
  onReplayWelcomeDemo: () => void;
  setUserName: (name: string) => void;
  userName: string;
}

function SettingRow({ children }: { children: ReactNode }) { return <div className="kivi-settings-row">{children}</div>; }
function Label({ children }: { children: ReactNode }) { return <span className="kivi-settings-label">{children}</span>; }

function physicalKey(event: KeyboardEvent) {
  const special: Record<string, string> = { " ": "Space", Meta: "Cmd", Control: "Ctrl", Alt: "Opt", Shift: "Shift", ArrowLeft: "Left", ArrowRight: "Right", ArrowUp: "Up", ArrowDown: "Down" };
  return special[event.key] ?? (event.key.length === 1 ? event.key.toUpperCase() : event.key);
}

export function SettingsModal({ appearance, isOpen, onAppearanceChange, onClose, onReplayWelcomeDemo, setUserName, userName }: SettingsModalProps) {
  const { captureShortcut, setCaptureShortcut } = useSettings();
  const [timeout, setTimeoutValue] = usePersistentState("kivi:settings:timeout", "3 min");
  const [textSize, setTextSize] = usePersistentState<TextSize>("kivi:settings:text-size", "medium");
  const [screenContext, setScreenContext] = usePersistentState("kivi:settings:screen-context", true);
  const [heyKiviKey, setHeyKiviKey] = usePersistentState("kivi:settings:hey-kivi-key", "fn + left ^");
  const [pasteKey, setPasteKey] = usePersistentState("kivi:settings:paste-key", "Shift+Z");
  const [recordingTarget, setRecordingTarget] = useState<RecordingTarget>(null);
  const [capturedKeys, setCapturedKeys] = useState<string[]>([]);
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) modalRef.current?.scrollTo({ top: 0 });
  }, [isOpen, textSize]);

  useEffect(() => {
    if (!isOpen || !recordingTarget) return;
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const nextKey = physicalKey(event);
      setCapturedKeys((current) => {
        const next = [...current, nextKey];
        const needed = 2;
        if (next.length < needed) return next;
        const shortcut = next.slice(0, needed).join(" + ");
        if (recordingTarget === "heyKivi") setHeyKiviKey(shortcut);
        if (recordingTarget === "pasteKey") setPasteKey(shortcut);
        setRecordingTarget(null);
        return [];
      });
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen, recordingTarget, setHeyKiviKey, setPasteKey]);

  const beginRecording = (target: Exclude<RecordingTarget, null>) => {
    setCapturedKeys([]);
    if (target === "heyKivi") setHeyKiviKey("none");
    if (target === "pasteKey") setPasteKey("none");
    setRecordingTarget(target);
  };
  const resetShortcuts = () => { setCaptureShortcut("Fn"); setHeyKiviKey("fn + left ^"); setPasteKey("Shift+Z"); setCapturedKeys([]); setRecordingTarget(null); };
  const keyLabel = (target: Exclude<RecordingTarget, null>, value: string) => recordingTarget === target ? (capturedKeys.length ? `${capturedKeys.join(" + ")} + …` : "press key…") : value;

  if (!isOpen) return null;

  return <section ref={modalRef} className={`kivi-settings-modal kivi-settings-modal--${textSize}`} data-shortcut-recording={recordingTarget ? "true" : undefined} role="dialog" aria-modal="true" aria-label="Profile and system settings">
    <header><div><span className="kivi-eyebrow">Profile & settings</span><h2>your kivi</h2></div><button type="button" onClick={onClose} aria-label="Close settings"><X size={17} /></button></header>
    <section className="kivi-settings-profile"><label>your name<input value={userName} onChange={(event) => setUserName(event.target.value)} placeholder="Swapnaneel" /></label></section>
    <section className="kivi-settings-section"><h3>general</h3><div className="kivi-settings-group"><SettingRow><Label>appearance</Label><div className="kivi-settings-segmented">{(["dark", "light", "system"] as Appearance[]).map((option) => <button type="button" key={option} className={appearance === option ? "is-active" : ""} onClick={() => onAppearanceChange(option)}>{option}</button>)}</div></SettingRow><SettingRow><Label>text size</Label><div className="kivi-settings-segmented">{(["small", "medium", "large"] as TextSize[]).map((option) => <button type="button" key={option} className={textSize === option ? "is-active" : ""} onClick={() => setTextSize(option)}>{option}</button>)}</div></SettingRow><SettingRow><Label>inactivity timeout</Label><label className="kivi-settings-select"><select value={timeout} onChange={(event) => setTimeoutValue(event.target.value)}><option>1 min</option><option>3 min</option><option>5 min</option><option>Never</option></select><ChevronDown size={13} /></label></SettingRow><SettingRow><Label>welcome demo</Label><button type="button" className="kivi-settings-action" onClick={() => { onClose(); onReplayWelcomeDemo(); }}>replay</button></SettingRow></div></section>
    <section className="kivi-settings-section"><h3>keyboard shortcuts</h3><div className="kivi-settings-group"><SettingRow><Label>capture shortcut</Label><label className="kivi-settings-select kivi-settings-shortcut-select"><select value={captureShortcut} onChange={(event) => setCaptureShortcut(event.target.value as typeof captureShortcut)} aria-label="Capture shortcut">{captureShortcutOptions.map((shortcut) => <option key={shortcut}>{shortcut}</option>)}</select><ChevronDown size={13} /></label></SettingRow><SettingRow><Label>“hey kivi” mode (experimental)</Label><span className="kivi-settings-row-actions"><button type="button" className={`kivi-settings-key ${recordingTarget === "heyKivi" ? "is-recording" : ""}`} onClick={() => beginRecording("heyKivi")}>{keyLabel("heyKivi", heyKiviKey)}</button><button type="button" className="kivi-settings-action" onClick={() => beginRecording("heyKivi")}>clear</button></span></SettingRow><SettingRow><Label>cancel take</Label><small>Esc or double-tap fn</small></SettingRow><SettingRow><Label>paste last content</Label><span className="kivi-settings-row-actions"><button type="button" className={`kivi-settings-key ${recordingTarget === "pasteKey" ? "is-recording" : ""}`} onClick={() => beginRecording("pasteKey")}>{keyLabel("pasteKey", pasteKey)}</button><button type="button" className="kivi-settings-action" onClick={() => beginRecording("pasteKey")}>clear</button></span></SettingRow><SettingRow><Label>reset shortcuts</Label><button type="button" className="kivi-settings-action" onClick={resetShortcuts}>reset</button></SettingRow></div></section>
    <section className="kivi-settings-section"><h3>permissions & context</h3><div className="kivi-settings-group"><SettingRow><Label>accessibility access</Label><small className="kivi-settings-active"><Check size={14} /> active this session</small></SettingRow><SettingRow><Label>screen context</Label><button type="button" role="switch" aria-checked={screenContext} className={`kivi-settings-switch ${screenContext ? "is-active" : ""}`} onClick={() => setScreenContext((value) => !value)}><i /></button></SettingRow></div></section>
    <button type="button" className="kivi-settings-advanced" title="Available in native Kivi">Advanced settings →</button>
  </section>;
}
