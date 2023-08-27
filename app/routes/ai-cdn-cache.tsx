import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { generateCompletion } from "~/ai.server";

export function headers() {
  return {
    "Cache-Control": "public, max-age=0, s-maxage=60",
  };
}

export async function loader({ request }: LoaderArgs) {
  const completion = await generateCompletion();

  return json({ completion });
}

export default function AiPage() {
  const data = useLoaderData<typeof loader>();

  const randomJoke = data.completion?.[0]?.message?.content ?? "No jokes";

  return (
    <div className="container">
      <p>{randomJoke}</p>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <h2>Something went wrong</h2>;
  }
  return <h2>Ups...</h2>;
}
