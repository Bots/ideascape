import { getSupabaseClient } from "@/lib/supabase";

export type IdeaStatus =
	| "draft"
	| "published"
	| "funding"
	| "funded"
	| "in_progress"
	| "completed"
	| "cancelled";

export type IdeaCategory = {
	id: number;
	slug: string;
	name: string;
	description: string | null;
};

export type IdeaEditorValues = {
	categoryId: number | null;
	title: string;
	summary: string;
	description: string;
};

export type IdeaRecord = {
	id: string;
	creator_id: string;
	category_id: number | null;
	slug: string;
	title: string;
	summary: string;
	description: string;
	status: IdeaStatus;
	published_at: string | null;
	created_at: string;
	updated_at: string;
};

const ideaColumns =
	"id, creator_id, category_id, slug, title, summary, description, status, published_at, created_at, updated_at";

function throwIfError(error: unknown): void {
	if (error) {
		throw error;
	}
}

function createIdeaSlug(title: string, id: string): string {
	const base =
		title
			.normalize("NFKD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
			.slice(0, 80)
			.replace(/-+$/g, "") || "idea";
	const suffix = id.replaceAll("-", "").slice(0, 8);

	return `${base}-${suffix}`;
}

export async function listCategories(): Promise<IdeaCategory[]> {
	const { data, error } = await getSupabaseClient()
		.from("categories")
		.select("id, slug, name, description")
		.order("name");

	throwIfError(error);
	return (data ?? []) as IdeaCategory[];
}

export async function createIdeaDraft(
	creatorId: string,
	values: IdeaEditorValues,
): Promise<IdeaRecord> {
	const id = crypto.randomUUID();
	const { data, error } = await getSupabaseClient()
		.from("ideas")
		.insert({
			id,
			creator_id: creatorId,
			category_id: values.categoryId,
			slug: createIdeaSlug(values.title, id),
			title: values.title,
			summary: values.summary,
			description: values.description,
		})
		.select(ideaColumns)
		.single();

	throwIfError(error);
	return data as IdeaRecord;
}

export async function getIdeaForEditing(id: string): Promise<IdeaRecord> {
	const { data, error } = await getSupabaseClient()
		.from("ideas")
		.select(ideaColumns)
		.eq("id", id)
		.single();

	throwIfError(error);
	return data as IdeaRecord;
}

export async function updateIdeaDraft(
	id: string,
	values: IdeaEditorValues,
): Promise<IdeaRecord> {
	const { data, error } = await getSupabaseClient()
		.from("ideas")
		.update({
			category_id: values.categoryId,
			title: values.title,
			summary: values.summary,
			description: values.description,
		})
		.eq("id", id)
		.select(ideaColumns)
		.single();

	throwIfError(error);
	return data as IdeaRecord;
}
