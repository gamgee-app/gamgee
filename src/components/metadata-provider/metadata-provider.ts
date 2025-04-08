import { Movie, MovieEdition } from "../../movies/movies.ts";
import { Timer } from "react-use-precision-timer";

export type TimeProviderProps = {
  timer: Timer;
  toggleTimerState: () => void;
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
