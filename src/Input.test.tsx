import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Input, inputVariants } from "./Input";

describe("Input", () => {
	test("default size resolves to the themeable tokens, not a literal height", () => {
		const cls = inputVariants({});
		assert.ok(cls.includes("h-[var(--field-height-base)]"));
		assert.ok(cls.includes("py-[var(--field-pad-y-base)]"));
	});

	test("each size emits exactly ONE py-* — cva alone, no base+variant conflict", () => {
		// py-* lives entirely in the size variant, so a direct inputVariants() caller
		// (no cn()/tailwind-merge) never gets two competing vertical paddings.
		for (const size of ["default", "xs", "sm", "md", "lg", "auto"] as const) {
			const py = inputVariants({ size }).match(/(?:^|\s)py-\S+/g) ?? [];
			assert.equal(py.length, 1, `size=${size} emitted ${py.length} py-* classes`);
		}
	});

	test("a sized field zeroes its padding so the fixed height is honoured", () => {
		// The regression this variant exists to prevent: a short box against a
		// leftover py-2.5 clips its own text.
		assert.ok(inputVariants({ size: "xs" }).includes("h-7 py-0"));
		assert.ok(!inputVariants({ size: "xs" }).includes("py-[var("));
	});

	test("a caller className height does NOT cancel the default vertical padding", () => {
		// Height and padding are different tailwind-merge groups, so `h-8` alone leaves
		// the token padding in place. This is why `size` exists — documented here so the
		// padding is never "simplified" back into the base string.
		const html = renderToStaticMarkup(<Input className="h-8" />);
		assert.ok(html.includes("py-[var(--field-pad-y-base)]"));
		assert.ok(html.includes("h-8"));
	});

	test("radius is the themeable field token, shared with Textarea and Select", () => {
		const cls = inputVariants({});
		assert.ok(cls.includes("rounded-[var(--field-radius)]"));
		assert.ok(!cls.includes("rounded-[10px]"));
	});

	test("type=number suppresses the native spinners; other types do not", () => {
		assert.ok(
			renderToStaticMarkup(<Input type="number" />).includes(
				"[appearance:textfield]",
			),
		);
		assert.ok(
			!renderToStaticMarkup(<Input type="text" />).includes(
				"[appearance:textfield]",
			),
		);
	});

	test("type=search suppresses the native cancel button", () => {
		assert.ok(
			renderToStaticMarkup(<Input type="search" />).includes(
				"search-cancel-button",
			),
		);
	});

	test("error sets both data-error and aria-invalid; a caller aria-invalid wins", () => {
		const html = renderToStaticMarkup(<Input error />);
		assert.ok(html.includes('data-error="true"'));
		assert.ok(html.includes('aria-invalid="true"'));
		// aria-invalid is set before the spread, so an explicit prop overrides it.
		assert.ok(
			renderToStaticMarkup(<Input error aria-invalid={false} />).includes(
				'aria-invalid="false"',
			),
		);
	});
});
