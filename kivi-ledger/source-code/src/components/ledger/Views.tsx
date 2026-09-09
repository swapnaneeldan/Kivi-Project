"use client";

import {
  ArrowLeft,
  Check,
  Copy,
  Pause,
  Play,
  Mic,
  Search,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { type TriggerPhase, type WorkspaceMode } from "@/data/mockData";
import { parseRawTranscriptToTurns, type StyleArtifact } from "@/data/styleArtifacts";
import { ambientMemoryData, conversationData, narrationData, type AmbientMemoryRecord } from "@/mock/kiviData";
import { deduplicateByTitle } from "@/data/deduplicate";
import { UtilityView, type UtilityContextId, type UtilityStyleCategory, type UtilityStylePreferences } from "@/components/ledger/UtilityView";
import { KiviBird } from "@/components/ledger/KiviBird";
import { HeadingSwish } from "@/components/ledger/HeadingSwish";
import { useSettings } from "@/SettingsContext";

interface ViewsProps {
  activeMode: WorkspaceMode;
  artifacts: StyleArtifact[];
  focusedArtifact: StyleArtifact | null;
  onStartCapture: () => void;
  onStopCapture: () => void;
  phase: TriggerPhase;
  stylePreferences: UtilityStylePreferences;
  onStylePreferenceChange: (category: UtilityStyleCategory, styleId: string) => void;
  onUtilityContextChange: (context: UtilityContextId) => void;
  onDeleteArtifact: (id: string) => void;
  deletedArtifactIds: string[];
  onClearFocusedArtifact: () => void;
}

function ArtifactCopyButton({ artifact }: { artifact: StyleArtifact }) {
  return <CopyIconButton text={artifact.transformedOutput} />;
}

function DeleteArtifactButton({ label, onDelete }: { label: string; onDelete: () => void }) {
  return <button type="button" className="kivi-inline-artifact-delete" onClick={(event) => { event.stopPropagation(); onDelete(); }} aria-label={`Delete ${label}`} title="Delete"><Trash2 size={13} /></button>;
}

const narrativeArtifactId = (id: string) => `history:narratives:${id}`;
const conversationArtifactId = (id: string) => `history:conversations:${id}`;
const memoryArtifactId = (id: string) => `history:memory:${id}`;

function artifactsForMode(artifacts: StyleArtifact[], mode: StyleArtifact["mode"], baselineTitles: string[] = []) {
  const claimedTitles = new Set(baselineTitles);
  return deduplicateByTitle(artifacts.filter((artifact) => artifact.mode === mode)).filter((artifact) => !claimedTitles.has(artifact.title));
}

function artifactConversationTurns(artifact: StyleArtifact) {
  const aliases: Record<string, string> = { Aaditya: "Kshatriya", Maya: "Vibhav" };
  const sourceTurns = artifact.turns ?? artifact.speakerTurns?.map((turn) => ({ speakerId: "", speakerName: turn.speaker, text: turn.utterance, timeRange: `${turn.timestamp}–${turn.endTimestamp}`, tag: turn.topic.toUpperCase() })) ?? parseRawTranscriptToTurns(artifact.rawTranscript);
  const idsBySpeaker = new Map<string, string>();
  return sourceTurns.map((turn) => {
    const speakerName = aliases[turn.speakerName] ?? turn.speakerName;
    const speakerId = idsBySpeaker.get(speakerName) ?? String(idsBySpeaker.size + 1).padStart(2, "0");
    idsBySpeaker.set(speakerName, speakerId);
    return { ...turn, speakerName, speakerId };
  });
}

function conversationSpeakerCount(artifact: StyleArtifact) {
  const turns = artifactConversationTurns(artifact);
  return new Set(turns.map((turn) => turn.speakerName)).size;
}

function CopyIconButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copyArtifact = async (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return <button type="button" className={copied ? "kivi-inline-artifact-copy is-copied" : "kivi-inline-artifact-copy"} onClick={copyArtifact} aria-label={copied ? "Copied" : "Copy artifact"} data-tooltip={copied ? "Copied ✓" : "Copy artifact"}>{copied ? <Check size={13} /> : <Copy size={13} />}</button>;
}

function ViewHeader({ eyebrow, title, description, phase, onStartCapture, onStopCapture }: { eyebrow: string; title: string; description?: string; phase: TriggerPhase; onStartCapture: () => void; onStopCapture: () => void }) {
  const { captureShortcut } = useSettings();
  return (
    <header className="kivi-view-header">
      <div className="kivi-unified-header-copy"><span className="kivi-eyebrow">{eyebrow}</span><h1 className="kivi-unified-title">{title}<span className="kivi-title-accent">.</span><HeadingSwish /></h1>{description && <p>{description}</p>}</div>
      <div className="kivi-view-header__actions"><small className="kivi-view-header__shortcut">{captureShortcut}</small><button type="button" className={`kivi-view-header__mic ${phase === "recording" ? "is-recording" : ""}`} onClick={phase === "recording" ? onStopCapture : onStartCapture} disabled={phase === "processing"} aria-label={phase === "recording" ? "Stop capture" : "Start capture"}>{phase === "recording" ? <Square size={12} fill="currentColor" /> : <Mic size={14} />}</button></div>
    </header>
  );
}

type NarrativeFormat = "Article" | "Summary" | "Transcript";

function ConversationDirectoryCard({ title, summary, speakerCount, timestamp, copyText, onOpen, onDelete }: { title: string; summary: string; speakerCount: string; timestamp: string; copyText: string; onOpen: () => void; onDelete: () => void }) {
  return <article className="kivi-conversation-card" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(); } }}><span className="kivi-conversation-directory__count">{speakerCount}</span><h2>{title}</h2><p>{summary}</p><footer><span>{timestamp}</span><div><CopyIconButton text={copyText} /><DeleteArtifactButton label={title} onDelete={onDelete} /></div></footer></article>;
}

