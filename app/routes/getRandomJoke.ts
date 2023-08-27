import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { generateCompletion } from "~/ai.server";

export async function loader({ request }: LoaderArgs) {
  const completion = await generateCompletion();

  return json({ completion });
}
