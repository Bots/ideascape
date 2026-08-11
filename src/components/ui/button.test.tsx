import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

afterEach(cleanup);

describe("Button", () => {
	it("keeps the field-notebook shape and an accessible touch target", () => {
		render(<Button>Primary action</Button>);

		const button = screen.getByRole("button", { name: /primary action/i });
		expect(button).toHaveClass("min-h-11");
		expect(button).toHaveClass("rounded-sm");
		expect(button).toHaveClass("focus-visible:ring-2");
		expect(button).toHaveClass("bg-signal");
		expect(button).toHaveClass("text-black");
		expect(button).toHaveClass("hover:bg-black");
		expect(button).toHaveClass("hover:text-white");
	});
});
