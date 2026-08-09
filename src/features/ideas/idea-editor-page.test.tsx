import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "@supabase/supabase-js";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/auth-provider";
import { IdeaEditorPage } from "@/features/ideas/idea-editor-page";
import {
	createIdeaDraft,
	getIdeaForEditing,
	listCategories,
	updateIdeaDraft,
} from "@/features/ideas/idea-service";

vi.mock("@/features/auth/auth-provider", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/features/ideas/idea-service", () => ({
	createIdeaDraft: vi.fn(),
	getIdeaForEditing: vi.fn(),
	listCategories: vi.fn(),
	updateIdeaDraft: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedCreateIdeaDraft = vi.mocked(createIdeaDraft);
const mockedGetIdeaForEditing = vi.mocked(getIdeaForEditing);
const mockedListCategories = vi.mocked(listCategories);
const mockedUpdateIdeaDraft = vi.mocked(updateIdeaDraft);

const creator = {
	id: "11111111-1111-4111-8111-111111111111",
	email: "creator@example.com",
} as User;
const category = {
	id: 1,
	slug: "technology",
	name: "Technology",
	description: "Tools and technical inventions.",
};
const idea = {
	id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
	creator_id: creator.id,
	category_id: category.id,
	slug: "solar-desalination-aaaaaaaa",
	title: "Solar desalination",
	summary: "Affordable clean water powered directly by sunlight.",
	description:
		"A modular desalination system designed for coastal communities.",
	status: "draft" as const,
	published_at: null,
	created_at: "2026-08-09T00:00:00.000Z",
	updated_at: "2026-08-09T00:00:00.000Z",
};

function renderEditor(path = "/ideas/new") {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return render(
		<MemoryRouter initialEntries={[path]}>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path="/ideas/new" element={<IdeaEditorPage />} />
					<Route path="/ideas/:ideaId/edit" element={<IdeaEditorPage />} />
				</Routes>
			</QueryClientProvider>
		</MemoryRouter>,
	);
}

async function completeForm(user: ReturnType<typeof userEvent.setup>) {
	await user.selectOptions(
		screen.getByLabelText(/category/i),
		String(category.id),
	);
	await user.type(screen.getByLabelText(/title/i), idea.title);
	await user.type(screen.getByLabelText(/summary/i), idea.summary);
	await user.type(screen.getByLabelText(/description/i), idea.description);
}

beforeEach(() => {
	vi.resetAllMocks();
	mockedUseAuth.mockReturnValue({ user: creator, isLoading: false });
	mockedListCategories.mockResolvedValue([category]);
	mockedGetIdeaForEditing.mockResolvedValue(idea);
	mockedCreateIdeaDraft.mockResolvedValue(idea);
	mockedUpdateIdeaDraft.mockResolvedValue(idea);
});

afterEach(cleanup);

describe("IdeaEditorPage", () => {
	it("requires authentication before showing the editor", () => {
		mockedUseAuth.mockReturnValue({ user: null, isLoading: false });

		renderEditor();

		expect(
			screen.getByRole("heading", { name: /sign in to create an idea/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
			"href",
			"/sign-in",
		);
		expect(mockedListCategories).not.toHaveBeenCalled();
	});

	it("creates a draft from valid editor fields", async () => {
		const user = userEvent.setup();
		renderEditor();

		await screen.findByRole("heading", { name: /start a new idea/i });
		await completeForm(user);
		await user.click(screen.getByRole("button", { name: /save draft/i }));

		expect(mockedCreateIdeaDraft).toHaveBeenCalledWith(creator.id, {
			categoryId: category.id,
			title: idea.title,
			summary: idea.summary,
			description: idea.description,
		});
		expect(
			await screen.findByRole("heading", { name: /edit your idea/i }),
		).toBeInTheDocument();
	});

	it("uses browser constraints for required field lengths", async () => {
		renderEditor();

		await screen.findByRole("heading", { name: /start a new idea/i });
		expect(screen.getByLabelText(/category/i)).toBeRequired();
		expect(screen.getByLabelText(/title/i)).toHaveAttribute("maxlength", "120");
		expect(screen.getByLabelText(/summary/i)).toHaveAttribute(
			"maxlength",
			"280",
		);
		expect(screen.getByLabelText(/description/i)).toHaveAttribute(
			"maxlength",
			"20000",
		);
	});

	it("loads and updates an existing draft", async () => {
		const user = userEvent.setup();
		renderEditor(`/ideas/${idea.id}/edit`);

		expect(
			await screen.findByRole("heading", { name: /edit your idea/i }),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/title/i)).toHaveValue(idea.title);
		await user.clear(screen.getByLabelText(/title/i));
		await user.type(
			screen.getByLabelText(/title/i),
			"Updated solar desalination",
		);
		await user.click(screen.getByRole("button", { name: /save changes/i }));

		expect(mockedGetIdeaForEditing).toHaveBeenCalledWith(idea.id);
		expect(mockedUpdateIdeaDraft).toHaveBeenCalledWith(idea.id, {
			categoryId: category.id,
			title: "Updated solar desalination",
			summary: idea.summary,
			description: idea.description,
		});
		expect(await screen.findByRole("status")).toHaveTextContent(/draft saved/i);
	});

	it("shows a safe alert when saving fails", async () => {
		const user = userEvent.setup();
		mockedCreateIdeaDraft.mockRejectedValue(
			new Error("sensitive database details"),
		);
		renderEditor();

		await screen.findByRole("heading", { name: /start a new idea/i });
		await completeForm(user);
		await user.click(screen.getByRole("button", { name: /save draft/i }));

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Unable to save your draft. Please try again.",
		);
		expect(screen.getByRole("alert")).not.toHaveTextContent(/sensitive/i);
	});
});
