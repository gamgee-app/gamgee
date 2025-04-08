import { Movie, MovieEdition } from "../../movies/movies.ts";
import { Timer } from "react-use-precision-timer";

export type TimeProviderProps = {
  timer: Timer;
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
