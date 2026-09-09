export interface NarrationLine { id: string; timestamp: string; text: string; emphasis?: "thought" | "turn" | "quote"; }
export interface ConvertedArticle { format: "Critical Essay" | "Epistemological Log" | "Micro-Manifesto"; title: string; framework: string; body: string; }
export interface NarrationRecord {
  id: string; timestamp: string; location: string; ambient_texture: string; phenomenological_framing: string; title: string; recordedAt: string; duration: string;
  rawAudioTranscript: string; convertedArticles: ConvertedArticle[]; transcript: NarrationLine[];
  article: { headline: string; dek: string; readTime: string; sections: { heading: string; body: string }[] };
}

const formats = (title: string, claim: string, method: string, coda: string): ConvertedArticle[] => [
  { format: "Critical Essay", title, framework: "Claim", body: claim },
  { format: "Epistemological Log", title: "Working note", framework: "Method", body: method },
  { format: "Micro-Manifesto", title: "Keep this", framework: "Constraint", body: coda },
];
const lines = (id: string, values: string[]): NarrationLine[] => values.map((text, index) => ({ id: `${id}-${index + 1}`, timestamp: `0${index}:${String(8 + index * 22).padStart(2, "0")}`, text, emphasis: index === 2 ? "turn" : undefined }));
const narr = (data: NarrationRecord) => data;

