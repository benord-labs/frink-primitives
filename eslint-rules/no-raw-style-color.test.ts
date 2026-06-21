import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "eslint";
import { noRawStyleColor } from "./no-raw-style-color.mjs";

const ruleTester = new RuleTester({
	languageOptions: {
		parser: tsParser,
		parserOptions: { ecmaFeatures: { jsx: true } },
	},
});

ruleTester.run("no-raw-style-color", noRawStyleColor, {
	valid: [
		// token reference
		'const a = <div style={{ color: "var(--ink)" }} />;',
		'const a = <div style={{ background: "var(--primary)" }} />;',
		// gradient / mask / url art — arbitrary stops legit (incl. raw hue)
		'const a = <div style={{ background: "linear-gradient(180deg, rgba(167,139,250,0.2), transparent)" }} />;',
		'const a = <div style={{ backgroundImage: "radial-gradient(circle, #a78bfa, transparent)" }} />;',
		'const a = <div style={{ fill: "url(#grad)" }} />;',
		// white / black at any alpha = neutral light/shadow, exempt
		'const a = <div style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />;',
		'const a = <div style={{ color: "rgba(0,0,0,0.2)" }} />;',
		'const a = <div style={{ background: "#fff" }} />;',
		'const a = <div style={{ borderColor: "#000000" }} />;',
		// SVG / CSS keywords
		'const a = <div style={{ fill: "currentColor" }} />;',
		'const a = <div style={{ color: "inherit" }} />;',
		// non-colour props ignored
		'const a = <div style={{ width: "440px", opacity: 0.5 }} />;',
		// custom property definitions are token plumbing, not a solid colour prop
		'const a = <div style={{ "--my-var": "#7c3aed" }} />;',
		// dynamic value — a static lint can't evaluate it, skip
		// biome-ignore lint/suspicious/noTemplateCurlyInString: ${x} is test-fixture source, not an unescaped template
		"const f = (x) => <div style={{ color: `rgb(${x})` }} />;",
	],
	invalid: [
		{
			code: 'const a = <div style={{ color: "#7c3aed" }} />;',
			errors: [{ messageId: "raw" }],
		},
		{
			code: 'const a = <div style={{ backgroundColor: "rgb(120, 80, 200)" }} />;',
			errors: [{ messageId: "raw" }],
		},
		{
			code: 'const a = <div style={{ borderColor: "hsl(270, 50%, 60%)" }} />;',
			errors: [{ messageId: "raw" }],
		},
		// solid background shorthand holding a flat hue (no gradient)
		{
			code: 'const a = <div style={{ background: "#7c3aed" }} />;',
			errors: [{ messageId: "raw" }],
		},
		{
			code: 'const a = <div style={{ stroke: "oklch(0.7 0.15 300)" }} />;',
			errors: [{ messageId: "raw" }],
		},
		// kebab key (CSS-in-JS string)
		{
			code: 'const a = <div style={{ "background-color": "#abc123" }} />;',
			errors: [{ messageId: "raw" }],
		},
		// multiple solid props in one style object
		{
			code: 'const a = <div style={{ color: "#7c3aed", backgroundColor: "#abc123" }} />;',
			errors: [{ messageId: "raw" }, { messageId: "raw" }],
		},
	],
});