function CapturedConversationDetail({ artifact, phase, onBack, onStartCapture, onStopCapture, onDeleteArtifact }: { artifact: StyleArtifact; phase: TriggerPhase; onBack: () => void; onStartCapture: () => void; onStopCapture: () => void; onDeleteArtifact: (id: string) => void }) {
  const [speakerFilter, setSpeakerFilter] = useState("all");
  const [playing, setPlaying] = useState(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);
  const turns = artifactConversationTurns(artifact);
  const speakers = [...new Map(turns.map((turn) => [turn.speakerId, turn])).values()];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActiveTurnIndex((index) => {
      if (index >= turns.length - 1) { setPlaying(false); return 0; }
      return index + 1;
    }), 1100);
    return () => window.clearInterval(timer);
  }, [playing, turns.length]);

  return <section className="kivi-view kivi-view--conversations">
    <button type="button" className="kivi-conversation-back" onClick={onBack}><ArrowLeft size={15} /> Back to Conversations</button>
    <ViewHeader eyebrow="Styles / Conversations" title="Follow who moved the room" description="Speaker-aware turns turn a recording into a navigable decision trail." phase={phase} onStartCapture={onStartCapture} onStopCapture={onStopCapture} />
    <div className="kivi-conversation-banner"><div><span>{artifact.timestamp} · {artifact.duration}</span><h2>{artifact.title}</h2><p>{artifact.summary}</p></div><div><ArtifactCopyButton artifact={artifact} /><DeleteArtifactButton label={artifact.title} onDelete={() => { onDeleteArtifact(artifact.id); onBack(); }} /><button type="button" onClick={() => { setActiveTurnIndex(0); setPlaying((value) => !value); }}>{playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}{playing ? "Pause timeline" : "Play timeline"}</button></div></div>
    <div className="kivi-speaker-filter"><span>Filter speakers</span><button type="button" className={speakerFilter === "all" ? "is-active" : ""} onClick={() => setSpeakerFilter("all")}>All turns</button>{speakers.map((speaker, index) => <button type="button" key={speaker.speakerId} className={`kivi-speaker-filter__speaker kivi-speaker-filter__speaker--${["emerald", "sky", "violet", "orange"][index % 4]} ${speakerFilter === speaker.speakerId ? "is-active" : ""}`} onClick={() => setSpeakerFilter(speaker.speakerId)}><i>{speaker.speakerId}</i>{speaker.speakerName}</button>)}</div>
    <div className="kivi-conversation-timeline">{turns.map((turn) => { const speakerIndex = speakers.findIndex((speaker) => speaker.speakerId === turn.speakerId); const color = ["emerald", "sky", "violet", "orange"][speakerIndex % 4]; const actualIndex = turns.indexOf(turn); const isSpeakerMatch = speakerFilter === turn.speakerId; return <article key={`${turn.timeRange}-${turn.speakerId}`} className={`kivi-turn kivi-captured-turn kivi-turn--${color} ${speakerFilter !== "all" && !isSpeakerMatch ? "is-dimmed" : ""} ${isSpeakerMatch ? "is-speaker-match" : ""} ${playing && actualIndex === activeTurnIndex ? "is-playing" : ""}`}><span className="kivi-turn__avatar">{turn.speakerId}</span><div><header><strong>Speaker {turn.speakerId}<small>{turn.speakerName}</small></strong><time>{turn.timeRange}</time></header><p>{turn.text}</p></div></article>; })}</div>
  </section>;
}

