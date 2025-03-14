import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import ResultAverage from "@/components/ResultAverage";
import ResultGraph from "@/components/ResultGraph";
import ResultPie from "@/components/ResultPie";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { resultsData, role, subjectsData, teachersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Result = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  student: string;
  date: string;
  type: "exam" | "assignment";
  score: number;
};

const columns = [
  {
    header: "Subject Name",
    accessor: "info",
  },

  {
    header: "Student",
    accessor: "student",
  },

  {
    header: "Score",
    accessor: "score",
    className: "hidden md:table-cell",
  },

  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },

  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
  },

  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },

  {
    header: "Actions",
    accessor: "actions",
  },
];

const ResultList = () => {
  const renderRow = (item: Result) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 hover:bg-lamaPurpleLight even:bg-slate-50 text-sm"
    >
      <td>
        <div className="flex items-center justify-start gap-4 my-2">
          <h3 className="font-semibold">{item.subject}</h3>
        </div>
      </td>
      <td className="mt-4">{item.student}</td>
      <td className="hidden md:table-cell mt-4">{item.score}</td>
      <td className="hidden md:table-cell mt-4">{item.teacher}</td>
      <td className="hidden md:table-cell mt-4">{item.class}</td>
      <td className="hidden md:table-cell mt-4">{item.date}</td>
      <td className="flex items-center gap-2 my-2">
        {role === "admin" && (
          <>
            <FormModal table="result" type="update" data={item} />
            <FormModal table="result" type="delete" id={item.id} />
          </>
        )}
      </td>
    </tr>
  );

  return (
    <div className="p-4 m-4 mt-0 bg-white rounded-md flex-1">
      {/*TOP*/}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold hidden md:block">All Results</h1>
        <div className="flex flex-col gap-4 md:flex-row items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
              <Image src={"/filter.png"} alt="fltr" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
              <Image src={"/sort.png"} alt="fltr" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="result" type="create" />}
          </div>
        </div>
      </div>

      {/*TEACHER LIST*/}
      <Table columns={columns} renderRow={renderRow} data={resultsData} />

      {/*PAGINATION*/}
      <Pagination />

      {/* GRAPHICAL REPRESENTSTIONS */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* BOTH CIRCULAR GRAPHS */}
        <div className="w-full h-[600px] md:w-1/2 lg:w-1/3 rounded-md flex flex-col gap-4 justify-between">
          {/* PIE CHART */}
          <div className="h-[48%] bg-gray-100 p-4 rounded-md flex-col gap-4">
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold">Pass & Fail</h1>
              <Image src={"/moreDark.png"} alt="more" height={20} width={20} />
            </div>

            <ResultPie />

            {/* LABEL DIV */}
            <div className="flex justify-between gap-4 mx-4 relative bottom-8">
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[#c7f5a9]" />
                <h2 className="text-xl font-semibold">Pass</h2>
                <h2 className="text-s font-semibold">86%</h2>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[#f5a9a9]" />
                <h2 className="text-xl font-semibold">Fail</h2>
                <h2 className="text-s font-semibold">14%</h2>
              </div>
            </div>
          </div>

          {/* AVG GRAPH */}
          <div className="h-[48%] bg-gray-100 p-4 rounded-md flex-col gap-4">
            <ResultAverage />
          </div>
        </div>

        <div className="w-full h-[600px] md:w-1/2 lg:w-2/3 bg-gray-100 p-4 rounded-md flex-col gap-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Marks Distribution</h1>
            <Image src={"/moreDark.png"} alt="more" height={20} width={20} />
          </div>

          <ResultGraph />
        </div>
      </div>
    </div>
  );
};

export default ResultList;
