import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";

// Guards the real light-mode failure mode: a token set only in `.dark` (so it is
// undefined — and the component renders wrong — in the light base). Every token
// overridden in `.dark` must have a light value in `:root`.
const css = readFileSync(
	new URL("../styles/theme.css", import.meta.url),
	"utf8",
);

// Bodies of every top-level `selector { … }` block (:root appears twice). The
// blocks here contain no nested braces, so the first `\n}` closes each one.
function bodies(selector: string): string[] {
	const out: string[] = [];
	let i = css.indexOf(`${selector} {`);
	while (i !== -1) {
		const from = css.indexOf("{", i);
		const end = css.indexOf("\n}", from);
		assert.ok(end !== -1, `${selector} block must be closed`);
		out.push(css.slice(from + 1, end));
		i = css.indexOf(`${selector} {`, end);
	}
	return out;
}

const propNames = (body: string): Set<string> =>
	new Set([...body.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));

describe("theme.css light/dark parity", () => {
	const rootProps = new Set(bodies(":root").flatMap((b) => [...propNames(b)]));
	const darkBodies = bodies(".dark");

	test("defines exactly one .dark override block", () => {
		assert.equal(darkBodies.length, 1);
	});

	test("every token overridden in .dark has a light base in :root", () => {
		for (const p of propNames(darkBodies[0])) {
			assert.ok(
				rootProps.has(p),
				`${p} is set in .dark but missing from :root — it would be undefined in light mode`,
			);
		}
	});

	test("core surface/text tokens flip between the two themes", () => {
		const darkProps = propNames(darkBodies[0]);
		for (const p of ["--bg", "--surface", "--ink", "--hairline"]) {
			assert.ok(rootProps.has(p), `:root (light) must define ${p}`);
			assert.ok(darkProps.has(p), `.dark must override ${p}`);
		}
	});
});
