import { z } from "zod";

const publicEnvSchema = z.object({
	VITE_SUPABASE_URL: z.url(),
	VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
	VITE_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function getPublicEnv(): PublicEnv {
	const result = publicEnvSchema.safeParse(import.meta.env);

	if (!result.success) {
		const missing = result.error.issues
			.map((issue) => issue.path.join("."))
			.join(", ");

		throw new Error(`Invalid public environment configuration: ${missing}`);
	}

	return result.data;
}
