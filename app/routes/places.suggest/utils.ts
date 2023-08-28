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

export const defaultPlaceList: Array<Pick<Place, 'id' | 'city' | 'country' | 'note'>> = [
  {
    id: '1',
    city: 'Warsaw',
    country: 'Poland',
    note: 'Warsaw, officially the Capital City of Warsaw, is the capital and largest city of Poland. The metropolis stands on the River Vistula in east-central Poland.'
  },
  {
    id: '2',
    city: 'Dubai',
    country: 'United Arab Emirates',
    note: 'Dubai is the most populous city in the United Arab Emirates and the capital of the Emirate of Dubai. Located in the eastern part of the Arabian Peninsula on the coast of the Persian Gulf, Dubai aims to be the business hub of Western Asia. It is also a major global transport hub for passengers and cargo.'
  },
  {
    id: '3',
    city: 'Paris',
    country: 'France',
    note: "Paris is the capital and most populous city of France, with an estimated population of 2,175,601 residents as of 2018, in an area of more than 105 square kilometers. Since the 17th century, Paris has been one of Europe's major centres of finance, diplomacy, commerce, fashion, science and arts."
  },
]