const narrationRecords: NarrationRecord[] = [
  narr({
    id: "narration-do-the-right-thing", timestamp: "2026-09-05T22:18:00+05:30", location: "Pizza shop near the campus gate", ambient_texture: "Half-down shutter, delivery scooters, hot oil, yellow counter light.", phenomenological_framing: "A street detail restores a film before its plot does.", title: "The half-shuttered pizza shop brought back Do the Right Thing", recordedAt: "September 5, 10:18 PM", duration: "02:46",
    rawAudioTranscript: "Passed the pizza place near the gate and thought of Sal's before I thought of any plot point. Save the shutter, the counter, and how hot it was at eight. Do not make this a note saying Spike Lee is important. The shop made the block come back as an argument nobody can leave. Rewatch it with someone who will not call Mookie heroic or evil and end the conversation there.",
    convertedArticles: formats("A shutter is a better film note than a rating", "The shop does not reproduce Do the Right Thing; it gives the film a route back. A lowered shutter, trapped heat, and a counter facing the pavement revive the pressure of a neighbourhood made to share space without sharing power.", "Keep the cue, the viewing condition, and the question. Do not preserve a verdict when the return began with a place.", "Save the street detail; leave the argument open."),
    transcript: lines("dtrt", ["I saw the shutter before I remembered the plot.", "The counter and heat were the route back to the film.", "Do not file it as a favourite; file why it returned tonight.", "Watch it with someone willing to disagree about Mookie."]),
    article: { headline: "A Pizza Shop Is a Better Prompt Than a Ranking", dek: "A half-closed shutter returned a familiar Spike Lee film as a question about heat, place, and spectatorship.", readTime: "3 min read", sections: [
      { heading: "The cue arrived first", body: "The shop near the gate did not look like Sal's. It only had the right shutter, counter, and exhausted warmth. That was enough for the film to return before any plot did." },
      { heading: "A block inside one room", body: "The memory restores the film's pressure, not its reputation: people occupy the same street while carrying radically unequal stakes into the same argument." },
      { heading: "A better rewatch", body: "The next screening needs company. The question is not whether a final act can be cleared morally, but what the film makes a spectator do with anger once the heat has nowhere to go." },
    ] },
  }),
  narr({
    id: "narration-phd-proposal", timestamp: "2026-09-05T20:42:00+05:30", location: "Department corridor, proposal PDF open on phone", ambient_texture: "Broken ceiling fan, tracked changes, two coffee cups, folded deadline sheet.", phenomenological_framing: "Institutional language becomes useful only when it returns to a sentence one can say aloud.", title: "The proposal needs a question that survives after I close the PDF", recordedAt: "September 5, 8:42 PM", duration: "03:28",
    rawAudioTranscript: "The proposal sounds grand and then I close it and cannot explain the actual question. I am somewhere between Beat writing, drugs, altered cognition, and testimony, but the usable version is: what happens when a damaged or altered memory is the only record somebody has? Keep the theory but stop using it as wallpaper. I do not want to turn addiction into brave artistic weather. The method has to read the break without pretending the break is beautiful.",
    convertedArticles: formats("The question has to survive the PDF", "This project asks how literary testimony handles altered memory without granting fracture either automatic truth or aesthetic glamour. It begins with sentences that revise, hesitate, and return.", "For every theoretical term, name the paragraph it clarifies: a correction, a gap, a withheld event, a repeated image.", "Method, not romance."),
    transcript: lines("proposal", ["The PDF sounds sure of itself; I do not, once it is closed.", "What can an altered memory testify to when it is the only record?", "Do not use theory as wallpaper above the paragraph.", "The break can be evidence without being made beautiful."]),
    article: { headline: "The Question Has to Survive the PDF", dek: "A proposal on Beat writing and altered cognition becomes usable when its conceptual language stays answerable to a small human question.", readTime: "4 min read", sections: [
      { heading: "A question small enough to carry", body: "The project asks what literature does when altered memory is both unreliable and indispensable: when a person cannot offer a seamless account, but no other record of the feeling exists." },
      { heading: "Against two shortcuts", body: "A fractured account is neither transparent proof nor a stylish alibi for harm. Reading it means attending to repetition, correction, sensory drift, and the social conditions that decide whether testimony is believed." },
      { heading: "Theory returns to the sentence", body: "Memory studies matter when they make a paragraph more precise: who remembers, what form holds the memory, what power asks it to become coherent, and what remains unreadable." },
    ] },
  }),
  narr({
    id: "narration-football-documentary", timestamp: "2026-09-05T17:41:00+05:30", location: "Hostel common room after a football draft", ambient_texture: "Paused tactics video, chips, names around a 4-3-3 on scrap paper.", phenomenological_framing: "A list becomes a football argument only when every player has a task.", title: "The all-time XI became interesting only after we named the midfield jobs", recordedAt: "September 5, 5:41 PM", duration: "03:06",
    rawAudioTranscript: "Vibhav's team has Pirlo and Kroos, mine has Xavi and Iniesta, and we spent twenty minutes doing the fake greatest-player thing. The minute we asked what the midfield was for, it got good. Pirlo needs runners and someone to cover the second ball. Xavi and Iniesta need width, a forward pinning centre-backs, and proper rest defence so the short passes do not become sentimental. Write the formation before we get to strikers.",
    convertedArticles: formats("An XI starts with a midfield problem", "Pirlo–Kroos and Xavi–Iniesta propose different forms of control: early distribution across the pitch versus pressure-resistant circulation close to the ball.", "Write formation, defensive coverage, ball progression, and chance creation beside each selection before comparing names.", "No museum of names."),
    transcript: lines("xi", ["We had famous names, not teams, until we asked what the midfield was for.", "Pirlo and Kroos change the field early; Xavi and Iniesta change it through proximity.", "The formation has to arrive before the striker argument.", "A team needs width, runners, and rest defence—not just a beautiful midfield on paper."]),
    article: { headline: "An All-Time XI Starts With a Midfield Problem", dek: "The argument between two fantasy sides changed once Pirlo, Kroos, Xavi, and Iniesta were treated as roles rather than trophies.", readTime: "3 min read", sections: [
      { heading: "Two ideas of control", body: "Pirlo and Kroos ask for a team that can receive a pass fifty metres away and turn before pressure arrives. Xavi and Iniesta ask for angles nearby, circulation under pressure, and teammates who know when not to run." },
      { heading: "The formation is the claim", body: "A 4-3-3 decides who protects a lost ball, who fixes the back line, and whether the midfield's preferred tempo can actually reach the final third." },
      { heading: "Keep the dispute", body: "Change one full-back or winger and the favourite midfielder may no longer be the answer. That is the point of saving the model, not merely the XI." },
    ] },
  }),
  narr({
    id: "narration-hostel-scene", timestamp: "2026-09-04T21:07:00+05:30", location: "Hostel room, desk lamp on", ambient_texture: "Wet shoes below the chair, quiet corridor, The Strokes in one earbud.", phenomenological_framing: "A room can retain unfinished work without turning it into a grand mood.", title: "The room was tidy, the paragraph was not", recordedAt: "September 4, 9:07 PM", duration: "02:14",
    rawAudioTranscript: "Room is clean for once, shoes are still damp, and I am pretending the paragraph will fix itself if I put on Is This It again. Save the actual scene, not a dramatic journal entry. I moved the application spreadsheet to tomorrow, crossed out the sentence that sounded like an abstract, and texted Pranav that I am still awake. That is the whole night. Unfinished things had a room around them.",
    convertedArticles: formats("An unfinished paragraph has a room around it", "The record of work is not the finished paragraph alone. Wet shoes, a delayed spreadsheet, and a song in one ear preserve the ordinary conditions in which writing stalled without becoming meaningless.", "Record object, postponed task, revision, and person contacted. Resist making a tired night into a personality trait.", "Keep the room; do not inflate it."),
    transcript: lines("room", ["The room is clean; the paragraph is not.", "Save the wet shoes, delayed spreadsheet, and crossed-out sentence.", "That is enough to remember the night without melodrama.", "Unfinished work still had a room around it."]),
    article: { headline: "An Unfinished Paragraph Has a Room Around It", dek: "A late-night note keeps the objects and decisions around a stalled paragraph, rather than pretending the work existed alone.", readTime: "2 min read", sections: [
      { heading: "The small evidence", body: "The room was tidy; the shoes were damp; the application sheet had been pushed to tomorrow. Each detail keeps the night from flattening into productivity or failure." },
      { heading: "Revision as event", body: "One sentence was deleted because it sounded like an abstract trying to impress another abstract. That decision is closer to the work than the mood attached to it." },
    ] },
  }),
  narr({
    id: "narration-late-ray", timestamp: "2026-09-02T00:23:00+05:30", location: "Library projection room", ambient_texture: "Warm projector fan, plastic chairs, a dark lake remaining on screen after the credits.", phenomenological_framing: "A parallel timeline can make a family history feel less like explanation than accusation.", title: "The lake scene in The Godfather Part II stayed after the credits", recordedAt: "September 2, 12:23 AM", duration: "02:38",
    rawAudioTranscript: "The thing that stayed from The Godfather Part II was not the crime plot but Michael alone by the lake after the family photograph has already made every absence visible. Do not turn young Vito into an answer to Michael. The parallel timelines are cruel because they keep showing another way a family can look before they show what that memory cannot repair. Save the projector fan coming back when the screen went dark.",
    convertedArticles: formats("The lake scene is not an answer", "The Godfather Part II uses its parallel timelines to make memory accusatory rather than restorative. Young Vito does not redeem Michael; he gives the later solitude a warmer image against which it can be measured.", "Keep the lake, the family photograph, the two timelines, and the refusal to turn origin into explanation.", "A past can make an ending lonelier without explaining it away."),
    transcript: lines("godfather", ["The lake scene stayed because the family photograph had already become an accusation.", "Young Vito does not redeem Michael; he makes the later solitude hurt differently.", "The parallel timelines are not an answer, only a cruel comparison.", "Save the projector fan returning when the screen went dark."]),
    article: { headline: "The Lake Scene Is Not an Answer", dek: "The Godfather Part II makes family history feel less like explanation than an accusation Michael cannot answer.", readTime: "3 min read", sections: [
      { heading: "A warmer image", body: "Young Vito's story is not a moral remedy for Michael. It gives the film a warmer picture of kinship so that the later isolation can register as a choice with a history behind it." },
      { heading: "The accusation remains", body: "The lake scene does not resolve the parallel timelines. It leaves Michael beside a memory the film has made emotionally available but structurally unreachable." },
    ] },
  }),
  narr({
    id: "narration-hou-distance", timestamp: "2026-09-01T20:17:00+05:30", location: "Film folder and reading list", ambient_texture: "Saved still, cursor over A City of Sadness, note saying clear evening, no score.", phenomenological_framing: "A watchlist can preserve a viewing condition instead of simulating a completed opinion.", title: "Save A City of Sadness with the condition, not a verdict", recordedAt: "September 1, 8:17 PM", duration: "01:58",
    rawAudioTranscript: "Put A City of Sadness on the list for a clear evening, ideally not after I have watched three things already. I am interested in history getting into family rooms, but that is not a review because I have not seen it. Say why I want to make time for it and what I do not want to do: tick it off, rate it in ten minutes, then pretend I encountered it. Save the still with it.",
    convertedArticles: formats("A watchlist should preserve attention", "A future screening can be archived honestly without anticipating its conclusion. The record holds a question—how public history enters family life—and the condition required to meet it with attention.", "Save title, image, question, and viewing constraint. Do not generate a score before the encounter.", "An unwatched film deserves an unwatched note."),
    transcript: lines("hou", ["I have not watched it; do not write around that fact.", "The list should keep why I want to make time for it, not invent a reaction.", "Save the image, the family-history question, and the clear-evening condition.", "No score after the credits just because the title was difficult to reach."]),
    article: { headline: "A Watchlist Should Preserve the Conditions of Attention", dek: "A future film note can be specific without pretending that anticipation is criticism.", readTime: "2 min read", sections: [
      { heading: "An honest prehistory", body: "The saved still and a question about history entering a family home explain why the film waits on the list without claiming knowledge the viewing has not supplied." },
      { heading: "The condition matters", body: "Clear evening, no score is a small defense against turning a demanding film into a completed item before its images have had time to alter anything." },
    ] },
  }),
  narr({
    id: "narration-jeanne-dielman", timestamp: "2026-08-31T17:45:00+05:30", location: "Department reading room", ambient_texture: "Printed schedule, cold tea, chores beside a film title.", phenomenological_framing: "Duration can make maintenance visible without making spectators perform seriousness.", title: "Do not make Jeanne Dielman a test of whether I am serious about film", recordedAt: "August 31, 5:45 PM", duration: "02:11",
    rawAudioTranscript: "I want to watch Jeanne Dielman but not as a dare or a Letterboxd badge. The repetition is not empty background; it makes domestic work take the time it actually takes. Pick an afternoon where I am not checking messages every five minutes, and do not force a review the same night. I need to notice what routine feels like before I turn it into a theory sentence.",
    convertedArticles: formats("Duration is not a test", "Jeanne Dielman asks a viewer to inhabit the time of maintenance rather than treating routine as invisible support for plot. The viewing condition should resist converting endurance into cultural capital.", "Watch without pressure to prove completion. Note the rhythm of tasks before translating it into theory.", "Let routine take its time."),
    transcript: lines("jd", ["Do not schedule the film as a test of seriousness.", "Its routine matters because domestic labour occupies real time.", "Watch before trying to make the correct theory sentence.", "No same-night score, no endurance medal."]),
    article: { headline: "Duration Is Not a Test", dek: "A watchlist note on domestic routine, attention, and refusing to turn a difficult film into a credential.", readTime: "2 min read", sections: [
      { heading: "Routine takes time", body: "The promise is not difficulty for its own sake. Ordinary maintenance stops functioning as narrative wallpaper when a viewer is asked to remain with its duration." },
      { heading: "A better promise", body: "The note reserves an afternoon and removes the demand for immediate verdict. Attention is not improved by treating a film as a test one must pass." },
    ] },
  }),
  narr({
    id: "narration-oral-history", timestamp: "2026-08-28T11:34:00+05:30", location: "Research lab, headphones on", ambient_texture: "Voice recording, waveform peaks, corrected transcript, archive finding aids.", phenomenological_framing: "Testimony happens in the recording, not only in the clean sentence eventually quoted.", title: "An oral-history recording is not a sentence mine", recordedAt: "August 28, 11:34 AM", duration: "03:42",
    rawAudioTranscript: "Do not lift one good line out of an interview and call it the person's memory. The pause before it, the correction after it, and the interviewer changing the question are part of the thing. Save the timestamp with the transcript and a listening note. I need that later when I am tempted to make a smooth argument out of someone else's difficulty finding words.",
    convertedArticles: formats("Listen before you summarise", "Oral history is not raw material waiting to be extracted. Hesitation, revision, and the relation between interviewer and speaker are part of how testimony becomes available.", "Store audio time, transcript passage, and listening note together. Quote only with the conditions of utterance visible.", "A transcript is a doorway, not a replacement for the voice."),
    transcript: lines("oral", ["Do not mine the interview for one elegant sentence.", "The pause and correction are part of the memory, not noise around it.", "Save the timestamp with a listening note before making an argument.", "The page was never the original object."]),
    article: { headline: "Listen Before You Summarise", dek: "A research note on preserving encounter, correction, and sound around an oral-history quotation.", readTime: "3 min read", sections: [
      { heading: "The recording is an event", body: "A speaker's testimony is shaped in the encounter: by a question, a pause, a revision, and the fact of being heard. A transcript is useful but cannot be mistaken for the whole event." },
      { heading: "A better archival unit", body: "Timestamp, passage, and listening note keep later writing from turning a difficult act of recall into an effortlessly available quotation." },
    ] },
  }),
  narr({
    id: "narration-music-walk", timestamp: "2026-08-26T19:24:00+05:30", location: "Walk from the bus stop", ambient_texture: "Rain on footpath, traffic at the signal, The Strokes followed by a too-bright Vance Joy track.", phenomenological_framing: "A playlist can remember a route better than a generic mood can.", title: "Make the playlist remember the walk, not just the weather", recordedAt: "August 26, 7:24 PM", duration: "02:12",
    rawAudioTranscript: "Make a rainy-walk playlist, but do not let it become a sad-indie dump. Start with The Strokes because the road from the library had that impatient rhythm, then something lighter because the day was annoying, not tragic. Add one line: long department day, rain near the gate, still had to buy detergent. The songs need the route, otherwise Spotify will remember a genre and I will remember nothing.",
    convertedArticles: formats("A playlist needs a route", "A personal playlist becomes archival when it retains a scene: the walk, weather, errand, and emotional temperature that made song order meaningful.", "Store a one-line route note beside the sequence. Avoid platform mood labels as substitutes for the particular evening.", "One line of weather is enough."),
    transcript: lines("walk", ["Do not turn rainy walk into a generic sad-indie folder.", "The road from the library needed The Strokes first and something lighter after.", "The day was irritating, not tragic—save the distinction.", "Add the rain, gate, and detergent errand."]),
    article: { headline: "A Playlist Needs a Route", dek: "A sequence of songs becomes a memory when it holds the rain, library walk, and small errand that followed.", readTime: "2 min read", sections: [
      { heading: "Mood is too broad", body: "A service can infer melancholy from guitars and tempo. It cannot know the day was merely frustrating, rain began near the gate, and detergent still had to be bought." },
      { heading: "A small annotation", body: "The playlist needs one line, not an essay. The route preserves why the order mattered and leaves the evening room to remain ordinary." },
    ] },
  }),
];

