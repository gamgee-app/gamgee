import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { parse, stringify } from "yaml";
import { z } from "zod";

const PlexConfigSchema = z.object({
  baseUrl: z.string().url().optional(),
  token: z.string().optional(),
  pollMs: z.number().int().positive().default(1000),
});

const ConfigSchema = z.object({
  server: z
    .object({
      host: z.string().default("0.0.0.0"),
      port: z.number().int().positive().default(8787),
    })
    .default({ host: "0.0.0.0", port: 8787 }),
  webhooks: z
    .object({
      swordOn: z.string().url().or(z.literal("")).default(""),
      swordOff: z.string().url().or(z.literal("")).default(""),
      debounceMs: z.number().int().nonnegative().default(250),
    })
    .default({ swordOn: "", swordOff: "", debounceMs: 250 }),
  source: z
    .object({
      kind: z.enum(["manual", "plex"]).default("manual"),
      plex: PlexConfigSchema.default({ pollMs: 1000 }),
    })
    .default({ kind: "manual", plex: { pollMs: 1000 } }),
});

export type Config = z.infer<typeof ConfigSchema>;

const interpolateEnv = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value.replace(/\$\{([A-Z0-9_]+)\}/g, (_, name: string) =>
      process.env[name] ?? "",
    );
  }
  if (Array.isArray(value)) return value.map(interpolateEnv);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        interpolateEnv(v),
      ]),
    );
  }
  return value;
};

export const loadConfig = async (path: string): Promise<Config> => {
  if (!existsSync(path)) {
    return ConfigSchema.parse({});
  }
  const raw = await readFile(path, "utf8");
  const parsed = parse(raw) ?? {};
  return ConfigSchema.parse(interpolateEnv(parsed));
};

export const saveConfig = async (
  path: string,
  config: Config,
): Promise<void> => {
  const validated = ConfigSchema.parse(config);
  await writeFile(path, stringify(validated), "utf8");
};

export const validateConfig = (value: unknown): Config =>
  ConfigSchema.parse(value);
