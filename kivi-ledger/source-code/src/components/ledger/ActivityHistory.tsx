"use client";

import { ArrowUpRight, Copy, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { WorkspaceMode } from "@/data/mockData";
import type { StyleArtifact } from "@/data/styleArtifacts";
import { deduplicateByTitle } from "@/data/deduplicate";
import { sortHistoryArtifacts } from "@/data/masterHistory";
import { KiviBird } from "@/components/ledger/KiviBird";
import { HeadingSwish } from "@/components/ledger/HeadingSwish";
import { contextIcons } from "@/components/ledger/contextIcons";

interface ActivityHistoryProps {
  artifacts: StyleArtifact[];
  focusedArtifactId: string | null;
  onClearFocusedArtifact: () => void;
  onOpenArtifact: (artifactId: string) => void;
  onDeleteArtifact: (id: string) => void;
}

const modeLabels: Record<WorkspaceMode, string> = {
  utility: "Utility",
  narratives: "Narratives",
  conversations: "Conversations",
  ambient: "Memory",
};

const historyFilters: { id: "all" | WorkspaceMode; label: string }[] = [
  { id: "all", label: "All" },
  { id: "utility", label: "Utility" },
  { id: "narratives", label: "Narratives" },
  { id: "conversations", label: "Conversations" },
  { id: "ambient", label: "Memory" },
];

type HistorySort = "newest" | "oldest" | "type";

export function ActivityHistory({ artifacts, focusedArtifactId, onClearFocusedArtifact, onOpenArtifact, onDeleteArtifact }: ActivityHistoryProps) {
  const [filter, setFilter] = useState<"all" | WorkspaceMode>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<HistorySort>("newest");
  const [selected, setSelected] = useState<StyleArtifact | null>(null);
  const [copied, setCopied] = useState(false);
  const visibleArtifacts = useMemo(() => {
    const scopedArtifacts = filter === "all" ? artifacts : artifacts.filter((artifact) => artifact.mode === filter);
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = (artifact: StyleArtifact) => !normalizedQuery || [artifact.title, artifact.summary, artifact.destination, artifact.styleLabel, artifact.rawTranscript, artifact.transformedOutput].some((value) => value.toLowerCase().includes(normalizedQuery));
    const filteredArtifacts = deduplicateByTitle(scopedArtifacts).filter(matchesQuery);
    const newestFirst = sortHistoryArtifacts(filteredArtifacts);
    if (sort === "newest") return newestFirst;
    if (sort === "oldest") return [...newestFirst].reverse();
    return newestFirst.sort((left, right) => modeLabels[left.mode].localeCompare(modeLabels[right.mode]) || new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  }, [artifacts, filter, query, sort]);
  const focusedArtifact = focusedArtifactId ? artifacts.find((artifact) => artifact.id === focusedArtifactId) ?? null : null;
  const activeSelected = selected ?? focusedArtifact;
  const words = activeSelected?.rawTranscript.split(/\s+/).filter(Boolean).length ?? 0;

  const closeDrawer = () => {
    setSelected(null);
    onClearFocusedArtifact();
  };

  const copyOutput = async () => {
    if (!activeSelected) return;
    await navigator.clipboard?.writeText(activeSelected.transformedOutput);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  const deleteSelected = () => {
    if (!activeSelected) return;
    onDeleteArtifact(activeSelected.id);
    closeDrawer();
  };

  return <section className="kivi-history-page">
    <KiviBird className="kivi-watermark" />
    <header className="kivi-view-header">
      <div className="kivi-unified-header-copy"><span className="kivi-eyebrow">Library / History</span><h1 className="kivi-unified-title">Capture history<span className="kivi-title-accent">.</span><HeadingSwish /></h1><p>The canonical record of each spoken note, its chosen Style, and its exact destination.</p></div>
      <span className="kivi-phase-badge">{artifacts.length} artifacts indexed</span>
    </header>
    <div className="kivi-history-page__controls">
      <label className="kivi-history-page__search"><Search size={15} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search captures" aria-label="Search capture history" /></label>
      <label className="kivi-history-page__sort"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as HistorySort)} aria-label="Sort capture history"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="type">Type</option></select></label>
    </div>
    <div className="kivi-history-page__filters" role="group" aria-label="Filter Style history">{historyFilters.map((item) => <button type="button" key={item.id} className={filter === item.id ? `is-active is-active--${item.id}` : ""} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div>
    <div className="kivi-history-page__list">{visibleArtifacts.map((artifact) => {
      const Icon = contextIcons[artifact.mode];
      return <button key={artifact.id} type="button" onClick={() => { onClearFocusedArtifact(); setSelected(artifact); setCopied(false); }}>
        <span className={`kivi-history-page__icon kivi-history-page__icon--${artifact.mode}`}><Icon size={16} /></span>
        <span className="kivi-history-page__content"><small>{modeLabels[artifact.mode]} · {artifact.styleLabel} · {artifact.timestamp}</small><strong>{artifact.title}</strong><em>{artifact.summary}</em></span>
        <span className="kivi-history-page__duration">{artifact.duration}</span><ArrowUpRight size={16} />
      </button>;
    })}</div>
    {activeSelected && typeof document !== "undefined" && createPortal(<div className="kivi-history-drawer__backdrop" role="presentation" onMouseDown={closeDrawer}>
      <aside className="kivi-history-drawer fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto" style={{ bottom: 0, position: "fixed", right: 0, top: 0 }} role="dialog" aria-modal="true" aria-label={`${activeSelected.title} details`} onMouseDown={(event) => event.stopPropagation()}>
        <header><div><span className={`kivi-history-drawer__tag kivi-history-drawer__tag--${activeSelected.mode}`}>{modeLabels[activeSelected.mode]} Style</span><small>{activeSelected.timestamp} · {activeSelected.duration} · {words} words</small><h2>{activeSelected.title}</h2></div><button type="button" onClick={closeDrawer} aria-label="Close capture details"><X size={17} /></button></header>
        <div className="kivi-history-drawer__body"><section><span className="kivi-eyebrow">Captured voice note</span><p>{activeSelected.rawTranscript}</p></section><section><span className="kivi-eyebrow">Transformed output · {activeSelected.styleLabel}</span><pre>{activeSelected.transformedOutput}</pre></section></div>
        <footer><button type="button" className="kivi-history-drawer__icon-action" onClick={copyOutput} aria-label={copied ? "Copied output" : "Copy output"} title={copied ? "Copied" : "Copy output"}>{copied ? <Copy size={15} /> : <Copy size={15} />}</button><button type="button" className="kivi-history-drawer__icon-action" onClick={() => { onOpenArtifact(activeSelected.id); setSelected(null); }} aria-label={`Open exact ${activeSelected.destination} artifact`} title="Open exact Style"><ArrowUpRight size={15} /></button><button type="button" className="kivi-history-drawer__icon-action" onClick={deleteSelected} aria-label="Delete artifact" title="Delete artifact"><Trash2 size={15} /></button></footer>
      </aside>
    </div>, document.body)}
  </section>;
}
