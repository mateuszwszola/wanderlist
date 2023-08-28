import type { Place } from "@prisma/client";
import { PlusIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { Button } from "~/components/ui/button";

interface AddPlaceProps {
  place: Pick<Place, "city" | "country" | "note">;
}

export function AddPlace({ place }: AddPlaceProps) {
  const addPlace = useFetcher();

  const isAdding = addPlace.state !== "idle";

  return (
    <addPlace.Form method="POST">
      <input type="hidden" name="city" value={place.city} />
      <input type="hidden" name="country" value={place.country} />
      <input type="hidden" name="note" value={place.note || ""} />

      <Button disabled={isAdding} variant="outline">
        <PlusIcon className="h-4 w-4" />
        <span className="ml-2">
          {isAdding ? "Adding..." : "Add to my list"}
        </span>
      </Button>
    </addPlace.Form>
  );
}
