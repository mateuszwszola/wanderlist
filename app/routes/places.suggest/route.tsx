import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { defer, json } from "@remix-run/node";
import {
  Await,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Suspense } from "react";
import { generatePlaceSuggestions } from "~/ai.server";
import { createPlace, getPlaceListItems } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { NewPlaceSchema } from "~/utils/place";
import { AddPlace } from "./AddPlace";
import { convertSuggestionToPlaces, defaultPlaceList } from "./utils";
import { Suggestion } from "./Suggestion";

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
            let places = convertSuggestionToPlaces(
              completion?.[0]?.message?.content ?? "[]"
            );

            if (places.length === 0) {
              places = defaultPlaceList;
            }

            return (
              <ul className="flex flex-col gap-4 divide-y-2">
                {places.map((place) => (
                  <Suggestion key={place.id} place={place}>
                    <AddPlace
                      place={{
                        city: place.city,
                        country: place.country,
                        note: place.note,
                      }}
                    />
                  </Suggestion>
                ))}
              </ul>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const placeData = {
    city: formData.get("city"),
    country: formData.get("country"),
    note: formData.get("note"),
    visited: null,
  };

  const validationResult = NewPlaceSchema.safeParse(placeData);

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();
    const formattedErrors = Object.fromEntries(
      Object.entries(fieldErrors).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value,
      ])
    );

    return json(
      {
        errors: formattedErrors,
      },
      { status: 400 }
    );
  }

  const data = validationResult.data;

  const place = await createPlace({
    userId,
    city: data.city,
    country: data.country,
    note: data.note || null,
    visited: Boolean(data.visited),
  });

  return json({
    ok: true,
    place,
  });
};

/* 
We want to fetch the list of place suggestions once per interaction.
... and we do not want to revalidate the data when the user adds a place to their list.
*/
export function shouldRevalidate() {
  return false;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <h2>Something went wrong</h2>;
  }
  return <h2>Ups...</h2>;
}
