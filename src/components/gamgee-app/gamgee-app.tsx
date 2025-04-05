import { StingComponent } from "../sting-component/sting-component.tsx";
import { useState } from "react";
import { usePlex } from "../../hooks/plex/usePlex.ts";
import { TextField } from "@mui/material";
import { movies } from "../../movies/movies.ts";

export const GamgeeApp = () => {
  const movieEdition = movies["tt0167261"].editions.find(
    (edition) => edition.label === "Extended Edition",
  )!;

  const [plexIp, setPlexIp] = useState("");
  const [plexToken, setPlexToken] = useState("");
  usePlex(plexIp, plexToken);

  // Use imdbId to identify the movie playing, see movies.ts
  // Use playerState to automatically pause/play our stopwatch
  // Use estimatedPlayTime to keep our stopwatch in sync.

  return (
    <>
      <StingComponent
        differences={movieEdition.differences!}
        chapters={movieEdition.chapters!}
      />
      <TextField
        label="Plex IP"
        onChange={(newIpEvent) => setPlexIp(newIpEvent.target.value)}
      />
      <TextField
        label="Plex Token"
        onChange={(newTokenEvent) => setPlexToken(newTokenEvent.target.value)}
      />
    </>
  );
};