function NarrativeView({ artifacts, phase, focusedArtifact, onStartCapture, onStopCapture, onDeleteArtifact, deletedArtifactIds, onClearFocusedArtifact }: { artifacts: StyleArtifact[]; phase: TriggerPhase; focusedArtifact: StyleArtifact | null; onStartCapture: () => void; onStopCapture: () => void; onDeleteArtifact: (id: string) => void; deletedArtifactIds: string[]; onClearFocusedArtifact: () => void }) {
  const [format, setFormat] = useState<NarrativeFormat>("Article");
  const [activeNarrativeId, setActiveNarrativeId] = useState(narrationData[0].id);
  const [activeCapturedArtifact, setActiveCapturedArtifact] = useState<StyleArtifact | null>(null);
  const availableNarratives = narrationData.filter((item) => !deletedArtifactIds.includes(narrativeArtifactId(item.id)));
  const capturedNarratives = artifactsForMode(artifacts, "narratives", availableNarratives.map((item) => item.title));
  const focusedNarrative = focusedArtifact?.mode === "narratives" ? availableNarratives.find((item) => narrativeArtifactId(item.id) === focusedArtifact.id) ?? null : null;
  const focusedCapturedArtifact = focusedArtifact?.mode === "narratives" && !focusedNarrative ? artifacts.find((artifact) => artifact.id === focusedArtifact.id) ?? null : null;
  const narrative = focusedNarrative ?? availableNarratives.find((item) => item.id === activeNarrativeId) ?? availableNarratives[0] ?? null;
  const displayedCapturedArtifact = focusedCapturedArtifact ?? (activeCapturedArtifact && artifacts.some((artifact) => artifact.id === activeCapturedArtifact.id) ? activeCapturedArtifact : null);
  const activeNarrativeOutput = displayedCapturedArtifact ? displayedCapturedArtifact.transformedOutput : narrative ? `${narrative.article.headline}\n\n${narrative.article.dek}\n\n${narrative.article.sections.map((section) => section.body).join("\n\n")}` : "";
  const deleteActiveNarrative = () => {
    const id = displayedCapturedArtifact?.id ?? (narrative ? narrativeArtifactId(narrative.id) : null);
    if (!id) return;
    onDeleteArtifact(id);
    setActiveCapturedArtifact(null);
    setActiveNarrativeId(availableNarratives.find((item) => narrativeArtifactId(item.id) !== id)?.id ?? "");
  };

  return (
    <section className="kivi-view kivi-view--narratives">
      <KiviBird className="kivi-watermark" />
      <ViewHeader eyebrow="Styles / Narratives" title="The spoken draft, editorially resolved" description="A raw thought and its reader-ready artifact, kept together." phase={phase} onStartCapture={onStartCapture} onStopCapture={onStopCapture} />
      <div className="kivi-narrative-toolbar">
        <span>{displayedCapturedArtifact?.title ?? narrative?.title ?? "No transcripts remaining"} <i>·</i> {displayedCapturedArtifact?.duration ?? narrative?.duration ?? ""}</span>
        <div><label>Format <select value={format} onChange={(event) => setFormat(event.target.value as NarrativeFormat)}><option>Article</option><option>Summary</option><option>Transcript</option></select></label></div>
      </div>
      <div className="kivi-narrative-layout">
        <article className="kivi-transcript-panel"><header><span>RAW AUDIO TRANSCRIPTS</span><small>{availableNarratives.length + capturedNarratives.length} text entries</small></header><div className="kivi-transcript-panel__feed">{capturedNarratives.map((artifact) => <article className={displayedCapturedArtifact?.id === artifact.id ? "kivi-captured-feed-item is-active" : "kivi-captured-feed-item"} key={artifact.id}><button type="button" onClick={() => { onClearFocusedArtifact(); setActiveCapturedArtifact(artifact); }}><strong>{artifact.title}</strong><span>{artifact.timestamp} <i>·</i> {artifact.duration}</span></button><ArtifactCopyButton artifact={artifact} /></article>)}{availableNarratives.map((item) => <article className={!displayedCapturedArtifact && item.id === narrative?.id ? "kivi-captured-feed-item is-active" : "kivi-captured-feed-item"} key={item.id}><button type="button" onClick={() => { onClearFocusedArtifact(); setActiveNarrativeId(item.id); setActiveCapturedArtifact(null); }}><strong>{item.title}</strong><span>{item.recordedAt} <i>·</i> {item.duration}</span></button><CopyIconButton text={`${item.article.headline}\n\n${item.article.dek}\n\n${item.article.sections.map((section) => section.body).join("\n\n")}`} /></article>)}</div></article>
        <article className="kivi-reader-panel"><header><span>{format.toUpperCase()}</span><div className="kivi-reader-panel__actions"><small>{displayedCapturedArtifact ? displayedCapturedArtifact.styleLabel : narrative?.article.readTime ?? ""}</small>{activeNarrativeOutput && <CopyIconButton text={activeNarrativeOutput} />}{(displayedCapturedArtifact || narrative) && <DeleteArtifactButton label={displayedCapturedArtifact?.title ?? narrative?.title ?? "artifact"} onDelete={deleteActiveNarrative} />}</div></header><div className="kivi-reader-panel__content">{displayedCapturedArtifact ? format === "Transcript" ? <div className="kivi-reader-panel__notes"><p>{displayedCapturedArtifact.rawTranscript}</p></div> : format === "Summary" ? <><h2>{displayedCapturedArtifact.title}</h2><p className="kivi-reader-panel__dek">{displayedCapturedArtifact.summary}</p><div className="kivi-reader-panel__body"><section><h3>Resolved summary</h3><p>{displayedCapturedArtifact.transformedOutput}</p></section></div></> : <><h2>{displayedCapturedArtifact.title}</h2><p className="kivi-reader-panel__dek">{displayedCapturedArtifact.summary}</p><div className="kivi-reader-panel__body">{displayedCapturedArtifact.sections?.length ? displayedCapturedArtifact.sections.map((section) => <section key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>) : <section><h3>Resolved artifact</h3><p>{displayedCapturedArtifact.transformedOutput}</p></section>}</div></> : narrative ? format === "Transcript" ? <div className="kivi-reader-panel__notes">{narrative.transcript.map((line) => <p key={line.id}>{line.text}</p>)}</div> : <><h2>{format === "Summary" ? narrative.article.dek : narrative.article.headline}</h2>{format === "Article" && <p className="kivi-reader-panel__dek">{narrative.article.dek}</p>}<div className="kivi-reader-panel__body">{(format === "Summary" ? narrative.article.sections.slice(0, 1) : narrative.article.sections).map((section) => <section key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>)}</div></> : <p className="kivi-reader-panel__dek">No transcripts remain in this Style.</p>}</div></article>
      </div>
    </section>
  );
}

