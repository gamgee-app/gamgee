import { useMemo } from "react";
import { PlexAPI } from "@lukehagar/plexjs";
import { ServerProtocol } from "@lukehagar/plexjs/src/lib/config.ts";

export const usePlexApi = (
  plexIp: string,
  plexToken: string,
  protocol: ServerProtocol,
) => {
  return useMemo(() => {
    if (plexIp && plexToken) {
      return new PlexAPI({
        ip: plexIp,
        accessToken: plexToken,
        protocol: protocol,
      });
    }
  }, [plexIp, plexToken]);
};
