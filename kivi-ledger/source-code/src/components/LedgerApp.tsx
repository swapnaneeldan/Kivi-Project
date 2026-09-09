"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContextLedger } from "@/components/ledger/ContextLedger";
import { ActivityHistory } from "@/components/ledger/ActivityHistory";
import { GlobalTrigger } from "@/components/ledger/GlobalTrigger";
import { LandingOverview } from "@/components/ledger/LandingOverview";
import { DictionaryView, ShortcutsView } from "@/components/ledger/LibraryViews";
import { Views } from "@/components/ledger/Views";
import { WelcomeDemoModal } from "@/components/ledger/WelcomeDemoModal";
import type { UtilityContextId, UtilityStyleCategory, UtilityStylePreferences } from "@/components/ledger/UtilityView";
import { useGlobalCancelTake } from "@/useGlobalCancelTake";
import { useArtifactStore } from "@/useArtifactStore";
import { useCaptureStore } from "@/useCaptureStore";
import type { ResearchCapturePayload } from "@/data/researchCapturePool";
import { SettingsProvider, useSettings } from "@/SettingsContext";
import { useCaptureShortcut } from "@/useCaptureShortcut";
import type { Appearance } from "@/components/ledger/SettingsModal";
import { workspaceModes, type LedgerRoute, type TriggerPhase, type WorkspaceMode } from "@/data/mockData";
import { createCapturedStyleArtifact, type StyleArtifact } from "@/data/styleArtifacts";
import "@/app/kivi-ledger.css";
import "@/app/kivi-polish.css";
import { usePersistentState } from "@/usePersistentState";

const processingDelay = 1400;
type PendingCapture = {
  originRoute: LedgerRoute;
  utilityContext: UtilityContextId;
  styleId: string;
  captureIndex: number;
  payload: ResearchCapturePayload | null;
};

