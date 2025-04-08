import { useEffect, useId, useState } from "react";
import { usePlex } from "../../hooks/plex/usePlex.ts";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { MetadataProviderProps } from "../metadata-provider/metadata-provider.ts";
import { movies } from "../../movies/movies.ts";
import { ServerProtocol } from "@lukehagar/plexjs/src/lib/config.ts";

export type PlexMetadataProviderProps = MetadataProviderProps;

export const PlexMetadataProvider = ({
  editionMetadata,
  setEditionMetadata,
  mediaTimerProperties,
  mediaTimerActions,
}: PlexMetadataProviderProps) => {
  const [plexIp, setPlexIp] = useState("");
  const [plexToken, setPlexToken] = useState("");
  const [protocol, setProtocol] = useState<ServerProtocol>("http");
  const { error, estimatedPlayTime, imdbId, mediaDuration, playerState } =
    usePlex(plexIp, plexToken, protocol);

  const { timestamp } = mediaTimerProperties;
  const { seek } = mediaTimerActions;

  useEffect(() => {
    const movie = movies.find((m) => m.imdbId === imdbId);
    const edition = movie?.editions.find((e) => e.duration === mediaDuration);
    if (
      movie &&
      edition &&
      (editionMetadata?.movie !== movie || editionMetadata?.edition !== edition)
    ) {
      setEditionMetadata({ movie, edition });
    }
  }, [imdbId, mediaDuration]);

  useEffect(() => {
    if (
      playerState === "paused" ||
      (playerState === "playing" && estimatedPlayTime > timestamp)
    ) {
      seek(estimatedPlayTime);
    }
  }, [playerState, estimatedPlayTime]);

  const protocolLabelId = useId();
  const protocolLabel = "Protocol";

  return (
    <>
      {imdbId}
      {playerState}
      {error?.message}
      <FormControl fullWidth>
        <InputLabel id={protocolLabelId}>{protocolLabel}</InputLabel>
        <Select
          value={protocol}
          id={protocolLabelId}
          label={protocolLabel}
          onChange={(newProtocol) =>
            setProtocol(newProtocol.target.value as ServerProtocol)
          }
        >
          {Object.values(ServerProtocol).map((protocol) => (
            <MenuItem key={protocol} value={protocol}>
              {protocol}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
