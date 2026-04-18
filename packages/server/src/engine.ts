import { EventEmitter } from "node:events";
import type { Config } from "./config.js";
import type { AppSnapshot } from "./domain/types.js";
import {
  findMovieByImdbId,
  getCurrentChapter,
  isSwordGlowing,
  matchEdition,
} from "./domain/sting.js";
import { movies } from "./movies/movies.js";
import type { Source, SourceSample } from "./sources/source.js";
import { ManualSource } from "./sources/manual.js";
import { PlexSource } from "./sources/plex.js";
import { WebhookDispatcher } from "./webhooks.js";

const initialSnapshot = (kind: "manual" | "plex"): AppSnapshot => ({
  source: kind,
  playerState: "stopped",
  timestampMs: 0,
  movieTitle: null,
  editionLabel: null,
  chapterTitle: null,
  swordOn: false,
});

export class Engine extends EventEmitter {
  private snapshot: AppSnapshot;
  private source: Source;
  private manual: ManualSource;
  private plex: PlexSource | null = null;
  private webhooks: WebhookDispatcher;
  private lastEmitted = 0;
  private readonly emitIntervalMs = 100;

  constructor(private config: Config) {
    super();
    this.snapshot = initialSnapshot(config.source.kind);
    this.manual = new ManualSource();
    this.webhooks = new WebhookDispatcher(() => this.config);
    this.source = this.pickSource(config.source.kind);
  }

  start() {
    this.source.start((sample) => this.onSample(sample));
  }

  stop() {
    this.source.stop();
    this.plex?.stop();
  }

  getSnapshot(): AppSnapshot {
    return this.snapshot;
  }

  updateConfig(config: Config) {
    const prevKind = this.config.source.kind;
    this.config = config;
    if (prevKind !== config.source.kind) {
      this.switchSource(config.source.kind);
    } else if (config.source.kind === "plex" && this.plex) {
      this.plex.updateConfig(config.source.plex);
    }
  }

  switchSource(kind: "manual" | "plex") {
    this.source.stop();
    this.webhooks.reset();
    this.snapshot = initialSnapshot(kind);
    this.source = this.pickSource(kind);
    this.source.start((sample) => this.onSample(sample));
    this.emit("snapshot", this.snapshot);
  }

  manualControls() {
    return this.manual;
  }

  private pickSource(kind: "manual" | "plex"): Source {
    if (kind === "manual") return this.manual;
    if (!this.plex) {
      this.plex = new PlexSource(this.config.source.plex);
    } else {
      this.plex.updateConfig(this.config.source.plex);
    }
    return this.plex;
  }

  private onSample(sample: SourceSample) {
    const movie = findMovieByImdbId(movies, sample.imdbId);
    const edition = matchEdition(movie, sample.durationMs);
    const chapter = edition
      ? getCurrentChapter(edition.chapters, sample.timestampMs)
      : undefined;
    const swordOn = edition
      ? isSwordGlowing(edition.differences, sample.timestampMs)
      : false;

    const next: AppSnapshot = {
      source: this.config.source.kind,
      playerState: sample.playerState,
      timestampMs: sample.timestampMs,
      movieTitle: movie?.title ?? null,
      editionLabel: edition?.label ?? null,
      chapterTitle: chapter?.title ?? null,
      swordOn,
    };

    const prev = this.snapshot;
    this.snapshot = next;

    if (prev.swordOn !== next.swordOn) this.webhooks.update(next.swordOn);

    const structural =
      prev.movieTitle !== next.movieTitle ||
      prev.editionLabel !== next.editionLabel ||
      prev.chapterTitle !== next.chapterTitle ||
      prev.playerState !== next.playerState ||
      prev.swordOn !== next.swordOn ||
      prev.source !== next.source;

    const now = Date.now();
    if (structural || now - this.lastEmitted >= this.emitIntervalMs) {
      this.lastEmitted = now;
      this.emit("snapshot", next);
    }
  }
}
