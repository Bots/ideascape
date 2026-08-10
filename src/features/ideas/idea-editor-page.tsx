import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, LoaderCircle, MapPinned } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import {
	createIdeaDraft,
	getIdeaForEditing,
	listCategories,
	updateIdeaDraft,
} from "@/features/ideas/idea-service";

export function IdeaEditorPage() {
	const { user, isLoading: isAuthLoading } = useAuth();
	const { ideaId } = useParams<{ ideaId: string }>();
	const navigate = useNavigate();
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saveMessage, setSaveMessage] = useState<string | null>(null);
	const isEditing = Boolean(ideaId);

	const categoriesQuery = useQuery({
		queryKey: ["idea-categories"],
		queryFn: listCategories,
		enabled: Boolean(user),
		retry: false,
	});
	const ideaQuery = useQuery({
		queryKey: ["idea-editor", ideaId],
		queryFn: () => getIdeaForEditing(ideaId ?? ""),
		enabled: Boolean(user && ideaId),
		retry: false,
	});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!user) {
			return;
		}

		setIsSaving(true);
		setSaveError(null);
		setSaveMessage(null);

		const form = new FormData(event.currentTarget);
		const values = {
			categoryId: Number(form.get("category")),
			title: String(form.get("title")).trim(),
			summary: String(form.get("summary")).trim(),
			description: String(form.get("description")).trim(),
		};

		try {
			if (ideaId) {
				await updateIdeaDraft(ideaId, values);
				setSaveMessage("Draft saved.");
			} else {
				const createdIdea = await createIdeaDraft(user.id, values);
				navigate(`/ideas/${createdIdea.id}/edit`);
			}
		} catch {
			setSaveError("Unable to save your draft. Please try again.");
		} finally {
			setIsSaving(false);
		}
	}

	if (isAuthLoading) {
		return <EditorStatus message="Restoring your session…" />;
	}

	if (!user) {
		return (
			<EditorShell>
				<h1 className="text-3xl font-semibold tracking-tight">
					Sign in to create an idea
				</h1>
				<p className="mt-3 max-w-xl leading-7 text-muted-foreground">
					Ideascape connects every idea to a verified creator profile. Sign in
					before starting your draft.
				</p>
				<Link className={buttonVariants({ className: "mt-6" })} to="/sign-in">
					Sign in
				</Link>
			</EditorShell>
		);
	}

	if (categoriesQuery.isPending || (isEditing && ideaQuery.isPending)) {
		return <EditorStatus message="Loading idea editor…" />;
	}

	if (categoriesQuery.isError || (isEditing && ideaQuery.isError)) {
		return (
			<EditorShell>
				<h1 className="text-3xl font-semibold tracking-tight">
					Editor unavailable
				</h1>
				<p className="mt-3 text-muted-foreground" role="alert">
					Unable to load the idea editor. Please try again.
				</p>
			</EditorShell>
		);
	}

	const idea = isEditing ? ideaQuery.data : null;
	const categories = categoriesQuery.data ?? [];

	return (
		<EditorShell>
			<Link
				className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
				to="/"
			>
				<ArrowLeft className="size-4" aria-hidden="true" />
				Back home
			</Link>
			<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
				{isEditing ? "Edit your idea" : "Start a new idea"}
			</h1>
			<p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
				Save a private draft while you sharpen the problem, proposed solution,
				and story you want to share.
			</p>

			<form className="mt-10 space-y-6" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<label className="text-sm font-medium" htmlFor="category">
						Category
					</label>
					<select
						className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring"
						id="category"
						name="category"
						defaultValue={idea?.category_id ?? ""}
						required
					>
						<option value="" disabled>
							Choose a category
						</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium" htmlFor="title">
						Title
					</label>
					<input
						className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring"
						id="title"
						name="title"
						defaultValue={idea?.title ?? ""}
						minLength={3}
						maxLength={120}
						required
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium" htmlFor="summary">
						Summary
					</label>
					<textarea
						className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring"
						id="summary"
						name="summary"
						defaultValue={idea?.summary ?? ""}
						minLength={10}
						maxLength={280}
						required
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium" htmlFor="description">
						Description
					</label>
					<textarea
						className="min-h-56 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring"
						id="description"
						name="description"
						defaultValue={idea?.description ?? ""}
						minLength={20}
						maxLength={20000}
						required
					/>
				</div>

				{saveError ? (
					<p className="text-sm text-destructive" role="alert">
						{saveError}
					</p>
				) : null}
				{saveMessage ? (
					<p
						className="border-l-2 border-signal pl-3 text-sm text-foreground"
						role="status"
					>
						{saveMessage}
					</p>
				) : null}

				<Button type="submit" disabled={isSaving}>
					{isSaving ? "Saving…" : isEditing ? "Save changes" : "Save draft"}
				</Button>
			</form>
		</EditorShell>
	);
}

function EditorShell({ children }: { children: React.ReactNode }) {
	return (
		<main className="field-grid contour-field relative min-h-screen overflow-hidden bg-background px-6 py-12 text-foreground">
			<section className="field-panel relative mx-auto w-full max-w-3xl border-t-4 border-t-primary p-8 sm:p-10">
				<Link
					to="/"
					className="mb-10 flex items-center gap-3 font-semibold tracking-tight"
				>
					<span className="grid size-10 place-items-center bg-primary text-primary-foreground">
						<MapPinned className="size-5" aria-hidden="true" />
					</span>
					<span className="text-lg">Ideascape</span>
				</Link>
				{children}
			</section>
		</main>
	);
}

function EditorStatus({ message }: { message: string }) {
	return (
		<EditorShell>
			<div
				className="flex items-center gap-3 text-muted-foreground"
				role="status"
			>
				<LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
				{message}
			</div>
		</EditorShell>
	);
}
