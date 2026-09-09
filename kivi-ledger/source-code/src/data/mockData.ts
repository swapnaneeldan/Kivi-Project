import { ambientMemoryData, conversationData as primaryConversationData, narrationData } from "@/mock/kiviData";

export type WorkspaceMode = "utility" | "narratives" | "conversations" | "ambient";
export type LedgerRoute = "overview" | "history" | "shortcuts" | "dictionary" | WorkspaceMode;

export type TriggerPhase = "idle" | "recording" | "processing" | "synthesized";

export interface WorkspaceMeta {
  id: WorkspaceMode;
  label: string;
  eyebrow: string;
  description: string;
}

export const workspaceModes: WorkspaceMeta[] = [
  {
    id: "utility",
    label: "Utility",
    eyebrow: "Capture to Style",
    description: "Turn a thought into the right shape for the app that needs it.",
  },
  {
    id: "narratives",
    label: "Narratives",
    eyebrow: "Podcast studio",
    description: "Find the argument inside a spoken, unfinished idea.",
  },
  {
    id: "conversations",
    label: "Conversations",
    eyebrow: "Diarized record",
    description: "Keep who said what, when it changed the room.",
  },
  {
    id: "ambient",
    label: "Memory",
    eyebrow: "Temporal vault",
    description: "Search the things worth remembering before they vanish.",
  },
];

export interface UtilityArtifact {
  label: string;
  body: string;
  metadata: string;
}

export interface UtilityTarget {
  id: string;
  label: string;
  destination: string;
  description: string;
  accent: "emerald" | "sky" | "violet" | "amber";
  rule: string;
  artifact: UtilityArtifact;
}

const rawUtilityData: UtilityTarget[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    destination: "Personal messaging",
    description: "Warm, direct, and ready to send.",
    accent: "emerald",
    rule: "Keep it human. One thought per message; no needless preamble.",
    artifact: {
      label: "Ready to paste",
      body: "Hey, I went through the deck. The direction feels right — especially the opening sequence. I left two small notes around the handoff, but nothing that should slow us down. Happy to talk them through tomorrow.",
      metadata: "34 spoken words · concise rewrite",
    },
  },
  {
    id: "email",
    label: "Email",
    destination: "Work correspondence",
    description: "Clear enough to forward without a follow-up.",
    accent: "sky",
    rule: "Lead with the decision, then give the recipient the context they need to act.",
    artifact: {
      label: "Draft email",
      body: "Subject: Research readout — proposed next step\n\nHi Maya,\n\nI reviewed the interview notes and the strongest signal is not feature demand; it is anxiety around losing control of context. I suggest we validate that distinction in the next round rather than adding more preference questions.\n\nI have attached a short synthesis with the pattern and two prompts for recruitment.\n\nBest,\nN",
      metadata: "1m 12s capture · structured rewrite",
    },
  },
  {
    id: "dev-notes",
    label: "Dev notes",
    destination: "Engineering workspace",
    description: "Keep the implementation detail intact.",
    accent: "violet",
    rule: "Preserve exact technical terms. Separate observation, decision, and follow-up.",
    artifact: {
      label: "Implementation note",
      body: "Decision: preserve the route-level recording state in the shell, not inside individual views.\n\nWhy: Fn capture should be consistent regardless of the active ledger context, and a capture can be reclassified after recording.\n\nFollow-up: add a small event boundary before a real audio provider is introduced.",
      metadata: "48 spoken words · technical structure",
    },
  },
  {
    id: "llm-prompts",
    label: "LLM prompts",
    destination: "Research copilot",
    description: "Give the model the situation, not just a command.",
    accent: "amber",
    rule: "Make the outcome, constraints, and evidence explicit before asking for an answer.",
    artifact: {
      label: "Prompt draft",
      body: "Act as a research editor. Based only on the attached interview notes, identify the three most defensible claims about context loss. Distinguish direct evidence from inference, cite the participant IDs for each claim, and end with one disconfirming question we should test next.",
      metadata: "39 spoken words · context-first prompt",
    },
  },
];

