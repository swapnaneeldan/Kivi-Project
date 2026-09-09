"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { LedgerRoute, TriggerPhase } from "@/data/mockData";
import type { StyleArtifact } from "@/data/styleArtifacts";
import { KiviBird } from "@/components/ledger/KiviBird";
import { KiwiHeroWidget } from "@/components/ledger/KiwiHeroWidget";
import { HeadingSwish } from "@/components/ledger/HeadingSwish";
import { contextIcons } from "@/components/ledger/contextIcons";
import { useSettings } from "@/SettingsContext";
import { sortHistoryArtifacts } from "@/data/masterHistory";
import { deduplicateByTitle } from "@/data/deduplicate";

interface LandingOverviewProps {
  artifacts: StyleArtifact[];
  onOpenHistoryArtifact: (artifactId: string) => void;
  onRouteChange: (route: LedgerRoute) => void;
  onStartCapture: () => void;
  onStopCapture: () => void;
  phase: TriggerPhase;
  wordCount: number;
}

const literaryQuotes = [
  "Memory is the diary that we all carry about with us. — Oscar Wilde, The Importance of Being Earnest",
  "Yesterday is but today's memory, and tomorrow is today's dream. — Kahlil Gibran, The Prophet",
  "But time meanwhile is flying, flying beyond recall. — Virgil, Georgics",
  "Time is a river, a violent current of events, glimpsed once and already carried past us, and another follows and is gone. — Marcus Aurelius, Meditations",
  "As if you could kill time without injuring eternity. — Henry David Thoreau, Walden",
];

export function LandingOverview({ artifacts, onOpenHistoryArtifact, onRouteChange, onStartCapture, onStopCapture, phase, wordCount }: LandingOverviewProps) {
  const { captureShortcut } = useSettings();
  const [literaryQuote, setLiteraryQuote] = useState(literaryQuotes[0]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLiteraryQuote(literaryQuotes[Math.floor(Math.random() * literaryQuotes.length)]), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Match History's default "Newest first" view exactly, including title de-duplication.
  const displayTakes = useMemo(() => sortHistoryArtifacts(deduplicateByTitle(artifacts)).slice(0, 6), [artifacts]);

  const activateCaptureBox = () => {
    if (phase === "recording") onStopCapture();
    else if (phase === "idle" || phase === "synthesized") onStartCapture();
  };
  const handleCaptureBoxKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activateCaptureBox();
  };

  return <section className="kivi-overview kivi-overview--sarvam">
    <KiviBird className="kivi-watermark" />
    <h1 className="kivi-overview__welcome kivi-heading-title"><span className="kivi-overview__welcome-copy">Welcome to Kivi<span className="kivi-title-accent">.</span><HeadingSwish /></span></h1>
    <div className="kivi-overview__title-spacer" aria-hidden="true" />
    <div className="kivi-overview__grid">
      <div className="kivi-overview__main">
        <div className={`kivi-overview__capture-box ${phase === "recording" ? "is-recording" : ""}`} role="button" tabIndex={0} onClick={activateCaptureBox} onKeyDown={handleCaptureBoxKeyDown} aria-label={phase === "recording" ? "Stop capture" : "Start capture"}>
          <div className="kivi-overview__capture-copy">
            <span className="kivi-overview__capture-kicker">Talk naturally.</span>
            {phase !== "idle" && <span className="kivi-overview__capture-status" aria-live="polite">{phase === "recording" ? <><span className="kivi-overview__capture-wave" aria-hidden="true"><i /><i /><i /><i /></span>listening… tap again to finish</> : phase === "processing" ? "finding the right Style…" : "artifact ready"}</span>}
            <p className="kivi-overview__capture-quote">{literaryQuote}</p>
          </div>
          <div className="kivi-overview__capture-meta">
            <span className="kivi-overview__synthesize-action is-quiet"><Sparkles size={13} /> Synthesize</span>
            <span className="kivi-overview__fn-hint">press <kbd>{captureShortcut}</kbd> anywhere to talk</span>
          </div>
        </div>

        <section className="kivi-overview__section kivi-overview__recent">
          <div className="kivi-overview__heading"><span className="kivi-eyebrow">recent takes</span><button type="button" onClick={() => onRouteChange("history")}>all takes →</button></div>
          <div className="kivi-overview__recent-list">{displayTakes.map((artifact) => {
            const Icon = contextIcons[artifact.mode];
            return <button type="button" key={artifact.id} onClick={() => onOpenHistoryArtifact(artifact.id)}><span className={`kivi-overview__recent-icon kivi-overview__recent-icon--${artifact.mode}`}><Icon size={15} strokeWidth={1.8} /></span><span><strong>{artifact.title}</strong><small>{artifact.destination} · {artifact.timestamp}</small></span></button>;
          })}</div>
        </section>
      </div>
      <KiwiHeroWidget wordCount={wordCount} />
    </div>
  </section>;
}
