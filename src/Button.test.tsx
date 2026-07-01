import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, buttonVariants } from "./Button";

describe("Button", () => {
	test("asChild renders styling on the child element, not a wrapping button", () => {
		const html = renderToStaticMarkup(
			<Button asChild variant="link">
				<a href="/docs">Docs</a>
			</Button>,
		);
		// The button classes land on the caller's anchor…
		assert.match(html, /^<a /);
		assert.ok(html.includes('href="/docs"'));
		assert.ok(html.includes("inline-flex"));
		// …and no <button> wrapper is emitted.
		assert.ok(!html.includes("<button"));
	});

	test("asChild does not inject the loading spinner into the slotted child", () => {
		const html = renderToStaticMarkup(
			<Button asChild loading>
				<a href="/x">Go</a>
			</Button>,
		);
		assert.ok(!html.includes("animate-spin"));
	});

	test("renders a <button> by default and an <a> when href is set", () => {
		assert.match(renderToStaticMarkup(<Button>Hi</Button>), /^<button /);
		assert.match(renderToStaticMarkup(<Button href="/go">Hi</Button>), /^<a /);
	});

	test("link variant is a text link (underline), not a filled pill", () => {
		const cls = buttonVariants({ variant: "link" });
		assert.ok(cls.includes("underline-offset-4"));
		assert.ok(cls.includes("text-primary"));
	});
});