export interface TranscriptLine {
  id: string;
  timestamp: string;
  text: string;
  emphasis?: "thought" | "turn" | "quote";
}

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface NarrativeArticle {
  headline: string;
  dek: string;
  readTime: string;
  sections: ArticleSection[];
}

export interface Narrative {
  id: string;
  title: string;
  recordedAt: string;
  duration: string;
  transcript: TranscriptLine[];
  article: NarrativeArticle;
}

const rawNarrativeData: Narrative[] = [
  { id: "narrative-memory", title: "The pizza shop note became an article about a block", recordedAt: "September 3, 10:18 AM", duration: "03:42", transcript: [
    { id: "t1", timestamp: "00:03", text: "Do not open with Do the Right Thing being important; open with the shutter I saw on the way back." },
    { id: "t2", timestamp: "00:26", text: "The shutter, the heat, and the counter are why the film came back tonight." },
    { id: "t3", timestamp: "00:51", text: "Then ask why everybody wants the ending to give them a clean moral position.", emphasis: "turn" },
  ], article: { headline: "A Pizza Shop Is a Better Prompt Than a Ranking", dek: "A street detail returned a familiar film as a question about heat, place, and spectatorship.", readTime: "3 min read", sections: [{ heading: "The cue", body: "A half-closed shutter near campus returned the film before its plot did. It carried the counter, pavement, and trapped heat that make the block feel impossible to leave." }, { heading: "The argument", body: "The note became an article by following that cue toward the film's harder question: what kind of spectator wants violence to conclude with an uncomplicated side to choose?" }] } },
  { id: "narrative-research", title: "The margin note on cultural memory became a reading method", recordedAt: "September 2, 4:46 PM", duration: "05:09", transcript: [
    { id: "r1", timestamp: "00:06", text: "The definition is fine, but the margin question is better: who gets to call their memory an archive?" },
    { id: "r2", timestamp: "00:34", text: "File the objection with the citation or it will disappear under the terminology." },
    { id: "r3", timestamp: "01:02", text: "Memory is not only stored; it is authorised.", emphasis: "turn" },
  ], article: { headline: "File the Objection With the Citation", dek: "A reading practice for retaining the power question that arrives before a theoretical term settles.", readTime: "3 min read", sections: [{ heading: "The useful margin", body: "The highlighted definition was less valuable than the pencilled question beside it: whose recollection becomes institutional record, and whose remains anecdote?" }, { heading: "A small method", body: "Saving the objection with the citation preserves the route back to a live disagreement instead of filing a PDF as if terminology were thought." }] } },
  { id: "narrative-podcast-12", title: "The Barça note became a piece about copying a structure, not a past", recordedAt: "September 2, 1:14 PM", duration: "07:18", transcript: [
    { id: "p1", timestamp: "00:08", text: "Do not say Barça need to be like 2011. Say what Pedri needs when he receives on the left." },
    { id: "p2", timestamp: "01:21", text: "If the six is alone after a loss, the pretty passing sequence has already failed." },
    { id: "p3", timestamp: "03:04", text: "A tactical reference is not a costume.", emphasis: "quote" },
  ], article: { headline: "Barcelona Cannot Copy 2011", dek: "The useful inheritance from Guardiola's side is structural: spacing, protection after loss, and roles that suit the current players.", readTime: "4 min read", sections: [{ heading: "Pedri's receiving lane", body: "Pedri is strongest when width and a stable pivot give him a left-half-space receipt he can turn from. Asking him to solve every transition merely repeats the imbalance." }, { heading: "No museum football", body: "Short passes do not recreate a past. Positional play is a relation among personnel, spacing, pressing triggers, and rest defence." }] } },
  { id: "narrative-latency", title: "The unfinished proposal became a question about unstable testimony", recordedAt: "September 3, 11:06 AM", duration: "06:02", transcript: [
    { id: "l1", timestamp: "00:05", text: "I keep naming altered cognition because it sounds smart, then losing the person whose memory is breaking." },
    { id: "l2", timestamp: "01:36", text: "The project needs to ask what an unstable account can still tell us." },
    { id: "l3", timestamp: "03:11", text: "Do not make damage beautiful just because the prose is exciting.", emphasis: "turn" },
  ], article: { headline: "What Can an Unstable Memory Testify To?", dek: "A proposal reframed around literary testimony, altered cognition, and the difference between method and romance.", readTime: "3 min read", sections: [{ heading: "The question", body: "The project begins where a seamless account is unavailable but a person's altered recollection remains the only record of a feeling or event." }, { heading: "The restraint", body: "Fracture is neither automatic truth nor artistic glamour. It needs a method attentive to revision, performance, withholding, and power." }] } },
  { id: "narrative-archive", title: "The rainy walk became a playlist with a route", recordedAt: "August 28, 8:44 AM", duration: "08:26", transcript: [
    { id: "a1", timestamp: "00:09", text: "The Strokes first, then something lighter; the day was annoying, not tragic." },
    { id: "a2", timestamp: "02:02", text: "Save rain near the gate and the detergent errand." },
    { id: "a3", timestamp: "04:17", text: "Spotify can remember a genre; I need the route.", emphasis: "thought" },
  ], article: { headline: "A Playlist Needs a Route", dek: "A one-line note turns a sequence of songs into a memory of the library walk that required it.", readTime: "2 min read", sections: [{ heading: "Mood is too broad", body: "A platform can infer melancholy. It cannot know the yellow gate light, a long department day, rain in the road, and detergent still to buy." }, { heading: "Enough context", body: "A route note preserves the reason a sequence mattered without forcing an ordinary evening into an essay." }] } },
];

