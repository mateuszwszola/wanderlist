import { Link } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => [{ title: "Places | Wanderlist" }];

export default function PlaceIndexPage() {
  return (
    <p>
      No place selected. Select a place on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new place.
      </Link>

      <Link to="/ai" className="ml-4 text-white bg-blue-500 rounded py-3 px-4 text-xs uppercase font-semibold">
        Generate a random joke
      </Link>
    </p>
  );
}
