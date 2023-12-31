import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useSearchParams
} from "@remix-run/react";
import { PlaceSearchInput } from "~/components/placeSearch";
import { VisitPlace } from "~/components/visitPlace";

import { getPlaceListItems, toggleVisited } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { ToggleVisitedInputSchema } from "~/utils/place";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("q") || "";
  const placeListItems = await getPlaceListItems({ userId, searchTerm });
  return json({ placeListItems });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const inputData = {
    placeId: formData.get("placeId"),
    visited: formData.get("visited"),
  };

  try {
    const parsedData = ToggleVisitedInputSchema.parse(inputData);

    await toggleVisited({
      id: parsedData.placeId,
      userId: userId,
      visited: parsedData.visited === "yes",
    });

    return { ok: true };
  } catch (e) {
    return { ok: false };
  }
}

export default function PlacesPage() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const user = useUser();

  const searchTerm = searchParams.get("q");

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Places</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <PlaceSearchInput defaultValue={searchTerm || ""} />

          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Place
          </Link>

          <hr />

          {data.placeListItems.length === 0 ? (
            <p className="p-4">No places yet</p>
          ) : (
            <ol>
              {data.placeListItems.map((place) => (
                <li key={place.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `align-center flex justify-between gap-1 border-b p-4 text-xl ${
                        isActive ? "bg-white" : ""
                      }`
                    }
                    to={place.id}
                  >
                    <span>🗺 {`${place.city}, ${place.country} `}</span>
                    <VisitPlace placeId={place.id} isVisited={place.visited} />
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
