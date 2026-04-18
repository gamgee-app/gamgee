import { cp, stat } from "node:fs/promises";

await cp("src/movies", "dist/movies", {
  recursive: true,
  filter: async (src) => {
    try {
      const info = await stat(src);
      if (info.isDirectory()) return true;
    } catch {
      return false;
    }
    return src.endsWith(".json");
  },
});

console.log("copied movie JSON assets to dist/movies");
