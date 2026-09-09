"use client";

import { ArrowRight, ChevronDown, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { KiviBird } from "@/components/ledger/KiviBird";
import { HeadingSwish } from "@/components/ledger/HeadingSwish";
import { usePersistentState } from "@/usePersistentState";

type SavedShortcut = { id: string; phrase: string; output: string };

const initialShortcuts: SavedShortcut[] = [
  { id: "shortcut-letterboxd", phrase: "log this on letterboxd", output: "A first-pass Letterboxd note: keep the specific scene, the formal detail that stayed with me, and the argument I am still having with the film." },
  { id: "shortcut-phd", phrase: "proposal follow-up", output: "Thank you for your time. I am developing a doctoral project on Beat literature, cultural memory, and altered cognition, and I would be grateful to continue the conversation." },
  { id: "shortcut-reading-group", phrase: "send the reading group update", output: "Hi everyone — I will circulate the archive piece tomorrow morning. Let us keep Friday open for the first discussion, and please add one passage you would like us to stay with." },
  { id: "shortcut-watchlist", phrase: "save this for a clear evening", output: "Watchlist note: keep the reason for saving this title attached, and do not schedule it as a completion task." },
];

export function ShortcutsView() {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [output, setOutput] = useState("");
  const [savedShortcuts, setSavedShortcuts] = usePersistentState<SavedShortcut[]>("kivi:library:shortcuts", initialShortcuts);

  const closeCreator = () => {
    setIsCreatorOpen(false);
    setPhrase("");
    setOutput("");
  };

  const teachShortcut = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phrase.trim() || !output.trim()) return;
    setSavedShortcuts((current) => [...current, { id: crypto.randomUUID(), phrase: phrase.trim(), output: output.trim() }]);
    closeCreator();
  };

  return <section className="kivi-library-page kivi-shortcuts-page">
    <KiviBird className="kivi-watermark" />
    <header className="kivi-view-header kivi-library-page__header"><div className="kivi-unified-header-copy"><span className="kivi-eyebrow">Library / Shortcuts</span><h1 className="kivi-unified-title">shortcuts<span className="kivi-title-accent">.</span><HeadingSwish /></h1><p>Teach a spoken phrase once, then let Kivi expand it wherever you write.</p></div></header>

    <section className="kivi-library-hero kivi-shortcuts-hero" aria-label="Shortcut example">
      <h2>shortcuts kivi expands automatically.</h2>
      <div className="kivi-dictionary-hero__example"><div><span>you say</span><em>“my sign-off”</em></div><ArrowRight size={38} strokeWidth={1.5} aria-hidden="true" /><div><span>kivi writes</span><strong>Warm regards, Swapnaneel Dan</strong></div></div>
    </section>

    <section className={`kivi-library-creator ${isCreatorOpen ? "is-open" : ""}`}>
      <button type="button" className="kivi-library-creator__trigger" onClick={() => setIsCreatorOpen((open) => !open)} aria-expanded={isCreatorOpen}>
        <span>{isCreatorOpen ? <X size={17} /> : <Plus size={17} />}</span>
        <strong>teach kivi a shortcut</strong>
        {isCreatorOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
      </button>
      {isCreatorOpen && <form className="kivi-library-creator__form" onSubmit={teachShortcut}>
        <label>when i say<input value={phrase} onChange={(event) => setPhrase(event.target.value)} placeholder="write an acknowledgement email" autoFocus /></label>
        <label>what kivi writes<textarea value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Thanks for sharing this. I have received it and will get back to you shortly." /></label>
        <div className="kivi-library-creator__actions"><button type="submit" disabled={!phrase.trim() || !output.trim()}>teach kivi</button><button type="button" onClick={closeCreator}>cancel</button></div>
      </form>}
    </section>

    {savedShortcuts.length > 0 && <section className="kivi-shortcuts-saved" aria-live="polite">{savedShortcuts.map((shortcut) => <article key={shortcut.id}><div><span>when you say</span><strong>“{shortcut.phrase}”</strong><p>{shortcut.output}</p></div><button type="button" onClick={() => setSavedShortcuts((current) => current.filter((item) => item.id !== shortcut.id))} aria-label={`Delete ${shortcut.phrase}`} title="Delete shortcut"><Trash2 size={15} /></button></article>)}</section>}
  </section>;
}

