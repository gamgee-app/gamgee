import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const SERVER_TARGET =
  process.env.GAMGEE_SERVER_URL ?? "http://localhost:8787";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: SERVER_TARGET,
        changeOrigin: true,
        ws: false,
      },
    },
  },
});