export type SpeakerId = "speaker-01" | "speaker-02" | "speaker-03";

export interface ConversationSpeaker {
  id: SpeakerId;
  label: string;
  name: string;
  color: "emerald" | "sky" | "violet";
}

export interface ConversationSegment {
  id: string;
  speakerId: SpeakerId;
  timestamp: string;
  endTimestamp: string;
  text: string;
  topic: string;
}

export interface Conversation {
  id: string;
  title: string;
  date: string;
  duration: string;
  summary: string;
  speakers: ConversationSpeaker[];
  segments: ConversationSegment[];
}

const rawConversationData: Conversation[] = [
  {
    id: "conversation-roadmap", title: "Picking a five-a-side team without making Messi do everything", date: "September 3, 9:02 AM", duration: "18:24", summary: "Neel, Pranav, and Vibhav build a five-a-side around Messi and disagree about who has to run for him.",
    speakers: [{ id: "speaker-01", label: "Speaker 01", name: "Neel", color: "sky" }, { id: "speaker-02", label: "Speaker 02", name: "Pranav", color: "violet" }, { id: "speaker-03", label: "Speaker 03", name: "Vibhav", color: "emerald" }],
    segments: [
      { id: "c1", speakerId: "speaker-01", timestamp: "00:14", endTimestamp: "00:42", text: "If Messi is in five-a-side, stop picking three more players who want the ball to feet. Give him a runner and somebody who will actually tackle.", topic: "Team balance" },
      { id: "c2", speakerId: "speaker-02", timestamp: "00:43", endTimestamp: "01:10", text: "You are pretending his walking is a flaw. In a small pitch he is saving energy to receive facing goal, which is worse for us.", topic: "Messi role" },
      { id: "c3", speakerId: "speaker-03", timestamp: "01:12", endTimestamp: "01:46", text: "Fine, then I take Kanté behind him and Mbappé running off him. But your keeper has to be good with feet or we cannot even get Messi the first pass.", topic: "Personnel" },
      { id: "c4", speakerId: "speaker-01", timestamp: "02:04", endTimestamp: "02:31", text: "That is a real team. You cannot draft vibes and then complain when Pranav presses us into the wall.", topic: "Pressing" },
    ],
  },
  {
    id: "conversation-design-crit", title: "The Godfather II after the restaurant closed", date: "September 3, 2:20 PM", duration: "12:10", summary: "Kshatriya and Neel argue over the parallel timelines and whether young Vito makes Michael easier to forgive.",
    speakers: [{ id: "speaker-01", label: "Speaker 01", name: "Kshatriya", color: "emerald" }, { id: "speaker-02", label: "Speaker 02", name: "Neel", color: "sky" }],
    segments: [
      { id: "dc1", speakerId: "speaker-01", timestamp: "00:12", endTimestamp: "00:38", text: "Young Vito is not there to redeem Michael. The cross-cutting makes Michael's loneliness look chosen because we keep seeing another way power could have been built.", topic: "Structure" },
      { id: "dc2", speakerId: "speaker-02", timestamp: "00:42", endTimestamp: "01:09", text: "But Vito is not harmless either. The movie gives us a warmer origin story because it wants Michael's coldness to hurt more, not because it has discovered a good gangster.", topic: "Pushback" },
      { id: "dc3", speakerId: "speaker-01", timestamp: "01:22", endTimestamp: "01:47", text: "Exactly. The lake scene lands because the family photograph has already become an accusation.", topic: "Scene" },
    ],
  },
  {
    id: "conversation-migration", title: "The Barcelona shirt, the second half, and a useless full-back debate", date: "September 2, 5:10 PM", duration: "24:05", summary: "Neel, Pranav, and Neelavo argue about an inverted full-back, a trapped winger, and the level of patience a match deserves.",
    speakers: [{ id: "speaker-01", label: "Speaker 01", name: "Neel", color: "sky" }, { id: "speaker-02", label: "Speaker 02", name: "Pranav", color: "violet" }, { id: "speaker-03", label: "Speaker 03", name: "Neelavo", color: "emerald" }],
    segments: [
      { id: "em1", speakerId: "speaker-01", timestamp: "00:18", endTimestamp: "00:49", text: "The full-back coming inside is not automatically clever. If the winger stays narrow too, they have just parked two players in one corridor.", topic: "Spacing" },
      { id: "em2", speakerId: "speaker-02", timestamp: "00:55", endTimestamp: "01:25", text: "But if he stays wide, who covers when the eight jumps to press? You want the old shape and none of the running it required.", topic: "Rest defence" },
      { id: "em3", speakerId: "speaker-03", timestamp: "01:31", endTimestamp: "02:07", text: "Can both of you watch ten minutes without turning the shirt on Neel's chair into tactical evidence?", topic: "Humour" },
      { id: "em4", speakerId: "speaker-01", timestamp: "02:16", endTimestamp: "02:41", text: "No, because the second half is where the argument is. If Pedri gets the next pass facing forward, I am right.", topic: "Stake" },
    ],
  },
  {
    id: "conversation-q4", title: "Why The Sopranos keeps making dinner feel dangerous", date: "September 3, 9:30 AM", duration: "15:42", summary: "Vibhav and Kshatriya discuss Carmela, Tony, and the threat concealed inside routine family scenes.",
    speakers: [{ id: "speaker-01", label: "Speaker 01", name: "Vibhav", color: "violet" }, { id: "speaker-02", label: "Speaker 02", name: "Kshatriya", color: "emerald" }],
    segments: [
      { id: "q41", speakerId: "speaker-01", timestamp: "00:10", endTimestamp: "00:38", text: "The scary scenes are not the hits. It is Tony at the table when everyone has to guess whether he is annoyed or about to be cruel.", topic: "Domesticity" },
      { id: "q42", speakerId: "speaker-02", timestamp: "00:43", endTimestamp: "01:10", text: "And Edie Falco never lets Carmela become a moral alibi for the audience. She knows the house is bought with something and still wants the house.", topic: "Performance" },
      { id: "q43", speakerId: "speaker-01", timestamp: "01:18", endTimestamp: "01:46", text: "That is why the show is funny too. The jokes arrive in the same room as the threat, not after it.", topic: "Tone" },
    ],
  },
];

