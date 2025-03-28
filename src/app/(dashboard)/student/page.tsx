import Announcement from "@/components/Announcement";
import BigCalanderContainer from "@/components/BigCalanderContainer";
import EventCalandarContainer from "@/components/EventCalandarContainer";
import EventCalander from "@/components/EventCalander";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const StudentPage = async({searchParams}:{searchParams:{[key:string]:string | undefined}}) => {
  const {userId} = await auth();

  const classItem = await prisma.class.findMany({
    where: {
      students:{
        some:{
          id: userId!,
        }
      }
    },
  });

  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4">
      {/* Left */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (VI B)</h1>
          <BigCalanderContainer type="classId" id={classItem[0]?.id}/>
        </div>
      </div>

      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalandarContainer searchParams={searchParams}/>
        <Announcement />
      </div>
    </div>
  );
};

export default StudentPage;
