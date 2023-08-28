import {
  Await,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Suspense } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { generatePlaceSuggestions } from "~/ai.server";
import { requireUserId } from "~/session.server";
import { getPlaceListItems } from "~/models/place.server";
import { convertSuggestionToPlaces } from "./utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);

  const userPlaceList = await getPlaceListItems({
    userId,
    take: 10,
  });

  const preparedUserPlaceList = userPlaceList.map((place) => ({
    city: place.city,
    country: place.country,
    note: place.note,
    visited: place.visited,
  }));

  const completion = generatePlaceSuggestions(preparedUserPlaceList);

  return defer({ completion });
}

export default function PlaceSuggestPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="container">
      <Suspense fallback={<p>Generating random place suggestion...</p>}>
        <Await
          resolve={data.completion}
          errorElement={<p>Error loading a random place suggestion</p>}
        >
          {(completion) => {
            const places = convertSuggestionToPlaces(
              completion?.[0]?.message?.content ?? "[]"
            );

            if (places.length === 0) return <p>No suggestions</p>;

            return (
              <ul className="flex flex-col gap-4 divide-y-2">
                {places.map((place) => (
                  <li className="block px-4 py-4" key={place.id}>
                    <h3 className="text-xl font-bold">
                      {place.city}, {place.country}
                    </h3>
                    <p className="mt-2">{place.note}</p>
                  </li>
                ))}
              </ul>
            );
          }}
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
