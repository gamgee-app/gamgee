import { useEffect, useId, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { api } from "../../api/client";
import type { AppSnapshot, MovieSummary } from "../../api/types";
import styles from "./manual-controls.module.css";

interface ManualControlsProps {
  snapshot: AppSnapshot;
}

const parseSeek = (value: string): number | null => {
  const match = /^(\d+):(\d{1,2}):(\d{1,2})$/.exec(value.trim());
  if (!match) return null;
  const [h, m, s] = [match[1], match[2], match[3]].map(Number);
  if (m >= 60 || s >= 60) return null;
  return ((h * 60 + m) * 60 + s) * 1000;
};

export const ManualControls = ({ snapshot }: ManualControlsProps) => {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [seekValue, setSeekValue] = useState("00:00:00");

  useEffect(() => {
    void api.getMovies().then(setMovies);
  }, []);

  const selectedMovie = movies.find((m) => m.title === snapshot.movieTitle);
  const selectedEditionLabel = snapshot.editionLabel ?? "";

  const movieLabelId = useId();
  const editionLabelId = useId();

  const onMovieChange = (imdbId: string) => {
    const movie = movies.find((m) => m.imdbId === imdbId);
    if (!movie) return;
    const edition =
      movie.editions.find((e) => e.label === selectedEditionLabel) ??
      movie.editions[0];
    void api.setSelection(movie.imdbId, edition.label);
  };

  const onEditionChange = (label: string) => {
    if (!selectedMovie) return;
    void api.setSelection(selectedMovie.imdbId, label);
  };

  const toggleLabel =
    snapshot.playerState === "playing" ? "Pause" : "Play";

  const onToggle = () => {
    if (snapshot.playerState === "playing") void api.pause();
    else void api.play();
  };

  const onSeek = () => {
    const parsed = parseSeek(seekValue);
    if (parsed !== null) void api.seek(parsed);
  };

  return (
    <div className={styles.controls}>
      <FormControl fullWidth>
        <InputLabel id={movieLabelId}>Movie</InputLabel>
        <Select
          value={selectedMovie?.imdbId ?? ""}
          labelId={movieLabelId}
          label="Movie"
          onChange={(e) => onMovieChange(e.target.value)}
        >
          {movies.map((m) => (
            <MenuItem key={m.imdbId} value={m.imdbId}>
              {m.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth disabled={!selectedMovie}>
        <InputLabel id={editionLabelId}>Edition</InputLabel>
        <Select
          value={selectedEditionLabel}
          labelId={editionLabelId}
          label="Edition"
          onChange={(e) => onEditionChange(e.target.value)}
        >
          {selectedMovie?.editions.map((e) => (
            <MenuItem key={e.label} value={e.label}>
              {e.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={styles.row}>
        <Button variant="contained" onClick={onToggle} disabled={!selectedMovie}>
          {toggleLabel}
        </Button>
        <Button variant="outlined" onClick={() => void api.stop()}>
          Stop
        </Button>
        <TextField
          size="small"
          label="Seek (hh:mm:ss)"
          value={seekValue}
          onChange={(e) => setSeekValue(e.target.value)}
          error={parseSeek(seekValue) === null}
        />
        <Button
          variant="outlined"
          onClick={onSeek}
          disabled={parseSeek(seekValue) === null}
        >
          Seek
        </Button>
      </div>
    </div>
  );
};
