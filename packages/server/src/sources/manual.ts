import type { Source, SourceListener } from "./source.js";

export class ManualSource implements Source {
  readonly kind = "manual" as const;
  private listener: SourceListener | null = null;
  private interval: NodeJS.Timeout | null = null;
  private imdbId: string | undefined;
  private durationMs: number | undefined;
  private baseTimestamp = 0;
  private startedAt: number | null = null;
  private tickMs = 1000 / 10;

  start(listener: SourceListener) {
    this.listener = listener;
    this.emit();
  }

  stop() {
    this.pause();
    this.listener = null;
  }

  setSelection(imdbId: string | undefined, durationMs: number | undefined) {
    this.imdbId = imdbId;
    this.durationMs = durationMs;
    this.emit();
  }

  play() {
    if (this.startedAt !== null) return;
    this.startedAt = Date.now();
    this.interval = setInterval(() => this.emit(), this.tickMs);
    this.emit();
  }

  pause() {
    if (this.startedAt !== null) {
      this.baseTimestamp = this.currentTimestamp();
      this.startedAt = null;
    }
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.emit();
  }

  stopPlayback() {
    this.pause();
    this.baseTimestamp = 0;
    this.emit();
  }

  seek(timestampMs: number) {
    const wasPlaying = this.startedAt !== null;
    this.baseTimestamp = Math.max(0, timestampMs);
    if (wasPlaying) {
      this.startedAt = Date.now();
    }
    this.emit();
  }

  get isPlaying() {
    return this.startedAt !== null;
  }

  get timestampMs() {
    return this.currentTimestamp();
  }

  private currentTimestamp(): number {
    if (this.startedAt === null) return this.baseTimestamp;
    return this.baseTimestamp + (Date.now() - this.startedAt);
  }

  private emit() {
    if (!this.listener) return;
    this.listener({
      imdbId: this.imdbId,
      durationMs: this.durationMs,
      timestampMs: this.currentTimestamp(),
      playerState: this.startedAt === null
        ? this.baseTimestamp === 0 ? "stopped" : "paused"
        : "playing",
    });
  }
}
