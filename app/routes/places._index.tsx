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
      <Link
        to="/ai-fetcher"
        className="rounded bg-blue-500 px-4 py-3 text-xs font-semibold uppercase text-white"
      >
        Generate a random joke (client side - useFetcher)
      </Link>
      <Link
        to="/ai"
        className="rounded bg-blue-500 px-4 py-3 text-xs font-semibold uppercase text-white"
      >
        Generate a random joke (streaming)
      </Link>
      <Link
        to="/ai"
        prefetch="intent"
        className="rounded bg-teal-500 px-4 py-3 text-xs font-semibold uppercase text-white"
      >
        Generate a random joke (streaming + prefetch)
      </Link>
      <Link
        to="/ai-cdn-cache"
        prefetch="intent"
        className="rounded bg-teal-500 px-4 py-3 text-xs font-semibold uppercase text-white"
      >
        Generate a random joke (CDN document cache)
      </Link>
    </div>
  );
}