export type MemoryContext = "Work" | "Research" | "Personal" | "Planning";

export interface MemoryEntry {
  id: string;
  date: string;
  isoDate: string;
  time: string;
  context: MemoryContext;
  title: string;
  excerpt: string;
  transcript: string;
  tags: string[];
  duration: string;
}

const rawMemoryData: MemoryEntry[] = [
  { id: "memory-3", date: "September 4", isoDate: "2026-09-04", time: "6:12 PM", context: "Work", title: "Ask the librarian about the Beat archive boxes", excerpt: "The email should ask what is digitised before I build a research fantasy around a catalogue title.", transcript: "Email the librarian: I am looking at the Beat collection and need to know which boxes are digitised, which require a visit, and whether there are restrictions on notes. Keep it specific and do not pretend I already have funding.", tags: ["research", "archive"], duration: "01:11" },
  { id: "memory-4", date: "September 4", isoDate: "2026-09-04", time: "7:54 AM", context: "Personal", title: "The coffee outside the department was too sweet", excerpt: "The bad coffee, a Dylan song, and the unread article are enough to locate the morning.", transcript: "Morning note: coffee outside department was too sweet, Dylan was on, and I still had not read the article for class. Do not turn this into a productivity lesson.", tags: ["music", "department", "morning"], duration: "00:36" },
  { id: "memory-5", date: "September 3", isoDate: "2026-09-03", time: "6:40 PM", context: "Work", title: "Find the Barcelona match before writing about it", excerpt: "A tactical claim should have a match, a minute, and a shape attached to it.", transcript: "Before writing about Pedri receiving between lines, find the match and the sequence. Do not build an entire argument from a thumbnail and a memory of the commentary.", tags: ["football", "barcelona", "writing"], duration: "01:09" },
  { id: "memory-6", date: "September 3", isoDate: "2026-09-03", time: "12:18 PM", context: "Research", title: "Keep the question beside the memory-studies PDF", excerpt: "Who gets to make a record is more useful than another highlighted definition.", transcript: "Before filing the chapter, record the question about who gets to call their recollection evidence. It will be more useful than colour-coding another definition.", tags: ["memory", "feminism", "reading"], duration: "00:57" },
  { id: "memory-7", date: "September 2", isoDate: "2026-09-02", time: "8:06 AM", context: "Personal", title: "Take the umbrella, not the good shoes", excerpt: "The practical note is the whole point: rain, wet shoes, class.", transcript: "It will rain. Take umbrella, dry shoes, charger. The brown pair can survive the walk; the good ones cannot.", tags: ["routine", "hostel", "morning"], duration: "00:31" },
  { id: "memory-8", date: "September 1", isoDate: "2026-09-01", time: "4:32 PM", context: "Planning", title: "Friday screening: pick one film and one person", excerpt: "A screening plan becomes real when it names the film and the argument it expects afterward.", transcript: "Friday: ask Vibhav whether he wants Taste of Cherry or Goodfellas. Do not make a ten-title poll. One film, one person, one thing we might disagree about.", tags: ["film", "friends", "planning"], duration: "00:44" },
  { id: "memory-9", date: "August 30", isoDate: "2026-08-30", time: "10:11 AM", context: "Research", title: "Read the lost-generation essay after lunch", excerpt: "The reading order matters less than preserving why this essay is on the desk today.", transcript: "Read the Lost Generation essay after lunch because the proposal needs a less romantic account of expatriation, not because I need another modernism label in the notes.", tags: ["literature", "research", "modernism"], duration: "01:24" },
  { id: "memory-10", date: "August 28", isoDate: "2026-08-28", time: "3:47 PM", context: "Personal", title: "The tea stall was shut after the rain", excerpt: "The closed stall, not the rain, is what made the walk feel unfamiliar.", transcript: "Tea stall closed after the rain. That is the detail to save from the walk, not a huge statement about the weather.", tags: ["walk", "rain", "memory"], duration: "00:52" },
];

