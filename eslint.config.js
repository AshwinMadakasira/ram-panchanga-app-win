/*
 * Tooling teaching note:
 * ESLint statically checks code for common mistakes and inconsistent patterns.
 */
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["node_modules/*", "dist/*", ".test-dist/*", ".expo/*", "tools/**/*"]
  }
]);
