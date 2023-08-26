import {
  isRouteErrorResponse,
  useFetcher,
  useRouteError,
} from "@remix-run/react";
import { useEffect } from "react";

export default function AiPage() {
  const ai = useFetcher();

  useEffect(() => {
    ai.load("/getRandomJoke");
  }, []);

  const randomJoke = ai.data?.completion?.[0]?.message?.content ?? "No jokes";

  return (
    <div className="container">
      <p>{ai.state === "loading" ? "Loading random joke..." : randomJoke}</p>
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
