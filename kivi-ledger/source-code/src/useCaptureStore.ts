"use client";

import { useCallback, useMemo, useState } from "react";
import type { WorkspaceMode } from "@/data/mockData";
import { capturePoolForMode, type ResearchCapturePayload } from "@/data/researchCapturePool";
import type { StyleArtifact } from "@/data/styleArtifacts";

type GeneratedCapture = Pick<ResearchCapturePayload, "title" | "summary"> & {
  rawAddition: string;
  outputAddition: string;
};

/**
 * Purpose-written continuations for the finite capture pool. Each one is
 * anchored to its source topic, so capture remains productive without adding
 * labels such as "later return" or crossing subjects.
 */
const generatedCaptures: Record<string, GeneratedCapture> = {
  "narrative-third-man-run": {
    title: "The midfield tells you what an all-time XI is for",
    rawAddition: "Start with the midfield triangle: who receives under pressure, who arrives beyond the ball, and who protects the loss. The striker choice can wait until the side has a way of getting him the ball.",
    outputAddition: "The midfield tells an all-time XI what it is for. Before choosing a striker, the list should establish who receives under pressure, who runs beyond the ball, and who protects the team when the move breaks.",
    summary: "A formation-led football note that makes the midfield, rather than reputation, organise the XI.",
  },
  "narrative-tarkovsky-time-pressure": {
    title: "A favourite-film list needs reasons, not ranks",
    rawAddition: "Put a reason beside each title: a frame to study, a mood to return to, or somebody who should see it with me. The number beside the film is the least interesting part.",
    outputAddition: "A favourite-film list becomes personal when every title keeps its reason for being there: a formal lesson, a remembered mood, or a conversation still waiting to happen.",
    summary: "A film-list note that replaces empty ranking with the distinct reasons a film remains alive.",
  },
  "narrative-close-up-spectator": {
    title: "Close-Up keeps the question moving",
    rawAddition: "The question is not whether Sabzian is simply sincere or simply performing. Keep the discomfort of wanting a clean answer, because the film keeps moving the ground beneath that demand.",
    outputAddition: "Close-Up keeps the question moving. Its power lies in refusing the comfort of a clean verdict on performance, sincerity, and the desire to belong near cinema.",
    summary: "A Close-Up note shaped around the film's refusal to settle performance into a verdict.",
  },
  "narrative-lynch-industrial-memory": {
    title: "A hum can outlast an explanation",
    rawAddition: "The industrial drone is not background texture. It makes the apartment feel like it has been listening before the scene begins, which is more useful than calling it merely surreal.",
    outputAddition: "The industrial hum outlasts explanation. In Eraserhead, sound gives the apartment a history that the plot cannot fully disclose, making atmosphere itself part of the record.",
    summary: "An Eraserhead observation that treats industrial sound as history rather than decorative strangeness.",
  },
  "narrative-godfather-lake": {
    title: "The photograph makes the lake scene harder to escape",
    rawAddition: "Keep the family photograph beside the lake scene. Young Vito is not a redemption arc for Michael; the point is that the warmer timeline makes the later silence feel chosen without making it simple.",
    outputAddition: "The family photograph makes the lake scene harder to escape. The Godfather Part II uses young Vito's warmer history as a contrast that deepens Michael's isolation without explaining it away.",
    summary: "A Godfather Part II note that keeps the parallel timelines as a source of pressure rather than a solution.",
  },
  "narrative-kipple-index": {
    title: "The unfinished list already has a shape",
    rawAddition: "A list of three names can show a preference before it becomes an argument. Keep the sequence and the hesitation; both explain what the next entry will have to answer.",
    outputAddition: "An unfinished list already has a shape. Its sequence and hesitation reveal the argument taking form, without forcing the fragment to impersonate a conclusion.",
    summary: "A note on how an incomplete list can preserve a real emerging argument.",
  },
  "conversation-six-second-counterpress": {
    title: "The striker argument starts after the formation",
    rawAddition: "Kshatriya: If the midfield cannot receive through pressure, the striker is just a poster. Neel: Exactly; choose the shape first, then argue about who finishes it. Pranav: Good, that gives the list an actual match to imagine.",
    outputAddition: "The group returns to the formation before the striker debate: midfield access and defensive cover determine what kind of forward the XI can support.",
    summary: "A football conversation that makes formation the condition for arguing about personnel.",
  },
  "conversation-inverted-fullback-rest-defense": {
    title: "A rewatch list is not an awards ballot",
    rawAddition: "Neelavo: I can admire something and never want to live inside it again. Kshatriya: Then give it a prestige label, not a return label. Neel: And put the season beside the reason it changed on the second watch.",
    outputAddition: "The group separates prestige from return: a series can be admired once, while another becomes meaningful because a later watch changes its texture.",
    summary: "A television conversation that distinguishes acclaim from the desire to revisit a world.",
  },
  "conversation-crdt-enrichment-boundary": {
    title: "Political certainty needs a named condition",
    rawAddition: "Neel: Say what the policy changes for the person who cannot opt out. Vibhav: And admit where the evidence stops. Kshatriya: Otherwise liberal language becomes a way of sounding humane without naming power.",
    outputAddition: "The discussion insists that political conviction name institutional power, lived consequence, and the edge of available evidence before it claims certainty.",
    summary: "A political conversation that resists replacing material conditions with elegant posture.",
  },
  "conversation-routing-confidence-override": {
    title: "A recommendation needs its scene attached",
    rawAddition: "Pranav: Tell me the scene you are trying to hand over, not the Letterboxd verdict. Vibhav: Or the hour you watched it. Kshatriya: Then I know whether you are recommending a film or inviting a conversation.",
    outputAddition: "The group agrees that a recommendation earns its place through a scene, a viewing condition, or a shared question—not through a rating alone.",
    summary: "A recommendation conversation that turns a title into a specific invitation.",
  },
  "conversation-prosthetic-memory-screening": {
    title: "The sender belongs beside the film title",
    rawAddition: "Vibhav: I want to know why you sent it on that particular Tuesday. Neel: That is part of the film's life with us. Pranav: Save the message, then; not only the title.",
    outputAddition: "The screening note keeps the sender's timing and reason beside the film, preserving the social route through which the viewing became meaningful.",
    summary: "A conversation about retaining the social history of a recommendation.",
  },
  "conversation-variable-capacity-ui": {
    title: "Three words can still be a record",
    rawAddition: "Kshatriya: 'Pedri, wet shoes, season two' is enough if I know why I wrote it. Vibhav: The system can ask later; it should not turn a tired day into a test. Neel: Save first, organise when there is capacity.",
    outputAddition: "The conversation treats minimal capture as a valid record: preserve the fragment first, then invite organisation only when the person has capacity for it.",
    summary: "A conversation that frames tiny notes as evidence of attention, not failed organisation.",
  },
  "memory-half-space-afterimage": {
    title: "The missing names are part of the XI",
    rawAddition: "The paper still has the goalkeeper and three midfielders, but no striker. That gap is the point: the team is waiting for an argument about what kind of football it should play.",
    outputAddition: "September 9 · #football #all-time-XI #notes\n\nThe unfilled positions remain part of the record. The XI is still asking what kind of football it is meant to make possible.",
    summary: "A football memory where an empty position keeps the tactical question alive.",
  },
  "memory-close-up-bus-window": {
    title: "Close-Up stays open on the bus home",
    rawAddition: "The bus window caught my reflection over a dark shopfront, and I remembered that I still do not know whether the film wants us to solve Sabzian or sit with the wanting.",
    outputAddition: "September 9 · #cinema #Close-Up #bus\n\nA dark bus window recalled Close-Up's unsettled question: whether spectatorship asks for a verdict when the film asks for attention.",
    summary: "A bus-window cue that brings back Close-Up's unresolved question about performance and spectatorship.",
  },
  "memory-remediation-chain": {
    title: "The political sentence carries its people with it",
    rawAddition: "I crossed out the neat line because it had no one inside it. Wrote the tenant, the agency, and the missing information in the margin instead.",
    outputAddition: "September 9 · #politics #notes #ethics\n\nThe revised note names the tenant, the agency, and the missing evidence before it lets the argument sound finished.",
    summary: "A political memory that keeps people and institutions inside a revisable claim.",
  },
  "memory-industrial-hum-library": {
    title: "The Bosch colour comes before its meaning",
    rawAddition: "At the library screen, the green looked almost artificial against the beige interface. I wrote down the colour first because explanation would have made it disappear too quickly.",
    outputAddition: "September 9 · #art #Bosch #library\n\nA green detail on a library screen is saved before interpretation, preserving the visual route back to the painting.",
    summary: "A library-screen memory that keeps a Bosch colour available before analysis.",
  },
  "memory-fatigue-capture-rule": {
    title: "The list does not owe anyone a conclusion",
    rawAddition: "Three album names were in the notes app beside a half-sentence about rain. I left them there; making categories would have been work for a different day.",
    outputAddition: "September 9 · #music #lists #notes\n\nThree album names and a half-sentence remain intact. The capture is useful without becoming a project.",
    summary: "A music-list fragment preserved without imposing organisation on a tired day.",
  },
  "memory-local-first-train": {
    title: "Season two changes when return becomes the point",
    rawAddition: "The docks came back first, not the plot. I remembered waiting for the usual characters and then realising the season had already taught me how narrow that expectation was.",
    outputAddition: "September 9 · #television #TheWire #rewatch\n\nThe Wire's second season returns through the docks and the memory of resisting its new centre, not through a plot summary.",
    summary: "A rewatch memory that locates The Wire's second season in the experience of changed expectation.",
  },
};

