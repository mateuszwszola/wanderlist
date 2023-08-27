import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import { Suspense, lazy, useEffect } from "react";
import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: nProgressStyles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

const RemixDevTools =
  process.env.NODE_ENV === "development"
    ? lazy(() => import("remix-development-tools"))
    : null;

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") {
      NProgress.done();
    } else {
      NProgress.start();
    }
  }, [navigation.state]);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {RemixDevTools ? (
          <Suspense>
            <RemixDevTools />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}
