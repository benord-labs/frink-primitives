import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { cn } from "./cn";

describe("cn", () => {
	test("later utilities win conflicts so a consumer className overrides primitive base classes", () => {
		const out = cn(
			"border bg-surface rounded-full px-2.5 text-xs",
			"bg-warning rounded-md text-[10px]",
		);
		// consumer overrides win
		assert.ok(out.includes("bg-warning"));
		assert.ok(out.includes("rounded-md"));
		assert.ok(out.includes("text-[10px]"));
		// conflicting base utilities are dropped
		assert.ok(!out.includes("bg-surface"));
		assert.ok(!out.includes("rounded-full"));
		assert.ok(!out.includes("text-xs"));
		// non-conflicting base utilities are kept
		assert.ok(out.includes("border"));
		assert.ok(out.includes("px-2.5"));
	});

	test("drops falsy parts and resolves conditional objects", () => {
		assert.equal(cn("a", false, null, undefined, { b: true, c: false }), "a b");
	});
});
