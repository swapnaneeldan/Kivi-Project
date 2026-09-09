"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Mic, Wand2, X } from "lucide-react";
import { useCallback, useEffect, useState, type ComponentType } from "react";
import type { LedgerRoute } from "@/data/mockData";
import type { UtilityStyleCategory, UtilityStylePreferences } from "@/components/ledger/UtilityView";
import { contextIcons } from "@/components/ledger/contextIcons";

type DictationState = "ready" | "listening" | "captured";
type RewriteState = "ready" | "rewriting" | "resolved";

interface WelcomeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteChange: (route: LedgerRoute) => void;
  onStylePreferenceChange: (category: UtilityStyleCategory, styleId: string) => void;
  stylePreferences: UtilityStylePreferences;
}

interface SurveyCategory {
  id: UtilityStyleCategory;
  label: string;
  prompt: string;
  options: { id: string; label: string; description: string }[];
}

const surveyCategories: SurveyCategory[] = [
  { id: "developer", label: "developer", prompt: "How should Kivi shape the prompt around your code?", options: [{ id: "clear", label: "clear", description: "direct instructions, logic preserved" }, { id: "concise", label: "concise", description: "minimal tokens, high-density prompts" }, { id: "structured", label: "structured", description: "markdown blocks, parameters highlighted" }] },
  { id: "work", label: "work messaging", prompt: "How should your workplace messages land?", options: [{ id: "clear", label: "clear", description: "clean sentences, shorthand kept" }, { id: "casual", label: "casual", description: "lowercase workplace shorthand" }, { id: "formal", label: "formal", description: "everything spelled out, properly" }] },
  { id: "personal", label: "personal messaging", prompt: "What should personal messages keep from your voice?", options: [{ id: "natural", label: "natural", description: "light cleanup, your voice kept" }, { id: "very-casual", label: "very casual", description: "lowercase, shorthand, zero fuss" }, { id: "polished", label: "polished", description: "full punctuation and grammar" }] },
  { id: "email", label: "email", prompt: "How should a spoken thought become an email?", options: [{ id: "professional", label: "professional", description: "conventional and to the point" }, { id: "friendly", label: "friendly", description: "the same note, with warmth" }, { id: "formal", label: "formal", description: "highest formality, full forms" }] },
  { id: "other", label: "other apps", prompt: "When a Style is still emerging, what is the safe default?", options: [{ id: "balanced", label: "balanced", description: "cleaned, but still yours" }, { id: "minimal", label: "minimal", description: "compressed to the essentials" }, { id: "polished", label: "polished", description: "composed, complete sentences" }] },
];

const contextCards: { route: LedgerRoute; title: string; description: string; className: string; icon: ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { route: "utility", title: "Utility", description: "Code, emails & structured app routing.", className: "is-utility", icon: contextIcons.utility },
  { route: "narratives", title: "Narratives", description: "Raw thoughts resolved into long-form drafts.", className: "is-narratives", icon: contextIcons.narratives },
  { route: "conversations", title: "Conversations", description: "Speaker-aware diarized meeting threads.", className: "is-conversations", icon: contextIcons.conversations },
  { route: "ambient", title: "Memory", description: "Time-aware archival timeline & search.", className: "is-memory", icon: contextIcons.ambient },
];

