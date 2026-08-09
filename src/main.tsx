import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { AppProviders } from "@/app/providers";
import "@/index.css";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root element was not found");
}

createRoot(root).render(
	<StrictMode>
		<AppProviders>
			<App />
		</AppProviders>
	</StrictMode>,
);
