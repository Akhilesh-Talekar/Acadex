"use client";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";



import React from "react";
import Image from "next/image";

const CountChart = ({boys, girls}: {boys:number, girls:number}) => {
  const data = [
    {
      name: "Total",
      count: boys+girls,
      fill: "white",
    },
    {
      name: "Boys",
      count: boys,
      fill: "#C3EBFA",
    },
    {
      name: "Girls",
      count: girls,
      fill: "#FAE27C",
    },
  ];

  return (
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
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image
        src={"/maleFemale.png"}
        alt="mf"
        width={50}
        height={50}
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default CountChart;
