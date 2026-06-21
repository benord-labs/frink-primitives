import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "eslint";
import { noRawColor } from "./no-raw-color.mjs";

// RuleTester drives its own describe/it (bun:test provides them globally), so it is
// called at top level — NOT inside a test(), which bun forbids (describe-in-test).
const ruleTester = new RuleTester({
	languageOptions: {
		parser: tsParser,
		parserOptions: { ecmaFeatures: { jsx: true } },
	},
});

ruleTester.run("no-raw-color", noRawColor, {
	valid: [
		// token utilities (ramps + singletons) all pass
		'const a = <div className="bg-surface text-ink border-hairline from-field to-surface bg-primary text-secondary-200 bg-neutral-900 ring-ring" />;',
		// shadow is not a colour utility — raw hex in a glow is allowed
		'const a = <div className="shadow-[inset_0_1px_0_#ffffff0a,0_8px_24px_-12px_#000000]" />;',
		// arbitrary NON-colour values (sizes, clamp) pass
		'const a = <div className="text-[15px] w-[440px] text-[clamp(2rem,8vw,4rem)]" />;',
		// bare white/black/transparent utilities are neutral keywords, not flagged
		'const a = <div className="bg-white bg-black text-transparent to-transparent from-black/75" />;',
		// arbitrary transparent keyword + a calc() are not colours
		'const a = <div className="bg-[transparent] w-[calc(100%-2rem)]" />;',
		"const a = <div className={`bg-surface text-ink`} />;",
	],
	invalid: [
		{
			code: 'const a = <div className="bg-[#ff0000]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		// 8-digit hex (with alpha) still caught
		{
			code: 'const a = <div className="bg-[#ffffff80]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="text-red-500" />;',
			errors: [{ messageId: "palette" }],
		},
		// opacity-suffixed palette
		{
			code: 'const a = <div className="border-blue-400/25" />;',
			errors: [{ messageId: "palette" }],
		},
		{
			code: 'const a = <div className="text-red-500/50" />;',
			errors: [{ messageId: "palette" }],
		},
		// modern CSS colour functions (previously slipped)
		{
			code: 'const a = <div className="bg-[hsl(0,0%,0%)]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="bg-[oklch(0.5_0.1_120)]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="bg-[lab(50%_40_59)]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="bg-[hwb(194_0%_0%)]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="bg-[color(display-p3_1_0_0)]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		// bare named hue inside an arbitrary utility
		{
			code: 'const a = <div className="bg-[red]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		// util prefixes beyond bg/text/border
		{
			code: 'const a = <div className="fill-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="stroke-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="ring-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="from-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="via-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="to-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="outline-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="decoration-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="caret-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="accent-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="divide-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="placeholder-[#abc]" />;',
			errors: [{ messageId: "arbitrary" }],
		},
		// gradient with embedded raw colour inside an arbitrary utility
		{
			code: 'const a = clsx("bg-[linear-gradient(180deg,rgba(1,2,3,0.5),transparent)]");',
			errors: [{ messageId: "arbitrary" }],
		},
		// MULTIPLE violations in one string — every match reported (locks the matchAll fix)
		{
			code: 'const a = <div className="bg-[#abc] text-[#def]" />;',
			errors: [{ messageId: "arbitrary" }, { messageId: "arbitrary" }],
		},
		{
			code: 'const a = <div className="bg-[#abc] text-red-500" />;',
			errors: [{ messageId: "arbitrary" }, { messageId: "palette" }],
		},
		// template chunk
		{
			code: "const a = <div className={`border-blue-400/25`} />;",
			errors: [{ messageId: "palette" }],
		},
	],
});
