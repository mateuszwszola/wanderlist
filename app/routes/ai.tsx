import { isRouteErrorResponse, useRouteError , useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { generateCompletion } from "~/ai.server";

export async function loader ({ request }: LoaderArgs) {
  const completion = await generateCompletion();

  return json({ completion });
};


export default function AiPage() {
  const data = useLoaderData<typeof loader>();

  const randomJoke = data.completion?.[0]?.message?.content ?? 'No data';

  return (
    <div className="container">
      <h2>{randomJoke}</h2>
    </div>
  )
} 


export function ErrorBoundary(){
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <h2>Something went wrong</h2>
  }
  return <h2>Ups...</h2>
}
