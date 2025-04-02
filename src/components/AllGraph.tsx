import prisma from "@/lib/prisma";
import Image from "next/image";
import React from "react";
import ResultPie from "./ResultPie";
import ResultAverage from "./ResultAverage";
import ResultGraph from "./ResultGraph";

const AllGraph = async () => {
  const graphData = await prisma.result.findMany({
    select: {
      score: true,
    },
  });


  // Pass & Fail Graph Data
  let totalData = graphData.length;
  let pass = graphData?.filter((item) => {
    return item.score >= 40;
  })

  let fail = totalData - pass.length;
  let passPercentage = Math.round((pass.length / totalData) * 100);
  let failPercentage = Math.round((fail / totalData) * 100);
  let passArr = [
    { name: "Pass", value: passPercentage },
    { name: "Fail", value: failPercentage },
  ];

  // Average Graph Data
  let totalScore = graphData?.reduce((acc, item) => {
    return acc + item.score;
  }
  , 0);
  let avgScore = Math.round(totalScore / totalData);
  let avgArr = [
    { name: "Average", value: avgScore, fill: "#C3EBFA" },
    { name: "Remaining", value: 100 - avgScore, fill: "#FAE27C" },
  ];

  // Marks Distribution Graph Data
  const distData = [
    { range: "0-10", frequency:0 },
    { range: "11-20", frequency:0 },
    { range: "21-30", frequency:0 },
    { range: "31-40", frequency:0 },
    { range: "41-50", frequency:0 },
    { range: "51-60", frequency:0 },
    { range: "61-70", frequency:0 },
    { range: "71-80", frequency:0 },
    { range: "81-90", frequency:0 },
    { range: "91-100", frequency:0 },
  ];

  graphData?.forEach((item) => {
    if (item.score <= 10) {
      distData[0].frequency += 1;
    } else if (item.score <= 20) {
      distData[1].frequency += 1;
    } else if (item.score <= 30) {
      distData[2].frequency += 1;
    } else if (item.score <= 40) {
      distData[3].frequency += 1;
    } else if (item.score <= 50) {
      distData[4].frequency += 1;
    } else if (item.score <= 60) {
      distData[5].frequency += 1;
    } else if (item.score <= 70) {
      distData[6].frequency += 1;
    } else if (item.score <= 80) {
      distData[7].frequency += 1;
    } else if (item.score <= 90) {
      distData[8].frequency += 1;
    } else if (item.score <= 100) {
      distData[9].frequency += 1;
    }
  });

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-4">
      {/* BOTH CIRCULAR GRAPHS */}
      <div className="w-full h-[600px] md:w-1/2 lg:w-1/3 rounded-md flex flex-col gap-4 justify-between">
        {/* PIE CHART */}
        <div className="h-[48%] bg-gray-100 p-4 rounded-md flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold">Pass & Fail</h1>
            <Image src={"/moreDark.png"} alt="more" height={20} width={20} />
          </div>

          <ResultPie data={passArr}/>

          {/* LABEL DIV */}
          <div className="flex justify-between gap-4 mx-4 relative bottom-8">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-[#c7f5a9]" />
              <h2 className="text-xl font-semibold">Pass</h2>
              <h2 className="text-s font-semibold">{`${passPercentage}%`}</h2>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-[#f5a9a9]" />
              <h2 className="text-xl font-semibold">Fail</h2>
              <h2 className="text-s font-semibold">{`${failPercentage}%`}</h2>
            </div>
          </div>
        </div>

        {/* AVG GRAPH */}
        <div className="h-[48%] bg-gray-100 p-4 rounded-md flex-col gap-4">
          <ResultAverage data={avgArr}/>
        </div>
      </div>

      <div className="w-full h-[600px] md:w-1/2 lg:w-2/3 bg-gray-100 p-4 rounded-md flex-col gap-4">
        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-semibold">Marks Distribution</h1>
          <Image src={"/moreDark.png"} alt="more" height={20} width={20} />
        </div>

        <ResultGraph data={distData}/>
      </div>
    </div>
  );
};

export default AllGraph;