export interface ConversationSpeaker { name: string; role: string; color: "emerald" | "sky" | "violet"; }
export interface ConversationRecord {
  id: string; title: string; timestamp: string; date: string; duration: string; summary: string; speakers: string[]; speaker_metadata: ConversationSpeaker[];
  dialogue_transcript: { speaker: string; utterance: string; timestamp: string; endTimestamp: string; topic: string }[]; theoretical_vector: string; citation_tags: string[];
}
const people: Record<string, ConversationSpeaker> = {
  Neel: { name: "Neel", role: "Research / Barcelona", color: "sky" }, Pranav: { name: "Pranav", role: "Football / television", color: "violet" },
  Kshatriya: { name: "Kshatriya", role: "Film / politics", color: "emerald" }, Vibhav: { name: "Vibhav", role: "Football / film", color: "violet" },
  Neelavo: { name: "Neelavo", role: "Music / writing", color: "emerald" },
};
type Turn = { speaker: string; utterance: string; topic: string };
const convo = (id: string, title: string, timestamp: string, date: string, duration: string, summary: string, speakers: string[], theoretical_vector: string, citation_tags: string[], turns: Turn[]): ConversationRecord => ({
  id, title, timestamp, date, duration, summary, speakers, speaker_metadata: speakers.map((speaker) => people[speaker]), theoretical_vector, citation_tags,
  dialogue_transcript: turns.map((turn, index) => ({ ...turn, timestamp: `0${Math.floor(index / 2)}:${String((index % 2) * 28 + 6).padStart(2, "0")}`, endTimestamp: `0${Math.floor(index / 2)}:${String((index % 2) * 28 + 26).padStart(2, "0")}` })),
});
const conversationRecords: ConversationRecord[] = [
  convo("conversation-screening", "Do the Right Thing: the radio, the wall, and the last twenty minutes", "2026-09-05T23:18:00+05:30", "September 5, 11:18 PM", "22:16", "Neel, Kshatriya, and Vibhav disagree about sound, Radio Raheem, and whether the ending permits a moral verdict.", ["Neel", "Kshatriya", "Vibhav"], "The film distributes heat, sound, and point of view rather than offering a binary loyalty test.", ["Spike Lee", "Do the Right Thing", "Radio Raheem"], [
    { speaker: "Neel", topic: "Sound", utterance: "Public Enemy is not background. By the time the radio becomes a problem, the song has already taught the block what volume feels like." },
    { speaker: "Kshatriya", topic: "Pushback", utterance: "Sure, but do not make it only symbolic. Sal's reaction is petty and racist, but the film lets noise be physically annoying too. That is why it hurts." },
    { speaker: "Vibhav", topic: "Performance", utterance: "Bill Nunn makes Raheem huge without playing him as a thesis. The rings, the boom box, the way he fills a doorway—then none of it protects him." },
    { speaker: "Neel", topic: "Ending", utterance: "Mookie throwing the bin is not a verdict we are meant to sign. A man has been killed and everyone suddenly wants the scene to resolve into a lesson." },
    { speaker: "Kshatriya", topic: "Form", utterance: "The two quotations at the end are honest. The film refuses to let Malcolm or Martin clean up what it staged." },
    { speaker: "Vibhav", topic: "Viewing condition", utterance: "Next time do not pause to explain the wall of fame. Let it sit there until somebody notices there are no Black faces." },
  ]),
  convo("conversation-proposal", "Beat writing, altered memory, and the sentence escaping the proposal", "2026-09-05T19:02:00+05:30", "September 5, 7:02 PM", "31:08", "Neel, Pranav, and Neelavo test a PhD question against the temptation to romanticise damaged testimony.", ["Neel", "Pranav", "Neelavo"], "Altered narration is treated as a formal and social problem, not evidence of authentic genius.", ["Beat Generation", "memory studies", "testimony"], [
    { speaker: "Neel", topic: "Question", utterance: "I keep writing pharmacological mediation and then hearing a grant application. The question I care about is what an altered memory can still tell us." },
    { speaker: "Pranav", topic: "Correction", utterance: "Start there. But do not say still tell us as if every broken account becomes profound. Some writers are performing for the page too." },
    { speaker: "Neelavo", topic: "Method", utterance: "Maybe performance is part of it. Ask when a confession becomes literary equipment without accusing the speaker of simply lying." },
    { speaker: "Neel", topic: "Scope", utterance: "I do not want a recovery narrative or the old tortured-genius thing. The sentence has to keep both risks visible." },
    { speaker: "Pranav", topic: "Writing", utterance: "Put one passage under the theory every time. If the concept cannot explain a sentence doubling back, it is furniture." },
    { speaker: "Neelavo", topic: "Close", utterance: "Then say it plainly: what conditions make an unstable memory readable, and to whom?" },
  ]),
  convo("conversation-football", "Pedri, the left half-space, and why Barça cannot copy 2011", "2026-09-05T21:34:00+05:30", "September 5, 9:34 PM", "17:42", "Neel, Pranav, and Vibhav argue over Pedri's role, midfield balance, and the difference between positional structure and nostalgia.", ["Neel", "Pranav", "Vibhav"], "Rotations and pressing triggers work only when personnel, rest defence, and receiving habits fit together.", ["Barcelona", "Pedri", "positional play"], [
    { speaker: "Neel", topic: "Pedri", utterance: "Pedri looks best receiving in the left half-space after the winger holds width. He can turn or play the third-man pass; he should not be every transition defender too." },
    { speaker: "Pranav", topic: "Balance", utterance: "If the left-back is high and the six is isolated, Pedri has to sprint backwards. You cannot say free Pedri and ignore the rest defence." },
    { speaker: "Vibhav", topic: "Guardiola comparison", utterance: "People say like Guardiola when they mean short passes. That Barça had spacing: wide wingers, interiors between lines, Busquets giving centre-backs a clean exit." },
    { speaker: "Neel", topic: "Pressing", utterance: "The press was not a slogan. A bad touch or a pass into a closed full-back was the trigger. Messi did not chase every defender for decoration." },
    { speaker: "Pranav", topic: "Personnel", utterance: "Decide whether the right side has a runner behind, a winger inside, or a full-back wide. Otherwise Pedri gets it with four people standing in his lane." },
    { speaker: "Vibhav", topic: "Conclusion", utterance: "Borrow the structure, not the museum. Build around what Pedri and the current forwards can repeat for ninety minutes." },
  ]),
  convo("conversation-writing-room", "The Leftovers finale: belief is not the same as proof", "2026-09-03T20:18:00+05:30", "September 3, 8:18 PM", "19:05", "Neel, Kshatriya, and Pranav revisit Nora's story and what the finale asks Kevin to do.", ["Neel", "Kshatriya", "Pranav"], "The ending frames listening as an ethical choice without converting ambiguity into a puzzle.", ["The Leftovers", "Nora Durst", "television finales"], [
    { speaker: "Neel", topic: "Nora", utterance: "Kevin does not cross-examine Nora like the audience wants. He finally lets her finish the story." },
    { speaker: "Kshatriya", topic: "Doubt", utterance: "I buy that emotionally, but the show enjoys making it impossible to verify. It knows exactly what it is doing to people who want an answer." },
    { speaker: "Pranav", topic: "Form", utterance: "The whole series is people inventing rituals because an answer never comes. Why would it hand us a cosmic spreadsheet in the last ten minutes?" },
    { speaker: "Neel", topic: "Performance", utterance: "Carrie Coon makes the story rehearsed and painful at once. That is not proof; it is why Kevin listening matters." },
    { speaker: "Kshatriya", topic: "Pushback", utterance: "Ambiguity is not depth by itself. The episode earns it through the kitchen table, wedding, and absurd grief rituals before this." },
    { speaker: "Pranav", topic: "Close", utterance: "After all that apocalypse noise, it asks whether two people can stop making each other carry impossible proof." },
  ]),
  convo("conversation-big-city", "The Wire season two is not the detour", "2026-09-02T19:26:00+05:30", "September 2, 7:26 PM", "14:38", "Pranav and Neelavo defend season two against the instinct to rush back to familiar characters.", ["Pranav", "Neelavo"], "The docks expand the series' system instead of temporarily leaving its real story.", ["The Wire", "season two", "Baltimore"], [
    { speaker: "Pranav", topic: "Rewatch", utterance: "If we rewatch, start at season two. Everybody loves it later because they stop waiting for Stringer to come back on screen." },
    { speaker: "Neelavo", topic: "Structure", utterance: "The docks make the show larger: goods, unions, smuggling, and politics before the street story becomes the only lens for Baltimore." },
    { speaker: "Pranav", topic: "Character", utterance: "Ziggy is painful. First time I thought he was annoying; now he feels like someone losing every available way to be taken seriously." },
    { speaker: "Neelavo", topic: "Pushback", utterance: "Do not turn him into a saint because he is sad. The season is good because bad choices stay bad while the structure around them stays visible." },
    { speaker: "Pranav", topic: "Close", utterance: "That is why it is not a detour. It explains what the later seasons are actually built on." },
  ]),
  convo("conversation-television", "Succession's karaoke scene is crueler than its boardroom scenes", "2026-08-31T22:14:00+05:30", "August 31, 10:14 PM", "16:04", "Kshatriya and Neel discuss the final-season karaoke scene and Logan's performance.", ["Kshatriya", "Neel"], "Power appears most sharply in an intimate ritual where no one can ask for care plainly.", ["Succession", "Logan Roy", "Karaoke"], [
    { speaker: "Kshatriya", topic: "Scene", utterance: "Logan walks in and everybody becomes twelve without the show announcing it. That is worse than any boardroom betrayal." },
    { speaker: "Neel", topic: "Performance", utterance: "Brian Cox says I need you almost casually, which makes it vicious. He knows those words will scramble them, then offers nothing concrete." },
    { speaker: "Kshatriya", topic: "Pushback", utterance: "It does not reveal hidden tenderness. It reveals a need for control wearing tenderness's clothes." },
    { speaker: "Neel", topic: "Form", utterance: "The karaoke room is perfect because nobody can perform competence there. Roman jokes, Shiv is furious, Kendall wants a deal that sounds like love." },
    { speaker: "Kshatriya", topic: "Close", utterance: "They have no vocabulary for care, only bargaining chips that resemble it." },
  ]),
  convo("conversation-baresi", "An all-time XI draft: Lahm is not a consolation prize", "2026-08-30T23:02:00+05:30", "August 30, 11:02 PM", "12:28", "Neel, Vibhav, and Pranav compare historic XIs by role rather than highlight-reel aura.", ["Neel", "Vibhav", "Pranav"], "Defenders' roles, game state, and partner fit matter more than generic nostalgia.", ["all-time XI", "Philipp Lahm", "Franco Baresi"], [
    { speaker: "Vibhav", topic: "Selection", utterance: "You took Lahm like he is just the sensible answer. In a 4-3-3 he can step inside and stop Xavi and Iniesta getting exposed in transition." },
    { speaker: "Neel", topic: "Role", utterance: "Exactly. If Ashley Cole overlaps, I need the right side to give me a second midfielder sometimes." },
    { speaker: "Pranav", topic: "Correction", utterance: "Then do not pretend the team is symmetrical. Salah wants the right half-space, Lahm comes inside, and somebody has to hold width. Name who." },
    { speaker: "Vibhav", topic: "Defending", utterance: "Baresi clips make everyone say defenders used to read the game. He did, but he had a compact Milan line and teammates moving with him." },
    { speaker: "Neel", topic: "Close", utterance: "Fine. We write the game model beside the XI. Otherwise every pick becomes a tiny statue." },
  ]),
  convo("conversation-letterboxd", "Scorsese, masculinity, and the temptation to call Goodfellas fun", "2026-08-29T22:21:00+05:30", "August 29, 10:21 PM", "18:16", "Neelavo and Neel argue about the thrill of Goodfellas and what a sincere response should acknowledge.", ["Neelavo", "Neel"], "Formal exhilaration and endorsement are kept distinct by staying with the film's seductions.", ["Goodfellas", "Martin Scorsese", "spectatorship"], [
    { speaker: "Neelavo", topic: "Form", utterance: "The Copa tracking shot is exhilarating. We do not need to apologise every time someone brings up the film's violence." },
    { speaker: "Neel", topic: "Pushback", utterance: "No apology, but the exhilaration is the trap. Henry shows Karen a world where every door opens, and the film makes you feel why that offer works." },
    { speaker: "Neelavo", topic: "Performance", utterance: "Lorraine Bracco is why it does not become only his fantasy. Her voice-over keeps puncturing the glamour even while she is drawn into it." },
    { speaker: "Neel", topic: "Writing", utterance: "Say the film is thrilling, then say what the thrill costs. Do not reduce it to a morality badge or a gangster GIF." },
    { speaker: "Neelavo", topic: "Close", utterance: "And no cinema-was-better-then caption. Please. We are not twelve." },
  ]),
  convo("conversation-syllabus", "Liberalism, the Democrats, and the limits of liking the institution", "2026-08-28T18:42:00+05:30", "August 28, 6:42 PM", "20:02", "Neel, Pranav, and Kshatriya separate liberal commitments from party fandom.", ["Neel", "Pranav", "Kshatriya"], "Rights, pluralism, and public institutions are held apart from uncritical party loyalty.", ["liberalism", "US Democratic Party", "coalition politics"], [
    { speaker: "Neel", topic: "Position", utterance: "I am broadly liberal: civil rights, institutions that can be corrected, public investment. That does not mean Democrats are automatically the good version of power." },
    { speaker: "Pranav", topic: "Coalition", utterance: "They are a coalition, not a personality test. You can vote for it and still be annoyed when messaging replaces delivery." },
    { speaker: "Kshatriya", topic: "Pushback", utterance: "And institutions matter cannot become a way of ignoring who gets excluded by institutions. Liberalism needs a material answer, not nicer vocabulary." },
    { speaker: "Neel", topic: "Correction", utterance: "Agreed. I am not defending every compromise; I care about what protects people better than fantasies of purification do." },
    { speaker: "Pranav", topic: "Close", utterance: "Political preference, yes; fandom, no. Keep the disagreement in the record." },
  ]),
];

