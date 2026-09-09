"use client";

import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useState } from "react";
import type { StyleArtifact } from "@/data/styleArtifacts";

export function StyleArtifactFocus({ artifact }: { artifact: StyleArtifact }) {
  const [copied, setCopied] = useState(false);
  const copyOutput = async () => {
    await navigator.clipboard?.writeText(artifact.transformedOutput);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return <article className="kivi-style-artifact-focus" aria-label={`Captured artifact: ${artifact.title}`}>
    <header><span className="kivi-eyebrow">Captured Style artifact</span><span>{artifact.destination} · {artifact.styleLabel} · {artifact.timestamp}</span></header>
    <div><section><small>Raw transcript</small><p>{artifact.rawTranscript}</p></section><ArrowUpRight size={16} aria-hidden="true" /><section><small>Transformed output</small><p>{artifact.transformedOutput}</p></section></div>
    <button type="button" className={copied ? "kivi-inline-artifact-copy is-copied" : "kivi-inline-artifact-copy"} onClick={copyOutput} aria-label={copied ? "Copied output" : "Copy output"} data-tooltip={copied ? "Copied ✓" : "Copy output"}>{copied ? <Check size={13} /> : <Copy size={13} />}<span>{copied ? "Copied" : "Copy output"}</span></button>
  </article>;
}
