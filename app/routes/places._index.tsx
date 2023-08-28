import { Link } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => [{ title: "Places | Wanderlist" }];

export default function PlaceIndexPage() {
  return (
    <div>
      <div>
        No place selected. Select a place on the left, {" "}
        <Link to="new" className="text-blue-500 underline">
          create a new place
        </Link>
        {" "} or {" "}
        <Link
          to="suggest"
          className="inline-block w-auto ml-2 rounded bg-blue-500 px-4 py-2 text-xs font-semibold uppercase text-white"
        >
          Visit random suggestions
        </Link>
      </div>
    </div>
  );
}
