import type { WorkspaceMode } from "@/data/mockData";
import { capturePoolForMode, type ResearchCapturePayload } from "@/data/researchCapturePool";

export interface ConversationTurn {
  speakerId: string;
  speakerName: string;
  text: string;
  timeRange: string;
  tag: string;
}

const speakerIds: Record<string, string> = { Neel: "01", Pranav: "02", Kshatriya: "03", Vibhav: "04", Neelavo: "05" };
const turnTags = ["ARCHITECTURE", "METRICS", "UI STATE", "DECISION"];

const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function parseRawTranscriptToTurns(rawTranscript: string): ConversationTurn[] {
  const matches = [...rawTranscript.matchAll(/([A-Z][a-z]+):/g)];
  if (matches.length === 0) return [{ speakerId: "01", speakerName: "Neel", text: rawTranscript.trim(), timeRange: "00:00–00:18", tag: "CAPTURED TAKE" }];
  const discoveredIds = new Map<string, string>();
  return matches.map((match, index) => {
    const speakerName = match[1];
    const nextBoundary = matches[index + 1]?.index ?? rawTranscript.length;
    const start = (match.index ?? 0) + match[0].length;
    const text = rawTranscript.slice(start, nextBoundary).trim();
    const speakerId = speakerIds[speakerName] ?? discoveredIds.get(speakerName) ?? String(discoveredIds.size + 1).padStart(2, "0");
    if (!speakerIds[speakerName]) discoveredIds.set(speakerName, speakerId);
    const rangeStart = Math.round((index * 70) / matches.length);
    const rangeEnd = Math.round(((index + 1) * 70) / matches.length);
    return { speakerId, speakerName, text, timeRange: `${clock(rangeStart)}–${clock(rangeEnd)}`, tag: turnTags[index % turnTags.length] };
  });
}

export interface StyleArtifact {
  id: string;
  mode: WorkspaceMode;
  title: string;
  timestamp: string;
  duration: string;
  destination: string;
  styleId: string;
  styleLabel: string;
  rawTranscript: string;
  transformedOutput: string;
  summary: string;
  createdAt: string;
  turns?: ConversationTurn[];
  speakerTurns?: Array<{ speaker: string; timestamp: string; endTimestamp: string; utterance: string; topic: string }>;
  /** Present for ambient captures so the calendar can index a capture without mutating its baseline dataset. */
  memoryDate?: string;
  tags?: string[];
  sections?: Array<{ heading: string; body: string }>;
  sourcePayloadId?: string;
}

export const styleProof = {
  raw: "hey can we move the launch review? the user calls are still shifting",
  outputs: [
    ["Messages", "Hey — can we move the launch review? The user calls are still shifting."],
    ["Email", "Hi team, could we move the launch review? The user calls are still shifting, and I’ll confirm a new time shortly."],
  ],
} as const;

