import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { Engine } from "../engine.js";
import { movies } from "../movies/movies.js";
import { toMovieSummaries } from "../domain/sting.js";
import { saveConfig, validateConfig, type Config } from "../config.js";

const SelectionSchema = z.object({
  imdbId: z.string(),
  editionLabel: z.string(),
});

const SeekSchema = z.object({ timestampMs: z.number().int().nonnegative() });

const SourceSchema = z.object({ kind: z.enum(["manual", "plex"]) });

const TestWebhookSchema = z.object({ which: z.enum(["on", "off"]) });

export const registerRoutes = (
  app: FastifyInstance,
  engine: Engine,
  opts: {
    getConfig: () => Config;
    setConfig: (next: Config) => Promise<void>;
    configPath: string;
  },
) => {
  app.get("/api/state", async () => engine.getSnapshot());

  app.get("/api/movies", async () => toMovieSummaries(movies));

  app.get("/api/config", async () => opts.getConfig());

  app.put("/api/config", async (req, reply) => {
    try {
      const next = validateConfig(req.body);
      await saveConfig(opts.configPath, next);
      await opts.setConfig(next);
      return next;
    } catch (err) {
      reply.code(400);
      return { error: err instanceof Error ? err.message : "invalid config" };
    }
  });

  app.post("/api/source", async (req, reply) => {
    const parsed = SourceSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: parsed.error.message };
    }
    const current = opts.getConfig();
    const next: Config = { ...current, source: { ...current.source, kind: parsed.data.kind } };
    await saveConfig(opts.configPath, next);
    await opts.setConfig(next);
    return engine.getSnapshot();
  });

  app.post("/api/selection", async (req, reply) => {
    const parsed = SelectionSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: parsed.error.message };
    }
    const movie = movies.find((m) => m.imdbId === parsed.data.imdbId);
    const edition = movie?.editions.find(
      (e) => e.label === parsed.data.editionLabel,
    );
    if (!movie || !edition) {
      reply.code(404);
      return { error: "movie or edition not found" };
    }
    engine.manualControls().setSelection(movie.imdbId, edition.duration);
    return engine.getSnapshot();
  });

  app.post("/api/timer/play", async () => {
    engine.manualControls().play();
    return engine.getSnapshot();
  });

  app.post("/api/timer/pause", async () => {
    engine.manualControls().pause();
    return engine.getSnapshot();
  });

  app.post("/api/timer/stop", async () => {
    engine.manualControls().stopPlayback();
    return engine.getSnapshot();
  });

  app.post("/api/timer/seek", async (req, reply) => {
    const parsed = SeekSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: parsed.error.message };
    }
    engine.manualControls().seek(parsed.data.timestampMs);
    return engine.getSnapshot();
  });

  app.post("/api/test-webhook", async (req, reply) => {
    const parsed = TestWebhookSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: parsed.error.message };
    }
    const { swordOn, swordOff } = opts.getConfig().webhooks;
    const url = parsed.data.which === "on" ? swordOn : swordOff;
    if (!url) {
      reply.code(400);
      return { error: "webhook url not configured" };
    }
    await fetch(url, { method: "POST" }).catch(() => undefined);
    return { ok: true };
  });
};
