import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

import { editPlace, getPlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";
import { PlaceSchema } from "~/utils/place";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const placeId = url.searchParams.get("placeId");
  invariant(placeId, "placeId not found");

  const place = await getPlace({ id: placeId, userId });

  if (!place) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ place });
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const placeId = url.searchParams.get("placeId");
  invariant(placeId, "placeId not found");

  const formData = await request.formData();
  const placeData = {
    city: formData.get("city"),
    country: formData.get("country"),
    visited: formData.get("visited"),
    note: formData.get("note"),
  };

  const validationResult = PlaceSchema.safeParse(placeData);

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

  const place = await editPlace({
    id: placeId,
    userId,
    city: data.city,
    country: data.country,
    visited: Boolean(data.visited),
    note: data.note || null,
  });

  return redirect(`/places/${place.id}`);
};

export default function NewPlacePage() {
  const { place } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const cityRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.city) {
      cityRef.current?.focus();
    } else if (actionData?.errors?.country) {
      countryRef.current?.focus();
    } else if (actionData?.errors?.note) {
      noteRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>City:</span>
          <input
            ref={cityRef}
            autoFocus
            name="city"
            defaultValue={place?.city || ""}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.city ? true : undefined}
            aria-errormessage={
              actionData?.errors?.city ? "city-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.city ? (
          <div className="pt-1 text-red-700" id="city-error">
            {actionData.errors.city}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Country:</span>
          <input
            ref={countryRef}
            name="country"
            defaultValue={place?.country || ""}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.country ? true : undefined}
            aria-errormessage={
              actionData?.errors?.country ? "country-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.country ? (
          <div className="pt-1 text-red-700" id="country-error">
            {actionData.errors.country}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Visited:</span>
          <input
            type="checkbox"
            name="visited"
            defaultChecked={place?.visited || false}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Note: </span>
          <textarea
            ref={noteRef}
            name="note"
            rows={8}
            defaultValue={place?.note || ""}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.note ? true : undefined}
            aria-errormessage={
              actionData?.errors?.note ? "note-error" : undefined
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.metaKey) {
                event.currentTarget.form?.submit();
              }
            }}
          />
        </label>
        {actionData?.errors?.note ? (
          <div className="pt-1 text-red-700" id="note-error">
            {actionData.errors.note}
          </div>
        ) : null}
      </div>

      <div className="flex align-center self-end gap-4">
        <Link
          to={place.id ? `/places/${place?.id}` : "/places"}
          className="block rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 focus:bg-orange-400"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
