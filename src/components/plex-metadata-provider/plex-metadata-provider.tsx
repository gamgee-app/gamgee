import { useEffect, useId } from "react";
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
  const {
    error,
    estimatedPlayTime,
    imdbId,
    mediaDuration,
    playerState,
    plexApiOptions,
    setPlexApiOptions,
  } = usePlex();

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
          value={plexApiOptions.protocol}
          id={protocolLabelId}
          label={protocolLabel}
          onChange={(newProtocolEvent) =>
            setPlexApiOptions((options) => ({
              ...options,
              protocol: newProtocolEvent.target.value as ServerProtocol,
            }))
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
        value={plexApiOptions.ip}
        label="Plex IP"
        onChange={(newIpEvent) =>
          setPlexApiOptions((options) => ({
            ...options,
            ip: newIpEvent.target.value,
          }))
        }
      />
      <TextField
        value={plexApiOptions.accessToken}
        label="Plex Token"
        onChange={(newTokenEvent) =>
          setPlexApiOptions((options) => ({
            ...options,
            accessToken: newTokenEvent.target.value,
          }))
        }
      />
    </>
  );
};