export interface AmbientMemoryRecord {
  id: string; trigger_event: string; memory_layer: string; archive_citations: string[]; cognitive_drift_index: number; isoDate: string; date: string; time: string;
  context: "Work" | "Research" | "Personal" | "Planning"; title: string; excerpt: string; transcript: string; tags: string[]; duration: string;
}
const mem = (id: string, trigger_event: string, memory_layer: string, archive_citations: string[], cognitive_drift_index: number, isoDate: string, date: string, time: string, context: AmbientMemoryRecord["context"], title: string, excerpt: string, transcript: string, tags: string[], duration: string): AmbientMemoryRecord => ({ id, trigger_event, memory_layer, archive_citations, cognitive_drift_index, isoDate, date, time, context, title, excerpt, transcript, tags, duration });
const ambientMemoryRecords: AmbientMemoryRecord[] = [
  mem("memory-letterboxd", "Closing a Letterboxd tab after Bamboozled", "The blinking cursor brought back the minstrel-show broadcast and the unease of laughing before knowing what the film made that laughter cost. The note keeps discomfort, not a polished take.", ["Spike Lee", "Bamboozled", "film log"], .38, "2026-09-05", "September 5", "10:48 PM", "Personal", "Do not make Bamboozled feel cleverer than it feels", "The saved detail is the moment criticism becomes consumption again.", "For the log: do not call it simply brilliant satire. Write that it made me feel caught using the same appetite it attacks, then stop before I turn discomfort into a performance.", ["film", "spike-lee", "letterboxd"], "01:14"),
  mem("memory-proposal", "Sorting funding pages beside the applications spreadsheet", "A row opened into three futures: a supervisor worth reading with, rent in another country, and the guilt of asking home to treat a speculative plan as settled.", ["PhD planning", "funding", "future"], .57, "2026-09-04", "September 4", "7:16 PM", "Planning", "Give every application row a reason and a cost", "Prestige alone is not an intellectual reason or a funding plan.", "For each programme: one scholar I want to work with, one reason the archive fits, one funding constraint. No ranking until those cells are filled.", ["phd", "planning", "research"], "02:08"),
  mem("memory-nyt", "An Ezra Klein interview queued after a campus politics chat", "The headphones caught the difference between an institutional explanation and the local irritation that started the conversation. Both belong in the archive; neither is enough alone.", ["politics", "podcasts", "liberalism"], .29, "2026-09-05", "September 5", "7:08 PM", "Research", "Politics needs the institution and the person waiting outside it", "Good analysis explains the machinery without erasing who has to live with it.", "Save this for the politics note: keep the structural question, but write down the practical scene that made it matter before it dissolves into policy vocabulary.", ["politics", "listening", "notes"], "00:57"),
  mem("memory-football", "A Pedri clip appeared between two Barça tactics videos", "The clip kept showing a simple receive-and-turn, but the memory was of the earlier argument: can a midfielder be freed without leaving the six alone behind him?", ["Barcelona", "Pedri", "conversation-football"], .44, "2026-09-05", "September 5", "9:07 PM", "Personal", "Pedri's turn needs a team behind it", "The clip is not evidence until the rest of the shape is named.", "Save the clip beside our rest-defence argument. Pedri turning in the left half-space looks effortless because the camera cuts away from the people making the angle possible.", ["football", "barcelona", "pedri"], "01:26"),
  mem("memory-journal", "Walking back from the library with The Strokes on", "A yellow gate light, rain in the road, and the first guitar line made the day feel narratable for one block. The note remembers the route home after a long department day.", ["The Strokes", "library walk", "playlist"], .66, "2026-09-04", "September 4", "10:42 PM", "Personal", "The yellow gate light after the library", "The song gave the walk a rhythm; the detergent errand kept it ordinary.", "Walking back: The Strokes first, rain near the gate, still had to buy detergent. Keep that order and do not call it a lonely-night entry.", ["music", "walk", "routine"], "01:03"),
  mem("memory-wong-kar-wai", "Saving an In the Mood for Love still", "The red wallpaper and narrow corridor recalled the pace of a late screening: two people holding a conversation after everyone else had gone to bed.", ["Wong Kar-wai", "In the Mood for Love", "late screening"], .51, "2026-09-03", "September 3", "10:19 PM", "Personal", "The corridor before the words arrive", "A colour can return the pace of a night before it returns explanation.", "Saved the still because of the red corridor, not for another wallpaper. It remembers the quiet after the screening and the argument about whether restraint can become melodrama.", ["film", "wong-kar-wai", "colour"], "00:44"),
  mem("memory-scene", "Reading a dialogue draft aloud at the hostel desk", "One sentence died as soon as it was spoken. The embarrassment was useful: a character had been explaining the scene instead of reacting inside it.", ["writing draft", "hostel desk", "revision"], .72, "2026-09-03", "September 3", "1:03 AM", "Planning", "The line sounded clever only on the page", "Speech caught false cleverness before another paragraph could defend it.", "Read the scene aloud tomorrow. If a line needs me to explain why it works, cut it. The page lets a fake-smart sentence hide too long.", ["writing", "dialogue", "revision"], "01:32"),
  mem("memory-fight-club", "A Fight Club clip appeared in the recommendation feed", "The clip remembered Tyler's posture but not the school argument about whether the satire survives the audience repeating its slogans. The algorithm had the object and lost the route.", ["Fight Club", "recommendation feed", "film memory"], .47, "2026-09-02", "September 2", "6:18 PM", "Personal", "The feed remembers the line, not the argument", "A recommendation can recognise a title while missing why it stayed with someone.", "Do not save the clip as iconic. It reminded me of the old argument about people quoting the film like an instruction manual. The disagreement is the memory.", ["film", "algorithm", "memory"], "00:51"),
  mem("memory-phd-list", "Adding a deadline to the PhD calendar", "The notification made a distant department feel briefly local, then became funding, travel, and a question about whether the project has a sentence worth carrying there.", ["PhD planning", "deadline", "proposal"], .59, "2026-09-02", "September 2", "2:36 PM", "Planning", "A deadline is not a destination", "The calendar can hold the date; the note must hold why the work belongs there.", "Add the deadline, then write one unembarrassed sentence about why this project needs that place. If I cannot write it, the calendar badge is pretending.", ["phd", "planning", "deadline"], "01:18"),
  mem("memory-mad-men", "Dinner went cold during a Mad Men episode", "The episode title blurred, but the table, unread message, and pause after a Don Draper pitch remain. Television attached itself to the room rather than the plot.", ["Mad Men", "late dinner", "serial memory"], .36, "2026-09-01", "September 1", "9:44 PM", "Personal", "The episode title is gone; the cold dinner is not", "Series memory keeps the room around an episode more faithfully than its name.", "Mad Men note: do not look up the title yet. I remember the plate getting cold, the room being quiet after the pitch, and the season becoming a place.", ["television", "mad-men", "home"], "00:49"),
  mem("memory-city-of-sadness", "A saved still beside an unread film list", "The still held an unfinished promise: watch without trying to possess the film quickly. It connects to the earlier note about history moving through family rooms.", ["A City of Sadness", "Hou Hsiao-hsien", "watchlist"], .42, "2026-09-04", "September 4", "5:17 PM", "Personal", "A City of Sadness needs a clear evening", "An unwatched film can carry a viewing condition without pretending to carry an opinion.", "Keep it for an evening with concentration. Link it to the family-history note and do not generate a score because the title sat on the list for months.", ["film", "watchlist", "history"], "00:38"),
  mem("memory-trains", "Waiting for the campus shuttle while rain started", "The delay made a small pocket in which the proposal thought could have been swallowed by a feed. A twenty-second voice note kept it attached to the wet bench.", ["campus shuttle", "voice note", "proposal"], .21, "2026-09-01", "September 1", "10:22 AM", "Planning", "The wet bench saved one sentence", "The thought was small enough to lose and small enough to record.", "Shuttle note: proposal question needs who gets to call a memory unreliable? Do not open five apps. Record the line, check the bus, move on.", ["routine", "capture", "research"], "00:24"),
  mem("memory-groceries", "Opening the nearly empty hostel fridge", "Coffee, detergent, eggs, and cheap biscuits became the inventory that made the rest of the day possible. The archive keeps the list small deliberately.", ["hostel room", "errands", "maintenance"], .09, "2026-09-01", "September 1", "7:14 AM", "Planning", "The fridge was almost empty", "A practical reminder earns its place without needing a metaphor.", "After class: coffee, detergent, eggs, cheap biscuits. Put detergent first because the shoes are still damp. That is all.", ["errands", "routine", "hostel"], "00:13"),
  mem("memory-radiohead", "A music queue placed Radiohead after Cage the Elephant", "The adjacency was technically defensible and emotionally wrong. The route to late-night Radiohead was not genre; it was the hour, headphones, and wish to stop choosing.", ["music library", "Radiohead", "Cage the Elephant"], .33, "2026-09-03", "September 3", "4:36 PM", "Personal", "The queue understood guitars, not the hour", "Similarity was not the same as belonging.", "The Radiohead recommendation is not bad; it belongs after midnight, not in a noisy-room playlist. Put it in late-night and stop asking the queue to know why.", ["music", "playlist", "taste"], "00:31"),
  mem("memory-wire", "Pranav mentioned a Wire rewatch at lunch", "A throwaway comment about season two reopened the docks, union hall, and old argument that viewers mistake familiarity for the centre of a series.", ["The Wire", "conversation-big-city", "lunch"], .26, "2026-09-03", "September 3", "7:18 PM", "Personal", "Start The Wire rewatch at the docks", "The second season changes most when one stops waiting for the usual characters.", "If the rewatch happens, begin at season two. Save Pranav's point: the docks are not a detour; they are the route into everything later.", ["television", "rewatch", "friends"], "00:36"),
  mem("memory-penalty", "A late match ended with a penalty shootout", "The replay held the keeper's tiny delay and commentary already searching for a story about nerve. A kick gains ancestors once a tournament gives it mythology.", ["football", "penalties", "match night"], .48, "2026-09-02", "September 2", "11:06 PM", "Personal", "The keeper waited half a second longer", "A statistical choice became a story before the replay finished.", "Save the shootout clip with one note: look up the run-up only after writing down what commentary made it feel like. Data and mythology arrive together.", ["football", "tactics", "memory"], "00:46"),
  mem("memory-reading-method", "A margin filled with arrows in a chapter on cultural memory", "One objection in the margin mattered more than the highlighted definition: whose recollection becomes archive, and whose remains anecdote because no institution wants it?", ["feminist memory studies", "reading method", "marginalia"], .37, "2026-09-03", "September 3", "3:44 PM", "Research", "File the objection with the citation", "The disagreement arrived before the terminology settled, which is why it should travel with the PDF.", "Before exporting the citation, record this: memory is not just stored; it is authorised. Find the paragraph where the author says who gets to make the record.", ["research", "memory", "feminism"], "00:42"),
  mem("memory-cassavetes", "Vibhav sent a Cassavetes clip without context", "The unsettled close-up was less memorable than the missing explanation. The record protects the social route of a recommendation: who sent it and what they thought I would notice.", ["John Cassavetes", "Vibhav", "film recommendation"], .39, "2026-09-03", "September 3", "9:11 AM", "Personal", "Ask why Vibhav sent the Cassavetes clip", "A director name is less useful than the sender's reason for sending it.", "Reply tomorrow: what film is this, and what made you think I would like that scene? Do not let the title become another orphaned watchlist entry.", ["film", "friends", "recommendation"], "00:29"),
  mem("memory-shoes", "Reaching for wet shoes before class", "The top-shelf pair, umbrella, and charger were enough to keep the morning from becoming return trips. Small logistics are what the larger day stands on.", ["morning", "hostel room", "reminder"], .07, "2026-09-02", "September 2", "8:02 AM", "Planning", "Take the dry shoes from the top shelf", "The successful note is the one that saves a wet walk and nothing more.", "Before class: dry shoes from the top shelf, umbrella, charger. Put the wet pair by the window later.", ["routine", "morning", "hostel"], "00:12"),
  mem("memory-mr-robot", "A Mr. Robot scene came up during a UI conversation", "The green terminal glow recalled a disagreement about whether an interface must look technical to feel consequential. The answer was history, not theatrical code.", ["Mr. Robot", "interface", "design conversation"], .41, "2026-09-02", "September 2", "10:42 PM", "Work", "Do not make the screen cosplay a hacker show", "The reference is about consequence and alienation, not terminal decoration.", "Design memory: Mr. Robot works because actions have social weight, not because the screen flashes code. Keep the archive legible; no fake terminal.", ["design", "television", "interface"], "00:51"),
  mem("memory-bookshop", "Seeing a used copy of The Power Broker in a bookshop window", "The thick spine triggered the fantasy of becoming the person who reads it immediately. Two actual books open on the desk interrupted the fantasy.", ["The Power Broker", "bookshop", "reading list"], .28, "2026-09-01", "September 1", "4:18 PM", "Personal", "Do not buy a thousand pages to feel like a better reader", "A serious-looking book is not proof that one has time to read it well.", "The Power Broker looked good in the window. Finish the two shorter books already open, then decide. Do not buy a future self because the cover is heavy.", ["books", "reading", "restraint"], "00:33"),
  mem("memory-curry", "Waiting for food delivery while the reading group chat moved", "The delivery tracker and group chat shared a screen. One small message about Friday's archive piece kept the plan alive without turning dinner into project management.", ["reading group", "food delivery", "Friday"], .12, "2026-08-31", "August 31", "8:21 PM", "Work", "Send the reading-group update before dinner", "One ordinary message moved the plan more than another abandoned document would.", "Send: I will circulate the archive piece tomorrow morning; keep Friday open for first thoughts, nothing formal. Put the phone away when food arrives.", ["message", "reading-group", "routine"], "00:19"),
  mem("memory-kiarostami", "Adding Taste of Cherry to a two-person screening list", "The title was saved with a future interlocutor rather than prestige. The anticipated argument concerned the ending, landscape, and whether spareness can be generous.", ["Taste of Cherry", "Abbas Kiarostami", "two-person screening"], .46, "2026-08-30", "August 30", "9:39 PM", "Personal", "Taste of Cherry belongs on the two-person list", "Some films need a person to argue with after the final image.", "Put Taste of Cherry on the two-person list. I do not want to turn the ending into a private rating before someone else tells me what they saw.", ["film", "watchlist", "friends"], "00:28"),
  mem("memory-application-email", "Drafting a faculty email between classes", "The email became manageable after separating reusable courtesy from one genuine question. The record keeps the distinction between a template and a person.", ["applications", "email", "department"], .23, "2026-08-29", "August 29", "12:16 PM", "Work", "Keep the email skeleton; rewrite the reason", "Reuse logistics, not interest.", "Email shortcut: greeting, one precise question, one sentence on project, thank you. Rewrite the project sentence every time so it does not sound machine-sent.", ["email", "applications", "writing"], "00:34"),
  mem("memory-family-call", "A missed call sat beside research notes", "The notification was not material for reflection. It was a small obligation that became easier once recorded plainly, before research became another reason to postpone care.", ["family", "missed call", "reminder"], .18, "2026-08-28", "August 28", "6:05 PM", "Personal", "Call home before nine", "Some records should remain simple enough to act on immediately.", "Call home before nine. Ask about the rain. Do not tag this as research and do not write a paragraph around it.", ["family", "care", "reminder"], "00:08"),
];

