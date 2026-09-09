"use client";

import {
  BookText,
  ChevronDown,
  ChevronRight,
  History,
  Home,
  Keyboard,
  Layers3,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import type { LedgerRoute } from "@/data/mockData";
import { workspaceModes } from "@/data/mockData";
import { KiviBird } from "@/components/ledger/KiviBird";
import { SettingsModal, type Appearance } from "@/components/ledger/SettingsModal";
import { contextIcons } from "@/components/ledger/contextIcons";

interface ContextLedgerProps {
  activeRoute: LedgerRoute;
  appearance: Appearance;
  onAppearanceChange: (appearance: Appearance) => void;
  onReplayWelcomeDemo: () => void;
  onRouteChange: (route: LedgerRoute) => void;
  setUserName: (name: string) => void;
  userName: string;
}

const libraryItems = [
  { id: "history", label: "History", icon: History },
  { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
  { id: "dictionary", label: "Dictionary", icon: BookText },
] as const;

export function ContextLedger({ activeRoute, appearance, onAppearanceChange, onReplayWelcomeDemo, onRouteChange, setUserName, userName }: ContextLedgerProps) {
  const [pinned, setPinned] = useState(false);
  const [isContextsOpen, setIsContextsOpen] = useState(true);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <aside className={`kivi-ledger kivi-ledger--${activeRoute} ${pinned ? "is-pinned" : ""}`} aria-label="Kivi Styles navigation">
      <div className="kivi-ledger__top">
        <div className="kivi-ledger__brand-row">
          <div className="kivi-wordmark" aria-label="Kivi">
            <span className="kivi-wordmark__emblem" aria-hidden="true"><KiviBird /></span>
            <span className="kivi-wordmark__dot" aria-hidden="true" />
            <span className="kivi-wordmark__text">Kivi</span>
          </div>
          <button
            type="button"
            className="kivi-ledger__pin"
            onClick={() => setPinned((value) => !value)}
            aria-label={pinned ? "Collapse navigation" : "Pin navigation open"}
            title={pinned ? "Collapse navigation" : "Pin navigation open"}
          >
            {pinned ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        </div>

        <nav className="kivi-ledger__nav">
          <button
            type="button"
            className={`kivi-ledger__nav-item ${activeRoute === "overview" ? "is-active" : ""}`}
            onClick={() => onRouteChange("overview")}
            aria-current={activeRoute === "overview" ? "page" : undefined}
            title="Overview"
          >
            <Home size={17} strokeWidth={1.7} />
            <span>Overview</span>
            {activeRoute === "overview" && <i className="kivi-ledger__nav-pulse" aria-hidden="true" />}
          </button>

          <button type="button" className="kivi-ledger__nav-item kivi-ledger__drawer-trigger" onClick={() => setIsContextsOpen((open) => !open)} aria-expanded={isContextsOpen}>
            <Layers3 size={17} strokeWidth={1.7} />
            <span>Styles</span>{isContextsOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
          {isContextsOpen && <div className="kivi-ledger__accordion is-open">{workspaceModes.map((mode) => {
            const Icon = contextIcons[mode.id];
            const isActive = activeRoute === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                className={`kivi-ledger__nav-item ${isActive ? "is-active" : ""}`}
                onClick={() => onRouteChange(mode.id)}
                title={mode.label}
              >
                <Icon size={17} strokeWidth={1.7} />
                <span>{mode.label}</span>
                {isActive && <i className="kivi-ledger__nav-pulse" aria-hidden="true" />}
              </button>
            );
          })}</div>}
          <button type="button" className="kivi-ledger__nav-item kivi-ledger__drawer-trigger" onClick={() => setIsLibraryOpen((open) => !open)} aria-expanded={isLibraryOpen}>
            <Library size={17} strokeWidth={1.7} />
            <span>Library</span>{isLibraryOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
          {isLibraryOpen && <div className="kivi-ledger__accordion kivi-ledger__accordion--library is-open">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;

              return <button
                key={item.id}
                type="button"
                className={`kivi-ledger__nav-item ${isActive ? "is-active" : ""}`}
                onClick={() => onRouteChange(item.id)}
                aria-current={isActive ? "page" : undefined}
                title={item.label}
              >
                <Icon size={17} strokeWidth={1.7} />
                <span>{item.label}</span>
                {isActive && <i className="kivi-ledger__nav-pulse" aria-hidden="true" />}
              </button>;
            })}
          </div>}
        </nav>
      </div>

      <div className="kivi-ledger__bottom">
        <button type="button" className="kivi-profile__avatar" aria-label="Open profile and settings" title="Profile and settings" onClick={() => setIsSettingsOpen((open) => !open)}>{userName.trim().charAt(0).toUpperCase() || "S"}</button>
      </div>
      <SettingsModal isOpen={isSettingsOpen} userName={userName} setUserName={setUserName} appearance={appearance} onAppearanceChange={onAppearanceChange} onClose={() => setIsSettingsOpen(false)} onReplayWelcomeDemo={onReplayWelcomeDemo} />
    </aside>
  );
}
