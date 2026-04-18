import { PlexAPI } from "@lukehagar/plexjs";
import type { Source, SourceListener, SourceSample } from "./source.js";
import type { PlayerState } from "../domain/types.js";

type PlexConfig = {
  baseUrl?: string;
  token?: string;
  pollMs: number;
};

const parseBaseUrl = (baseUrl: string | undefined) => {
  if (!baseUrl) return { protocol: "http" as const, ip: "127.0.0.1", port: "32400" };
  try {
    const url = new URL(baseUrl);
    return {
      protocol: (url.protocol.replace(":", "") as "http" | "https"),
      ip: url.hostname,
      port: url.port || (url.protocol === "https:" ? "443" : "80"),
    };
  } catch {
    return { protocol: "http" as const, ip: "127.0.0.1", port: "32400" };
  }
};

const mapPlayerState = (state: string | undefined): PlayerState => {
  switch (state) {
    case "playing":
      return "playing";
    case "paused":
      return "paused";
    case "buffering":
      return "buffering";
    default:
      return "stopped";
  }
};

export class PlexSource implements Source {
  readonly kind = "plex" as const;
  private listener: SourceListener | null = null;
  private interval: NodeJS.Timeout | null = null;
  private api: PlexAPI | null = null;
  private lastRatingKey: string | null = null;
  private lastImdbId: string | undefined;
  private lastDurationMs: number | undefined;
  private lastViewOffset = 0;
  private lastPlayerState: PlayerState = "stopped";
  private lastUpdatedAt = Date.now();

  constructor(private config: PlexConfig) {
    this.api = this.buildApi();
  }

  updateConfig(config: PlexConfig) {
    const changed =
      config.baseUrl !== this.config.baseUrl ||
      config.token !== this.config.token;
    this.config = config;
    if (changed) {
      this.api = this.buildApi();
      this.lastRatingKey = null;
      this.lastImdbId = undefined;
      this.lastDurationMs = undefined;
    }
    if (this.interval && this.listener) {
      this.stop();
      this.start(this.listener);
    }
  }

  private buildApi(): PlexAPI | null {
    const { protocol, ip, port } = parseBaseUrl(this.config.baseUrl);
    if (!this.config.token) return null;
    return new PlexAPI({
      protocol,
      ip,
      port,
      accessToken: this.config.token,
      timeoutMs: 2000,
    });
  }

  start(listener: SourceListener) {
    this.listener = listener;
    this.tick();
    this.interval = setInterval(() => this.tick(), this.config.pollMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.listener = null;
  }

  private async tick() {
    if (!this.api) {
      this.emit({
        imdbId: undefined,
        durationMs: undefined,
        timestampMs: 0,
        playerState: "stopped",
      });
      return;
    }

    try {
      const response = await this.api.sessions.getSessions();
      const session = response.object?.mediaContainer?.metadata?.at(0);
      const ratingKey = session?.ratingKey;
      const newState = mapPlayerState(session?.player?.state);
      const viewOffset = session?.viewOffset ?? 0;
      const duration = session?.duration;

      if (ratingKey && ratingKey !== this.lastRatingKey) {
        this.lastRatingKey = ratingKey;
        try {
          const meta = await this.api.library.getMediaMetaData({
            ratingKey: parseInt(ratingKey),
          });
          const imdbGuid = meta.object?.mediaContainer?.metadata
            ?.at(0)
            ?.guids?.find((g) => g.id.includes("imdb://"));
          this.lastImdbId = imdbGuid?.id?.split("//")?.at(1);
        } catch {
          this.lastImdbId = undefined;
        }
      }

      this.lastDurationMs = duration;

      if (
        newState !== this.lastPlayerState ||
        viewOffset !== this.lastViewOffset
      ) {
        this.lastUpdatedAt = Date.now();
        this.lastPlayerState = newState;
        this.lastViewOffset = viewOffset;
      }

      const elapsed = Date.now() - this.lastUpdatedAt;
      const timestampMs =
        newState === "playing" ? viewOffset + elapsed : viewOffset;

      if (!ratingKey) {
        this.lastRatingKey = null;
        this.lastImdbId = undefined;
        this.lastDurationMs = undefined;
      }

      this.emit({
        imdbId: this.lastImdbId,
        durationMs: this.lastDurationMs,
        timestampMs,
        playerState: ratingKey ? newState : "stopped",
      });
    } catch (err) {
      console.warn("[plex] poll failed:", err instanceof Error ? err.message : err);
    }
  }

  private emit(sample: SourceSample) {
    this.listener?.(sample);
  }
}
