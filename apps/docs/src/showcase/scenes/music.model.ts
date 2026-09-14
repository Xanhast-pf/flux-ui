export const trackIds = ["drums", "bass", "keys", "texture"] as const;
export type TrackId = (typeof trackIds)[number];
export interface TrackSettings {
  cutoff: number;
  gain: number;
  pan: number;
}
export interface StudioSession {
  tempo: number;
  volume: number;
  muted: readonly TrackId[];
  solo: TrackId | null;
  channels: Readonly<Record<TrackId, TrackSettings>>;
  notes: string;
}
export function createStudioSession(): StudioSession {
  return {
    tempo: 108,
    volume: 72,
    muted: [],
    solo: null,
    notes: "",
    channels: {
      drums: { cutoff: 1000, gain: 0, pan: 0 },
      bass: { cutoff: 1000, gain: 0, pan: 0 },
      keys: { cutoff: 1000, gain: 0, pan: 0 },
      texture: { cutoff: 1000, gain: 0, pan: 0 },
    },
  };
}
/** A checkpoint is an independent value; subsequent edits cannot mutate it. */
export function snapshotSession(session: StudioSession): StudioSession {
  return {
    tempo: session.tempo,
    volume: session.volume,
    muted: trackIds.filter((id) => session.muted.includes(id)),
    solo: session.solo,
    notes: session.notes,
    channels: {
      drums: { ...session.channels.drums },
      bass: { ...session.channels.bass },
      keys: { ...session.channels.keys },
      texture: { ...session.channels.texture },
    },
  };
}
export function sameSession(
  first: StudioSession,
  second: StudioSession,
): boolean {
  return (
    JSON.stringify(snapshotSession(first)) ===
    JSON.stringify(snapshotSession(second))
  );
}
export function studioExport(session: StudioSession) {
  return {
    schemaVersion: 1,
    kind: "flux-studio-ui-simulation",
    producesAudio: false,
    description:
      "UI settings only. No audio, MIDI, media files or engine state.",
    session: snapshotSession(session),
  } as const;
}
