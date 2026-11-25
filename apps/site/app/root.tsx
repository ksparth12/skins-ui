import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from "react-router";
import { MotionConfig } from "motion/react";
import type { Route } from "./+types/root";
import calSans from "./fonts/cal-sans.woff2?url";
import calSansText from "./fonts/cal-sans-text-ui.woff2?url";
import { ThemeScript } from "~/components/theme";
import { fetchStars } from "~/lib/site";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preload", href: calSansText, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: calSans, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

/** The GitHub star count rides along with every page. A slow or failed answer never holds the page up. */
export async function loader() {
  return { stars: await fetchStars(AbortSignal.timeout(2500)) };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ThemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Outlet />
    </MotionConfig>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="mx-auto grid min-h-dvh max-w-xl place-content-center gap-3 px-6 text-center">
      <h1 className="text-3xl">{notFound ? "This page doesn't exist" : "Something went wrong"}</h1>
      <p className="text-sk-muted">{notFound ? "Check the address, or start from the home page." : "Try again in a moment."}</p>
    </main>
  );
}
