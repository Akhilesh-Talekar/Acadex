"use client";
import { getRandomInRange } from "@/lib/utils";
import Image from "next/image";
import React, { PureComponent, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";



const Preformance = ({data, random}:{data:any[], random:number}) => {


  const defaultData = [
    { name: "Group A", value: random, fill: "#C3EBFA" },
    { name: "Group B", value: 100 - random, fill: "#FAE27C" },
  ];

  let finalData = data.length > 0 ? data : defaultData;

  

  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Performance</h1>
        <Image src={'/moreDark.png'} alt="more" width={16} height={16}/>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={finalData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">{finalData[0]?.value}</h1>
        <p className="text-sm text-gray-400">of 100 max LTS</p>
      </div>
      <h1 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">1st Semester - 2nd Semester</h1>
    </div>
  );
};

export default Preformance;
