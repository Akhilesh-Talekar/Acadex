"use client";
import Image from "next/image";
import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", present: 78, absent: 22 }, // Total 100
  { name: "Tue", present: 85, absent: 15 }, // Total 100
  { name: "Wed", present: 10, absent: 90 }, // Mass bunk scenario
  { name: "Thu", present: 72, absent: 28 }, // Total 100
  { name: "Fri", present: 90, absent: 10 }, // Total 100
];

const AttendanceChart = () => {
  return (
    <div className="w-full h-full bg-white rounded-xl p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src={"/moreDark.png"} alt="more" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="name" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
          <YAxis  axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
          <Tooltip contentStyle={{borderRadius:"10px", borderColor:"lightgray"}}/>
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "20px" }}
            iconType="circle"
          />
          <Bar
            dataKey="present"
            fill="#C3EBFA"
            activeBar={<Rectangle fill="#C3EBFA" stroke="#C3EBFA" />}
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="#FAE27C"
            activeBar={<Rectangle fill="#FAE27C" stroke="#FAE27C" />}
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