export const seedStyleArtifacts: StyleArtifact[] = [
  {
    "id": "artifact-utility-launch-review",
    "mode": "utility",
    "title": "Launch review timing check",
    "timestamp": "September 6 · 6:18 PM",
    "duration": "0:18",
    "destination": "Utility / personal messaging",
    "styleId": "natural",
    "styleLabel": "natural",
    "rawTranscript": "hey can we move the launch review? the user calls are still shifting and I do not want to promise three if it is moving again",
    "transformedOutput": "Hey — can we move the launch review? The user calls are still shifting, and I don’t want to promise 3:00 PM if it moves again.",
    "summary": "A spoken scheduling note, prepared for linked personal messaging apps.",
    "createdAt": "2026-09-06T18:18:00+05:30"
  },
  {
    "id": "artifact-narrative-projection-booth",
    "mode": "narratives",
    "title": "The pizza shop brought Do the Right Thing back",
    "timestamp": "September 5 · 4:42 PM",
    "duration": "1:46",
    "destination": "Narratives / article",
    "styleId": "reader-ready",
    "styleLabel": "reader-ready",
    "rawTranscript": "I passed a pizza shop with the shutters half down and thought of Sal's before I remembered the plot. Save that, not just that Do the Right Thing is a favourite. The counter, the heat, the feeling that a whole block is inside one argument.",
    "transformedOutput": "The half-closed pizza shop was a better prompt than a ranking. It brought back the counter, the heat, and the sense that Do the Right Thing holds an entire neighbourhood inside one argument.",
    "summary": "A real-world cue resolved into a specific film-memory passage.",
    "createdAt": "2026-09-05T16:42:00+05:30"
  },
  {
    "id": "artifact-conversation-roadmap",
    "mode": "conversations",
    "title": "The midfield argument behind two all-time XIs",
    "timestamp": "September 4 · 7:05 PM",
    "duration": "18:24",
    "destination": "Conversations / football draft",
    "styleId": "speaker-aware",
    "styleLabel": "speaker-aware",
    "rawTranscript": "Neel: I take Xavi and Iniesta because I want to control the middle in small spaces. Pranav: Vibhav takes Pirlo and Kroos because he wants the first pass to arrive before the defence settles. Kshatriya: fine, but name the job of every player before you call either team better.",
    "transformedOutput": "Thread: the two all-time XIs describe rival ideas of control. Neel values circulation in tight spaces; Vibhav values early distribution. The group agreed to save roles and formation beside the names.",
    "summary": "A diarized football draft that preserves the reasoning behind each selection.",
    "createdAt": "2026-09-04T19:05:00+05:30"
  },
  {
    "id": "artifact-memory-night-walk",
    "mode": "ambient",
    "title": "The walk home had a Strokes-sized rhythm",
    "timestamp": "September 3 · 11:26 PM",
    "duration": "0:36",
    "destination": "Memory / Ambient Memory",
    "styleId": "archival",
    "styleLabel": "archival",
    "rawTranscript": "walking back from the library with The Strokes on, I started narrating the day like a scene instead of a checklist. Save the yellow light near the gate and the fact that nothing was resolved yet.",
    "transformedOutput": "Night walk from the library. The Strokes gave the unresolved day a borrowed rhythm; the yellow light near the gate became the cue that held the scene together.",
    "summary": "A music-linked night-walk fragment anchored to its route and mood.",
    "createdAt": "2026-09-03T23:26:00.000Z"
  },
  {
    "id": "artifact-utility-follow-up",
    "mode": "utility",
    "title": "Acknowledgement email",
    "timestamp": "September 2 · 10:11 AM",
    "duration": "0:24",
    "destination": "Utility / email",
    "styleId": "professional",
    "styleLabel": "professional",
    "rawTranscript": "write back to say I got the draft and I will send notes by Friday, keep it warm but do not overdo it",
    "transformedOutput": "Hi,\n\nThank you for sharing the draft. I’ve received it and will send my notes by Friday.\n\nBest,\nSwapnaneel",
    "summary": "A spoken instruction transformed into a concise email draft.",
    "createdAt": "2026-09-02T10:11:00.000Z"
  }
];

