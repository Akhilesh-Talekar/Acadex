import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const Announcement = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleConditions = {
    admin: {},
    teacher: {
      lessons: { 
        some: {
          teacherId: userId!,
        },
      },
    },
    student: {
      students: {
        some: {
          id: userId!,
        },
      },
    },
    parent: {
      students: {
        some: {
          parentId: userId!,
        },
      },
    },
  };

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
  });

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-gray-400 text-xs ring-[1px] ring-gray-400 p-1 rounded-md leading-[1.3] cursor-pointer">
          <Link href={"/"}>View All</Link>
        </span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lamaSky rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{data[0]?.title}</h2>
            <span className="text-sm text-gray-400 bg-white rounded-md p-1">
              {data[0]?.date.toLocaleDateString("en-IN")}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{data[0]?.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lamaPurple rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{data[1]?.title}</h2>
            <span className="text-sm text-gray-400 bg-white rounded-md p-1">
              {data[1]?.date.toLocaleDateString("en-IN")}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{data[1]?.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-[#f7f4d2] rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{data[2]?.title}</h2>
            <span className="text-sm text-gray-400 bg-white rounded-md p-1">
              {data[2]?.date.toLocaleDateString("en-IN")}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{data[2]?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