export function WelcomeDemoModal({ isOpen, onClose, onRouteChange, onStylePreferenceChange, stylePreferences }: WelcomeDemoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [dictationState, setDictationState] = useState<DictationState>("ready");
  const [rewriteState, setRewriteState] = useState<RewriteState>("ready");

  const closeDemo = useCallback(() => {
    setCurrentSlide(0);
    setSurveyIndex(0);
    setDictationState("ready");
    setRewriteState("ready");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (dictationState !== "listening") return;
    const timer = window.setTimeout(() => setDictationState("captured"), 1500);
    return () => window.clearTimeout(timer);
  }, [dictationState]);

  useEffect(() => {
    if (rewriteState !== "rewriting") return;
    const timer = window.setTimeout(() => setRewriteState("resolved"), 1200);
    return () => window.clearTimeout(timer);
  }, [rewriteState]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDemo();
      if (event.key === "ArrowLeft") setCurrentSlide((slide) => Math.max(0, slide - 1));
      if (event.key === "ArrowRight") setCurrentSlide((slide) => Math.min(4, slide + 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDemo, isOpen]);

  if (!isOpen) return null;

  const survey = surveyCategories[surveyIndex];
  const selectContext = (route: LedgerRoute) => {
    onRouteChange(route);
    closeDemo();
  };

  return <AnimatePresence>
    <motion.section className="kivi-welcome-demo" role="dialog" aria-modal="true" aria-label="Welcome to Kivi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <header className="kivi-welcome-demo__header">
        <button type="button" onClick={closeDemo}>skip <X size={14} /></button>
        <span>{String(currentSlide + 1).padStart(2, "0")} / 05</span>
      </header>

      <button type="button" className="kivi-welcome-demo__arrow kivi-welcome-demo__arrow--previous" onClick={() => setCurrentSlide((slide) => Math.max(0, slide - 1))} disabled={currentSlide === 0} aria-label="Previous onboarding slide"><ChevronLeft size={22} /></button>
      <button type="button" className="kivi-welcome-demo__arrow kivi-welcome-demo__arrow--next" onClick={() => setCurrentSlide((slide) => Math.min(4, slide + 1))} disabled={currentSlide === 4} aria-label="Next onboarding slide"><ChevronRight size={22} /></button>

      <AnimatePresence mode="wait">
        <motion.main key={currentSlide} className="kivi-welcome-demo__stage" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: .28, ease: "easeOut" }}>
          {currentSlide === 0 && <IntroSlide onContinue={() => setCurrentSlide(1)} />}
          {currentSlide === 1 && <DictationSlide state={dictationState} onStart={() => setDictationState("listening")} />}
          {currentSlide === 2 && <TransformationSlide state={rewriteState} onStart={() => setRewriteState("rewriting")} />}
          {currentSlide === 3 && <SurveySlide category={survey} categoryIndex={surveyIndex} preferences={stylePreferences} onChoose={(styleId) => onStylePreferenceChange(survey.id, styleId)} onPrevious={() => setSurveyIndex((index) => Math.max(0, index - 1))} onNext={() => setSurveyIndex((index) => Math.min(surveyCategories.length - 1, index + 1))} />}
          {currentSlide === 4 && <FinalSlide onSelect={selectContext} />}
        </motion.main>
      </AnimatePresence>

      <footer className="kivi-welcome-demo__footer">
        <span>{currentSlide === 3 ? `${surveyIndex + 1} of ${surveyCategories.length} style spaces` : "your private voice ledger"}</span>
        {currentSlide < 4 && <button type="button" onClick={() => setCurrentSlide((slide) => slide + 1)}>continue <ArrowRight size={15} /></button>}
      </footer>
    </motion.section>
  </AnimatePresence>;
}

function SlideTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="kivi-demo-slide-title"><h1>{title}</h1><p>{subtitle}</p></div>;
}

function IntroSlide({ onContinue }: { onContinue: () => void }) {
  return <div className="kivi-demo-intro"><SlideTitle title="meet kivi." subtitle="— it walks the talk." /><button type="button" className="kivi-demo-intro__orb" onClick={onContinue} aria-label="Start the Kivi welcome demo"><span /><Image src="/images/kivi-hero-pixel-art.png" alt="Pixel-art kiwi under a blossom tree" fill priority sizes="330px" /></button><small>tap Kivi to begin</small></div>;
}

function DemoWave() {
  return <span className="kivi-demo-wave" aria-hidden="true">{Array.from({ length: 15 }, (_, index) => <i key={index} style={{ animationDelay: `${index * 55}ms` }} />)}</span>;
}

function DictationSlide({ state, onStart }: { state: DictationState; onStart: () => void }) {
  return <div className="kivi-demo-practice"><SlideTitle title="tap fn" subtitle="— try saying ‘How are you doing Kivi?’" /><div className={`kivi-demo-capture-pill is-${state}`}><button type="button" onClick={onStart} disabled={state === "listening"}><Mic size={17} />{state === "ready" ? "press and hold fn" : state === "listening" ? "listening…" : "How are you doing, Kivi?"}</button>{state === "listening" && <DemoWave />}{state === "captured" && <span className="kivi-demo-capture-pill__check"><Check size={14} /> captured</span>}</div><p className="kivi-demo-hint">The first pass stays true to what you said.</p></div>;
}

