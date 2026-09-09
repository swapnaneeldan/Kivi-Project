import type { WorkspaceMode } from "@/data/mockData";

type SpeakerTurn = { speaker: string; timestamp: string; endTimestamp: string; utterance: string; topic: string };
type ArticleSection = { heading: string; body: string };

export interface ResearchCapturePayload {
  id: string;
  mode: WorkspaceMode;
  title: string;
  duration: string;
  destination: string;
  rawTranscript: string;
  transformedOutput: string;
  summary: string;
  tags: string[];
  sections?: ArticleSection[];
  speakerTurns?: SpeakerTurn[];
}

export const researchCapturePool: ResearchCapturePayload[] = [
  {
    "id": "utility-crdt-local-first-contract",
    "mode": "utility",
    "title": "Local-first capture contract",
    "duration": "0:42",
    "destination": "Utility / developer",
    "rawTranscript": "Okay, for the capture path, write this down exactly: commit locally first, bro, then let remote enrichment be optional. If the classifier is late, the voice note still exists; do not make the user wait for a confidence score before we save the thing.",
    "transformedOutput": "type CaptureCommit = {\n  transcript: string;\n  localArtifactId: string;\n  routing?: { destination: StyleId; confidence: number };\n};\n\n// Persist locally before remote enrichment.\n// Manual destination override always wins.",
    "summary": "A local-first capture contract separates durable local commitment from optional remote enrichment. It keeps routing confidence informative rather than making it a gate that can lose a thought.",
    "tags": [
      "architecture",
      "local-first",
      "crdt",
      "routing"
    ]
  },
  {
    "id": "utility-barca-analysis-email",
    "mode": "utility",
    "title": "Barcelona analysis follow-up",
    "duration": "0:36",
    "destination": "Utility / email",
    "rawTranscript": "Send the note to the group: the point is not that Barça keep the ball for moral reasons. It is that the pivot and the far-side interior make the next pass safer, wait, say that without turning it into a lecture.",
    "transformedOutput": "Subject: Positional-play note\n\nHi all,\n\nThe useful point is not possession as an end in itself. The pivot and far-side interior give the next pass a safer structure, so the team can progress without treating every forward ball as a gamble.\n\nBest,\nSwapnaneel",
    "summary": "A spoken tactical clarification becomes a concise email without losing the distinction between possession and structural security. The output makes the football point actionable for a reading group rather than merely decorative.",
    "tags": [
      "football",
      "barcelona",
      "positional-play",
      "email"
    ]
  },
  {
    "id": "utility-routing-override-spec",
    "mode": "utility",
    "title": "Routing override acceptance criteria",
    "duration": "0:51",
    "destination": "Utility / developer",
    "rawTranscript": "Need a tiny spec for the router: show the inferred Style, show how sure it is, and let me change it before anything becomes final. Do not bury the override in settings; if the confidence is wrong, the correction should be one move.",
    "transformedOutput": "## Routing acceptance criteria\n- show destination and confidence before finalization\n- expose a one-step manual override\n- preserve the original transcript on every reroute\n- log the override as product feedback, not user error",
    "summary": "The capture router is framed as a reversible suggestion rather than an invisible classification lock. Keeping the original transcript visible makes a correction legible and preserves the record of the choice.",
    "tags": [
      "product",
      "routing-confidence",
      "manual-override",
      "ux"
    ]
  },
  {
    "id": "utility-remediation-brief",
    "mode": "utility",
    "title": "Remediation research brief",
    "duration": "0:47",
    "destination": "Utility / research copilot",
    "rawTranscript": "Make me a research prompt that asks what changes when a memory moves from a voice note to a card to a history row. I do not want the model saying media just carry content; ask it to identify what each form makes newly available or impossible.",
    "transformedOutput": "Act as a media-studies research assistant. Trace how a single voice capture changes as it is remediated into a transcript, an archival card, and a chronological ledger. Treat each medium as an active form that shapes recall; distinguish evidence from inference and preserve uncertainty.",
    "summary": "A research instruction translates Erll’s account of mediation into a concrete product-analysis prompt. It rejects the idea that interface layers are neutral containers for otherwise stable content.",
    "tags": [
      "cultural-memory",
      "remediation",
      "research",
      "prompt"
    ]
  },
  {
    "id": "utility-accessible-fatigue-note",
    "mode": "utility",
    "title": "Variable-capacity design note",
    "duration": "0:39",
    "destination": "Utility / work messaging",
    "rawTranscript": "Quick message for design: please stop making people prove they are organised before the app lets them save anything. On a tired day the system should hold an unfinished fragment and offer structure later, not punish the body for not having a folder ready.",
    "transformedOutput": "Design note: capture must remain useful on variable-capacity days. Preserve unfinished fragments first; offer structure, reminders, and labels later as optional support rather than prerequisites for saving.",
    "summary": "The message treats fatigue and executive-function variation as normal design conditions rather than exceptional failure states. It makes deferred organisation a product affordance instead of a hidden tax on the user.",
    "tags": [
      "accessibility",
      "fatigue",
      "executive-function",
      "product"
    ]
  },
  {
    "id": "utility-pressing-metrics-note",
    "mode": "utility",
    "title": "Press-resistance metric note",
    "duration": "0:44",
    "destination": "Utility / developer",
    "rawTranscript": "For the tactics dashboard, keep the pressure metric honest: a successful escape is not just one progressive pass. Count whether the first receiver has a third-man option and whether the rest defence survives the turnover, otherwise the graph lies.",
    "transformedOutput": "interface PressEscape {\n  progressivePass: boolean;\n  thirdManAvailable: boolean;\n  restDefenseShape: \"3-2\" | \"other\";\n  turnoverRecovered: boolean;\n}\n\n// Evaluate progression and post-loss security together.",
    "summary": "A technical note turns positional-play intuition into explicit analytical fields. It avoids reducing press resistance to a single forward action by retaining support geometry and post-loss protection.",
    "tags": [
      "football",
      "analytics",
      "rest-defense",
      "developer"
    ]
  },
  {
    "id": "narrative-third-man-run",
    "mode": "narratives",
    "title": "An all-time XI begins with a shape",
    "duration": "02:16",
    "destination": "Narratives / article",
    "rawTranscript": "An all-time XI is only interesting when the formation comes first. The players are not collectibles; each choice should explain what the next choice can do. I want the list to feel like a match is about to happen, not like a museum has opened.",
    "transformedOutput": "An all-time XI begins with a shape. The selection becomes meaningful when every player is chosen in relation to the next: cover, risk, timing, and the kind of football the side wants to make possible.",
    "summary": "A football-list note that treats formation as the argument behind the names.",
    "tags": [
      "football",
      "all-time XI",
      "formation",
      "lists"
    ],
    "sections": [
      {
        "heading": "Start with the shape",
        "body": "A formation prevents the list from becoming a collection of reputations. It asks what every player makes possible for the others."
      },
      {
        "heading": "Leave room for disagreement",
        "body": "The best XI is specific enough to invite a different one in reply."
      }
    ]
  },
  {
    "id": "narrative-tarkovsky-time-pressure",
    "mode": "narratives",
    "title": "A favourite-film list is a record of attention",
    "duration": "02:38",
    "destination": "Narratives / critical essay",
    "rawTranscript": "The films I keep returning to are not all there for the same reason. Some changed how I looked at a frame, some are for a particular mood, and some are there because I want to see what somebody else notices. The list should keep that difference alive.",
    "transformedOutput": "A favourite-film list is a record of attention rather than a final hierarchy. Its titles hold different promises: a return to form, a particular feeling, or a conversation that has not happened yet.",
    "summary": "A personal film-list note resolved into a compact editorial passage.",
    "tags": [
      "cinema",
      "favourite films",
      "watchlist",
      "attention"
    ],
    "sections": [
      {
        "heading": "Different reasons to return",
        "body": "A title can belong to a list because of what it teaches, what it recalls, or who it is waiting to be watched with."
      },
      {
        "heading": "Not a canon",
        "body": "The list remains honest when it records the reason rather than pretending the order is universal."
      }
    ]
  },
  {
    "id": "narrative-close-up-spectator",
    "mode": "narratives",
    "title": "Save the question beside the film",
    "duration": "02:04",
    "destination": "Narratives / critical essay",
    "rawTranscript": "Do not save a title with only the title. For Close-Up, keep the question about performance and wanting to belong near cinema. That way the next watch begins with something more useful than the pressure to have a perfect opinion.",
    "transformedOutput": "Save the question beside the film. A watchlist note can retain the thread that drew a viewer in, allowing the next encounter to begin with curiosity rather than a demand for a verdict.",
    "summary": "A watchlist fragment that keeps a live question beside a film title.",
    "tags": [
      "cinema",
      "kiarostami",
      "watchlist",
      "questions"
    ],
    "sections": [
      {
        "heading": "The case is replayed, not resolved",
        "body": "The real participants perform the event again, but replay does not deliver a stable original. It makes the conditions under which truth is wanted newly visible."
      },
      {
        "heading": "Spectatorship as involvement",
        "body": "The film turns the viewer’s demand for distance into part of its subject. We are asked to notice why we want cinema to authenticate one person’s longing and discredit another’s."
      }
    ]
  },
  {
    "id": "narrative-lynch-industrial-memory",
    "mode": "narratives",
    "title": "Eraserhead's hum is a note before it is an explanation",
    "duration": "01:57",
    "destination": "Narratives / article",
    "rawTranscript": "In Eraserhead, keep the hum and the room before trying to explain them. A sound that stays in the body is enough for the first note; later, it can tell you whether it belongs in an essay about industrial residue or just the memory of a screening.",
    "transformedOutput": "Eraserhead's hum is a note before it is an explanation. Its industrial sound keeps the room open as an atmosphere and an archive, preserving the route back before interpretation closes around it.",
    "summary": "An Eraserhead note that retains sound and space before settling their meaning.",
    "tags": [
      "cinema",
      "images",
      "notes",
      "atmosphere"
    ],
    "sections": [
      {
        "heading": "Sound before explanation",
        "body": "The hum arrives before the plot can justify it. It trains the body to understand that the room has a past, even when narrative information has not yet caught up."
      },
      {
        "heading": "A spatial archive",
        "body": "Industrial sound makes space feel less like a neutral container than a medium with residue. What it stores is not a fact but a pressure the characters must enter."
      }
    ]
  },
  {
    "id": "narrative-godfather-lake",
    "mode": "narratives",
    "title": "The lake scene in The Godfather Part II does not explain Michael",
    "duration": "02:21",
    "destination": "Narratives / critical essay",
    "rawTranscript": "For The Godfather Part II, do not use young Vito to make Michael understandable. Keep the lake, the family photograph, and the fact that the two timelines make the later solitude worse without offering a cure for it.",
    "transformedOutput": "The lake scene in The Godfather Part II does not explain Michael. The parallel timelines make family history an accusation: young Vito supplies a warmer image of kinship without redeeming the isolation that follows.",
    "summary": "A film note shaped around the parallel timelines, the family photograph, and Michael's irreducible solitude.",
    "tags": [
      "cinema",
      "watchlist",
      "attention",
      "future"
    ],
    "sections": [
      {
        "heading": "A warmer image",
        "body": "Young Vito gives the film a warmer image of kinship, not a moral correction. That contrast makes Michael's later solitude hurt without turning it into something the past can solve."
      },
      {
        "heading": "History as accusation",
        "body": "The lake scene leaves Michael beside a family memory he cannot re-enter. The two timelines remain uneven on purpose: one is not the explanation for the other."
      }
    ]
  },
  {
    "id": "narrative-kipple-index",
    "mode": "narratives",
    "title": "A rough list can stay rough",
    "duration": "01:49",
    "destination": "Narratives / essay note",
    "rawTranscript": "The half-finished list is not a failure. It might be a few players, a few films, or a sentence that has not found its argument yet. Keep it legible enough to return to, but do not dress it up as a conclusion.",
    "transformedOutput": "A rough list can stay rough. A fragment becomes useful when it retains enough of its original pressure to invite return without pretending to be a finished conclusion.",
    "summary": "A personal archive note about preserving unfinished lists without forcing closure.",
    "tags": [
      "notes",
      "lists",
      "memory",
      "archives"
    ],
    "sections": [
      {
        "heading": "Fragments as indices",
        "body": "A scrap matters when it can return a user to the moment that produced it. Its incompleteness is not a bug if the system keeps enough of its surrounding trace."
      },
      {
        "heading": "Against false completion",
        "body": "Cleaning every fragment into a polished note can destroy the uncertainty that made it useful. The interface should support revisiting, not counterfeit resolution."
      }
    ]
  },
  {
    "id": "conversation-six-second-counterpress",
    "mode": "conversations",
    "title": "Who belongs in the XI depends on the question",
    "duration": "06:12",
    "destination": "Conversations / football list",
    "rawTranscript": "Kshatriya: Are we choosing the best eleven or the team we would most want to watch? Neel: Those are different questions, and the formation changes with the answer. Pranav: Good, then write the question at the top before anyone starts fighting about the striker.",
    "transformedOutput": "Decision: name the football question before selecting the XI. Use formation and role to show whether the list values control, invention, intensity, or a particular kind of match.",
    "summary": "A football-list conversation that makes the selection criteria explicit.",
    "tags": [
      "football",
      "all-time XI",
      "formation",
      "debate"
    ],
    "speakerTurns": [
      {
        "speaker": "Kshatriya",
        "timestamp": "00:00",
        "endTimestamp": "00:18",
        "utterance": "Are we choosing the best eleven or the team we would most want to watch?",
        "topic": "selection question"
      },
      {
        "speaker": "Neel",
        "timestamp": "00:19",
        "endTimestamp": "00:37",
        "utterance": "Those are different questions, and the formation changes with the answer.",
        "topic": "formation"
      },
      {
        "speaker": "Pranav",
        "timestamp": "00:38",
        "endTimestamp": "00:56",
        "utterance": "Write the question at the top before anyone starts fighting about the striker.",
        "topic": "method"
      }
    ]
  },
  {
    "id": "conversation-inverted-fullback-rest-defense",
    "mode": "conversations",
    "title": "A list of series needs more than prestige",
    "duration": "07:08",
    "destination": "Conversations / television list",
    "rawTranscript": "Neelavo: Some shows are brilliant once and some are places you can actually return to. Kshatriya: Put both on the list, but say which is which. Neel: And save the season that becomes better once you know where the story is going.",
    "transformedOutput": "Decision: organise the series list by return rather than prestige. Mark the shows that invite a new entry point and the seasons that sharpen after the first watch.",
    "summary": "A television conversation about rewatching, return, and the difference between admiration and attachment.",
    "tags": [
      "television",
      "rewatch",
      "favourite series",
      "lists"
    ],
    "speakerTurns": [
      {
        "speaker": "Neelavo",
        "timestamp": "00:00",
        "endTimestamp": "00:17",
        "utterance": "Some shows are brilliant once and some are places you can actually return to.",
        "topic": "return"
      },
      {
        "speaker": "Kshatriya",
        "timestamp": "00:18",
        "endTimestamp": "00:32",
        "utterance": "Put both on the list, but say which is which.",
        "topic": "list structure"
      },
      {
        "speaker": "Neel",
        "timestamp": "00:33",
        "endTimestamp": "00:55",
        "utterance": "Save the season that becomes better once you know where the story is going.",
        "topic": "rewatch"
      }
    ]
  },
  {
    "id": "conversation-crdt-enrichment-boundary",
    "mode": "conversations",
    "title": "How to keep a political note from becoming a slogan",
    "duration": "08:34",
    "destination": "Conversations / political reading",
    "rawTranscript": "Neel: The first line should name the institution and the people affected. Vibhav: Then keep the part that is still uncertain. Kshatriya: Otherwise the note is only a posture with better punctuation.",
    "transformedOutput": "Decision: political notes should retain their condition: the institution, the people affected, and the unresolved question that prevents a claim from hardening into a slogan.",
    "summary": "A reading-group conversation about making political reflection precise without flattening it.",
    "tags": [
      "politics",
      "reading",
      "notes",
      "ethics"
    ],
    "speakerTurns": [
      {
        "speaker": "Neel",
        "timestamp": "00:00",
        "endTimestamp": "00:18",
        "utterance": "Name the institution and the people affected before you make the claim.",
        "topic": "conditions"
      },
      {
        "speaker": "Vibhav",
        "timestamp": "00:19",
        "endTimestamp": "00:34",
        "utterance": "Then keep the part that is still uncertain.",
        "topic": "uncertainty"
      },
      {
        "speaker": "Kshatriya",
        "timestamp": "00:35",
        "endTimestamp": "00:58",
        "utterance": "Otherwise the note is only a posture with better punctuation.",
        "topic": "precision"
      }
    ]
  },
  {
    "id": "conversation-routing-confidence-override",
    "mode": "conversations",
    "title": "What makes a recommendation worth sending",
    "duration": "05:51",
    "destination": "Conversations / film recommendations",
    "rawTranscript": "Pranav: Do not send me a title with no reason. Vibhav: Give me the scene, the feeling, or the person you thought of. Kshatriya: Then I can decide whether it is for tonight, later, or for us to argue about.",
    "transformedOutput": "Decision: pair every recommendation with a reason and a viewing condition. The title becomes an invitation rather than a demand for completion.",
    "summary": "A conversation about sending films and series with enough context to make the recommendation personal.",
    "tags": [
      "film",
      "recommendations",
      "watchlist",
      "friends"
    ],
    "speakerTurns": [
      {
        "speaker": "Pranav",
        "timestamp": "00:00",
        "endTimestamp": "00:18",
        "utterance": "Do not send me a title with no reason.",
        "topic": "recommendation"
      },
      {
        "speaker": "Vibhav",
        "timestamp": "00:19",
        "endTimestamp": "00:34",
        "utterance": "Give me the scene, feeling, or person you thought of.",
        "topic": "context"
      },
      {
        "speaker": "Kshatriya",
        "timestamp": "00:35",
        "endTimestamp": "00:53",
        "utterance": "Then I can decide whether it is for tonight, later, or for us to argue about.",
        "topic": "viewing condition"
      }
    ]
  },
  {
    "id": "conversation-prosthetic-memory-screening",
    "mode": "conversations",
    "title": "A film list can remember the people around it",
    "duration": "09:17",
    "destination": "Conversations / screening discussion",
    "rawTranscript": "Vibhav: I remember who recommended it before I remember the plot. Neel: That is useful information, not a distraction. Pranav: Keep the person and the question with the title so the list has a route back to the conversation.",
    "transformedOutput": "Decision: store the social route beside a film title. A recommendation retains its force when the sender, question, and anticipated conversation remain visible.",
    "summary": "A screening discussion about keeping the social life of a film inside the watchlist.",
    "tags": [
      "cinema",
      "friends",
      "watchlist",
      "memory"
    ],
    "speakerTurns": [
      {
        "speaker": "Vibhav",
        "timestamp": "00:00",
        "endTimestamp": "00:22",
        "utterance": "I remember who recommended it before I remember the plot.",
        "topic": "recommendation"
      },
      {
        "speaker": "Neel",
        "timestamp": "00:23",
        "endTimestamp": "00:41",
        "utterance": "That is useful information, not a distraction.",
        "topic": "social memory"
      },
      {
        "speaker": "Pranav",
        "timestamp": "00:42",
        "endTimestamp": "01:02",
        "utterance": "Keep the person and question with the title so the list has a route back.",
        "topic": "watchlist"
      }
    ]
  },
  {
    "id": "conversation-variable-capacity-ui",
    "mode": "conversations",
    "title": "A rough note is allowed to stay unfinished",
    "duration": "06:44",
    "destination": "Conversations / writing notes",
    "rawTranscript": "Kshatriya: A list can be three words and still be worth keeping. Vibhav: The next pass should be invited, not demanded. Neel: Right, unfinished is a state of attention, not a personal failing.",
    "transformedOutput": "Decision: preserve rough notes without forcing completion. A later pass can offer structure, but the first capture only needs to keep the original pressure intact.",
    "summary": "A conversation about treating unfinished notes as valid beginnings.",
    "tags": [
      "writing",
      "notes",
      "fragments",
      "care"
    ],
    "speakerTurns": [
      {
        "speaker": "Kshatriya",
        "timestamp": "00:00",
        "endTimestamp": "00:20",
        "utterance": "A list can be three words and still be worth keeping.",
        "topic": "fragments"
      },
      {
        "speaker": "Vibhav",
        "timestamp": "00:21",
        "endTimestamp": "00:39",
        "utterance": "The next pass should be invited, not demanded.",
        "topic": "return"
      },
      {
        "speaker": "Neel",
        "timestamp": "00:40",
        "endTimestamp": "00:58",
        "utterance": "Unfinished is a state of attention, not a personal failing.",
        "topic": "care"
      }
    ]
  },
  {
    "id": "memory-half-space-afterimage",
    "mode": "ambient",
    "title": "The XI stayed unfinished on purpose",
    "duration": "01:12",
    "destination": "Memory / Ambient Memory",
    "rawTranscript": "The list is only half there: a goalkeeper, a midfield, a feeling for how the team should move. Leave it. The missing names are part of the argument for now.",
    "transformedOutput": "September 7 · #football #all-time-XI #notes\n\nA partial XI is saved as an open formation: enough structure to return to, not enough certainty to close the debate.",
    "summary": "A football fragment preserved without forcing the selection into a final list.",
    "tags": [
      "football",
      "all-time XI",
      "notes"
    ]
  },
  {
    "id": "memory-close-up-bus-window",
    "mode": "ambient",
    "title": "Put the question beside the saved film",
    "duration": "00:54",
    "destination": "Memory / Ambient Memory",
    "rawTranscript": "For Close-Up, keep the question about performance and belonging, not a finished reading. The next watch should begin from curiosity.",
    "transformedOutput": "September 7 · #cinema #watchlist #questions\n\nThe saved title keeps its question: what does performance reveal about wanting to belong near cinema?",
    "summary": "A watchlist memory that preserves curiosity instead of a verdict.",
    "tags": [
      "cinema",
      "watchlist",
      "questions"
    ]
  },
  {
    "id": "memory-remediation-chain",
    "mode": "ambient",
    "title": "A political note needs the condition beside it",
    "duration": "01:03",
    "destination": "Memory / Ambient Memory",
    "rawTranscript": "Do not save the clean sentence by itself. Keep the institution, the people affected, and the thing that still needs to be tested.",
    "transformedOutput": "September 7 · #politics #notes #ethics\n\nA political thought remains useful when its condition travels with it: the system at stake, the people inside it, and the open question.",
    "summary": "A political note held in a form that remains precise and revisable.",
    "tags": [
      "politics",
      "notes",
      "ethics"
    ]
  },
  {
    "id": "memory-industrial-hum-library",
    "mode": "ambient",
    "title": "Write down the Bosch detail before it disappears",
    "duration": "00:47",
    "destination": "Memory / Ambient Memory",
    "rawTranscript": "The strange image is enough for now. Keep the colour and the figure; do not force the interpretation while the first reaction is still useful.",
    "transformedOutput": "September 7 · #art #Bosch #images\n\nA small visual detail is retained as a route back to the painting before explanation takes over.",
    "summary": "An art-memory fragment that keeps observation before interpretation.",
    "tags": [
      "art",
      "Bosch",
      "images"
    ]
  },
  {
    "id": "memory-fatigue-capture-rule",
    "mode": "ambient",
    "title": "A rough list does not need to become a project",
    "duration": "00:38",
    "destination": "Memory / Ambient Memory",
    "rawTranscript": "This is just a few titles, a few names, and a feeling for what belongs together. Save it without asking it to become a complete plan.",
    "transformedOutput": "September 7 · #lists #notes #fragments\n\nA rough list remains a valid capture: enough to return to, not yet asking for a conclusion.",
    "summary": "An unfinished list retained as a legitimate beginning.",
    "tags": [
      "lists",
      "notes",
      "fragments"
    ]
  },
  {
    "id": "memory-local-first-train",
    "mode": "ambient",
    "title": "Save the series that feels different now",
    "duration": "00:49",
    "destination": "Memory / Ambient Memory",
    "rawTranscript": "The rewatch note is simple: start with the season that changed after the first viewing. The point is not to prove it is still good; it is to see what I missed.",
    "transformedOutput": "September 7 · #television #rewatch #memory\n\nA rewatch begins with change: return to the season that now carries a different question.",
    "summary": "A television memory anchored to the changing experience of a return.",
    "tags": [
      "television",
      "rewatch",
      "memory"
    ]
  }
];