/**
 * Curated display order: the first card in each workspace is also its strongest
 * demonstration of the feature. Chronology is assigned here with the ordering so
 * card labels, calendar data, and the History projection never disagree.
 */
const orderByIds = <T extends { id: string }>(records: T[], ids: string[]) => ids.map((id) => {
  const record = records.find((candidate) => candidate.id === id);
  if (!record) throw new Error(`Missing curated mock record: ${id}`);
  return record;
});

const narrationChronology: Record<string, Pick<NarrationRecord, "timestamp" | "recordedAt">> = {
  "narration-do-the-right-thing": { timestamp: "2026-09-05T22:18:00+05:30", recordedAt: "September 5, 10:18 PM" },
  "narration-phd-proposal": { timestamp: "2026-09-05T20:42:00+05:30", recordedAt: "September 5, 8:42 PM" },
  "narration-oral-history": { timestamp: "2026-09-05T19:06:00+05:30", recordedAt: "September 5, 7:06 PM" },
  "narration-football-documentary": { timestamp: "2026-09-05T17:41:00+05:30", recordedAt: "September 5, 5:41 PM" },
  "narration-late-ray": { timestamp: "2026-09-04T23:23:00+05:30", recordedAt: "September 4, 11:23 PM" },
  "narration-hostel-scene": { timestamp: "2026-09-04T21:07:00+05:30", recordedAt: "September 4, 9:07 PM" },
  "narration-jeanne-dielman": { timestamp: "2026-09-04T17:45:00+05:30", recordedAt: "September 4, 5:45 PM" },
  "narration-hou-distance": { timestamp: "2026-09-03T20:17:00+05:30", recordedAt: "September 3, 8:17 PM" },
  "narration-music-walk": { timestamp: "2026-09-03T19:24:00+05:30", recordedAt: "September 3, 7:24 PM" },
};

