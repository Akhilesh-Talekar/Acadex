"use client";

import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


// const data = [
//   { range: "0-10", frequency: 1 },
//   { range: "11-20", frequency: 3 },
//   { range: "21-30", frequency: 5 },
//   { range: "31-40", frequency: 8 },
//   { range: "41-50", frequency: 12 },
//   { range: "51-60", frequency: 18 },
//   { range: "61-70", frequency: 24 },
//   { range: "71-80", frequency: 30 },
//   { range: "81-90", frequency: 25 },
//   { range: "91-100", frequency: 20 },
// ];


const ResultGraph = ({data}:{data:any[]}) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
        <XAxis dataKey="range" tick={{ fill: "#d1d5db" }} tickLine={false} axisLine={false} tickMargin={10}/>
        <YAxis tick={{ fill: "#d1d5db" }} tickLine={false} axisLine={false} tickMargin={10}/>
        <Tooltip />
        <Area type="monotone" dataKey="frequency" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ResultGraph;
