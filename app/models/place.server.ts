import type { User, Place } from "@prisma/client";

import { prisma } from "~/db.server";

export function getPlace({
  id,
  userId,
}: Pick<Place, "id"> & {
  userId: User["id"];
}) {
  return prisma.place.findFirst({
    select: { id: true, city: true, country: true, visited: true, note: true },
    where: { id, userId },
  });
}

export function getPlaceListItems({
  userId,
  searchTerm = "",
  take = 100,
}: {
  userId: User["id"];
  searchTerm?: string;
  take?: number;
}) {
  return prisma.place.findMany({
    where: {
      userId,
      OR: [
        { city: { contains: searchTerm } },
        { country: { contains: searchTerm } },
      ],
    },
    select: { id: true, city: true, country: true, visited: true, note: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function createPlace({
  city,
  country,
  visited,
  note,
  userId,
}: Pick<Place, "city" | "country" | "visited" | "note"> & {
  userId: User["id"];
}) {
  return prisma.place.create({
    data: {
      city,
      country,
      visited,
      note,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function editPlace({
  id: placeId,
  city,
  country,
  visited,
  note,
  userId,
}: Pick<Place, "id" | "city" | "country" | "visited" | "note"> & {
  userId: User["id"];
}) {
  return prisma.place.update({
    data: {
      city,
      country,
      visited,
      note,
    },
    where: {
      id: placeId,
      userId,
    },
  });
}

export function toggleVisited({
  id: placeId,
  visited,
  userId,
}: Pick<Place, "id" | "visited"> & {
  userId: User["id"];
}) {
  return prisma.place.update({
    data: {
      visited,
    },
    where: {
      id: placeId,
      userId,
    },
  });
}

export function deletePlace({
  id,
  userId,
}: Pick<Place, "id"> & { userId: User["id"] }) {
  return prisma.place.deleteMany({
    where: { id, userId },
  });
}
