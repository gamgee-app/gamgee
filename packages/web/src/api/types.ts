export type PlayerState = "playing" | "paused" | "buffering" | "stopped";
export type SourceKind = "manual" | "plex";

export type AppSnapshot = {
  source: SourceKind;
  playerState: PlayerState;
  timestampMs: number;
  movieTitle: string | null;
  editionLabel: string | null;
  chapterTitle: string | null;
  swordOn: boolean;
};

export type MovieSummary = {
  imdbId: string;
  title: string;
  editions: { label: string; durationMs: number }[];
};

export type Config = {
  server: { host: string; port: number };
  webhooks: { swordOn: string; swordOff: string; debounceMs: number };
  source: {
    kind: SourceKind;
    plex: { baseUrl?: string; token?: string; pollMs: number };
  };
};
