import { useEffect, useId } from "react";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { MetadataProviderProps } from "../metadata-provider/metadata-provider.ts";
import { ServerProtocol } from "@lukehagar/plexjs/src/lib/config.ts";
import { usePlex } from "../../hooks/plex/usePlex.ts";
import { movies } from "../../movies/movies.ts";

export type PlexMetadataProviderProps = MetadataProviderProps;

export const PlexMetadataProvider = ({
  editionMetadata,
  setEditionMetadata,
  mediaTimerProperties,
  mediaTimerActions,
}: PlexMetadataProviderProps) => {
  const {
    estimatedPlayTime,
    imdbId,
    mediaDuration,
    playerState,
    plexApiOptions,
    setPlexApiOptions,
    plexServerCapabilities,
    plexServerCapabilitiesError,
  } = usePlex();

  const { timestamp, state: mediaTimerState } = mediaTimerProperties;
  const { resume, seek, pause, stop } = mediaTimerActions;

  useEffect(() => {
    // playerState is "playing" | "paused" | "buffering" | "empty"

    if (playerState === "paused" || playerState === "buffering") {
      seek(estimatedPlayTime);
      pause();
      return;
    }

    if (playerState !== "playing") {
      stop();
      setEditionMetadata(null);
      return;
    }

    if (mediaTimerState !== "running") {
      resume();
    }

    if (Math.abs(estimatedPlayTime - timestamp) > 500) {
      seek(estimatedPlayTime);
    }
  }, [playerState, estimatedPlayTime]);

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

  const protocolLabelId = useId();
  const protocolLabel = "Protocol";

  return (
    <>
      {plexServerCapabilities === null ? (
        <Alert severity="error">
          {plexServerCapabilitiesError?.message ?? "Unknown error occurred"}
        </Alert>
      ) : !editionMetadata ? (
        <Alert severity="success">
          {`Connected to ${plexServerCapabilities.object?.mediaContainer?.friendlyName} as ${plexServerCapabilities.object?.mediaContainer?.myPlexUsername}`}
        </Alert>
      ) : (
        <Alert severity="info">
          {[editionMetadata.movie.title, editionMetadata.edition.label].join(
            " - ",
          )}
        </Alert>
      )}
      <FormControl fullWidth>
        <InputLabel id={protocolLabelId}>{protocolLabel}</InputLabel>
        <Select
          value={plexApiOptions.protocol}
          id={protocolLabelId}
          label={protocolLabel}
          onChange={(newProtocolEvent) =>
            setPlexApiOptions({
              ...plexApiOptions,
              protocol: newProtocolEvent.target.value as ServerProtocol,
            })
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
          setPlexApiOptions({
            ...plexApiOptions,
            ip: newIpEvent.target.value,
          })
        }
      />
      <TextField
        value={plexApiOptions.accessToken}
        label="Plex Token"
        onChange={(newTokenEvent) =>
          setPlexApiOptions({
            ...plexApiOptions,
            accessToken: newTokenEvent.target.value,
          })
        }
      />
    </>
  );
};
