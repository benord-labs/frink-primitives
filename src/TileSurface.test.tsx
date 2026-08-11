import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { TileSurface } from "./TileSurface";

const css = readFileSync(
	new URL("../styles/components.css", import.meta.url),
	"utf8",
);

describe("TileSurface", () => {
	test("keeps the default surface neutral", () => {
		const html = renderToStaticMarkup(<TileSurface>Content</TileSurface>);

		assert.ok(html.includes("tile-rim"));
		assert.ok(!html.includes("tile-rim-attention"));
	});

	test("renders the primitive-owned attention treatment", () => {
		const html = renderToStaticMarkup(
			<TileSurface
				variant="attention"
				className="consumer-surface"
				style={{ opacity: 0.5 }}
			>
				Content
			</TileSurface>,
		);

		assert.ok(html.includes("tile-rim-attention"));
		assert.ok(html.includes("consumer-surface"));
		assert.ok(html.includes("opacity:0.5"));
		assert.ok(!html.includes('variant="attention"'));
	});

	test("resolves rim and attention colors through Tailwind role tokens", () => {
		assert.ok(css.includes("var(--color-muted, var(--muted))"));
		assert.ok(css.includes("var(--color-rim, var(--rim))"));
		assert.ok(css.includes("var(--color-primary, var(--primary, #a78bfa))"));
	});
});
