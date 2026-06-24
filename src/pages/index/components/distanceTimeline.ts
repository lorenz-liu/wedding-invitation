import type { CSSProperties } from "react";

export const TIMELINE_EVENT_FIRST_DELAY_MS = 600;
export const TIMELINE_EVENT_STAGGER_MS = 220;
export const TIMELINE_EVENT_DURATION_MS = 800;

/** CSS vars for timeline axis reveal — synced with staggered event image entrances. */
export function getTimelineLineStyle(eventCount: number): CSSProperties {
  return {
    "--timeline-line-delay": `${TIMELINE_EVENT_FIRST_DELAY_MS}ms`,
    "--timeline-line-duration": `${
      (eventCount - 1) * TIMELINE_EVENT_STAGGER_MS +
      TIMELINE_EVENT_DURATION_MS
    }ms`,
  } as CSSProperties;
}
