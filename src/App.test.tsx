import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App", () => {
	it("introduces the Ideascape mission", () => {
		render(<App />);

		expect(
			screen.getByRole("heading", {
				name: /great ideas deserve a place to grow/i,
			}),
		).toBeInTheDocument();
		expect(screen.getByText(/community funding platform/i)).toBeInTheDocument();
	});
});