const captureTemplates: Array<Omit<StyleArtifact, "id" | "timestamp" | "createdAt" | "styleId" | "styleLabel">> = [
  {
    "mode": "utility",
    "title": "Launch review reschedule",
    "duration": "0:14",
    "destination": "Utility / personal messaging",
    "rawTranscript": "hey can we move the launch review? the user calls are still shifting",
    "transformedOutput": "",
    "summary": "A spoken scheduling note, prepared for linked personal messaging apps."
  },
  {
    "mode": "narratives",
    "title": "A watchlist should keep the reason for the title",
    "duration": "0:52",
    "destination": "Narratives / article",
    "rawTranscript": "save this with the reason, not just the name. Some films are for a quiet night, some are for a friend, and some are there because I know the argument after will be better than the review.",
    "transformedOutput": "A watchlist is more than a queue. Each title carries a condition of attention: a quiet evening, a particular friend, or the argument waiting after the credits.",
    "summary": "A raw watchlist note, resolved into a compact editorial passage.",
    "sections": [
      {
        "heading": "Keep the reason",
        "body": "A saved title becomes useful when it retains the question or person that made it worth saving."
      },
      {
        "heading": "Leave room",
        "body": "The watchlist should preserve curiosity without turning every film into homework."
      }
    ]
  },
  {
    "mode": "conversations",
    "title": "What an all-time XI is actually for",
    "duration": "0:31",
    "destination": "Conversations / football list",
    "rawTranscript": "Kshatriya: start with the formation or it is just famous names. Neel: and say what each player is doing for the others. Pranav: exactly, the argument is in the relationships, not the rating.",
    "transformedOutput": "Thread: build the XI from a formation and explain the relationships it creates. The list should reveal a view of football, not pretend to settle it.",
    "summary": "A diarized football conversation with its selection principle preserved.",
    "turns": [
      {
        "speakerId": "03",
        "speakerName": "Kshatriya",
        "text": "Start with the formation or it is just famous names.",
        "timeRange": "00:00–00:18",
        "tag": "FORMATION"
      },
      {
        "speakerId": "01",
        "speakerName": "Neel",
        "text": "Say what each player is doing for the others.",
        "timeRange": "00:18–00:42",
        "tag": "ROLES"
      },
      {
        "speakerId": "02",
        "speakerName": "Pranav",
        "text": "The argument is in the relationships, not the rating.",
        "timeRange": "00:42–01:10",
        "tag": "SELECTION"
      }
    ],
    "speakerTurns": [
      {
        "speaker": "Kshatriya",
        "timestamp": "00:00",
        "endTimestamp": "00:08",
        "utterance": "Start with the formation or it is just famous names.",
        "topic": "formation"
      },
      {
        "speaker": "Neel",
        "timestamp": "00:09",
        "endTimestamp": "00:18",
        "utterance": "Say what each player is doing for the others.",
        "topic": "roles"
      },
      {
        "speaker": "Pranav",
        "timestamp": "00:19",
        "endTimestamp": "00:29",
        "utterance": "The argument is in the relationships, not the rating.",
        "topic": "selection"
      }
    ]
  },
  {
    "mode": "ambient",
    "title": "Leave the Leicester story for a night that needs it",
    "duration": "0:27",
    "destination": "Memory / Ambient Memory",
    "rawTranscript": "save the Leicester season as a reminder that football can still surprise you without turning it into a slogan. It was a whole year of people recalibrating what seemed possible.",
    "transformedOutput": "September 6 · 9:14 PM · #football #Leicester #memory\n\nKeep the season as a story of attention changing week by week, not as proof that miracles are a strategy.",
    "summary": "A short football memory anchored to the feeling of a season becoming possible.",
    "tags": [
      "football",
      "Leicester",
      "memory"
    ]
  },
  {
    "mode": "narratives",
    "title": "A favourite-film list is an invitation, not a verdict",
    "duration": "1:08",
    "destination": "Narratives / article",
    "rawTranscript": "the list should not say these are the objectively best films. It should say these are the ones I would like to show someone because each one starts a different kind of conversation.",
    "transformedOutput": "A favourite-film list works best as an invitation. Its titles do not need to settle a canon; they can open different conversations about form, feeling, and return.",
    "summary": "A personal list note shaped into a reader-ready editorial draft.",
    "sections": [
      {
        "heading": "A list can invite",
        "body": "The title matters less than the reason it is being offered to someone else."
      },
      {
        "heading": "Against final rankings",
        "body": "Taste becomes more generous when a list leaves room for another person's memory and reply."
      }
    ]
  },
  {
    "mode": "narratives",
    "title": "A political note should keep its condition attached",
    "duration": "1:14",
    "destination": "Narratives / essay note",
    "rawTranscript": "when I make a political note, I do not want a sentence that only sounds certain. Keep the institution, the people affected, and the question it still cannot answer.",
    "transformedOutput": "A political note is more useful when it keeps its condition attached: the institution at stake, the people affected, and the question the first claim has not yet settled.",
    "summary": "A rough political reflection shaped into a reader-ready argument.",
    "sections": [
      {
        "heading": "Precision before posture",
        "body": "The note should name the actual condition it is trying to understand rather than merely announce a position."
      },
      {
        "heading": "Leave the question open",
        "body": "A usable thought can remain provisional while still being clear about the stakes."
      }
    ]
  },
  {
    "mode": "narratives",
    "title": "The series list is really a map of return",
    "duration": "0:58",
    "destination": "Narratives / article",
    "rawTranscript": "the favourite series are not all the same kind of good. Some are worlds I want to enter again, some are one perfect season, and some are there because the first watch changed what I thought television could do.",
    "transformedOutput": "A favourite-series list is a map of return. It separates the worlds a viewer revisits from the single seasons that remain unforgettable, and keeps the changing reasons for each return in view.",
    "summary": "A spoken television note resolved into a short editorial passage.",
    "sections": [
      {
        "heading": "Different kinds of return",
        "body": "A rewatchable world and an unforgettable first viewing make different claims on attention."
      },
      {
        "heading": "Keep the changing reason",
        "body": "The note beside a series can record what shifts when the viewer comes back years later."
      }
    ]
  },
  {
    "mode": "conversations",
    "title": "Which series are worth returning to",
    "duration": "0:44",
    "destination": "Conversations / television list",
    "rawTranscript": "Kshatriya: do not just put the famous shows in order. Neel: say which one you would actually start again tomorrow. Pranav: and which season looks different once you know where the whole thing goes.",
    "transformedOutput": "Thread: rank television by return, not reputation. Record the series that invite a new entry point and the seasons that become sharper on a rewatch.",
    "summary": "A speaker-aware conversation about series, rewatching, and return.",
    "speakerTurns": [
      {
        "speaker": "Kshatriya",
        "timestamp": "00:00",
        "endTimestamp": "00:09",
        "utterance": "Do not just rank the famous shows. Which one would you actually start again tomorrow?",
        "topic": "return"
      },
      {
        "speaker": "Neel",
        "timestamp": "00:10",
        "endTimestamp": "00:18",
        "utterance": "And say which season looks different once you know where the whole thing goes.",
        "topic": "rewatch"
      },
      {
        "speaker": "Pranav",
        "timestamp": "00:19",
        "endTimestamp": "00:29",
        "utterance": "That is the useful split: reputation is one thing; wanting to return is another.",
        "topic": "list criteria"
      }
    ]
  },
  {
    "mode": "conversations",
    "title": "A list of films should preserve the next conversation",
    "duration": "0:49",
    "destination": "Conversations / screening notes",
    "rawTranscript": "Vibhav: save the title with the person you want to talk to after. Kshatriya: otherwise it becomes another tab. Neel: the whole point is that some endings get better when you have to explain what stayed with you.",
    "transformedOutput": "Thread: store the person and question beside a film title. Some endings are most valuable as the beginning of a later conversation.",
    "summary": "A diarized discussion about watchlists as social memory.",
    "speakerTurns": [
      {
        "speaker": "Vibhav",
        "timestamp": "00:00",
        "endTimestamp": "00:11",
        "utterance": "Save the title with the person you want to talk to after; otherwise it becomes another tab.",
        "topic": "watchlist"
      },
      {
        "speaker": "Kshatriya",
        "timestamp": "00:12",
        "endTimestamp": "00:23",
        "utterance": "And keep the question beside it. A rating does not tell me why you sent it.",
        "topic": "context"
      },
      {
        "speaker": "Neel",
        "timestamp": "00:24",
        "endTimestamp": "00:36",
        "utterance": "Some endings get better only when you have to explain what stayed with you.",
        "topic": "later conversation"
      }
    ]
  },
  {
    "mode": "conversations",
    "title": "A worn projector changes the performance",
    "duration": "0:42",
    "destination": "Conversations / screening notes",
    "rawTranscript": "Pranav: the print looks almost too clean on that projector. Vibhav: no, the scratches help, they make the performance feel less sealed. Kshatriya: yeah, like the room has a say in it too.",
    "transformedOutput": "Thread: the worn projection was read as part of the performance, making the room and apparatus visible rather than incidental.",
    "summary": "A short speaker-aware conversation about projection, performance, and the room.",
    "speakerTurns": [
      {
        "speaker": "Pranav",
        "timestamp": "00:00",
        "endTimestamp": "00:08",
        "utterance": "The print looks almost too clean on that projector, which is funny given how battered the room is.",
        "topic": "projection"
      },
      {
        "speaker": "Vibhav",
        "timestamp": "00:09",
        "endTimestamp": "00:20",
        "utterance": "No, the scratches help. They make the performance feel less sealed off from us.",
        "topic": "apparatus"
      },
      {
        "speaker": "Kshatriya",
        "timestamp": "00:21",
        "endTimestamp": "00:32",
        "utterance": "Yeah, like the room has a say in it too. It is not just receiving the film.",
        "topic": "audience space"
      }
    ]
  },
  {
    "mode": "ambient",
    "title": "Save the film with the person beside it",
    "duration": "0:36",
    "destination": "Memory / Ambient Memory",
    "rawTranscript": "put this on the two-person watchlist. I do not want to turn the ending into a rating before I have had the chance to talk it through.",
    "transformedOutput": "September 6 · 11:26 PM · #film #watchlist #friends\n\nSave the title with the conversation it is waiting for, not only the expectation that it must be completed.",
    "summary": "A social watchlist fragment attached to the conversation it anticipates.",
    "tags": [
      "film",
      "watchlist",
      "friends"
    ]
  },
  {
    "mode": "ambient",
    "title": "Write down the Bosch image before the interpretation",
    "duration": "0:33",
    "destination": "Memory / Ambient Memory",
    "rawTranscript": "do not try to explain the whole painting yet. Keep the figure, colour, or detail that made the room feel strange, then come back when there is more to say.",
    "transformedOutput": "September 6 · 4:18 PM · #art #Bosch #notes\n\nKeep the image before the interpretation. A strange detail is enough to make a future return possible.",
    "summary": "A small art note that keeps observation separate from explanation.",
    "tags": [
      "art",
      "Bosch",
      "notes"
    ]
  },
  {
    "mode": "ambient",
    "title": "A rough list can remain a rough list",
    "duration": "0:29",
    "destination": "Memory / Ambient Memory",
    "rawTranscript": "this is only a few names and an idea of a formation. Do not make it sound finished. The point is to leave enough here for the football argument to continue later.",
    "transformedOutput": "September 6 · 2:06 PM · #football #lists #ideas\n\nA partial XI is not unfinished research; it is the beginning of an argument worth returning to.",
    "summary": "A fragmentary football note retained without forced completion.",
    "tags": [
      "football",
      "lists",
      "ideas"
    ]
  }
];

