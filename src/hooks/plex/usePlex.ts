import { usePlexSession } from "./usePlexSession.ts";
import { usePlexMetadata } from "./usePlexMetadata.ts";
import { useEffect, useState } from "react";
import { usePlexApi } from "./usePlexApi.ts";

export const usePlex = () => {
  const {
    plexApi,
    plexApiOptions,
    setPlexApiOptions,
    plexServerCapabilities,
    plexServerCapabilitiesError,
  } = usePlexApi();

  const { session } = usePlexSession(plexApi, 1000);

  const ratingKey = session?.ratingKey
    ? parseInt(session.ratingKey)
    : undefined;

  const { metadata } = usePlexMetadata(plexApi, ratingKey);

  const metadataGuidImdb = metadata?.guids?.find((guid) =>
    guid.id.includes("imdb://"),
  );
  const imdbId = metadataGuidImdb?.id?.split("//")?.at(1);

  const viewOffset = session?.viewOffset ?? 0;
  const playerState = session?.player?.state ?? "empty";
  const mediaDuration = session?.duration;

  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [lastPlayerState, setLastPlayerState] = useState(playerState);
  const [lastViewOffset, setLastViewOffset] = useState(viewOffset);

  useEffect(() => {
    setLastUpdated(Date.now());
    setLastPlayerState(playerState);
    setLastViewOffset(viewOffset);
  }, [playerState, viewOffset]);

  const different =
    playerState !== lastPlayerState || viewOffset !== lastViewOffset;

  const timeSinceLastUpdate = different ? 0 : Date.now() - lastUpdated;

  // The Plex API does not update the viewOffset very regularly, so we must make an educated guess at the timestamp
  //  based on when we last witnessed an API state update

  const estimatedPlayTime =
    playerState === "playing" ? viewOffset + timeSinceLastUpdate : viewOffset;

  return {
    imdbId,
    estimatedPlayTime,
    playerState,
    mediaDuration,
    plexApiOptions,
    setPlexApiOptions,
    plexServerCapabilities,
    plexServerCapabilitiesError,
  };
};
