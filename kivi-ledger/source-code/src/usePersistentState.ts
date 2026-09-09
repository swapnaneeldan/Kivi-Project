"use client";

import { useCallback, useEffect, useRef, useState, type SetStateAction } from "react";

const identity = <T,>(value: T) => value;

/** A small client-side store for prototype choices that should survive a refresh. */
export function usePersistentState<T>(key: string, fallback: T, sanitize: (value: T) => T = identity) {
  const [value, setValue] = useState<T>(() => sanitize(fallback));
  const [isHydrated, setIsHydrated] = useState(false);
  const changedBeforeHydration = useRef(false);

  const setPersistentValue = useCallback((nextValue: SetStateAction<T>) => {
    if (!isHydrated) changedBeforeHydration.current = true;
    setValue(nextValue);
  }, [isHydrated]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored !== null && !changedBeforeHydration.current) setValue(sanitize(JSON.parse(stored) as T));
      } catch {
        // A malformed prototype value should never prevent the workspace loading.
      } finally {
        setIsHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [key, sanitize]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Persistence is an enhancement; the in-memory interaction still works.
    }
  }, [isHydrated, key, value]);

  return [value, setPersistentValue, isHydrated] as const;
}