export const narrativeCapturePool = captureTemplates.filter((template) => template.mode === "narratives");
export const conversationCapturePool = captureTemplates.filter((template) => template.mode === "conversations");
export const memoryCapturePool = captureTemplates.filter((template) => template.mode === "ambient");

const utilityCaptureTemplates: Array<Omit<StyleArtifact, "id" | "timestamp" | "createdAt" | "styleId" | "styleLabel">> = [
  captureTemplates[0],
  {
    mode: "utility",
    title: "Draft received confirmation",
    duration: "0:21",
    destination: "Utility / email",
    rawTranscript: "send a quick acknowledgement to Maya, say I have the draft and will send notes by Friday. Keep it warm, no essay.",
    transformedOutput: "To: Maya\nSubject: Draft received\n\nHi Maya,\n\nThanks for sending this through. I have the draft and will send my notes by Friday.\n\nBest,\nSwapnaneel",
    summary: "A short spoken instruction, shaped into an email draft.",
  },
  {
    mode: "utility",
    title: "Capture routing instruction",
    duration: "0:19",
    destination: "Utility / developer",
    rawTranscript: "for the capture response, keep the identifiers as they are and return the routing confidence. Do not bury it in another object.",
    transformedOutput: "// capture response\nreturn {\n  transcript,\n  destination,\n  routingConfidence,\n};\n\n// Preserve existing identifiers.",
    summary: "A spoken developer instruction, resolved into a compact implementation note.",
  },
];

