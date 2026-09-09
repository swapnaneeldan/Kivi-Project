import {
  conversationData as legacyConversationData,
  memoryData as legacyMemoryData,
  narrativeData as legacyNarrativeData,
  recentTakes,
  utilityData,
} from "@/data/mockData";
import { ambientMemoryData, conversationData, narrationData } from "@/mock/kiviData";
import { deduplicateByTitle } from "@/data/deduplicate";
import { seedStyleArtifacts, type ConversationTurn, type StyleArtifact } from "@/data/styleArtifacts";

/**
 * This file is deliberately a read-only projection. Source mock arrays stay owned
 * by their workspace; History only receives copied, uniquely-addressable records.
 */
const isoForLegacyItem = (index: number, hour = 12) => {
  const date = new Date(Date.UTC(2026, 8, 6, hour, 0, 0));
  date.setUTCDate(date.getUTCDate() - index);
  return date.toISOString();
};

const timeTo24Hour = (time: string) => {
  const match = time.match(/^(\d{1,2}):(\d{2})\s([AP]M)$/);
  if (!match) return "12:00";
  const [, rawHour, minutes, meridiem] = match;
  const hour = (Number(rawHour) % 12) + (meridiem === "PM" ? 12 : 0);
  return `${String(hour).padStart(2, "0")}:${minutes}`;
};

const createdAtForMemory = (isoDate: string, time: string) => new Date(`${isoDate}T${timeTo24Hour(time)}:00+05:30`).toISOString();

