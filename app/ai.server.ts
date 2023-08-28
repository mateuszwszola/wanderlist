import type { Place } from "@prisma/client";
import OpenAI from "openai";
import invariant from "tiny-invariant";

invariant(process.env.OPENAI_API_KEY, "OPENAI_API_KEY must be set");

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function generatePlaceSuggestions(
  userPlaceList: Array<Pick<Place, "city" | "country" | "note" | "visited">>
) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
          Imagine you're a professional travel agent. Guest is approaching you and asking for a trip, but they do not know
          where to go. The person might have a list of places they've already visited or wish to visit. 
          You should use this list as a reference to suggest a new places to visit (3-5 places). 
          To provide better results extract common features from the list of places and use them to generate new places.
          E.g. if the list contains places in Europe, you should rank higher places in Europe.
          The response should contain only suggestions of places to visit, and nothing else.
          The response should be in the JSON, and match the following format:
          """
          [
            {
              "id": 1,
              "city": "Paris",
              "country": "France",
              "note": "Paris is the capital and most populous city of France, with an estimated population of 2,175,601 residents as of 2018, in an area of more than 105 square kilometres. Since the 17th century, Paris has been one of Europe's major centres of finance, diplomacy, commerce, fashion, science and arts."
            },
            {
              "id": 2,
              "city": "Dubai",
              "country": "United Arab Emirates",
              "note": "Dubai is the most populous city in the United Arab Emirates and the capital of the Emirate of Dubai. Located in the eastern part of the Arabian Peninsula on the coast of the Persian Gulf, Dubai aims to be the business hub of Western Asia. It is also a major global transport hub for passengers and cargo."
            }
          ]
          """
          Is especially important that the response is in the following format, because it will be parsed using JSON.parse() function in JavaScript.

          And here's user list of places:

          ${JSON.stringify(userPlaceList)}

          Avoid suggesting places that user has already in the bucket list.
    `,
      },
    ],
    model: "gpt-3.5-turbo",
    temperature: 1.5,
  });

  return completion.choices;
}
