import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
     exclude: [
      "tests/e2e/**",
      "node_modules/**"
    ],
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setupTestDB.js"]
  }
});
