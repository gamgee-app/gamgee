import {
  EditionProviderProps,
  MetadataProviderProps,
  TimeProviderProps,
} from "../metadata-provider/metadata-provider.ts";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { useId, useState } from "react";
import dayjsUtc, { Dayjs } from "../../utils/dayjs-config.ts";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { movies } from "../../movies/movies.ts";
import styles from "./manual-metadata-provider.module.css";

export type ManualMetadataProviderProps = MetadataProviderProps;

export const ManualMetadataProvider = ({
  editionMetadata,
  setEditionMetadata,
  mediaTimerProperties,
  mediaTimerActions,
}: ManualMetadataProviderProps) => {
  return (
    <>
      <ManualEditionMetadataProvider
        editionMetadata={editionMetadata}
        setEditionMetadata={setEditionMetadata}
      />
      <ManualTimeProvider
        mediaTimerProperties={mediaTimerProperties}
        mediaTimerActions={mediaTimerActions}
        disabled={!editionMetadata}
      />
    </>
  );
};

export const ManualEditionMetadataProvider = ({
  editionMetadata,
  setEditionMetadata,
}: EditionProviderProps) => {
  const movieLabelId = useId();
  const movieLabel = "Movie";

  const editionLabelId = useId();
  const editionLabel = "Edition";

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id={movieLabelId}>{movieLabel}</InputLabel>
        <Select
          value={editionMetadata?.movie.imdbId ?? ""}
          id={movieLabelId}
          label={movieLabel}
          onChange={(imdbId) => {
            const movie = movies.find((m) => m.imdbId === imdbId.target.value);

            if (!movie) return;
            const foundSameEdition = movie.editions.find(
              (e) => e.label === editionMetadata?.edition.label,
            );
            const edition = foundSameEdition ?? movie.editions[0];

            setEditionMetadata({
              movie,
              edition,
            });
          }}
        >
          {movies.map((movie) => (
            <MenuItem key={movie.imdbId} value={movie.imdbId}>
              {movie.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id={editionLabelId}>{editionLabel}</InputLabel>
        <Select
          value={editionMetadata?.edition.label ?? ""}
          id={editionLabelId}
          label={editionLabel}
          disabled={!editionMetadata}
          onChange={(label) => {
            if (!editionMetadata) return;
            const movie = editionMetadata.movie;
            const edition = movie.editions.find(
              (e) => e.label === label.target.value,
            );

            if (!edition) return;
            setEditionMetadata({ movie, edition });
          }}
        >
          {editionMetadata?.movie.editions.map((edition) => (
            <MenuItem key={edition.label} value={edition.label}>
              {edition.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export type ManualTimeProviderProps = TimeProviderProps & { disabled: boolean };

export const ManualTimeProvider = ({
  mediaTimerProperties,
  mediaTimerActions,
  disabled,
}: ManualTimeProviderProps) => {
  const [seekTimerValue, setSeekTimerValue] = useState<Dayjs>(
    dayjsUtc("1970-01-01"),
  );

  const { toggleLabel } = mediaTimerProperties;
  const { reset, seek, toggle } = mediaTimerActions;

  return (
    <div className={styles.timeProvider}>
      <button disabled={disabled} onClick={toggle}>
        {toggleLabel}
      </button>
      <button disabled={disabled} onClick={reset}>
        Reset
      </button>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimeField
          disabled={disabled}
          value={seekTimerValue}
          onChange={(newSeekTimerValue) => {
            if (newSeekTimerValue) setSeekTimerValue(newSeekTimerValue);
          }}
          format="HH:mm:ss"
        />
      </LocalizationProvider>
      <button
        disabled={disabled || !seekTimerValue || !seekTimerValue.isValid()}
        onClick={() => {
          if (seekTimerValue) seek(seekTimerValue.valueOf());
        }}
      >
        Seek
      </button>
    </div>
  );
};