function ConversationView({ artifacts, phase, focusedArtifact, onStartCapture, onStopCapture, onDeleteArtifact, deletedArtifactIds, onClearFocusedArtifact }: { artifacts: StyleArtifact[]; phase: TriggerPhase; focusedArtifact: StyleArtifact | null; onStartCapture: () => void; onStopCapture: () => void; onDeleteArtifact: (id: string) => void; deletedArtifactIds: string[]; onClearFocusedArtifact: () => void }) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedCapturedConversation, setSelectedCapturedConversation] = useState<StyleArtifact | null>(null);
  const [speakerFilter, setSpeakerFilter] = useState<"all" | string>("all");
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const availableConversations = conversationData.filter((item) => !deletedArtifactIds.includes(conversationArtifactId(item.id)));
  const activeConversation = activeConversationId && !deletedArtifactIds.includes(conversationArtifactId(activeConversationId)) ? activeConversationId : null;
  const capturedConversations = artifactsForMode(artifacts, "conversations", availableConversations.map((item) => item.title));
  const focusedConversation = focusedArtifact?.mode === "conversations" ? availableConversations.find((item) => conversationArtifactId(item.id) === focusedArtifact.id) ?? null : null;
  const focusedCapturedConversation = focusedArtifact?.mode === "conversations" && !focusedConversation ? artifacts.find((artifact) => artifact.id === focusedArtifact.id) ?? null : null;
  const conversation = focusedConversation ?? availableConversations.find((item) => item.id === activeConversation) ?? null;
  const displayedCapturedConversation = focusedCapturedConversation ?? (selectedCapturedConversation && artifacts.some((artifact) => artifact.id === selectedCapturedConversation.id) ? selectedCapturedConversation : null);
  const isFiltered = speakerFilter !== "all";
  const timelinePlaying = playing && elapsed < 100;

  useEffect(() => {
    if (!timelinePlaying || !conversation) return;
    const timer = window.setInterval(() => setElapsed((value) => Math.min(value + 2, 100)), 650);
    return () => window.clearInterval(timer);
  }, [timelinePlaying, conversation]);

  if (displayedCapturedConversation) return <CapturedConversationDetail artifact={displayedCapturedConversation} phase={phase} onBack={() => { onClearFocusedArtifact(); setSelectedCapturedConversation(null); }} onStartCapture={onStartCapture} onStopCapture={onStopCapture} onDeleteArtifact={onDeleteArtifact} />;

  if (!conversation) return (
    <section className="kivi-view kivi-view--conversations">
      <ViewHeader eyebrow="Styles / Conversations" title="Conversations, kept together" description="Choose a recorded thread to follow its speakers, turns, and decisions." phase={phase} onStartCapture={onStartCapture} onStopCapture={onStopCapture} />
      <div className="kivi-conversation-directory__heading"><span>THREAD DIRECTORY</span><small>{availableConversations.length + capturedConversations.length} recorded threads</small></div>
      <div className="kivi-conversation-directory">
        {capturedConversations.map((artifact) => <ConversationDirectoryCard key={artifact.id} title={artifact.title} summary={artifact.summary} speakerCount={`${conversationSpeakerCount(artifact)} speakers`} timestamp={artifact.timestamp} copyText={artifact.transformedOutput} onOpen={() => { onClearFocusedArtifact(); setSelectedCapturedConversation(artifact); }} onDelete={() => { onClearFocusedArtifact(); onDeleteArtifact(artifact.id); }} />)}
        {availableConversations.map((item) => <ConversationDirectoryCard key={item.id} title={item.title} summary={item.summary} speakerCount={`${item.speakers.length} speakers`} timestamp={item.date} copyText={item.dialogue_transcript.map((turn) => `${turn.speaker}: ${turn.utterance}`).join("\n\n")} onOpen={() => { onClearFocusedArtifact(); setSelectedCapturedConversation(null); setActiveConversationId(item.id); setSpeakerFilter("all"); setPlaying(false); setElapsed(0); }} onDelete={() => { onClearFocusedArtifact(); onDeleteArtifact(conversationArtifactId(item.id)); }} />)}
      </div>
    </section>
  );

  return (
    <section className="kivi-view kivi-view--conversations">
      <button type="button" className="kivi-conversation-back" onClick={() => { setActiveConversationId(null); setSpeakerFilter("all"); setPlaying(false); setElapsed(0); }}><ArrowLeft size={15} /> Back to Conversations</button>
      <ViewHeader eyebrow="Styles / Conversations" title="Follow who moved the room" description="Speaker-aware turns turn a recording into a navigable decision trail." phase={phase} onStartCapture={onStartCapture} onStopCapture={onStopCapture} />
      <div className="kivi-conversation-banner"><div><span>{conversation.date} · {conversation.duration}</span><h2>{conversation.title}</h2><p>{conversation.summary}</p></div><div><DeleteArtifactButton label={conversation.title} onDelete={() => { onDeleteArtifact(conversationArtifactId(conversation.id)); setActiveConversationId(null); }} /><button type="button" onClick={() => { if (timelinePlaying) setPlaying(false); else { setElapsed(0); setPlaying(true); } }}>{timelinePlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}{timelinePlaying ? "Pause timeline" : "Play timeline"}</button></div></div>
      <div className="kivi-speaker-filter"><span>Filter speakers</span><button type="button" className={speakerFilter === "all" ? "is-active" : ""} onClick={() => setSpeakerFilter("all")}>All turns</button>{conversation.speakers.map((speaker, index) => <button type="button" key={speaker} className={`kivi-speaker-filter__speaker kivi-speaker-filter__speaker--${["emerald", "sky", "violet"][index % 3]} ${speakerFilter === speaker ? "is-active" : ""}`} onClick={() => setSpeakerFilter(speaker)}><i>{String(index + 1).padStart(2, "0")}</i>{speaker}</button>)}</div>
      <div className="kivi-conversation-timeline">{conversation.dialogue_transcript.map((segment, index) => { const speakerIndex = conversation.speakers.indexOf(segment.speaker); const color = ["emerald", "sky", "violet"][speakerIndex % 3]; const activeTurn = timelinePlaying && index === Math.min(conversation.dialogue_transcript.length - 1, Math.floor((elapsed / 100) * conversation.dialogue_transcript.length)); const isSpeakerMatch = speakerFilter === segment.speaker; const dimmed = (isFiltered && !isSpeakerMatch) || (timelinePlaying && !activeTurn); return <article key={`${segment.timestamp}-${segment.speaker}`} className={`kivi-turn kivi-turn--${color} ${dimmed ? "is-dimmed" : ""} ${isSpeakerMatch ? "is-speaker-match" : ""} ${activeTurn ? "is-playing" : ""}`}><span className="kivi-turn__avatar">{String(speakerIndex + 1).padStart(2, "0")}</span><div><header><strong>Speaker {String(speakerIndex + 1).padStart(2, "0")}<small>{segment.speaker}</small></strong><time>{segment.timestamp}—{segment.endTimestamp}</time></header><p>{segment.utterance}</p><footer>{segment.topic}</footer></div></article>; })}</div>
      <div className="kivi-conversation-progress" aria-label={`Playback position: ${elapsed}%`}><span style={{ width: `${elapsed}%` }} /></div>
    </section>
  );
}

