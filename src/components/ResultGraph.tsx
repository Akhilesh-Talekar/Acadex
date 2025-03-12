"use client";

import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { range: "0-10", frequency: 2 },
  { range: "11-20", frequency: 5 },
  { range: "21-30", frequency: 8 },
  { range: "31-40", frequency: 15 },
  { range: "41-50", frequency: 22 },
  { range: "51-60", frequency: 30 },
  { range: "61-70", frequency: 24 },
  { range: "71-80", frequency: 18 },
  { range: "81-90", frequency: 10 },
  { range: "91-100", frequency: 5 },
];

const ResultGraph = () => {
  return (
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="range" tick={{ fill: "#d1d5db" }} tickLine={false} axisLine={false} tickMargin={10}/>
          <YAxis tick={{ fill: "#d1d5db" }} tickLine={false} axisLine={false} tickMargin={10}/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="frequency" stroke="#82ca9d" strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
  );
};

export default ResultGraph;
