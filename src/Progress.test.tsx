import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Progress, type ProgressSegment, progressVariants } from "./Progress";

const QUEUE: ProgressSegment[] = [
	{ key: "running", label: "Running", value: 6, tone: "primary" },
	{ key: "review", label: "Review", value: 1, tone: "primary-soft" },
	{ key: "queued", label: "Queued", value: 15, tone: "muted" },
];

const widths = (html: string): number[] =>
	[...html.matchAll(/width:\s*([\d.]+)%/g)].map((m) => Number(m[1]));

describe("Progress — geometry", () => {
	test("default size resolves to the themeable token, not a literal height", () => {
		const cls = progressVariants({});
		assert.ok(cls.includes("h-[var(--track-height-base)]"));
		assert.ok(cls.includes("rounded-[var(--track-radius)]"));
	});

	test("each size emits exactly ONE h-* — cva alone, no base+variant conflict", () => {
		for (const size of ["default", "xs", "sm", "md", "lg"] as const) {
			const h = progressVariants({ size }).match(/(?:^|\s)h-\S+/g) ?? [];
			assert.equal(h.length, 1, `size=${size} emitted ${h.length} h-* classes`);
		}
	});
});

describe("Progress — segmented", () => {
	test("stripe widths are each segment's share of the total, summing to 100%", () => {
		const html = renderToStaticMarkup(<Progress segments={QUEUE} />);
		const w = widths(html);
		assert.equal(w.length, 3);
		// 6 / 1 / 15 of 22.
		assert.ok(Math.abs(w[0] - (6 / 22) * 100) < 1e-6);
		assert.ok(Math.abs(w[1] - (1 / 22) * 100) < 1e-6);
		assert.ok(Math.abs(w[2] - (15 / 22) * 100) < 1e-6);
		assert.ok(Math.abs(w.reduce((a, b) => a + b, 0) - 100) < 1e-6);
	});

	test("an all-zero queue renders an empty track, never width:NaN%", () => {
		// Nothing-running-yet is a real state; 0/0 would otherwise reach the style attr.
		const html = renderToStaticMarkup(
			<Progress
				segments={[
					{ key: "a", value: 0 },
					{ key: "b", value: 0 },
				]}
			/>,
		);
		assert.ok(!html.includes("NaN"));
		assert.deepEqual(widths(html), [0, 0]);
	});

	test("negative, NaN and Infinity counts collapse to 0 rather than inverting a stripe", () => {
		const html = renderToStaticMarkup(
			<Progress
				segments={[
					{ key: "good", value: 3 },
					{ key: "negative", value: -5 },
					{ key: "nan", value: Number.NaN },
					{ key: "inf", value: Number.POSITIVE_INFINITY },
				]}
				legend
			/>,
		);
		assert.ok(!html.includes("NaN"));
		// The one valid count takes the whole track.
		assert.deepEqual(widths(html), [100, 0, 0, 0]);
	});

	test("legend counts come from the SAME array that sizes the stripes", () => {
		const html = renderToStaticMarkup(<Progress segments={QUEUE} legend />);
		for (const s of QUEUE) {
			assert.ok(html.includes(String(s.label)), `legend missing ${s.label}`);
			assert.ok(
				html.includes(`>${s.value}</span>`),
				`legend missing count ${s.value}`,
			);
		}
		// Sanitised counts, not the raw props: a clamped value must show its clamped count.
		const clamped = renderToStaticMarkup(
			<Progress segments={[{ key: "neg", value: -4 }]} legend />,
		);
		assert.ok(clamped.includes(">0</span>"));
		assert.ok(!clamped.includes(">-4</span>"));
	});

	test("without a legend the numbers survive as an sr-only summary", () => {
		const html = renderToStaticMarkup(<Progress segments={QUEUE} />);
		assert.ok(html.includes('<ul class="sr-only">'));
		assert.ok(html.includes("Running"));
		assert.ok(html.includes("15"));
	});

	test("the stripes are aria-hidden — the legend/summary carries the meaning", () => {
		const html = renderToStaticMarkup(<Progress segments={QUEUE} legend />);
		assert.ok(html.includes('aria-hidden="true"'));
		// No progressbar role: a distribution is not progress toward a goal.
		assert.ok(!html.includes('role="progressbar"'));
	});

	test("role=group is taken only when the group actually has a name", () => {
		assert.ok(
			!renderToStaticMarkup(<Progress segments={QUEUE} />).includes(
				'role="group"',
			),
		);
		assert.ok(
			renderToStaticMarkup(
				<Progress segments={QUEUE} aria-label="Work queue" />,
			).includes('role="group"'),
		);
	});

	test("the muted tone is --dim, the balanced-contrast grey — not --rim", () => {
		// A quiet segment is usually the biggest one, so it must stay legible against the
		// --elevated track. Measured against it: dim 2.08:1 dark / 2.33:1 light, rim 2.51 /
		// 1.41 (lopsided), border 1.34 / 1.16 (invisible). Pinned so it is not "tidied"
		// back to rim — the light theme is what pays for that.
		const html = renderToStaticMarkup(
			<Progress
				segments={[{ key: "queued", value: 1, tone: "muted" }]}
				legend
			/>,
		);
		assert.equal(html.match(/bg-dim/g)?.length, 2);
		assert.ok(!html.includes("bg-rim"));
	});

	test("a segment className recolours the stripe AND its legend dot together", () => {
		const html = renderToStaticMarkup(
			<Progress
				segments={[{ key: "custom", value: 1, className: "bg-info" }]}
				legend
			/>,
		);
		assert.equal(html.match(/bg-info/g)?.length, 2);
	});
});

