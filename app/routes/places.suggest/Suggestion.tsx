import type { Place } from "@prisma/client";

interface SuggestionProps {
  place: Pick<Place, "id" | "city" | "country" | "note">;
  children?: React.ReactNode;
}

export function Suggestion({ place, children }: SuggestionProps) {
  return (
    <li className="block px-4 py-4" key={place.id}>
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold">
          {place.city}, {place.country}
        </h3>
        {children}
      </div>
      <p className="mt-2">{place.note}</p>
    </li>
  );
}
