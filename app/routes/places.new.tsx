import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createPlace } from "~/models/place.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const city = formData.get("city");
  const country = formData.get("country");
  const visited = formData.get("visited");
  const note = formData.get("note");

  if (typeof city !== "string" || city.length === 0) {
    return json(
      {
        errors: {
          country: null,
          visited: null,
          note: null,
          city: "City is required",
        },
      },
      { status: 400 }
    );
  }

  if (typeof country !== "string" || country.length === 0) {
    return json(
      {
        errors: {
          city: null,
          visited: null,
          note: null,
          country: "City is required",
        },
      },
      { status: 400 }
    );
  }

  if (typeof note !== "string") {
    return json(
      {
        errors: {
          city: null,
          visited: null,
          country: null,
          note: "Invalid note provided",
        },
      },
      { status: 400 }
    );
  }

  const isVisited = Boolean(visited);

  const place = await createPlace({
    userId,
    city,
    country,
    visited: isVisited,
    note,
  });

  return redirect(`/places/${place.id}`);
};

export default function NewPlacePage() {
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
          <span>City: </span>
          <input
            ref={cityRef}
            name="city"
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
          <span>Country: </span>
          <input
            ref={countryRef}
            name="country"
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
          <span>Visited: </span>
          <input
            type="checkbox"
            name="visited"
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
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.note ? true : undefined}
            aria-errormessage={
              actionData?.errors?.note ? "note-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.note ? (
          <div className="pt-1 text-red-700" id="note-error">
            {actionData.errors.note}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
