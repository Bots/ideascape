import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";
import { BrowserRouter } from "react-router-dom";

export function AppProviders({ children }: PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						staleTime: 30_000,
					},
				},
			}),
	);

	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</BrowserRouter>
	);
}
