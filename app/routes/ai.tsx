import { Await, isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import { Suspense } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { generateCompletion } from "~/ai.server";

export async function loader ({ request }: LoaderArgs) {
  const completion = generateCompletion();

  return defer({ completion });
}

export default function AiPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="container">
      <Suspense fallback={<p>Loading random joke...</p>}>
        <Await resolve={data.completion} errorElement={<p>Error loading a random joke</p>}>
          {completion => (
            <h2>{completion?.[0]?.message?.content ?? "No jokes"}</h2>
          )}
        </Await>
      </Suspense>
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
