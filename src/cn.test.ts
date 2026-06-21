import { describe, expect, test } from "bun:test";
import { cn } from "./cn";

describe("cn", () => {
	test("later utilities win conflicts so a consumer className overrides primitive base classes", () => {
		const out = cn(
			"border bg-surface rounded-full px-2.5 text-xs",
			"bg-warning rounded-md text-[10px]",
		);
		// consumer overrides win
		expect(out).toContain("bg-warning");
		expect(out).toContain("rounded-md");
		expect(out).toContain("text-[10px]");
		// conflicting base utilities are dropped
		expect(out).not.toContain("bg-surface");
		expect(out).not.toContain("rounded-full");
		expect(out).not.toContain("text-xs");
		// non-conflicting base utilities are kept
		expect(out).toContain("border");
		expect(out).toContain("px-2.5");
	});

	test("drops falsy parts and resolves conditional objects", () => {
		expect(cn("a", false, null, undefined, { b: true, c: false })).toBe("a b");
	});
});
