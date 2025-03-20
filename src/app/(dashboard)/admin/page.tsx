import Announcement from "@/components/Announcement";
import AttendanceChart from "@/components/AttendanceChart";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChart from "@/components/CountChart";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalandarContainer from "@/components/EventCalandarContainer";
import EventCalander from "@/components/EventCalander";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import React from "react";

const AdminPage = ({searchParams}:{searchParams:{[key:string]:string | undefined}}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* Left */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* UserCard */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="student" />
        </div>

        {/* MiddleChart */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* CountChart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>

          {/* AttendanceChart */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer/>
          </div>
        </div>

        {/* BottomChart */}
        <div className="w-full h-[500px]">
          <FinanceChart/>
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalandarContainer searchParams={searchParams}/>
        <Announcement/>
      </div>
    </div>
  );
};

export default AdminPage;
