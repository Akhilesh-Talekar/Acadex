import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  let date = new Date();

  // Validate dateParam
  if (dateParam && !isNaN(Date.parse(dateParam))) {
    date = new Date(dateParam);
  }
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  let roleConditions: any = [];

  switch (role) {
    case "admin":
      break;

    case "student":
      roleConditions = [
        { classId: null },
        { class: { students: { some: { id: userId! } } } },
      ];

    default:
      break;
  }

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      ...(roleConditions.length > 0 ? { OR: roleConditions } : {}),
    },
  });
  return data.map((event) => (
    <div
      className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
      key={event.id}
    >
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-gray-600">{event.title}</h1>
        <span className="text-gray-300 text-xs">
          {event.startTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
    </div>
  ));
};

export default EventList;
