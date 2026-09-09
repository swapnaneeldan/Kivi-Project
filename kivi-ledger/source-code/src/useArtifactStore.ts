"use client";

import { useCallback, useEffect, useMemo } from "react";
import { masterHistoryArtifacts, sortHistoryArtifacts } from "@/data/masterHistory";
import { seedStyleArtifacts, type StyleArtifact } from "@/data/styleArtifacts";
import { usePersistentState } from "@/usePersistentState";

export interface NormalizedArtifact extends StyleArtifact {
  /** Canonical output field; transformedOutput remains for existing view compatibility. */
  output: string;
}

const keyFor = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();
const contentKeyFor = (artifact: Pick<StyleArtifact, "title" | "rawTranscript">) => `${keyFor(artifact.title)}::${keyFor(artifact.rawTranscript)}`;

export function normalizeArtifact(artifact: StyleArtifact | NormalizedArtifact): NormalizedArtifact {
  const output = "output" in artifact && artifact.output ? artifact.output : artifact.transformedOutput;
  return { ...artifact, output, transformedOutput: output };
}

/** Removes legacy generator scaffolding from persisted artifacts without removing the artifact itself. */
function cleanLegacyGeneratorCopy(artifact: NormalizedArtifact): NormalizedArtifact {
  const clean = (value: string) => value
    .replace(/\s+—\s*follow-up\s+\d+$/i, "")
    .replace(/\s*One more note from this capture: keep the unfinished detail available for the next pass\.?/i, "")
    .replace(/\n\nFollow-up capture\s+\d+:\s*the source thought remains linked to this new artifact\.?/i, "")
    .replace(/\s*This follow-up preserves a distinct captured continuation rather than replacing the earlier entry\.?/i, "")
    .trim();
  const rawTranscript = clean(artifact.rawTranscript);
  const transformedOutput = clean(artifact.transformedOutput);
  return { ...artifact, title: clean(artifact.title), rawTranscript, transformedOutput, output: transformedOutput, summary: clean(artifact.summary) };
}

/** Keeps seeded records unique while allowing a new capture to remain a distinct event. */
export function deduplicateArtifacts(items: Array<StyleArtifact | NormalizedArtifact>) {
  const ids = new Set<string>();
  const titles = new Set<string>();
  const payloads = new Set<string>();
  return items.reduce<NormalizedArtifact[]>((result, item) => {
    const normalized = normalizeArtifact(item);
    const title = keyFor(normalized.title);
    const payload = contentKeyFor(normalized);
    const isNewCapture = normalized.id.startsWith("artifact-capture-");
    if (ids.has(normalized.id) || (!isNewCapture && (titles.has(title) || payloads.has(payload)))) return result;
    ids.add(normalized.id);
    titles.add(title);
    payloads.add(payload);
    result.push(normalized);
    return result;
  }, []);
}

const baseArtifacts = deduplicateArtifacts([...masterHistoryArtifacts, ...seedStyleArtifacts]);
const baselineArtifactIds = new Set(baseArtifacts.map((artifact) => artifact.id));
const isRetiredMockArtifact = (artifact: NormalizedArtifact) => /\bnayak\b|\barindam\b|\buttam kumar\b/i.test([artifact.title, artifact.summary, artifact.rawTranscript, artifact.transformedOutput].join(" "));

export function useArtifactStore() {
  const [storedArtifacts, setStoredArtifacts, isHydrated] = usePersistentState<NormalizedArtifact[]>("kivi:artifacts:normalized", baseArtifacts, deduplicateArtifacts);
  const [deletedArtifactIds, setDeletedArtifactIds] = usePersistentState<string[]>("kivi:artifacts:deleted", []);

  // Preserve captures created before the normalized store was introduced.
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const legacy = JSON.parse(window.localStorage.getItem("kivi:artifacts") ?? "[]") as StyleArtifact[];
      if (legacy.length) setStoredArtifacts((current) => deduplicateArtifacts([...legacy, ...current]));
    } catch {
      // Old malformed prototype data should never prevent startup.
    }
  }, [isHydrated, setStoredArtifacts]);

  // Baseline records are refreshed from their sources after a prototype update;
  // user-created captures keep their identity and remain untouched.
  useEffect(() => {
    if (!isHydrated) return;
    setStoredArtifacts((current) => deduplicateArtifacts([
      ...baseArtifacts,
      ...current.filter((artifact) => !baselineArtifactIds.has(artifact.id) && !isRetiredMockArtifact(artifact)),
    ]));
  }, [isHydrated, setStoredArtifacts]);

  // Remove the old generated variants from local prototype storage. Their
  // synthetic labels did not add a credible record.
  useEffect(() => {
    if (!isHydrated) return;
    setStoredArtifacts((current) => current.filter((artifact) => artifact.sourcePayloadId?.includes(":variant:") ? !/—\s*later return$/i.test(artifact.title) : true));
  }, [isHydrated, setStoredArtifacts]);

  const artifacts = useMemo(
    () => sortHistoryArtifacts(storedArtifacts.filter((artifact) => !deletedArtifactIds.includes(artifact.id)))
      .map((artifact) => cleanLegacyGeneratorCopy(normalizeArtifact(artifact))),
    [deletedArtifactIds, storedArtifacts],
  );

  const addArtifact = useCallback((artifact: StyleArtifact) => {
    setStoredArtifacts((current) => deduplicateArtifacts([artifact, ...current]));
  }, [setStoredArtifacts]);

  const deleteArtifact = useCallback((id: string) => {
    setDeletedArtifactIds((current) => current.includes(id) ? current : [...current, id]);
    setStoredArtifacts((current) => current.filter((artifact) => artifact.id !== id));
  }, [setDeletedArtifactIds, setStoredArtifacts]);

  const hasMatchingContent = useCallback((candidate: Pick<StyleArtifact, "title" | "rawTranscript">) => {
    const candidateTitle = keyFor(candidate.title);
    const candidatePayload = contentKeyFor(candidate);
    return artifacts.some((artifact) => keyFor(artifact.title) === candidateTitle || contentKeyFor(artifact) === candidatePayload);
  }, [artifacts]);

  return { artifacts, addArtifact, deleteArtifact, deletedArtifactIds, hasMatchingContent, isHydrated };
}