type MemoryTab = "ambient" | "layers";
const calendarMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const calendarDateKey = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

interface ArchivalRecord {
  artifactId: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  transcript: string;
  archivalLayer: string;
  sourceMetadata: string;
  tags: string[];
  context: string;
}

const archivalRecordFromMemory = (entry: AmbientMemoryRecord): ArchivalRecord => ({ artifactId: memoryArtifactId(entry.id), title: entry.title, date: entry.date, time: entry.time, duration: entry.duration, transcript: entry.transcript, archivalLayer: entry.memory_layer, sourceMetadata: entry.trigger_event, tags: entry.tags, context: entry.context });
const archivalRecordFromCapture = (artifact: StyleArtifact): ArchivalRecord => ({ artifactId: artifact.id, title: artifact.title, date: artifact.timestamp, time: "", duration: artifact.duration, transcript: artifact.rawTranscript, archivalLayer: artifact.transformedOutput, sourceMetadata: artifact.summary, tags: artifact.tags ?? [artifact.styleLabel], context: artifact.destination });

function MemoryVaultView({ artifacts, phase, focusedArtifact, onStartCapture, onStopCapture, onDeleteArtifact, deletedArtifactIds, onClearFocusedArtifact }: { artifacts: StyleArtifact[]; phase: TriggerPhase; focusedArtifact: StyleArtifact | null; onStartCapture: () => void; onStopCapture: () => void; onDeleteArtifact: (id: string) => void; deletedArtifactIds: string[]; onClearFocusedArtifact: () => void }) {
  const [activeTab, setActiveTab] = useState<MemoryTab>("ambient");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(ambientMemoryData[0].id);
  const [selectedCapturedMemory, setSelectedCapturedMemory] = useState<StyleArtifact | null>(null);
  const [selectedArchivalRecord, setSelectedArchivalRecord] = useState<ArchivalRecord | null>(null);
  const [archivalCopied, setArchivalCopied] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(8);
  const availableMemoryEntries = ambientMemoryData.filter((entry) => !deletedArtifactIds.includes(memoryArtifactId(entry.id)));
  const entries = useMemo(() => availableMemoryEntries.filter((entry) => [entry.title, entry.excerpt, entry.context, ...entry.tags].join(" ").toLowerCase().includes(query.toLowerCase()) && (!selectedDate || entry.isoDate === selectedDate)), [availableMemoryEntries, query, selectedDate]);
  const capturedMemories = artifactsForMode(artifacts, "ambient", availableMemoryEntries.map((item) => item.title));
  const visibleCapturedMemories = useMemo(() => capturedMemories.filter((artifact) => {
    const captureDate = artifact.memoryDate ?? artifact.createdAt.slice(0, 10);
    const searchText = [artifact.title, artifact.summary, artifact.rawTranscript, ...(artifact.tags ?? [])].join(" ").toLowerCase();
    return (!selectedDate || captureDate === selectedDate) && searchText.includes(query.toLowerCase());
  }), [capturedMemories, query, selectedDate]);
  const focusedMemory = focusedArtifact?.mode === "ambient" ? availableMemoryEntries.find((entry) => memoryArtifactId(entry.id) === focusedArtifact.id) ?? null : null;
  const focusedCapturedMemory = focusedArtifact?.mode === "ambient" && !focusedMemory ? artifacts.find((artifact) => artifact.id === focusedArtifact.id) ?? null : null;
  const selected = focusedMemory ?? entries.find((entry) => entry.id === selectedId) ?? entries[0] ?? null;
  const displayedCapturedMemory = focusedCapturedMemory ?? (selectedCapturedMemory && artifacts.some((artifact) => artifact.id === selectedCapturedMemory.id) ? selectedCapturedMemory : null);
  const displayedArchivalRecord = selectedArchivalRecord && !deletedArtifactIds.includes(selectedArchivalRecord.artifactId) ? selectedArchivalRecord : null;

  const captureCounts = useMemo(() => {
    const baselineCounts = availableMemoryEntries.reduce<Record<string, number>>((counts, entry) => ({ ...counts, [entry.isoDate]: (counts[entry.isoDate] ?? 0) + 1 }), {});
    return capturedMemories.reduce<Record<string, number>>((counts, artifact) => {
      const captureDate = artifact.memoryDate ?? artifact.createdAt.slice(0, 10);
      counts[captureDate] = (counts[captureDate] ?? 0) + 1;
      return counts;
    }, baselineCounts);
  }, [availableMemoryEntries, capturedMemories]);
  const selectDate = (isoDate: string) => {
    const nextDate = selectedDate === isoDate ? null : isoDate;
    setSelectedDate(nextDate);
    setSelectedCapturedMemory(null);
    const firstOnDate = nextDate ? availableMemoryEntries.find((entry) => entry.isoDate === nextDate) : availableMemoryEntries[0];
    if (firstOnDate) setSelectedId(firstOnDate.id);
  };
  const clearDateFilter = () => { setSelectedDate(null); setSelectedCapturedMemory(null); setSelectedId(availableMemoryEntries[0]?.id ?? ""); };
  const shiftMonth = (direction: -1 | 1) => { const next = calendarMonth + direction; if (next < 0) { setCalendarMonth(11); setCalendarYear((year) => Math.max(2020, year - 1)); } else if (next > 11) { setCalendarMonth(0); setCalendarYear((year) => Math.min(2040, year + 1)); } else setCalendarMonth(next); };
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOffset = (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7;
  const selectedDateLabel = selectedDate ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${selectedDate}T12:00:00`)) : null;
  const copyArchivalContent = async () => {
    if (!displayedArchivalRecord) return;
    await navigator.clipboard?.writeText(`${displayedArchivalRecord.title}\n\n${displayedArchivalRecord.transcript}\n\n${displayedArchivalRecord.archivalLayer}`);
    setArchivalCopied(true);
    window.setTimeout(() => setArchivalCopied(false), 2000);
  };

  return (
    <section className="kivi-view kivi-view--ambient">
      <KiviBird className="kivi-watermark" />
      <ViewHeader eyebrow="Styles / Memory" title="Search the life between the notes" description="A time-aware record of what you said, where you were, and why it returned." phase={phase} onStartCapture={onStartCapture} onStopCapture={onStopCapture} />
      <nav className="kivi-memory-tabs" aria-label="Memory sections">
        <button type="button" className={activeTab === "ambient" ? "is-active" : ""} onClick={() => setActiveTab("ambient")}>Ambient Memory</button>
        <button type="button" className={activeTab === "layers" ? "is-active" : ""} onClick={() => setActiveTab("layers")}>Archival Layers</button>
      </nav>
      {activeTab === "ambient" && <><div className="kivi-memory-controls"><label><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search memories" /></label></div>
      <div className="kivi-memory-layout">
        <aside className="kivi-calendar"><header><button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">←</button><span>{calendarMonths[calendarMonth]}</span><button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">→</button></header><label className="kivi-calendar__year">Year<select value={calendarYear} onChange={(event) => setCalendarYear(Number(event.target.value))}>{Array.from({ length: 21 }, (_, index) => 2020 + index).map((year) => <option key={year}>{year}</option>)}</select></label><div className="kivi-calendar__days">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}{Array.from({ length: firstDayOffset }, (_, index) => <i key={`blank-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => { const day = index + 1; const isoDate = calendarDateKey(calendarYear, calendarMonth, day); const count = captureCounts[isoDate] ?? 0; return <button type="button" key={day} className={`${count ? "is-captured" : ""} heat-${Math.min(count, 3)} ${selectedDate === isoDate ? "is-selected" : ""}`} aria-pressed={selectedDate === isoDate} onClick={() => selectDate(isoDate)}>{day}{count > 0 && <b />}</button>; })}</div><footer><i /> {selectedDate ? `Showing ${selectedDateLabel}` : "All dates"}<button type="button" onClick={clearDateFilter}>Clear filter</button></footer></aside>
        <div className="kivi-memory-stream">
          {visibleCapturedMemories.map((artifact) => <article className={displayedCapturedMemory?.id === artifact.id ? "kivi-memory-stream__item is-selected" : "kivi-memory-stream__item"} key={artifact.id}><button type="button" onClick={() => { onClearFocusedArtifact(); setSelectedCapturedMemory(artifact); }}><time>{artifact.timestamp}<small>{artifact.duration}</small></time><span><i>Captured memory</i><strong>{artifact.title}</strong><p>{artifact.summary}</p></span></button></article>)}
          {entries.map((entry) => <article className={!displayedCapturedMemory && entry.id === selected?.id ? "kivi-memory-stream__item is-selected" : "kivi-memory-stream__item"} key={entry.id}><button type="button" onClick={() => { onClearFocusedArtifact(); setSelectedCapturedMemory(null); setSelectedId(entry.id); }}><time>{entry.date}<small>{entry.time}</small></time><span><i>{entry.context}</i><strong>{entry.title}</strong><p>{entry.excerpt}</p></span></button></article>)}
          {entries.length + visibleCapturedMemories.length === 0 && <div className="kivi-memory-stream__empty"><strong>No voice captures recorded for {selectedDateLabel}.</strong><span>Try another day or clear the date filter.</span></div>}
        </div>
        {displayedCapturedMemory ? <aside className="kivi-memory-detail"><span className="kivi-eyebrow">Captured memory</span><h2>{displayedCapturedMemory.title}</h2><p>{displayedCapturedMemory.rawTranscript}</p><div><ArtifactCopyButton artifact={displayedCapturedMemory} /><DeleteArtifactButton label={displayedCapturedMemory.title} onDelete={() => { onDeleteArtifact(displayedCapturedMemory.id); setSelectedCapturedMemory(null); }} /></div><small>{displayedCapturedMemory.timestamp} · {displayedCapturedMemory.duration}</small></aside> : selected && <aside className="kivi-memory-detail"><span className="kivi-eyebrow">Audio snippet</span><h2>{selected.title}</h2><p>{selected.transcript}</p><div><CopyIconButton text={selected.transcript} /><DeleteArtifactButton label={selected.title} onDelete={() => { onDeleteArtifact(memoryArtifactId(selected.id)); setSelectedId(availableMemoryEntries.find((entry) => entry.id !== selected.id)?.id ?? ""); }} /></div><small>{selected.context} · {selected.time}</small></aside>}
      </div></>}
      {activeTab === "layers" && <div className="kivi-memory-layers">{capturedMemories.map((artifact) => <article key={artifact.id} role="button" tabIndex={0} onClick={() => { onClearFocusedArtifact(); setSelectedArchivalRecord(archivalRecordFromCapture(artifact)); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onClearFocusedArtifact(); setSelectedArchivalRecord(archivalRecordFromCapture(artifact)); } }}><div><h2>{artifact.title}</h2><p>{artifact.transformedOutput}</p></div><aside>{(artifact.tags ?? [artifact.styleLabel]).map((tag) => <span key={tag}>{tag}</span>)}<small>{artifact.timestamp} · {artifact.duration}</small></aside></article>)}{availableMemoryEntries.map((entry) => <article key={entry.id} role="button" tabIndex={0} onClick={() => setSelectedArchivalRecord(archivalRecordFromMemory(entry))} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedArchivalRecord(archivalRecordFromMemory(entry)); } }}><div><h2>{entry.trigger_event}</h2><p>{entry.memory_layer}</p></div><aside>{entry.archive_citations.map((citation) => <span key={citation}>{citation}</span>)}<small>Cognitive drift: {entry.cognitive_drift_index.toFixed(2)}</small></aside></article>)}</div>}
      {displayedArchivalRecord && typeof document !== "undefined" && createPortal(<div className="kivi-archival-drawer__backdrop" role="presentation" onMouseDown={() => setSelectedArchivalRecord(null)}><aside className="kivi-archival-drawer" role="dialog" aria-modal="true" aria-label={`${displayedArchivalRecord.title} archival record`} onMouseDown={(event) => event.stopPropagation()}><header><div><span className="kivi-eyebrow">Archival record</span><h2>{displayedArchivalRecord.title}</h2><p>{[displayedArchivalRecord.date, displayedArchivalRecord.time, displayedArchivalRecord.duration].filter(Boolean).join(" · ")}</p></div><button type="button" className="kivi-overlay-close" onClick={() => setSelectedArchivalRecord(null)} aria-label="Close archival record"><X size={17} /></button></header><section><span className="kivi-eyebrow">Captured voice note</span><p>{displayedArchivalRecord.transcript}</p></section><section><span className="kivi-eyebrow">Archival layer</span><p>{displayedArchivalRecord.archivalLayer}</p></section><section><span className="kivi-eyebrow">Source metadata</span><p>{displayedArchivalRecord.sourceMetadata}</p><div>{displayedArchivalRecord.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><small>{displayedArchivalRecord.context}</small></section><footer><button type="button" className="kivi-history-drawer__icon-action" onClick={copyArchivalContent} aria-label={archivalCopied ? "Copied content" : "Copy content"} title={archivalCopied ? "Copied" : "Copy content"}>{archivalCopied ? <Check size={15} /> : <Copy size={15} />}</button><button type="button" className="kivi-history-drawer__icon-action" onClick={() => { onDeleteArtifact(displayedArchivalRecord.artifactId); setSelectedArchivalRecord(null); }} aria-label="Delete archival record" title="Delete"><Trash2 size={15} /></button></footer></aside></div>, document.body)}
    </section>
  );
}

