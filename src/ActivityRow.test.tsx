// fallow-ignore-file unused-file -- exercised directly by the package's `bun test` script.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ActivityRow } from "./ActivityRow";
import { Button } from "./Button";

const css = readFileSync(
	new URL("../styles/components.css", import.meta.url),
	"utf8",
);

describe("ActivityRow", () => {
	test("renders one semantic list item with every presentation slot", () => {
		const html = renderToStaticMarkup(
			<ActivityRow
				leading={<svg aria-label="GitHub" />}
				title="Fix flaky auth test"
				description="From CI · login session expiry"
				meta={<span>frink-web</span>}
				trailing="2m"
				state="running"
				className="consumer-row"
				aria-label="Running task"
			/>,
		);

		assert.match(html, /^<li /);
		assert.ok(html.includes("Fix flaky auth test"));
		assert.ok(html.includes("From CI · login session expiry"));
		assert.ok(html.includes("frink-web"));
		assert.ok(html.includes(">2m</span>"));
		assert.ok(html.includes("consumer-row"));
		assert.ok(html.includes('aria-label="Running task"'));
		assert.ok(html.includes('data-state="running"'));
		assert.ok(html.includes("Status: Running"));
		assert.ok(html.includes("bg-online"));
		assert.ok(html.includes("activity-row-meta"));
		assert.ok(html.includes("activity-row-trailing"));
		assert.ok(html.includes("min-w-7"));
	});

	test("omits empty optional slot wrappers", () => {
		const html = renderToStaticMarkup(
			<ActivityRow leading={<span>G</span>} title="Only a title" />,
		);

		assert.ok(!html.includes("min-w-7"));
		assert.ok(!html.includes("pl-3.5"));
		assert.ok(!html.includes('gap-2.5"><span class="shrink-0'));
	});

	test("reserves an aligned wide rail for mixed values and controls", () => {
		const value = renderToStaticMarkup(
			<ActivityRow
				leading={<span>G</span>}
				title="Running"
				trailing="7 months"
				trailingWidth="wide"
			/>,
		);
		const control = renderToStaticMarkup(
			<ActivityRow
				leading={<span>G</span>}
				title="Ready"
				trailing={<Button size="xs">Start task</Button>}
				trailingWidth="wide"
			/>,
		);

		for (const html of [value, control]) {
			assert.ok(html.includes("min-w-24"));
			assert.ok(html.includes("justify-end"));
			assert.ok(html.includes("whitespace-nowrap"));
		}
		assert.equal(control.match(/<button/g)?.length, 1);
	});

	test("keeps the neutral status dot quiet but legible across consumer themes", () => {
		const html = renderToStaticMarkup(
			<ActivityRow leading={<span>G</span>} title="Ready to start" />,
		);

		assert.ok(html.includes('data-state="neutral"'));
		assert.ok(html.includes("Status: Neutral"));
		assert.ok(html.includes("bg-dim"));
		assert.ok(!html.includes("bg-muted"));
	});

	test("keeps a running status static by default", () => {
		const html = renderToStaticMarkup(
			<ActivityRow
				leading={<span>G</span>}
				title="Running without motion"
				state="running"
			/>,
		);

		assert.ok(html.includes("bg-online"));
		assert.ok(!html.includes("motion-safe:animate-pulse"));
		assert.ok(!html.includes('pulse="'));
	});

	test("pulses only the hidden status dot while retaining textual status", () => {
		const html = renderToStaticMarkup(
			<ActivityRow
				leading={<span>G</span>}
				title="Running with motion"
				state="running"
				pulse
			/>,
		);

		assert.match(
			html,
			/<span class="size-1\.5 shrink-0 rounded-full bg-online motion-safe:animate-pulse" aria-hidden="true"><\/span>/,
		);
		assert.equal(html.match(/motion-safe:animate-pulse/g)?.length, 1);
		assert.ok(html.includes("Status: Running"));
	});

	test("renders a keyboard-native button only when activation is provided", () => {
		const interactive = renderToStaticMarkup(
			<ActivityRow
				leading={<span>G</span>}
				title="Open task"
				onActivate={() => undefined}
				actionProps={{ "aria-describedby": "task-help" }}
			/>,
		);
		const passive = renderToStaticMarkup(
			<ActivityRow leading={<span>G</span>} title="Read only" />,
		);

		assert.ok(interactive.includes('<button type="button"'));
		assert.ok(interactive.includes('aria-describedby="task-help"'));
		assert.ok(interactive.includes("focus-visible:ring-2"));
		assert.ok(!passive.includes("<button"));
	});

	test("keeps independent actions outside the row activation button", () => {
		const html = renderToStaticMarkup(
			<ActivityRow
				leading={<span>G</span>}
				title="Open task"
				onActivate={() => undefined}
				actions={<Button size="xs">More actions</Button>}
			/>,
		);
		const rowButtonStart = html.indexOf("<button");
		const rowButtonEnd = html.indexOf("</button>", rowButtonStart);
		const actionButtonStart = html.indexOf("<button", rowButtonStart + 1);

		assert.equal(html.match(/<button/g)?.length, 2);
		assert.ok(rowButtonStart >= 0);
		assert.ok(rowButtonEnd < actionButtonStart);
		assert.ok(
			html.includes("activity-row-actions flex shrink-0 items-center gap-1"),
		);
		assert.ok(html.indexOf("activity-row-actions") < html.lastIndexOf("</li>"));
	});

	test("preserves the existing row DOM when no actions are provided", () => {
		const withoutActions = renderToStaticMarkup(
			<ActivityRow
				leading={<span>G</span>}
				title="Open task"
				onActivate={() => undefined}
			/>,
		);
		const emptyActions = renderToStaticMarkup(
			<ActivityRow
				leading={<span>G</span>}
				title="Open task"
				onActivate={() => undefined}
				actions={null}
			/>,
		);

		assert.equal(emptyActions, withoutActions);
		assert.ok(!withoutActions.includes("activity-row-actions"));
		assert.ok(!withoutActions.includes("flex items-center gap-1"));
	});

	test("size presets own compact and desktop geometry", () => {
		const compact = renderToStaticMarkup(
			<ActivityRow leading={<span>G</span>} title="Compact" size="sm" />,
		);
		const desktop = renderToStaticMarkup(
			<ActivityRow leading={<span>G</span>} title="Desktop" size="md" />,
		);

		assert.ok(compact.includes("size-8"));
		assert.ok(compact.includes("py-2"));
		assert.ok(desktop.includes("size-9"));
		assert.ok(desktop.includes("py-2.5"));
	});

	test("owns the divider and exact machined icon-plate recipe", () => {
		const html = renderToStaticMarkup(
			<ActivityRow leading={<span>G</span>} title="Styled" />,
		);

		assert.ok(html.includes("border-t border-hairline first:border-t-0"));
		assert.ok(html.includes("activity-row-leading"));
		assert.ok(
			css.includes("linear-gradient(180deg, #1c1d20 0%, #0e0e10 100%)"),
		);
		assert.ok(css.includes("inset 0 1px 0 rgb(255 255 255 / 12%)"));
		assert.ok(css.includes("0 6px 16px -10px rgb(0 0 0 / 85%)"));
	});
});
