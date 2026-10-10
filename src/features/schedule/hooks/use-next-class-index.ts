"use client";

import { useSyncExternalStore } from "react";

import { getNextClassIndex } from "../lib/schedule";

function subscribe() {
  return () => {};
}

// undefined means "not yet known": keeps SSR/client markup identical until
// hydration, since the answer depends on the visitor's local clock.
function getServerSnapshot() {
  return undefined;
}

/** Index of the next class in CLASS_SCHEDULE, -1 when none is left, undefined before hydration. */
export function useNextClassIndex(): number | undefined {
  return useSyncExternalStore(subscribe, getNextClassIndex, getServerSnapshot);
}
