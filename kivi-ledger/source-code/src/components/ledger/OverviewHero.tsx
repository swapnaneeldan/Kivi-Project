import { Mic } from "lucide-react";

interface OverviewHeroProps {
  greeting: string;
  subheading: string;
  onCapture: () => void;
}

export function OverviewHero({ greeting, subheading, onCapture }: OverviewHeroProps) {
  return (
    <header className="kivi-overview__hero">
      <div>
        <span className="kivi-eyebrow">Your private voice workspace</span>
        <h1>{greeting}</h1>
        <p>{subheading}</p>
      </div>
      <button type="button" className="kivi-overview__capture" onClick={onCapture} aria-label="Start voice capture" title="Speak a thought">
        <Mic size={18} strokeWidth={2} />
      </button>
    </header>
  );
}
