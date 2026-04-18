import type { Config } from "./config.js";

export class WebhookDispatcher {
  private lastFired: boolean | null = null;
  private timer: NodeJS.Timeout | null = null;
  private pending: boolean | null = null;

  constructor(private getConfig: () => Config) {}

  update(swordOn: boolean) {
    if (this.pending === swordOn) return;
    this.pending = swordOn;

    const debounceMs = this.getConfig().webhooks.debounceMs;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), debounceMs);
  }

  private flush() {
    this.timer = null;
    if (this.pending === null) return;
    const next = this.pending;
    this.pending = null;
    if (next === this.lastFired) return;
    this.lastFired = next;
    const { swordOn, swordOff } = this.getConfig().webhooks;
    const url = next ? swordOn : swordOff;
    if (url) void this.fire(url);
  }

  async fire(url: string): Promise<void> {
    try {
      await fetch(url, { method: "POST" });
    } catch (err) {
      console.warn(`[webhook] ${url} failed:`, err);
    }
  }

  reset() {
    this.lastFired = null;
    this.pending = null;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
