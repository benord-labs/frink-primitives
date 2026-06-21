// Shared ESLint preset for frink colour governance. Consumers spread `frinkColorConfig`
// into their flat config alongside their own `{ ignores }` entry — no per-repo wiring of
// the parser/plugin/rules (which previously drifted between repos).
import tsParser from "@typescript-eslint/parser";
import { noRawColor } from "./no-raw-color.mjs";
import { noRawStyleColor } from "./no-raw-style-color.mjs";

export const frinkEslintPlugin = {
	rules: { "no-raw-color": noRawColor, "no-raw-style-color": noRawStyleColor },
};

// Self-contained flat-config object: carries its own parser + linterOptions so it works
// when spread on its own (without it, .tsx silently fails to parse and the rules no-op).
export const frinkColorConfig = {
	files: ["src/**/*.{ts,tsx,js,jsx}"],
	languageOptions: {
		parser: tsParser,
		parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
	},
	linterOptions: { reportUnusedDisableDirectives: "off" },
	plugins: { frink: frinkEslintPlugin },
	rules: { "frink/no-raw-color": "error", "frink/no-raw-style-color": "error" },
};

export { noRawColor, noRawStyleColor };
