import { useEffect, useState } from "react";
import { PlexAPI, SDKOptions } from "@lukehagar/plexjs";
import { GetServerCapabilitiesResponse } from "@lukehagar/plexjs/sdk/models/operations";
import { useLocalStorage } from "@uidotdev/usehooks";

export interface UsePlexApiReturnProps {
  plexApi: PlexAPI | null;
  plexApiOptions: SDKOptions;
  setPlexApiOptions: (options: SDKOptions) => void;
  plexServerCapabilities: GetServerCapabilitiesResponse | null;
  plexServerCapabilitiesError: Error | null;
}

export const usePlexApi = (): UsePlexApiReturnProps => {
  const [plexApiOptions, setPlexApiOptions] = useLocalStorage<SDKOptions>(
    "plex-api-options",
    {},
  );

  const [plexApi, setPlexApi] = useState<PlexAPI | null>(null);
  const [plexServerCapabilities, setPlexServerCapabilities] =
    useState<GetServerCapabilitiesResponse | null>(null);
  const [plexServerCapabilitiesError, setPlexServerCapabilitiesError] =
    useState<Error | null>(null);

  const setPlexApiWithTest = (options: SDKOptions) => {
    const plexApi = new PlexAPI({ ...options, timeoutMs: 500 });

    plexApi?.server
      .getServerCapabilities()
      .then((value) => {
        setPlexServerCapabilities(value);
        setPlexServerCapabilitiesError(null);
        setPlexApi(plexApi);
      })
      .catch((reason: Error) => {
        setPlexServerCapabilities(null);
        setPlexServerCapabilitiesError(reason);
        setPlexApi(null);
      });
  };

  useEffect(() => {
    setPlexApiWithTest(plexApiOptions);
  }, [plexApiOptions]);

  return {
    plexApi,
    plexApiOptions,
    setPlexApiOptions,
    plexServerCapabilities,
    plexServerCapabilitiesError,
  };
};
