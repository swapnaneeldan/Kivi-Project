"use client";

import { useEffect } from "react";

export function useGlobalCancelTake(onCancel: () => void) {
  useEffect(() => {
    let lastFnPress = 0;
    const cancel = () => {
      onCancel();
      window.dispatchEvent(new Event("kivi:cancel-take"));
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector("[data-shortcut-recording='true']")) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopImmediatePropagation(); cancel(); return; }
      if (event.key !== "Fn") return;
      const now = Date.now();
      if (now - lastFnPress <= 300) { event.preventDefault(); event.stopImmediatePropagation(); lastFnPress = 0; cancel(); return; }
      lastFnPress = now;
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);
}