const curatedCaptureOrder: Partial<Record<WorkspaceMode, string[]>> = {
  narratives: [
    "narrative-godfather-lake",
    "narrative-third-man-run",
    "narrative-close-up-spectator",
    "narrative-lynch-industrial-memory",
    "narrative-tarkovsky-time-pressure",
    "narrative-kipple-index",
  ],
  conversations: [
    "conversation-crdt-enrichment-boundary",
    "conversation-routing-confidence-override",
    "conversation-prosthetic-memory-screening",
    "conversation-inverted-fullback-rest-defense",
    "conversation-six-second-counterpress",
    "conversation-variable-capacity-ui",
  ],
  ambient: [
    "memory-close-up-bus-window",
    "memory-half-space-afterimage",
    "memory-remediation-chain",
    "memory-local-first-train",
    "memory-industrial-hum-library",
    "memory-fatigue-capture-rule",
  ],
};

/** Capture order is a quality curation, not a routing rule. Utility retains its
 * original sequence and content; every other workspace begins with its richest
 * source-grounded examples. */
export const capturePoolForMode = (mode: WorkspaceMode) => {
  const preferredIds = curatedCaptureOrder[mode];
  if (!preferredIds) return researchCapturePool.filter((payload) => payload.mode === mode);
  return preferredIds.map((id) => {
    const payload = researchCapturePool.find((candidate) => candidate.id === id);
    if (!payload) throw new Error(`Missing curated capture payload: ${id}`);
    return payload;
  });
};