/**
 * Session-level selector for new captures. It never returns an already visible
 * research payload, including entries restored from a previous local session.
 */
export function useCaptureStore(existingArtifacts: StyleArtifact[], hasMatchingContent?: (candidate: Pick<StyleArtifact, "title" | "rawTranscript">) => boolean) {
  const [sessionDispatchedIds, setSessionDispatchedIds] = useState<string[]>([]);
  const knownIds = useMemo(() => new Set([
    ...sessionDispatchedIds,
    ...existingArtifacts.map((artifact) => artifact.sourcePayloadId).filter((id): id is string => Boolean(id)),
  ]), [existingArtifacts, sessionDispatchedIds]);

  const takeNextPayload = useCallback((mode: WorkspaceMode): ResearchCapturePayload | null => {
    const pool = capturePoolForMode(mode);
    const nextPayload = pool.find((payload) => !knownIds.has(payload.id) && !hasMatchingContent?.(payload));
    if (nextPayload) {
      setSessionDispatchedIds((ids) => ids.includes(nextPayload.id) ? ids : [...ids, nextPayload.id]);
      return nextPayload;
    }

    const seed = pool[sessionDispatchedIds.length % pool.length];
    const generated = seed ? generatedCaptures[seed.id] : undefined;
    if (!seed || !generated) return null;
    const captureNumber = sessionDispatchedIds.length + 1;
    const payload: ResearchCapturePayload = {
      ...seed,
      id: `${seed.id}:generated:${captureNumber}`,
      title: generated.title,
      rawTranscript: `${seed.rawTranscript}\n\n${generated.rawAddition}`,
      transformedOutput: `${seed.transformedOutput}\n\n${generated.outputAddition}`,
      summary: generated.summary,
    };
    setSessionDispatchedIds((ids) => [...ids, payload.id]);
    return payload;
  }, [hasMatchingContent, knownIds, sessionDispatchedIds.length]);

  return { takeNextPayload, remainingByMode: (mode: WorkspaceMode) => capturePoolForMode(mode).filter((payload) => !knownIds.has(payload.id)).length };
}
