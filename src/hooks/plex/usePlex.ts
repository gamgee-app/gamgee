import { usePlexSession } from "./usePlexSession.ts";
import { usePlexMetadata } from "./usePlexMetadata.ts";
import { useEffect, useMemo, useState } from "react";
import { PlexAPI } from "@lukehagar/plexjs";

export const usePlex = (plexIp: string, plexToken: string) => {
  const plexApi = useMemo(() => {
    if (plexIp && plexToken) {
      return new PlexAPI({
        ip: plexIp,
        accessToken: plexToken,
      });
    }
  }, [plexIp, plexToken]);

  const { session, error: sessionError } = usePlexSession(plexApi, 200);

  const ratingKey = session?.ratingKey
    ? parseInt(session.ratingKey)
    : undefined;
  const { metadata, error: metadataError } = usePlexMetadata(
    plexApi,
    ratingKey,
  );

  const metadataGuidImdb = metadata?.guids?.find((guid) =>
    guid.id.includes("imdb://"),
  );
  const imdbId = metadataGuidImdb?.id?.split("//")?.at(1);

  const viewOffset = session?.viewOffset;
  const playerState = session?.player?.state;
  const mediaDuration = session?.duration;

  const [lastPlayerState, setLastPlayerState] = useState<string>("unknown");
  const [lastViewOffset, setLastViewOffset] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  useEffect(() => {
    if (
      playerState === "playing" &&
      lastPlayerState !== playerState &&
      viewOffset !== undefined
    ) {
      setLastViewOffset(viewOffset);
      setLastPlayerState(playerState);
    }
    if (playerState === "paused" && viewOffset !== undefined) {
      setLastViewOffset(viewOffset);
    }
    if (playerState === undefined) {
      setLastViewOffset(0);
    }
    setLastUpdated(Date.now());
  }, [lastPlayerState, playerState, viewOffset]);

  // The Plex API does not update the viewOffset very regularly, so we must make an educated guess at the timestamp
  //  based on the last available viewOffset, and when we witnessed viewOffset update
  const timeSinceLastUpdate = Date.now() - lastUpdated;
  const estimatedPlayTime =
    playerState === "playing"
      ? lastViewOffset + timeSinceLastUpdate
      : lastViewOffset;

  return {
    imdbId,
    estimatedPlayTime,
    playerState,
    mediaDuration,
    error: sessionError ?? metadataError,
  };
};
