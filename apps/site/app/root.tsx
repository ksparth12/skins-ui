import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from "react-router";
import { MotionConfig } from "motion/react";
import type { Route } from "./+types/root";
import calSans from "./fonts/cal-sans.woff2?url";
import calSansText from "./fonts/cal-sans-text-ui.woff2?url";
import { AppShell } from "~/components/app-shell";
import { ErrorPage } from "~/components/error-pages";
import { HueScript, ThemeScript } from "~/components/theme";
import { BRAND_COLOUR, fetchStars } from "~/lib/site";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
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
        <meta name="theme-color" content={BRAND_COLOUR} />
        <ThemeScript />
        <Meta />
        <Links />
        <HueScript />
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
  // The real error is shown only while developing.
  const detail = import.meta.env.DEV && error instanceof Error ? (error.stack ?? error.message) : undefined;
  return (
    <MotionConfig reducedMotion="user">
      <AppShell>
        <ErrorPage kind={notFound ? "404" : "500"} detail={detail} />
      </AppShell>
    </MotionConfig>
  );
}
