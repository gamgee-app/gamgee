import { useMemo } from "react";
import { PlexAPI, SDKOptions } from "@lukehagar/plexjs";
import { useLocalStorage } from "usehooks-ts";

export const usePlexApi = () => {
  const [plexApiOptions, setPlexApiOptions] = useLocalStorage<SDKOptions>(
    "plex-api-options",
    {},
  );

  const plexApi = useMemo(() => new PlexAPI(plexApiOptions), [plexApiOptions]);

  return {
    plexApi,
    plexApiOptions,
    setPlexApiOptions,
  };
};
