import type { AppSnapshot, Config, MovieSummary, SourceKind } from "./types";

const json = async <T>(res: Response): Promise<T> => {
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
};

export const api = {
  getState: () => fetch("/api/state").then((r) => json<AppSnapshot>(r)),
  getMovies: () => fetch("/api/movies").then((r) => json<MovieSummary[]>(r)),
  getConfig: () => fetch("/api/config").then((r) => json<Config>(r)),
  putConfig: (config: Config) =>
    fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    }).then((r) => json<Config>(r)),
  setSource: (kind: SourceKind) =>
    fetch("/api/source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind }),
    }).then((r) => json<AppSnapshot>(r)),
  setSelection: (imdbId: string, editionLabel: string) =>
    fetch("/api/selection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imdbId, editionLabel }),
    }).then((r) => json<AppSnapshot>(r)),
  play: () => fetch("/api/timer/play", { method: "POST" }).then((r) => json<AppSnapshot>(r)),
  pause: () => fetch("/api/timer/pause", { method: "POST" }).then((r) => json<AppSnapshot>(r)),
  stop: () => fetch("/api/timer/stop", { method: "POST" }).then((r) => json<AppSnapshot>(r)),
  seek: (timestampMs: number) =>
    fetch("/api/timer/seek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestampMs }),
    }).then((r) => json<AppSnapshot>(r)),
  testWebhook: (which: "on" | "off") =>
    fetch("/api/test-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ which }),
    }).then((r) => json<{ ok: boolean }>(r)),
};