function TransformationSlide({ state, onStart }: { state: RewriteState; onStart: () => void }) {
  return <div className="kivi-demo-practice"><SlideTitle title="tap fn + ^" subtitle="— tap once, say ‘make it formal’, then tap fn." /><div className={`kivi-demo-transform is-${state}`}><div><span>you say</span><p>hey, how are you doing kivi?</p></div><ArrowRight size={20} /><div><span>kivi writes</span><p>{state === "resolved" ? "Hello Kivi, I hope you are doing well." : state === "rewriting" ? "resolving your intent…" : "ready when you are"}</p></div></div><button type="button" className="kivi-demo-action" onClick={onStart} disabled={state === "rewriting"} aria-label={state === "resolved" ? "Try the transformation again" : "Try the transformation"} title={state === "rewriting" ? "Rewriting…" : "Try the transformation"}><Wand2 size={14} className={state === "rewriting" ? "animate-pulse" : ""} /></button></div>;
}

function SurveySlide({ category, categoryIndex, preferences, onChoose, onPrevious, onNext }: { category: SurveyCategory; categoryIndex: number; preferences: UtilityStylePreferences; onChoose: (styleId: string) => void; onPrevious: () => void; onNext: () => void; }) {
  return <div className="kivi-demo-survey"><SlideTitle title="styles survey." subtitle="— set the defaults that sound most like you." /><div className="kivi-demo-survey__categories">{surveyCategories.map((item, index) => <span key={item.id} className={index === categoryIndex ? "is-active" : index < categoryIndex ? "is-complete" : ""}>{item.label}</span>)}</div><div className="kivi-demo-survey__body"><div><span className="kivi-eyebrow">{String(categoryIndex + 1).padStart(2, "0")} / 05</span><h2>{category.label}</h2><p>{category.prompt}</p></div><div className="kivi-demo-survey__choices" role="radiogroup" aria-label={`${category.label} writing style`}>{category.options.map((option) => <button type="button" role="radio" aria-checked={preferences[category.id] === option.id} className={preferences[category.id] === option.id ? "is-selected" : ""} key={option.id} onClick={() => onChoose(option.id)}><span>{preferences[category.id] === option.id && <Check size={14} />}</span><strong>{option.label}</strong><small>{option.description}</small></button>)}</div></div><div className="kivi-demo-survey__controls"><button type="button" onClick={onPrevious} disabled={categoryIndex === 0}><ArrowLeft size={15} /> previous</button><button type="button" onClick={onNext} disabled={categoryIndex === surveyCategories.length - 1}>next category <ArrowRight size={15} /></button></div></div>;
}

function ContextCardVisual({ kind }: { kind: string }) {
  if (kind === "is-utility") return <span className="kivi-demo-context-card__visual kivi-demo-context-card__visual--utility" aria-hidden="true"><b>$</b><i>capture()</i><em>✓</em></span>;
  if (kind === "is-narratives") return <span className="kivi-demo-context-card__visual kivi-demo-context-card__visual--narratives" aria-hidden="true"><i /><i /><i /></span>;
  if (kind === "is-conversations") return <span className="kivi-demo-context-card__visual kivi-demo-context-card__visual--conversations" aria-hidden="true"><b>A</b><i /><b>N</b><i /><b>P</b></span>;
  return <span className="kivi-demo-context-card__visual kivi-demo-context-card__visual--memory" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</span>;
}

function FinalSlide({ onSelect }: { onSelect: (route: LedgerRoute) => void }) {
  return <div className="kivi-demo-final"><SlideTitle title="off you go." subtitle="— choose a Style to explore your private ledger." /><div className="kivi-demo-context-grid">{contextCards.map((card) => { const Icon = card.icon; return <button type="button" className={`kivi-demo-context-card ${card.className}`} key={card.route} onClick={() => onSelect(card.route)}><Icon size={17} strokeWidth={1.7} /><ContextCardVisual kind={card.className} /><strong>{card.title}</strong><small>{card.description}</small><span className="kivi-demo-context-card__open">Open Style <ArrowRight size={13} /></span></button>; })}</div></div>;
}
