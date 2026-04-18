export type EditionDifferenceData = {
  start_time: string;
  start_time_ms: number;
  end_time: string;
  end_time_ms: number;
  type: string;
};

export type EditionChapter = {
  start_time: string;
  start_time_ms: number;
  title: string;
};

export type MovieEdition = {
  label: string;
  duration: number;
  chapters: EditionChapter[];
  differences: EditionDifferenceData[];
};

export type Movie = {
  title: string;
  imdbId: string;
  editions: MovieEdition[];
};

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
