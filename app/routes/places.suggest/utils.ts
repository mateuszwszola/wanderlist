import type { Place } from "@prisma/client";

export function convertSuggestionToPlaces(
  suggestion: string
): Array<Pick<Place, "id" | "city" | "country" | "note">> {
  try {
    const places = JSON.parse(suggestion);

    return places;
  } catch (err) {
    return [];
  }
}