"use client";
import Image from "next/image";
import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

// const data = [
//   { name: "Group A", value: 66, fill: "#C3EBFA" },
//   { name: "Group B", value: 34, fill: "#FAE27C" },
// ];

const ResultAverage = ({data}:{data:any[]}) => {
  return (
    <div className="rounded-md h-full relative">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Average Marks</h1>
        <Image src={'/moreDark.png'} alt="more" width={20} height={20}/>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">{Math.round(data[0]?.value) || 0}</h1>
        <p className="text-sm">of 100 marks</p>
      </div>
      <h1 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">1st Semester - 2nd Semester</h1>
    </div>
  );
};

export default ResultAverage;
