import path from "node:path";
import { defineConfig } from "vitest/config";

// JSX is transformed by Vitest's esbuild pipeline using the `jsx` setting from
// tsconfig.json, so no React plugin is required here.
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
