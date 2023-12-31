import { z } from 'zod';

export const NewPlaceSchema = z.object({
  city: z.string().nonempty("City is required"),
  country: z.string().nonempty("Country is required"),
  visited: z.union([z.boolean(), z.string(), z.null()]),
  note: z.string().optional(),
});

export const ToggleVisitedInputSchema = z.object({
  placeId: z.string(),
  visited: z.string(),
});