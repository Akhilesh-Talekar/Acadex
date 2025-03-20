import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalander";
import BigCalanderContainer from "@/components/BigCalanderContainer";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const TeacherPage = async() => {
  const {userId} = await auth();

  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* Left */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalanderContainer type="teacherId" id={userId!}/>
        </div>
      </div>

      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcement />
      </div>
    </div>
  );
};

export default TeacherPage;
