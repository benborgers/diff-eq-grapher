import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import posthog from "posthog-js";
import { flare } from "@flareapp/flare-client";
import { FlareErrorBoundary } from "@flareapp/flare-react";

if (import.meta.env.PROD) {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host: "https://app.posthog.com",
    });
    posthog.identify(window.SESSION_ID);
}

flare.light(import.meta.env.VITE_FLARE_KEY);

const appName = import.meta.env.VITE_APP_NAME;

createInertiaApp({
    title: (title) => appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <FlareErrorBoundary>
                <App {...props} />
            </FlareErrorBoundary>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