export interface RecentTake {
  id: string;
  mode: WorkspaceMode;
  title: string;
  timestamp: string;
  duration: string;
  description: string;
}

const rawRecentTakes: RecentTake[] = [
  { id: "take-seat", mode: "utility", title: "Save me a seat at the screening", timestamp: "September 4, 11:31 PM", duration: "00:19", description: "Prepared for personal messaging." },
  { id: "take-shuttle", mode: "ambient", title: "Use the shuttle time for voice notes", timestamp: "September 4, 12:22 PM", duration: "00:24", description: "Filed under routine and capture workflow." },
  { id: "take-apps-email", mode: "utility", title: "Application question email", timestamp: "September 4, 3:27 PM", duration: "00:41", description: "Prepared for Gmail from a reusable skeleton." },
  { id: "take-groceries", mode: "utility", title: "Coffee, detergent, and eggs", timestamp: "September 4, 7:14 AM", duration: "00:13", description: "Routed to the personal planning list." },
  { id: "take-rainy-playlist", mode: "narratives", title: "A playlist should remember the walk", timestamp: "September 3, 8:42 PM", duration: "02:12", description: "Saved as a music and journal narrative." },
  { id: "take-wire", mode: "ambient", title: "Start The Wire rewatch with season two", timestamp: "September 3, 1:18 PM", duration: "00:36", description: "Saved as a shared rewatch note." },
  { id: "take-email-skeleton", mode: "utility", title: "Reusable application email skeleton", timestamp: "August 29, 12:16 PM", duration: "00:34", description: "Prepared for Email with personalisation points." },
  { id: "take-bookshop", mode: "ambient", title: "Do not buy a thousand-page book for the fantasy of it", timestamp: "September 1, 4:18 PM", duration: "00:33", description: "Filed under books, history, and reading." },
  { id: "take-developer", mode: "utility", title: "Research library import prompt", timestamp: "August 26, 2:44 PM", duration: "00:46", description: "Prepared for Cursor with stable field names." },
];

