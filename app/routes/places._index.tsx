import { Link } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => [{ title: "Places | Wanderlist" }];

export default function PlaceIndexPage() {
  return (
    <div className="flex flex-col gap-5">
      No place selected. Select a place on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new place.
      </Link>

      <Link to="/ai-fetcher" className="text-white bg-blue-500 rounded py-3 px-4 text-xs uppercase font-semibold">
        Generate a random joke (client side - useFetcher)
      </Link>

      <Link to="/ai" className="text-white bg-blue-500 rounded py-3 px-4 text-xs uppercase font-semibold">
        Generate a random joke (streaming)
      </Link>

      <Link to="/ai" prefetch="intent" className="text-white bg-teal-500 rounded py-3 px-4 text-xs uppercase font-semibold">
        Generate a random joke (streaming + prefetch)
      </Link>

      <Link to="/ai-cdn-cache" prefetch="intent" className="text-white bg-teal-500 rounded py-3 px-4 text-xs uppercase font-semibold">
        Generate a random joke (CDN document cache)
      </Link>
    </div>
  );
}
