"use client";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Total",
    count: 100,
    fill: "white",
  },
  {
    name: "Boys",
    count: 80,
    fill: "#C3EBFA",
  },
  {
    name: "Girls",
    count: 20,
    fill: "#FAE27C",
  },
];

import React from "react";
import Image from "next/image";

const CountChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-large font-semibold">Students</h1>
        <Image src={"/moreDark.png"} alt="more" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="w-full h-[75%] relative">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar
              background
              dataKey="count"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image src={"/maleFemale.png"} alt="mf" width={50} height={50} className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"/>
      </div>

      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">80</h1>
          <h2 className="text-xs text-gray">Boys (80%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">20</h1>
          <h2 className="text-xs text-gray">Girls (20%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