const archiveTimestamp = (createdAt: string) => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(new Date(createdAt));
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("month")} ${value("day")} · ${value("hour")}:${value("minute")} ${value("dayPeriod")}`;
};

const legacyNarrativeChronology: Record<string, string> = {
  "narrative-memory": "2026-09-03T10:18:00+05:30",
  "narrative-research": "2026-09-02T16:46:00+05:30",
  "narrative-podcast-12": "2026-09-02T13:14:00+05:30",
  "narrative-latency": "2026-09-01T11:06:00+05:30",
  "narrative-archive": "2026-08-28T08:44:00+05:30",
};

const legacyConversationChronology: Record<string, string> = {
  "conversation-roadmap": "2026-09-03T09:02:00+05:30",
  "conversation-design-crit": "2026-09-03T14:20:00+05:30",
  "conversation-migration": "2026-09-02T17:10:00+05:30",
  "conversation-q4": "2026-09-01T09:30:00+05:30",
};

const seedCreatedAt: Record<string, string> = {
  "artifact-narrative-projection-booth": "2026-09-05T16:42:00+05:30",
  "artifact-conversation-roadmap": "2026-09-04T19:05:00+05:30",
  "artifact-memory-night-walk": "2026-09-03T23:26:00+05:30",
};

const recentTakeChronology: Record<string, string> = {
  "take-seat": "2026-09-04T23:31:00+05:30",
  "take-shuttle": "2026-09-04T12:22:00+05:30",
  "take-apps-email": "2026-09-04T15:27:00+05:30",
  "take-groceries": "2026-09-04T07:14:00+05:30",
  "take-rainy-playlist": "2026-09-03T20:42:00+05:30",
  "take-wire": "2026-09-03T13:18:00+05:30",
  "take-email-skeleton": "2026-08-29T12:16:00+05:30",
  "take-bookshop": "2026-09-01T16:18:00+05:30",
  "take-developer": "2026-08-26T14:44:00+05:30",
};

const recentTakeHistoryTimestamp: Record<string, string> = {
  "take-seat": "September 4, 11:31 PM",
  "take-shuttle": "September 4, 12:22 PM",
  "take-apps-email": "September 4, 3:27 PM",
  "take-groceries": "September 4, 7:14 AM",
  "take-rainy-playlist": "September 3, 8:42 PM",
  "take-wire": "September 3, 1:18 PM",
};

const articleText = (sections: Array<{ heading: string; body: string }>) => sections
  .map((section) => `${section.heading}\n${section.body}`)
  .join("\n\n");

const primaryNarrativeArtifacts: StyleArtifact[] = narrationData.map((record) => ({
  id: `history:narratives:${record.id}`,
  mode: "narratives",
  title: record.title,
  timestamp: record.recordedAt,
  duration: record.duration,
  destination: "Narratives / article",
  styleId: "reader-ready",
  styleLabel: "reader-ready",
  rawTranscript: record.rawAudioTranscript,
  transformedOutput: articleText(record.article.sections) || record.convertedArticles[0]?.body || record.rawAudioTranscript,
  summary: record.article.dek,
  createdAt: record.timestamp,
}));

const legacyNarrativeArtifacts: StyleArtifact[] = legacyNarrativeData.map((record, index) => ({
  id: `history:legacy-narratives:${record.id}`,
  mode: "narratives",
  title: record.title,
  timestamp: record.recordedAt,
  duration: record.duration,
  destination: "Narratives / article",
  styleId: "reader-ready",
  styleLabel: "reader-ready",
  rawTranscript: record.transcript.map((line) => line.text).join(" "),
  transformedOutput: articleText(record.article.sections),
  summary: record.article.dek,
  createdAt: legacyNarrativeChronology[record.id] ?? isoForLegacyItem(index + 3, 10),
}));

const toTurns = (turns: Array<{ speaker: string; timestamp: string; endTimestamp: string; utterance: string; topic: string }>): ConversationTurn[] => turns.map((turn, index) => ({
  speakerId: String(index + 1).padStart(2, "0"),
  speakerName: turn.speaker,
  text: turn.utterance,
  timeRange: `${turn.timestamp}–${turn.endTimestamp}`,
  tag: turn.topic.toUpperCase(),
}));

const primaryConversationArtifacts: StyleArtifact[] = conversationData.map((record) => {
  const turns = toTurns(record.dialogue_transcript);
  return {
    id: `history:conversations:${record.id}`,
    mode: "conversations",
    title: record.title,
    timestamp: record.date,
    duration: record.duration,
    destination: "Conversations / timeline",
    styleId: "speaker-aware",
    styleLabel: "speaker-aware",
    rawTranscript: record.dialogue_transcript.map((turn) => `${turn.speaker}: ${turn.utterance}`).join(" "),
    transformedOutput: `${record.theoretical_vector}\n\nTags: ${record.citation_tags.join(" · ")}`,
    summary: record.summary,
    createdAt: record.timestamp,
    turns,
    speakerTurns: record.dialogue_transcript.map((turn) => ({
      speaker: turn.speaker,
      timestamp: turn.timestamp,
      endTimestamp: turn.endTimestamp,
      utterance: turn.utterance,
      topic: turn.topic,
    })),
  };
});

const legacyConversationArtifacts: StyleArtifact[] = legacyConversationData.map((record, index) => {
  const turns: ConversationTurn[] = record.segments.map((segment, segmentIndex) => {
    const speaker = record.speakers.find((candidate) => candidate.id === segment.speakerId);
    return {
      speakerId: String(segmentIndex + 1).padStart(2, "0"),
      speakerName: speaker?.name ?? "Speaker",
      text: segment.text,
      timeRange: `${segment.timestamp}–${segment.endTimestamp}`,
      tag: segment.topic.toUpperCase(),
    };
  });
  return {
    id: `history:legacy-conversations:${record.id}`,
    mode: "conversations",
    title: record.title,
    timestamp: record.date,
    duration: record.duration,
    destination: "Conversations / timeline",
    styleId: "speaker-aware",
    styleLabel: "speaker-aware",
    rawTranscript: turns.map((turn) => `${turn.speakerName}: ${turn.text}`).join(" "),
    transformedOutput: `Decision trail\n${record.summary}`,
    summary: record.summary,
    createdAt: legacyConversationChronology[record.id] ?? isoForLegacyItem(index + 5, 15),
    turns,
    speakerTurns: turns.map((turn) => ({
      speaker: turn.speakerName,
      timestamp: turn.timeRange.split("–")[0],
      endTimestamp: turn.timeRange.split("–")[1],
      utterance: turn.text,
      topic: turn.tag,
    })),
  };
});

const primaryMemoryArtifacts: StyleArtifact[] = ambientMemoryData.map((record) => ({
  id: `history:memory:${record.id}`,
  mode: "ambient",
  title: record.title,
  timestamp: `${record.date} · ${record.time}`,
  duration: record.duration,
  destination: "Memory / Ambient Memory",
  styleId: "archival",
  styleLabel: "archival",
  rawTranscript: record.transcript,
  transformedOutput: `${record.memory_layer}\n\nTags: ${record.tags.join(" · ")}\nSources: ${record.archive_citations.join(" · ")}`,
  summary: record.excerpt,
  createdAt: createdAtForMemory(record.isoDate, record.time),
}));

const legacyMemoryArtifacts: StyleArtifact[] = legacyMemoryData.map((record) => ({
  id: `history:legacy-memory:${record.id}`,
  mode: "ambient",
  title: record.title,
  timestamp: `${record.date} · ${record.time}`,
  duration: record.duration,
  destination: "Memory / Ambient Memory",
  styleId: "archival",
  styleLabel: "archival",
  rawTranscript: record.transcript,
  transformedOutput: `${record.excerpt}\n\nTags: ${record.tags.join(" · ")}`,
  summary: record.excerpt,
  createdAt: createdAtForMemory(record.isoDate, record.time),
}));

const utilityArtifacts: StyleArtifact[] = utilityData.map((record, index) => {
  const createdAt = isoForLegacyItem(index + 8, 10);
  return {
    id: `history:utility:${record.id}`,
    mode: "utility",
    title: record.artifact.label,
    timestamp: archiveTimestamp(createdAt),
    duration: record.artifact.metadata.split(" · ")[0] ?? "0:30",
    destination: `Utility / ${record.destination}`,
    styleId: "structured",
    styleLabel: "structured",
    rawTranscript: record.rule,
    transformedOutput: record.artifact.body,
    summary: record.description,
    createdAt,
  };
});

const recentTakeArtifacts: StyleArtifact[] = recentTakes.map((record, index) => ({
  id: `history:recent-take:${record.id}`,
  mode: record.mode,
  title: record.title,
  timestamp: recentTakeHistoryTimestamp[record.id] ?? record.timestamp,
  duration: record.duration,
  destination: `${record.mode === "ambient" ? "Memory" : record.mode[0].toUpperCase() + record.mode.slice(1)} / capture`,
  styleId: "captured",
  styleLabel: "captured",
  rawTranscript: record.description,
  transformedOutput: record.description,
  summary: record.description,
  createdAt: recentTakeChronology[record.id] ?? isoForLegacyItem(index, 9),
}));

export const sortHistoryArtifacts = (artifacts: StyleArtifact[]) => [...artifacts].sort((left, right) => {
  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
});

// Additive concatenation only: each source keeps ownership of its own mock array.
export const masterHistoryArtifacts = sortHistoryArtifacts(deduplicateByTitle([
  ...seedStyleArtifacts.map((artifact) => ({ ...artifact, createdAt: seedCreatedAt[artifact.id] ?? artifact.createdAt })),
  ...recentTakeArtifacts,
  ...legacyNarrativeArtifacts,
  ...legacyConversationArtifacts,
  ...legacyMemoryArtifacts,
  ...utilityArtifacts,
  // The current workspace records are last so they become the canonical copy
  // when a legacy History projection shares a visible title.
  ...primaryNarrativeArtifacts,
  ...primaryConversationArtifacts,
  ...primaryMemoryArtifacts,
]));

export function mergeMasterHistoryBase(existing: StyleArtifact[]) {
  return sortHistoryArtifacts(deduplicateByTitle([...existing, ...masterHistoryArtifacts]));
}
