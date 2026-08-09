import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { getSupabaseClient } from "@/lib/supabase";

export type AuthContextValue = {
	user: User | null;
	isLoading: boolean;
};

type AuthProviderProps = PropsWithChildren<{
	client?: SupabaseClient;
}>;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children, client }: AuthProviderProps) {
	const supabase = client ?? getSupabaseClient();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function restoreSession() {
			try {
				const { data, error } = await supabase.auth.getSession();

				if (error) {
					console.error("Unable to restore the authentication session.");
				}

				if (isMounted) {
					setUser(error ? null : (data.session?.user ?? null));
				}
			} catch {
				console.error("Unable to restore the authentication session.");

				if (isMounted) {
					setUser(null);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		void restoreSession();

		const { data } = supabase.auth.onAuthStateChange((_event, session) => {
			if (isMounted) {
				setUser(session?.user ?? null);
			}
		});

		return () => {
			isMounted = false;
			data.subscription.unsubscribe();
		};
	}, [supabase]);

	return (
		<AuthContext.Provider value={{ user, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