const conversationChronology: Record<string, Pick<ConversationRecord, "timestamp" | "date">> = {
  "conversation-screening": { timestamp: "2026-09-05T23:18:00+05:30", date: "September 5, 11:18 PM" },
  "conversation-football": { timestamp: "2026-09-05T21:34:00+05:30", date: "September 5, 9:34 PM" },
  "conversation-proposal": { timestamp: "2026-09-05T19:02:00+05:30", date: "September 5, 7:02 PM" },
  "conversation-syllabus": { timestamp: "2026-09-05T17:42:00+05:30", date: "September 5, 5:42 PM" },
  "conversation-writing-room": { timestamp: "2026-09-05T15:18:00+05:30", date: "September 5, 3:18 PM" },
  "conversation-letterboxd": { timestamp: "2026-09-04T22:21:00+05:30", date: "September 4, 10:21 PM" },
  "conversation-baresi": { timestamp: "2026-09-04T20:02:00+05:30", date: "September 4, 8:02 PM" },
  "conversation-big-city": { timestamp: "2026-09-04T18:26:00+05:30", date: "September 4, 6:26 PM" },
  "conversation-television": { timestamp: "2026-09-04T16:14:00+05:30", date: "September 4, 4:14 PM" },
};

const memoryChronology: Record<string, Pick<AmbientMemoryRecord, "isoDate" | "date" | "time">> = {
  "memory-letterboxd": { isoDate: "2026-09-05", date: "September 5", time: "10:48 PM" },
  "memory-football": { isoDate: "2026-09-05", date: "September 5", time: "9:07 PM" },
  "memory-nyt": { isoDate: "2026-09-05", date: "September 5", time: "7:08 PM" },
  "memory-reading-method": { isoDate: "2026-09-05", date: "September 5", time: "5:44 PM" },
  "memory-wong-kar-wai": { isoDate: "2026-09-05", date: "September 5", time: "3:19 PM" },
  "memory-journal": { isoDate: "2026-09-04", date: "September 4", time: "10:42 PM" },
  "memory-cassavetes": { isoDate: "2026-09-04", date: "September 4", time: "9:11 PM" },
  "memory-proposal": { isoDate: "2026-09-04", date: "September 4", time: "7:16 PM" },
  "memory-city-of-sadness": { isoDate: "2026-09-04", date: "September 4", time: "5:17 PM" },
  "memory-fight-club": { isoDate: "2026-09-04", date: "September 4", time: "3:18 PM" },
  "memory-mad-men": { isoDate: "2026-09-03", date: "September 3", time: "9:44 PM" },
  "memory-wire": { isoDate: "2026-09-03", date: "September 3", time: "7:18 PM" },
  "memory-kiarostami": { isoDate: "2026-09-03", date: "September 3", time: "5:39 PM" },
  "memory-radiohead": { isoDate: "2026-09-03", date: "September 3", time: "4:36 PM" },
  "memory-penalty": { isoDate: "2026-09-02", date: "September 2", time: "11:06 PM" },
  "memory-scene": { isoDate: "2026-09-02", date: "September 2", time: "9:03 PM" },
  "memory-mr-robot": { isoDate: "2026-09-02", date: "September 2", time: "6:42 PM" },
  "memory-bookshop": { isoDate: "2026-09-02", date: "September 2", time: "4:18 PM" },
  "memory-curry": { isoDate: "2026-09-01", date: "September 1", time: "8:21 PM" },
  "memory-application-email": { isoDate: "2026-09-01", date: "September 1", time: "12:16 PM" },
  "memory-trains": { isoDate: "2026-09-01", date: "September 1", time: "10:22 AM" },
  "memory-groceries": { isoDate: "2026-09-01", date: "September 1", time: "7:14 AM" },
  "memory-shoes": { isoDate: "2026-08-31", date: "August 31", time: "8:02 PM" },
  "memory-family-call": { isoDate: "2026-08-31", date: "August 31", time: "6:05 PM" },
  "memory-phd-list": { isoDate: "2026-08-31", date: "August 31", time: "2:36 PM" },
};

