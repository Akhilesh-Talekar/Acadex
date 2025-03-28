import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalander";
import BigCalanderContainer from "@/components/BigCalanderContainer";
import EventCalander from "@/components/EventCalander";
import prisma from "@/lib/prisma";
import { getRole } from "@/lib/utils";
import React from "react";

const ParentPage = async () => {
  const { currUserId } = await getRole();

  const students = await prisma.student.findMany({
    where: {
      parentId: currUserId,
    },
  });

  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* Left */}
      {students.map((student) => {
        return (
          <div className="w-full xl:w-2/3">
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold">Schedule({`${student.name} ${student.surname}`})</h1>
              <BigCalanderContainer type="classId" id={student.classId}/>
            </div>
          </div>
        );
      })}

      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcement />
      </div>
    </div>
  );
};

export default ParentPage;