const claimedLegacyTitles = new Set<string>([
  ...narrationData,
  ...primaryConversationData,
  ...ambientMemoryData,
].map((item) => item.title));

function claimUniqueTitles<T>(items: T[], titleOf: (item: T) => string) {
  return items.filter((item) => {
    const title = titleOf(item);
    if (claimedLegacyTitles.has(title)) return false;
    claimedLegacyTitles.add(title);
    return true;
  });
}

// Legacy data only feeds History. Keep a single canonical instance of every
// visible title before the History projection merges it with live workspace data.
export const utilityData = claimUniqueTitles(rawUtilityData, (item) => item.artifact.label);
export const narrativeData = claimUniqueTitles(rawNarrativeData, (item) => item.title);
export const conversationData = claimUniqueTitles(rawConversationData, (item) => item.title);
export const memoryData = claimUniqueTitles(rawMemoryData, (item) => item.title);
export const recentTakes = claimUniqueTitles(rawRecentTakes, (item) => item.title);

export const utilityTargets = utilityData;
export const narratives = narrativeData;
export const conversations = conversationData;
export const memoryEntries = memoryData;

export const overviewData = {
  greeting: "Welcome to Kivi Styles",
  subheading: "A living index of the thoughts you have already trusted to your voice.",
  captureTotal: 42,
  captureChange: "+8 this week",
  rapidStarts: [
    { mode: "utility" as const, title: "Send a thought", description: "Route a quick capture to WhatsApp, Email, Dev notes, or an LLM prompt." },
    { mode: "narratives" as const, title: "Shape a narrative", description: "Turn a rough spoken idea into an editorial draft." },
    { mode: "conversations" as const, title: "Index a conversation", description: "Keep speaker turns, decisions, and follow-ups together." },
    { mode: "ambient" as const, title: "Find a memory", description: "Search moments by time, context, or tags." },
  ],
};
