import { Movie, MovieEdition } from "../../movies/movies.ts";
import {
  MediaTimerActions,
  MediaTimerProperties,
} from "../../hooks/media-timer/useMediaTimer.tsx";

export type TimeProviderProps = {
  mediaTimerProperties: MediaTimerProperties;
  mediaTimerActions: MediaTimerActions;
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