export const narrationData = orderByIds(
  narrationRecords.map((record) => ({ ...record, ...narrationChronology[record.id] })),
  ["narration-do-the-right-thing", "narration-phd-proposal", "narration-oral-history", "narration-football-documentary", "narration-late-ray", "narration-hostel-scene", "narration-jeanne-dielman", "narration-hou-distance", "narration-music-walk"],
);

export const conversationData = orderByIds(
  conversationRecords.map((record) => ({ ...record, ...conversationChronology[record.id] })),
  ["conversation-screening", "conversation-football", "conversation-proposal", "conversation-syllabus", "conversation-writing-room", "conversation-letterboxd", "conversation-baresi", "conversation-big-city", "conversation-television"],
);

export const ambientMemoryData = orderByIds(
  ambientMemoryRecords.map((record) => ({ ...record, ...memoryChronology[record.id] })),
  ["memory-letterboxd", "memory-football", "memory-nyt", "memory-reading-method", "memory-wong-kar-wai", "memory-journal", "memory-cassavetes", "memory-proposal", "memory-city-of-sadness", "memory-fight-club", "memory-mad-men", "memory-wire", "memory-kiarostami", "memory-radiohead", "memory-penalty", "memory-scene", "memory-mr-robot", "memory-bookshop", "memory-curry", "memory-application-email", "memory-trains", "memory-groceries", "memory-shoes", "memory-family-call", "memory-phd-list"],
);