describe("Progress — value & indeterminate", () => {
	test("value mode exposes the full progressbar contract", () => {
		const html = renderToStaticMarkup(<Progress value={64} />);
		assert.ok(html.includes('role="progressbar"'));
		assert.ok(html.includes('aria-valuenow="64"'));
		assert.ok(html.includes('aria-valuemin="0"'));
		assert.ok(html.includes('aria-valuemax="100"'));
		assert.deepEqual(widths(html), [64]);
	});

	test("value clamps at both ends, and the width tracks the clamped value", () => {
		assert.deepEqual(
			widths(renderToStaticMarkup(<Progress value={-20} />)),
			[0],
		);
		assert.deepEqual(
			widths(renderToStaticMarkup(<Progress value={180} />)),
			[100],
		);
		assert.ok(
			renderToStaticMarkup(<Progress value={180} />).includes(
				'aria-valuenow="100"',
			),
		);
	});

	test("a non-positive max falls back to 100 instead of dividing by zero", () => {
		const html = renderToStaticMarkup(<Progress value={50} max={0} />);
		assert.ok(!html.includes("NaN"));
		assert.ok(html.includes('aria-valuemax="100"'));
		assert.deepEqual(widths(html), [50]);
	});

	test("value scales against a custom max", () => {
		const html = renderToStaticMarkup(<Progress value={3} max={4} />);
		assert.ok(html.includes('aria-valuemax="4"'));
		assert.deepEqual(widths(html), [75]);
	});

	test("indeterminate omits aria-valuenow — that is how ARIA spells 'unknown'", () => {
		const html = renderToStaticMarkup(<Progress indeterminate />);
		assert.ok(html.includes('role="progressbar"'));
		assert.ok(!html.includes("aria-valuenow"));
		assert.ok(html.includes("track-indeterminate"));
	});

	test("segments outrank indeterminate, which outranks value", () => {
		const both = renderToStaticMarkup(
			<Progress segments={QUEUE} indeterminate value={40} />,
		);
		assert.ok(!both.includes("track-indeterminate"));
		assert.deepEqual(widths(both).length, 3);

		const loading = renderToStaticMarkup(<Progress indeterminate value={40} />);
		assert.ok(loading.includes("track-indeterminate"));
		assert.ok(!loading.includes("aria-valuenow"));
	});

	test("an empty segments array falls through to value mode, not a blank track", () => {
		const html = renderToStaticMarkup(<Progress segments={[]} value={40} />);
		assert.ok(html.includes('aria-valuenow="40"'));
		assert.deepEqual(widths(html), [40]);
	});

	test("a consumer className wins over the baked-in track utilities", () => {
		const html = renderToStaticMarkup(<Progress value={10} className="h-4" />);
		assert.ok(html.includes("h-4"));
		assert.ok(!html.includes("h-[var(--track-height-base)]"));
	});
});
