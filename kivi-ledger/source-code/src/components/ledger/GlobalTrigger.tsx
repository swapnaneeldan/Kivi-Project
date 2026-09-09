"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, LoaderCircle, Mic, Square } from "lucide-react";
import { useState } from "react";
import type { TriggerPhase } from "@/data/mockData";
import type { StyleArtifact } from "@/data/styleArtifacts";
import { useSettings } from "@/SettingsContext";

interface GlobalTriggerProps {
  phase: TriggerPhase;
  activeContext: string;
  elapsedSeconds: number;
  artifact: StyleArtifact | null;
  onStart: () => void;
  onStop: () => void;
}

const waveform = [18, 35, 55, 30, 68, 42, 78, 38, 60, 28, 49, 72, 38, 57, 31, 65];

function formatDuration(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function GlobalTrigger({ phase, activeContext, elapsedSeconds, artifact, onStart, onStop }: GlobalTriggerProps) {
  const { captureShortcut } = useSettings();
  const [copied, setCopied] = useState(false);
  const recording = phase === "recording";
  const processing = phase === "processing";
  const ready = phase === "synthesized";
  const copyArtifact = async () => {
    if (!artifact) return;
    await navigator.clipboard?.writeText(artifact.transformedOutput);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={`kivi-trigger kivi-trigger--${phase}`} aria-label="Global voice capture">
      <div className="kivi-trigger__surface">
        <motion.span
          className="kivi-trigger__icon"
          animate={recording ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 1.3, repeat: recording ? Infinity : 0 }}
        >
          {recording ? <Square size={13} fill="currentColor" /> : processing ? <LoaderCircle className="kivi-spin" size={17} /> : ready ? <Check size={17} strokeWidth={2.2} /> : <Mic size={17} />}
        </motion.span>

        <div className="kivi-trigger__copy">
          <span className="kivi-status-dot" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.strong key={phase} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16 }}>
              {phase === "idle" && `Press ${captureShortcut} anywhere to speak`}
              {recording && `Listening · ${formatDuration(elapsedSeconds)}`}
              {processing && "Finding the signal"}
              {ready && "Artifact ready"}
            </motion.strong>
          </AnimatePresence>
          <small>{activeContext}</small>
        </div>

        <div className="kivi-trigger__waveform" aria-hidden="true">
          {waveform.map((height, index) => (
            <motion.i
              key={`${height}-${index}`}
              style={{ height: `${height}%` }}
              animate={recording ? { scaleY: [0.34, 1, 0.48, 0.82, 0.34] } : processing ? { scaleY: [0.32, 0.7, 0.32] } : { scaleY: 0.25 }}
              transition={{ duration: 0.72 + (index % 4) * 0.09, delay: index * 0.025, repeat: recording || processing ? Infinity : 0, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="kivi-trigger__actions">
          {phase === "idle" && <button type="button" onClick={onStart} aria-label="Start capture"><Mic size={15} /> Start capture</button>}
          {recording && <button type="button" className="is-recording" onClick={onStop} aria-label="Stop capture"><Square size={11} fill="currentColor" /> Stop capture</button>}
          {processing && <span>Processing</span>}
          {ready && artifact && <button type="button" className={copied ? "kivi-trigger__copy is-copied" : "kivi-trigger__copy"} onClick={copyArtifact} aria-label={copied ? "Copied" : "Copy artifact"} data-tooltip={copied ? "Copied ✓" : "Copy artifact"}>{copied ? <Check size={13} /> : <Copy size={13} />}</button>}
        </div>
      </div>
    </section>
  );
}
