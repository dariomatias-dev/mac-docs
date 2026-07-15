import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

export function usePersistedState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initial);
  const initialRef = useRef(initial);
  useEffect(() => {
    initialRef.current = initial;
  });
  // Tracks which key the current `state` was hydrated for, so the write
  // effect never persists stale state under a key it hasn't read yet
  // (e.g. when `key` changes on an already-mounted instance).
  const [hydratedKey, setHydratedKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(raw !== null ? (JSON.parse(raw) as T) : initial);
    } catch (err) {
      console.error(`usePersistedState: failed to read "${key}"`, err);
      setState(initial);
    }
    setHydratedKey(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (hydratedKey !== key) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error(`usePersistedState: failed to write "${key}"`, err);
    }
  }, [key, state, hydratedKey]);

  // Keeps other tabs/windows on the same key in sync (the "storage" event
  // only fires in tabs other than the one that wrote the value).
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== key) return;
      try {
        setState(e.newValue !== null ? (JSON.parse(e.newValue) as T) : initialRef.current);
      } catch (err) {
        console.error(`usePersistedState: failed to parse storage event for "${key}"`, err);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [state, setState];
}
