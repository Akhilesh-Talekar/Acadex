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
import { AttendanceChartProps } from "../../types";

const AttendanceChart = ({data}: AttendanceChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart width={500} height={300} data={data} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
        />
        <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
        />
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
  );
};

export default AttendanceChart;
