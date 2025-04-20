import { useState } from "react";
import { GetSessionsResponse } from "@lukehagar/plexjs/sdk/models/operations";
import { PlexAPI } from "@lukehagar/plexjs";
import { useInterval } from "usehooks-ts";

export const usePlexSession = (plexApi: PlexAPI | null, interval: number) => {
  const [sessionsResponse, setSessionsResponse] =
    useState<GetSessionsResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useInterval(() => {
    let isMounted = true;

    setError(null);

    plexApi?.sessions
      .getSessions()
      .then((response) => {
        if (isMounted) setSessionsResponse(response);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      });

    return () => {
      isMounted = false;
    };
  }, interval);

  return {
    session: sessionsResponse?.object?.mediaContainer?.metadata?.at(0),
    error,
  };
};
