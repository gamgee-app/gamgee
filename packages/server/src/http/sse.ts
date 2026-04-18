import type { FastifyInstance } from "fastify";
import type { Engine } from "../engine.js";
import type { AppSnapshot } from "../domain/types.js";

export const registerSse = (app: FastifyInstance, engine: Engine) => {
  app.get("/api/events", (req, reply) => {
    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    const send = (event: string, data: AppSnapshot) => {
      reply.raw.write(`event: ${event}\n`);
      reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    send("snapshot", engine.getSnapshot());

    const onSnapshot = (snapshot: AppSnapshot) => send("snapshot", snapshot);
    engine.on("snapshot", onSnapshot);

    const heartbeat = setInterval(() => {
      reply.raw.write(": ping\n\n");
    }, 15000);

    req.raw.on("close", () => {
      clearInterval(heartbeat);
      engine.off("snapshot", onSnapshot);
    });
  });
};
