import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalander";
import EventCalander from "@/components/EventCalander";
import React from "react";

const StudentPage = () => {
  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4">
      {/* Left */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (VI B)</h1>
          <BigCalendar/>
        </div>
      </div>

      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalander />
        <Announcement />
      </div>
    </div>
  );
};

export default StudentPage;
