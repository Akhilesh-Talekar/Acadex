import Image from "next/image";
import React from "react";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async() => {

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daySinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const lastMonday = new Date(today);

    lastMonday.setDate(today.getDate() - daySinceMonday);
   
    const respData = await prisma.attendance.findMany({
        where:{
            date:{
                gte: lastMonday,
            }
        },
        select:{
            date: true,
            present: true,
        }
    });

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    const attendanceMap: {[key:string]:{present:number; absent:number}} = {
        Mon: {present: 0, absent: 0},
        Tue: {present: 0, absent: 0},
        Wed: {present: 0, absent: 0},
        Thu: {present: 0, absent: 0},
        Fri: {present: 0, absent: 0},
    };

    respData.forEach(item => {
        const itemDate = new Date(item.date);
        const itemDay = itemDate.getDay();

        if(itemDay >= 1 && itemDay <= 5){
            const dayName = daysOfWeek[itemDay - 1];

            if(item.present){
                attendanceMap[dayName].present++;
            }
            else{
                attendanceMap[dayName].absent++;
            }
        }
    })

    const data = daysOfWeek.map(day => ({
        name: day,
        present: attendanceMap[day].present,
        absent: attendanceMap[day].absent,
    }))

  return (
    <div className="w-full h-full bg-white rounded-xl p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src={"/moreDark.png"} alt="more" width={20} height={20} />
      </div>
      <AttendanceChart data={data}/>
    </div>
  );
};

export default AttendanceChartContainer;
