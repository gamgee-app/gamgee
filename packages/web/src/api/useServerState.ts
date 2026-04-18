import { useEffect, useState } from "react";
import type { AppSnapshot } from "./types";

export const useServerState = (): AppSnapshot | null => {
  const [snapshot, setSnapshot] = useState<AppSnapshot | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/events");
    source.addEventListener("snapshot", (evt) => {
      const parsed = JSON.parse((evt as MessageEvent<string>).data) as AppSnapshot;
      setSnapshot(parsed);
    });
    source.onerror = () => {
      // EventSource auto-reconnects; keep last snapshot until recovered
    };
    return () => source.close();
  }, []);

  return snapshot;
};
