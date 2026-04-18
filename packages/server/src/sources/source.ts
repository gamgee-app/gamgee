import type { PlayerState } from "../domain/types.js";

export type SourceSample = {
  imdbId: string | undefined;
  durationMs: number | undefined;
  timestampMs: number;
  playerState: PlayerState;
};

export type SourceListener = (sample: SourceSample) => void;

export interface Source {
  readonly kind: "manual" | "plex";
  start(listener: SourceListener): void;
  stop(): void;
}
