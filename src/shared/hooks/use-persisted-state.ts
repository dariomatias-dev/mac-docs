import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function usePersistedState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initial);
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

  return [state, setState];
}
