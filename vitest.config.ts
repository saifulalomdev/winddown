// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          tsconfigPaths: true,
        },
        test: {
          name: "server-workers",
          globals: true,
          include: ["**/__tests__/**/*.ts", "**/*.test.ts"],
          // Point to your actual setup file here:
          setupFiles: ["./src/tests/setup-db.ts"],
        },
      },
      {
        resolve: {
          tsconfigPaths: true,
        },
        test: {
          name: "client-ui",
          globals: true,
          include: ["**/__tests__/**/*.tsx", "**/*.test.tsx"],
          environment: "jsdom",
        },
      },
    ],
  },
});