export function Views({ activeMode, artifacts, focusedArtifact, onStartCapture, onStopCapture, phase, stylePreferences, onStylePreferenceChange, onUtilityContextChange, onDeleteArtifact, deletedArtifactIds, onClearFocusedArtifact }: ViewsProps) {
  if (activeMode === "utility") return <UtilityView onStartCapture={onStartCapture} onStopCapture={onStopCapture} phase={phase} stylePreferences={stylePreferences} onStylePreferenceChange={onStylePreferenceChange} onContextChange={onUtilityContextChange} />;
  if (activeMode === "narratives") return <NarrativeView artifacts={artifacts} focusedArtifact={focusedArtifact} onStartCapture={onStartCapture} onStopCapture={onStopCapture} phase={phase} onDeleteArtifact={onDeleteArtifact} deletedArtifactIds={deletedArtifactIds} onClearFocusedArtifact={onClearFocusedArtifact} />;
  if (activeMode === "conversations") return <ConversationView artifacts={artifacts} focusedArtifact={focusedArtifact} onStartCapture={onStartCapture} onStopCapture={onStopCapture} phase={phase} onDeleteArtifact={onDeleteArtifact} deletedArtifactIds={deletedArtifactIds} onClearFocusedArtifact={onClearFocusedArtifact} />;
  return <MemoryVaultView artifacts={artifacts} focusedArtifact={focusedArtifact} onStartCapture={onStartCapture} onStopCapture={onStopCapture} phase={phase} onDeleteArtifact={onDeleteArtifact} deletedArtifactIds={deletedArtifactIds} onClearFocusedArtifact={onClearFocusedArtifact} />;
}