function KiviLedgerAppContent() {
  const [activeRoute, setActiveRoute] = useState<LedgerRoute>("overview");
  const [phase, setPhase] = useState<TriggerPhase>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [appearance, setAppearance] = usePersistentState<Appearance>("kivi:settings:appearance", "dark");
  const [systemLight, setSystemLight] = useState(false);
  const [userName, setUserName] = usePersistentState("kivi:settings:user-name", "Swapnaneel");
  const [isWelcomeDemoOpen, setIsWelcomeDemoOpen] = useState(false);
  const [utilityStylePreferences, setUtilityStylePreferences] = usePersistentState<UtilityStylePreferences>("kivi:styles:preferences", {});
  const [, setActiveUtilityContext] = useState<UtilityContextId>("personal");
  const [captureIndex, setCaptureIndex] = usePersistentState("kivi:capture-index", 0);
  const [focusedArtifactId, setFocusedArtifactId] = useState<string | null>(null);
  const [lastCompletedArtifactId, setLastCompletedArtifactId] = useState<string | null>(null);
  const { captureShortcut } = useSettings();
  const processingTimer = useRef<number | null>(null);
  const phaseRef = useRef<TriggerPhase>("idle");
  const activeRouteRef = useRef<LedgerRoute>("overview");
  const activeUtilityContextRef = useRef<UtilityContextId>("personal");
  const captureIndexRef = useRef(0);
  const pendingCaptureRef = useRef<PendingCapture | null>(null);
  const captureOriginRouteRef = useRef<LedgerRoute>("overview");
  const captureUtilityContextRef = useRef<UtilityContextId>("personal");
  const { artifacts, addArtifact, deleteArtifact, deletedArtifactIds, hasMatchingContent } = useArtifactStore();
  const { takeNextPayload } = useCaptureStore(artifacts, hasMatchingContent);
  const focusedArtifact = artifacts.find((artifact) => artifact.id === focusedArtifactId) ?? null;
  const lastCompletedArtifact = artifacts.find((artifact) => artifact.id === lastCompletedArtifactId) ?? null;

  useEffect(() => {
    captureIndexRef.current = captureIndex;
  }, [captureIndex]);

  const setCapturePhase = useCallback((nextPhase: TriggerPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const clearProcessingTimer = useCallback(() => {
    if (processingTimer.current !== null) {
      window.clearTimeout(processingTimer.current);
      processingTimer.current = null;
    }
  }, []);

  const startCapture = useCallback(() => {
    if (phaseRef.current === "processing" || phaseRef.current === "recording") return;
    clearProcessingTimer();
    const originRoute = activeRouteRef.current;
    const utilityContext = activeUtilityContextRef.current;
    const preferredMode = workspaceModes.some((mode) => mode.id === originRoute) ? originRoute as WorkspaceMode : undefined;
    const selectedStyle = utilityStylePreferences[utilityContext] ?? "natural";
    const payload = preferredMode && preferredMode !== "utility" ? takeNextPayload(preferredMode) : null;
    captureOriginRouteRef.current = originRoute;
    captureUtilityContextRef.current = utilityContext;
    pendingCaptureRef.current = { originRoute, utilityContext, styleId: selectedStyle, captureIndex: captureIndexRef.current, payload };
    setLastCompletedArtifactId(null);
    setElapsedSeconds(0);
    setWordCount((count) => count + 44);
    setCapturePhase("recording");
  }, [clearProcessingTimer, setCapturePhase, takeNextPayload, utilityStylePreferences]);

  const addHistoryEntry = useCallback((artifact: StyleArtifact) => {
    addArtifact(artifact);
  }, [addArtifact]);

  const stopCapture = useCallback(() => {
    if (phaseRef.current !== "recording") return;
    setCapturePhase("processing");
    clearProcessingTimer();
    processingTimer.current = window.setTimeout(() => {
      // This request is assembled on the first click, not completion. It keeps
      // the chosen Style and source mode stable across refresh hydration and UI updates.
      const pendingCapture = pendingCaptureRef.current;
      const originRoute = pendingCapture?.originRoute ?? captureOriginRouteRef.current;
      const preferredMode = workspaceModes.some((mode) => mode.id === originRoute) ? originRoute as WorkspaceMode : undefined;
      const utilityContext = pendingCapture?.utilityContext ?? captureUtilityContextRef.current;
      const selectedStyle = pendingCapture?.styleId ?? utilityStylePreferences[utilityContext] ?? "natural";
      const artifact = createCapturedStyleArtifact(selectedStyle, preferredMode, pendingCapture?.captureIndex ?? captureIndexRef.current, pendingCapture?.payload ?? undefined, utilityContext);
      addHistoryEntry(artifact);
      captureIndexRef.current += 1;
      setCaptureIndex(captureIndexRef.current);
      setLastCompletedArtifactId(artifact.id);
      pendingCaptureRef.current = null;
      setCapturePhase("synthesized");
      processingTimer.current = null;
    }, processingDelay);
  }, [addHistoryEntry, clearProcessingTimer, setCaptureIndex, setCapturePhase, utilityStylePreferences]);

  const resetCapture = useCallback(() => {
    clearProcessingTimer();
    pendingCaptureRef.current = null;
    setElapsedSeconds(0);
    setCapturePhase("idle");
  }, [clearProcessingTimer, setCapturePhase]);

  useGlobalCancelTake(resetCapture);
  useCaptureShortcut({ shortcut: captureShortcut, isRecording: phase === "recording", onStart: startCapture, onStop: stopCapture });

  const changeRoute = useCallback((route: LedgerRoute) => {
    const routeChanged = route !== activeRouteRef.current;
    activeRouteRef.current = route;
    setActiveRoute(route);
    setNavigationOpen(false);
    setFocusedArtifactId(null);
    if (routeChanged) resetCapture();
  }, [resetCapture]);

  const openArtifact = useCallback((artifactId: string) => {
    const artifact = artifacts.find((item) => item.id === artifactId);
    if (!artifact) return;
    activeRouteRef.current = artifact.mode;
    setActiveRoute(artifact.mode);
    setNavigationOpen(false);
    setFocusedArtifactId(artifact.id);
    resetCapture();
  }, [artifacts, resetCapture]);

  const openHistoryArtifact = useCallback((artifactId: string) => {
    if (!artifacts.some((artifact) => artifact.id === artifactId)) return;
    activeRouteRef.current = "history";
    setActiveRoute("history");
    setNavigationOpen(false);
    setFocusedArtifactId(artifactId);
    resetCapture();
  }, [artifacts, resetCapture]);

  const updateUtilityStyle = useCallback((category: UtilityStyleCategory, styleId: string) => {
    setUtilityStylePreferences((preferences) => ({ ...preferences, [category]: styleId }));
  }, [setUtilityStylePreferences]);

  const updateUtilityContext = useCallback((context: UtilityContextId) => {
    activeUtilityContextRef.current = context;
    setActiveUtilityContext(context);
  }, []);

  useEffect(() => {
    if (phase !== "recording") return;
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavigationOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => () => clearProcessingTimer(), [clearProcessingTimer]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const update = () => setSystemLight(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const activeMode = workspaceModes.some((mode) => mode.id === activeRoute) ? activeRoute as WorkspaceMode : null;
  const activeStyle = activeRoute === "history" ? "History" : activeRoute === "shortcuts" ? "Shortcuts" : activeRoute === "dictionary" ? "Dictionary" : activeMode ? workspaceModes.find((mode) => mode.id === activeMode)?.label ?? "Utility" : "Capture inbox";

  const lightMode = appearance === "light" || (appearance === "system" && systemLight);

  useEffect(() => {
    const theme = lightMode ? "light" : "dark";
    for (const element of [document.documentElement, document.body]) {
      element.classList.remove("light", "dark");
      element.classList.add(theme);
    }
  }, [lightMode]);

  return (
    <main className={`kivi-app-shell ${lightMode ? "is-light" : ""}`}>
      <button type="button" className="kivi-mobile-menu" aria-label="Open navigation" aria-expanded={navigationOpen} onClick={() => setNavigationOpen((open) => !open)}>
        <Menu size={20} strokeWidth={1.8} />
      </button>

      <div className={`kivi-mobile-ledger ${navigationOpen ? "is-open" : ""}`}>
        <ContextLedger activeRoute={activeRoute} appearance={appearance} onAppearanceChange={setAppearance} onReplayWelcomeDemo={() => setIsWelcomeDemoOpen(true)} onRouteChange={changeRoute} userName={userName} setUserName={setUserName} />
      </div>
      <div className="kivi-desktop-ledger">
        <ContextLedger activeRoute={activeRoute} appearance={appearance} onAppearanceChange={setAppearance} onReplayWelcomeDemo={() => setIsWelcomeDemoOpen(true)} onRouteChange={changeRoute} userName={userName} setUserName={setUserName} />
      </div>

      <section className="kivi-workspace" aria-live="polite">
        <header className="kivi-workspace__topbar">
          <div className="kivi-workspace__location"><strong>{activeRoute === "overview" ? "Overview" : activeStyle}</strong></div>
          <div className="kivi-workspace__utilities">
            <button type="button" className="kivi-theme-toggle" onClick={() => setAppearance(lightMode ? "dark" : "light")} aria-label={lightMode ? "Switch to dark theme" : "Switch to light theme"} title={lightMode ? "Dark theme" : "Light theme"}>
              {lightMode ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>
        </header>

        {activeMode && <GlobalTrigger phase={phase} activeContext={activeStyle} elapsedSeconds={elapsedSeconds} artifact={phase === "synthesized" ? lastCompletedArtifact : null} onStart={startCapture} onStop={stopCapture} />}

        <AnimatePresence mode="wait">
          <motion.div className="kivi-workspace__view" key={activeRoute} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: "easeOut" }}>
            {activeRoute === "overview" ? <LandingOverview artifacts={artifacts} onOpenHistoryArtifact={openHistoryArtifact} onRouteChange={changeRoute} onStartCapture={startCapture} onStopCapture={stopCapture} phase={phase} wordCount={wordCount} /> : activeRoute === "history" ? <ActivityHistory artifacts={artifacts} focusedArtifactId={focusedArtifactId} onClearFocusedArtifact={() => setFocusedArtifactId(null)} onOpenArtifact={openArtifact} onDeleteArtifact={deleteArtifact} /> : activeRoute === "shortcuts" ? <ShortcutsView /> : activeRoute === "dictionary" ? <DictionaryView /> : <Views activeMode={activeRoute} artifacts={artifacts} focusedArtifact={focusedArtifact} onStartCapture={startCapture} onStopCapture={stopCapture} phase={phase} stylePreferences={utilityStylePreferences} onStylePreferenceChange={updateUtilityStyle} onUtilityContextChange={updateUtilityContext} onDeleteArtifact={deleteArtifact} deletedArtifactIds={deletedArtifactIds} onClearFocusedArtifact={() => setFocusedArtifactId(null)} />}
          </motion.div>
        </AnimatePresence>
      </section>
      <WelcomeDemoModal isOpen={isWelcomeDemoOpen} onClose={() => setIsWelcomeDemoOpen(false)} onRouteChange={changeRoute} onStylePreferenceChange={updateUtilityStyle} stylePreferences={utilityStylePreferences} />
    </main>
  );
}

export default function KiviLedgerApp() {
  return <SettingsProvider><KiviLedgerAppContent /></SettingsProvider>;
}
