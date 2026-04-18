import type {
  EditionChapter,
  EditionDifferenceData,
  Movie,
  MovieEdition,
  MovieSummary,
} from "./types.js";

export const isSwordGlowing = (
  differences: EditionDifferenceData[],
  timestampMs: number,
): boolean =>
  differences.some(
    (d) => d.start_time_ms < timestampMs && d.end_time_ms > timestampMs,
  );

export const getCurrentChapter = (
  chapters: EditionChapter[],
  timestampMs: number,
): EditionChapter | undefined =>
  chapters.findLast((c) => c.start_time_ms <= timestampMs);

export const matchEdition = (
  movie: Movie | undefined,
  durationMs: number | undefined,
): MovieEdition | undefined => {
  if (!movie) return undefined;
  if (durationMs === undefined) return movie.editions[0];
  return movie.editions.find((e) => e.duration === durationMs);
};

export const findMovieByImdbId = (
  movies: readonly Movie[],
  imdbId: string | undefined,
): Movie | undefined =>
  imdbId ? movies.find((m) => m.imdbId === imdbId) : undefined;

export const toMovieSummaries = (movies: readonly Movie[]): MovieSummary[] =>
  movies.map((m) => ({
    imdbId: m.imdbId,
    title: m.title,
    editions: m.editions.map((e) => ({
      label: e.label,
      durationMs: e.duration,
    })),
  }));