export type UtilityCaptureContext = "personal" | "work" | "email" | "developer" | "other";
type UtilityCaptureTemplate = Omit<StyleArtifact, "id" | "timestamp" | "createdAt" | "styleId" | "styleLabel">;

const utilityCaptureScenarios: Record<UtilityCaptureContext, Array<{ title: string; raw: string; destination: string; tags: string[]; outputs: Record<string, string> }>> = {
  personal: [
    { title: "Dinner plan, without the group-chat essay", raw: "tell Pranav I am running late because the library printer ate the last pages, ask if he can keep the table for twenty minutes", destination: "Utility / personal messaging", tags: ["personal", "message"], outputs: { natural: "Hey, the library printer ate the last pages of my printout, so I’m running late. Could you keep the table for twenty minutes?", "very-casual": "hey printer ate my last pages lol, running late — can you hold the table 20?", polished: "Hi Pranav — the library printer delayed me, so I’m running late. Could you please keep the table for another twenty minutes?" } },
    { title: "A film recommendation with an actual invitation", raw: "message Neelavo that I finally watched Close-Up and want to talk after they see it, do not make it sound like homework", destination: "Utility / personal messaging", tags: ["personal", "film"], outputs: { natural: "I finally watched Close-Up. See it when you have the space — I really want to talk about it afterwards, not assign you reading.", "very-casual": "finally watched close-up. watch when you have time? i need to talk about it after, not in a homework way", polished: "I finally watched Close-Up. If you get the chance to see it, I would love to talk about it afterwards — no homework implied." } },
  ],
  work: [
    { title: "Research review moved, with a usable next step", raw: "send Slack update that the research review needs to move because two interviews slipped, say what is still ready and ask people to comment on the synthesis by Thursday", destination: "Utility / work messaging", tags: ["work", "slack"], outputs: { clear: "Quick update: two interviews slipped, so we’re moving the research review. The synthesis is ready now; please add comments by Thursday so we can set a new meeting with the evidence in hand.", casual: "quick update: two interviews slipped, so moving the review. synthesis is ready though — comments by thursday would help us lock the new slot.", formal: "Please note that the research review will be rescheduled because two interviews have moved. The synthesis is available now; comments by Thursday will allow us to schedule the review with the full evidence." } },
    { title: "A clear handoff before the stand-up", raw: "tell the team the capture bug is fixed, mention it was the route state after refresh, ask QA to test memory first capture and utility styles", destination: "Utility / work messaging", tags: ["work", "handoff"], outputs: { clear: "Capture after refresh is fixed: the route state was being read too late. QA: please test Memory’s first capture and Utility Styles across contexts.", casual: "capture-after-refresh is fixed — route state was getting read too late. QA, can you hit Memory first capture + a few Utility Styles contexts?", formal: "The capture-after-refresh issue has been resolved; route state was read after capture began. Please test Memory’s first capture and Utility Styles across their available contexts." } },
  ],
  email: [
    { title: "A warm, bounded request for feedback", raw: "email Maya the draft is attached, ask for comments on the argument not line edits, say I need them by Friday afternoon", destination: "Utility / email", tags: ["email", "feedback"], outputs: { professional: "To: Maya\nSubject: Draft — feedback on the argument\n\nHi Maya,\n\nI’ve attached the draft. Could you focus your comments on the argument and structure rather than line edits? If possible, I’d appreciate them by Friday afternoon.\n\nBest,\nSwapnaneel", friendly: "To: Maya\nSubject: Draft attached\n\nHi Maya,\n\nSending the draft over. When you have a moment, I’d especially value your read on the argument and structure rather than line edits. Friday afternoon would be ideal, if that works.\n\nThanks,\nSwapnaneel", formal: "To: Maya\nSubject: Request for feedback on attached draft\n\nDear Maya,\n\nPlease find the draft attached. I would be grateful for feedback on its central argument and structure, rather than line-level edits, by Friday afternoon.\n\nKind regards,\nSwapnaneel" } },
    { title: "A concise scheduling confirmation", raw: "write an email confirming Thursday at two for the project review, include the agenda and say I will send the notes beforehand", destination: "Utility / email", tags: ["email", "scheduling"], outputs: { professional: "To: Project team\nSubject: Thursday review — 2:00 PM\n\nHi all,\n\nConfirming our project review for Thursday at 2:00 PM. We’ll cover the current synthesis, open decisions, and next steps. I’ll send the notes beforehand.\n\nBest,\nSwapnaneel", friendly: "To: Project team\nSubject: Thursday at 2:00 PM\n\nHi all,\n\nThursday at 2:00 PM works for the review. We’ll look at the synthesis, open decisions, and next steps; I’ll send notes beforehand so we can use the time well.\n\nBest,\nSwapnaneel", formal: "To: Project team\nSubject: Confirmation of project review\n\nDear all,\n\nThis confirms the project review for Thursday at 2:00 PM. The agenda will cover the current synthesis, outstanding decisions, and subsequent steps. Notes will be circulated in advance.\n\nKind regards,\nSwapnaneel" } },
  ],
  developer: [
    { title: "Route-aware capture regression test", raw: "write a developer task to preserve the route at capture start so memory does not fall back to overview after refresh, include acceptance criteria", destination: "Utility / developer", tags: ["developer", "capture"], outputs: { clear: "Task: preserve the active route when capture starts.\n\nAcceptance criteria:\n- Memory’s first capture after refresh stays in Memory.\n- The captured artifact uses the route captured at start, not completion.\n- Add a regression test for the refresh path.", concise: "Preserve route on capture start.\n\nAC: first Memory capture after refresh stays in Memory; completion cannot read Overview; add regression coverage.", structured: "## Task\nPersist the active route at capture start.\n\n## Acceptance criteria\n- first post-refresh Memory capture remains in Memory\n- completion reads the captured route\n- regression test covers refresh\n\n## Constraint\nDo not change capture UI." } },
    { title: "Utility context passed into generation", raw: "write implementation note that styles generator needs selected context plus style id, do not let email output leak into developer or personal messaging", destination: "Utility / developer", tags: ["developer", "styles"], outputs: { clear: "Pass both `utilityContext` and `styleId` into artifact generation. Select a context-specific template before formatting. Never reuse Email output for Developer or Personal Messaging.", concise: "Pass `utilityContext` + `styleId` to generation. Pick context template first; no cross-category fallbacks.", structured: "## Task\nPass `utilityContext` and `styleId` to the generator.\n\n## Rules\n- choose the context template first\n- apply the selected style second\n- prohibit cross-category fallback output" } },
  ],
  other: [
    { title: "A browser note worth finding later", raw: "save a short note from the article about memory studies, keep the question about who gets to preserve a record and add a reading follow up", destination: "Utility / other apps", tags: ["note", "theory"], outputs: { balanced: "Question from the memory-studies article: who gets to preserve a record, and who is left outside it?\n\nFollow up: read the cited chapter before using this in the essay.", minimal: "Memory studies: who gets to preserve the record?\n\nRead cited chapter.", polished: "Question for the reading notes: who is permitted to preserve a record, and who remains outside its archive?\n\nFollow-up: read the cited chapter before carrying this claim into the essay." } },
    { title: "A reading note with the next action", raw: "make a Finder note that I need to scan the Barcelona history chapter and compare the section on club identity with my old notes", destination: "Utility / other apps", tags: ["note", "reading"], outputs: { balanced: "Scan the Barcelona history chapter. Then compare its account of club identity with the older notes before drafting anything.", minimal: "Scan Barça history chapter; compare club-identity section with old notes.", polished: "Scan the Barcelona history chapter, then compare its discussion of club identity with the earlier notes before beginning a draft." } },
  ],
};

