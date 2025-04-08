import { Movie, MovieEdition } from "../../movies/movies.ts";

export type TimeProviderProps = {
  toggleTimerState: () => void;
  toggleTimerLabel: string;
  resetTimer: () => void;
  seekTimer: (milliseconds: number) => void;
};

export type EditionMetadata = {
  movie: Movie;
  edition: MovieEdition;
};

export type EditionProviderProps = {
  editionMetadata: EditionMetadata | null;
  setEditionMetadata: (metadata: EditionMetadata) => void;
};

export type MetadataProviderProps = TimeProviderProps & EditionProviderProps;
