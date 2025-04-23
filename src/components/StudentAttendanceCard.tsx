import prisma from "@/lib/prisma";
import React from "react";

const StudentAttendanceCard = async ({id}:{id:string}) => {
    
    const attendance = await prisma.attendance.findMany({
        where:{
            studentId: id
        }
    });

    const totalDays = attendance.length;
    const presentDays = attendance?.filter((a) => {
        return a.present === true;
    }).length;

    const percentage = Math.round((presentDays/totalDays)*100);

  return (
    <div>
      <h1 className="text-xl font-semibold">{percentage ? percentage + "%" : "0%"}</h1>
      <span className="text-sm text-gray-400">Attendance</span>
    </div>
  );
};

export default StudentAttendanceCard;