function createUtilityCapturedTemplate(context: UtilityCaptureContext, styleId: string, captureIndex: number): UtilityCaptureTemplate {
  const scenario = utilityCaptureScenarios[context][captureIndex % utilityCaptureScenarios[context].length];
  const fallbackStyle = context === "personal" ? "natural" : context === "work" || context === "developer" ? "clear" : context === "email" ? "professional" : "balanced";
  return {
    mode: "utility",
    title: scenario.title,
    duration: "0:24",
    destination: scenario.destination,
    rawTranscript: scenario.raw,
    transformedOutput: scenario.outputs[styleId] ?? scenario.outputs[fallbackStyle],
    summary: `A ${context.replace(/other/, "general")}-context capture shaped in the selected ${styleId.replace(/-/g, " ")} style.`,
    tags: scenario.tags,
  };
}

export function createCapturedStyleArtifact(styleId = "natural", preferredMode?: WorkspaceMode, captureIndex = 0, payload?: ResearchCapturePayload, utilityContext: UtilityCaptureContext = "personal"): StyleArtifact {
  const now = new Date();
  const timestamp = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(now);
  const captureDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(now);
  const availableTemplates = preferredMode === "narratives" ? narrativeCapturePool : preferredMode === "conversations" ? conversationCapturePool : preferredMode === "ambient" ? memoryCapturePool : preferredMode ? captureTemplates.filter((candidate) => candidate.mode === preferredMode) : captureTemplates;
  // A route-specific capture without a supplied payload still deserves the same
  // high-detail source material as the normal capture flow. Utility deliberately
  // continues to use its existing structured templates.
  const curatedFallback = preferredMode && preferredMode !== "utility"
    ? capturePoolForMode(preferredMode)[captureIndex % capturePoolForMode(preferredMode).length]
    : undefined;
  const contextualUtilityTemplate = preferredMode === "utility" ? createUtilityCapturedTemplate(utilityContext, styleId, captureIndex) : undefined;
  const baseTemplate = contextualUtilityTemplate ?? payload ?? curatedFallback ?? availableTemplates[captureIndex % availableTemplates.length] ?? captureTemplates[0];
  const template = contextualUtilityTemplate ?? payload ?? (baseTemplate.mode === "utility" ? utilityCaptureTemplates[captureIndex % utilityCaptureTemplates.length] ?? utilityCaptureTemplates[0] : baseTemplate);
  const templateTurns = "turns" in template ? template.turns : undefined;
  const isUtilityCapture = preferredMode === "utility";
  const isMemoryCapture = preferredMode === "ambient" && template.mode === "ambient";
  const memoryDate = isMemoryCapture ? now.toISOString().slice(0, 10) : undefined;
  const transformedOutput = isMemoryCapture ? template.transformedOutput.replace(/September\s+\d+/g, captureDate) : template.transformedOutput;
  return {
    id: `artifact-capture-${now.getTime()}`,
    mode: template.mode,
    title: template.title,
    timestamp: isMemoryCapture ? `${captureDate} · ${timestamp}` : `Today · ${timestamp}`,
    duration: template.duration,
    destination: template.destination,
    styleId: isUtilityCapture ? styleId : template.mode === "narratives" ? "reader-ready" : template.mode === "conversations" ? "speaker-aware" : template.mode === "ambient" ? "archival" : "structured",
    styleLabel: isUtilityCapture ? styleId.replace(/-/g, " ") : template.mode === "narratives" ? "reader-ready" : template.mode === "conversations" ? "speaker-aware" : template.mode === "ambient" ? "archival" : "structured",
    rawTranscript: template.rawTranscript,
    transformedOutput,
    summary: template.summary,
    createdAt: now.toISOString(),
    turns: template.mode === "conversations" ? templateTurns ?? parseRawTranscriptToTurns(template.rawTranscript) : undefined,
    speakerTurns: template.speakerTurns,
    memoryDate,
    tags: template.tags,
    sections: template.sections,
    sourcePayloadId: isUtilityCapture ? undefined : payload?.id,
  };
}
