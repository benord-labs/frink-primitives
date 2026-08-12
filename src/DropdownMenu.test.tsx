// fallow-ignore-file unused-file -- exercised directly by the package's `bun test` script.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, test } from "node:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { renderToStaticMarkup } from "react-dom/server";

GlobalRegistrator.register();

const { cleanup, render } = await import("@testing-library/react");
const userEvent = (await import("@testing-library/user-event")).default;
const {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} = await import("./DropdownMenu");

afterEach(cleanup);

const source = readFileSync(
	new URL("./DropdownMenu.tsx", import.meta.url),
	"utf8",
);

describe("DropdownMenu", () => {
	test("composes a native menu trigger without a wrapper button", () => {
		const html = renderToStaticMarkup(
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button type="button" aria-label="More actions">
						More
					</button>
				</DropdownMenuTrigger>
			</DropdownMenu>,
		);

		assert.equal(html.match(/<button/g)?.length, 1);
		assert.ok(html.includes('aria-haspopup="menu"'));
		assert.ok(html.includes('data-state="closed"'));
		assert.ok(html.includes('aria-label="More actions"'));
	});

	test("owns semantic menu surfaces, states, and action tones", () => {
		assert.ok(source.includes("border-hairline bg-elevated"));
		assert.ok(source.includes("data-[highlighted]:bg-raised"));
		assert.ok(source.includes("data-[disabled]:pointer-events-none"));
		assert.ok(source.includes('success: "text-success-fg"'));
		assert.ok(source.includes('danger: "text-danger-fg"'));
		assert.ok(!source.includes("hsl("));
		assert.ok(!source.includes("rgb("));
	});

	test("supports keyboard dismissal, disabled actions, selection, and focus return", async () => {
		let selectionCount = 0;
		const user = userEvent.setup({ document });

		const view = render(
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button type="button">More actions</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onSelect={() => selectionCount++}>
						Open task
					</DropdownMenuItem>
					<DropdownMenuItem disabled onSelect={() => selectionCount++}>
						Delete task
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const trigger = view.getByRole("button", { name: "More actions" });
		trigger.focus();
		await user.keyboard("{Enter}");
		assert.ok(await view.findByRole("menu"));

		await user.click(view.getByRole("menuitem", { name: "Delete task" }));
		assert.equal(selectionCount, 0);

		await user.keyboard("{Escape}");
		assert.equal(view.queryByRole("menu"), null);
		assert.equal(document.activeElement, trigger);

		await user.click(trigger);
		await user.click(view.getByRole("menuitem", { name: "Open task" }));
		assert.equal(selectionCount, 1);
		assert.equal(view.queryByRole("menu"), null);
		assert.equal(document.activeElement, trigger);
	});
});
