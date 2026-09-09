"use client";

import { usePersistentState } from "@/usePersistentState";

type LanguageSettings = { language: string; script: "native" | "roman" };
const defaultLanguageSettings: LanguageSettings = { language: "auto-detect", script: "native" };

export function LanguageScriptModule({ appId }: { appId: string }) {
  const [settingsByApp, setSettingsByApp] = usePersistentState<Record<string, LanguageSettings>>("kivi:styles:language-by-app", {});
  const settings = settingsByApp[appId] ?? defaultLanguageSettings;
  const updateSettings = (next: Partial<LanguageSettings>) => setSettingsByApp((current) => ({ ...current, [appId]: { ...defaultLanguageSettings, ...current[appId], ...next } }));

  return (
    <article className="kivi-language-script">
      <div>
        <span className="kivi-eyebrow">How you sound, app by app</span>
        <h2>Language &amp; script</h2>
        <p>Let Kivi preserve the words you say and choose the writing system each app expects.</p>
      </div>
      <label>Language
        <select value={settings.language} onChange={(event) => updateSettings({ language: event.target.value })}>
          <option>auto-detect</option><option>English</option><option>Hindi (हिन्दी)</option><option>Bengali (বাংলা)</option><option>Tamil (தமிழ்)</option><option>Telugu (తెలుగు)</option><option>Marathi (मराठी)</option><option>Gujarati (ગુજરાતી)</option>
        </select>
      </label>
      <div className="kivi-script-toggle" role="group" aria-label="Script selection">
        <button type="button" className={settings.script === "native" ? "is-active" : ""} onClick={() => updateSettings({ script: "native" })}><strong>native</strong><span>नमस्ते, आप कैसे हैं?</span></button>
        <button type="button" className={settings.script === "roman" ? "is-active" : ""} onClick={() => updateSettings({ script: "roman" })}><strong>roman</strong><span>namaste, aap kaise hain?</span></button>
      </div>
    </article>
  );
}