const initialTerms = ["Swapnaneel Dan", "Letterboxd", "Wong Kar-wai", "Satyajit Ray", "Hou Hsiao-hsien", "Aaditya", "Neel", "Pranav", "Maya", "Kerouac", "Halbwachs", "Astrid Erll", "Ricoeur", "Kiarostami", "Cassavetes", "Baresi", "Kaurismäki", "MUBI", "SDS Football", "The Strokes", "Cage the Elephant", "New Taiwan Cinema", "cultural memory", "oral history"];

export function DictionaryView() {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [terms, setTerms] = usePersistentState<string[]>("kivi:library:dictionary", initialTerms);

  const closeCreator = () => {
    setIsCreatorOpen(false);
    setIsAdvancedOpen(false);
    setTerm("");
  };

  const saveTerm = () => {
    const nextTerm = term.trim();
    if (!nextTerm) return;
    setTerms((current) => current.includes(nextTerm) ? current : [...current, nextTerm]);
    closeCreator();
  };

  const teachTerm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveTerm();
  };

  return <section className="kivi-library-page kivi-dictionary-page">
    <KiviBird className="kivi-watermark" />
    <header className="kivi-view-header kivi-library-page__header"><div className="kivi-unified-header-copy"><span className="kivi-eyebrow">Library / Dictionary</span><h1 className="kivi-unified-title">dictionary<span className="kivi-title-accent">.</span><HeadingSwish /></h1><p>Keep the words, names, and addresses you care about exactly as intended.</p></div><button type="button" className="kivi-library-import" disabled title="Import is available in native Kivi" aria-label="Import is available in native Kivi">📥</button></header>

    <section className="kivi-library-hero kivi-dictionary-hero">
      <h2>words kivi never misspells.</h2>
      <div className="kivi-dictionary-hero__example"><div><span>you say</span><em>“wong car why”</em></div><ArrowRight size={38} strokeWidth={1.5} aria-hidden="true" /><div><span>kivi writes</span><strong>Wong Kar-wai</strong></div></div>
    </section>

    <section className={`kivi-library-creator ${isCreatorOpen ? "is-open" : ""}`}>
      <button type="button" className="kivi-library-creator__trigger" onClick={() => setIsCreatorOpen((open) => !open)} aria-expanded={isCreatorOpen}>
        <span>{isCreatorOpen ? <X size={17} /> : <Plus size={17} />}</span>
        <strong>teach kivi a term</strong>
        {isCreatorOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
      </button>
      {isCreatorOpen && <form className="kivi-library-creator__form" onSubmit={teachTerm}>
        <label className="kivi-library-creator__single-input"><input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="darthvader@yahoo.com" autoFocus /></label>
        <button type="button" className="kivi-library-advanced" onClick={() => setIsAdvancedOpen((open) => !open)}>advanced <ChevronRight size={16} className={isAdvancedOpen ? "is-open" : ""} /></button>
        {isAdvancedOpen && <p className="kivi-library-advanced__copy">Kivi will preserve this spelling across captures and linked destinations.</p>}
        <div className="kivi-library-creator__actions"><button type="submit" disabled={!term.trim()}>teach kivi</button><button type="button" onClick={closeCreator}>cancel</button></div>
      </form>}
    </section>

    <section className="kivi-dictionary-list" aria-label="Saved dictionary terms">{terms.map((entry) => <article key={entry}><span>{entry}</span><button type="button" onClick={() => setTerms((current) => current.filter((termEntry) => termEntry !== entry))} aria-label={`Delete ${entry}`} title={`Delete ${entry}`}><Trash2 size={15} /></button></article>)}</section>
  </section>;
}
