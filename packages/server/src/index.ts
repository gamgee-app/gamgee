import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { resolve, join } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadConfig, saveConfig, type Config } from "./config.js";
import { Engine } from "./engine.js";
import { registerRoutes } from "./http/routes.js";
import { registerSse } from "./http/sse.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const configPath = resolve(
  process.env.GAMGEE_CONFIG ?? join(here, "..", "config.yaml"),
);

const webDist = resolve(here, "..", "..", "web", "dist");

const bootstrap = async () => {
  let config: Config = await loadConfig(configPath);
  const engine = new Engine(config);
  engine.start();

  const app = Fastify({ logger: { level: "info" } });

  await registerRoutes(app, engine, {
    getConfig: () => config,
    setConfig: async (next) => {
      config = next;
      engine.updateConfig(next);
    },
    configPath,
  });
  registerSse(app, engine);

  if (existsSync(webDist)) {
    await app.register(fastifyStatic, { root: webDist, prefix: "/" });
    app.setNotFoundHandler((req, reply) => {
      if (req.raw.url?.startsWith("/api/")) {
        reply.code(404).send({ error: "not found" });
        return;
      }
      reply.sendFile("index.html");
    });
  }

  if (!existsSync(configPath)) {
    await saveConfig(configPath, config).catch((err) =>
      app.log.warn({ err }, "failed to write default config"),
    );
  }

  const { host, port } = config.server;
  await app.listen({ host, port });
  app.log.info(`gamgee server listening on http://${host}:${port}`);

  const shutdown = async () => {
    engine.stop();
    await app.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
