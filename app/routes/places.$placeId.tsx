import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deletePlace, getPlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  invariant(params.placeId, "placeId not found");

  const place = await getPlace({ id: params.placeId, userId });
  if (!place) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ place });
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.placeId, "placeId not found");

  await deletePlace({ id: params.placeId, userId });

  return redirect("/places");
};

export default function PlaceDetailsPage() {
  const data = useLoaderData<typeof loader>();

  const visitedContent = data.place.visited ? (
    <span aria-label="Visited" title="Visited">📌</span>
  ) : (
    <span aria-label="Not Visited" title="Not Visited" className="opacity-25">📌</span>
  );

  return (
    <div>
      <h3 className="text-2xl font-bold">
        {data.place.city}, {data.place.country} {visitedContent}
      </h3>
      <p className="py-6">{data.place.note}</p>
      <hr className="my-4" />
      <div className="flex gap-4">
        <Form method="post">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Delete
          </button>
        </Form>
        <Link
          to={`../edit?placeId=${data.place.id}`}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Place not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
