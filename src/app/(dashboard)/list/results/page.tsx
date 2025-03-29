import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import ResultAverage from "@/components/ResultAverage";
import ResultGraph from "@/components/ResultGraph";
import ResultPie from "@/components/ResultPie";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole } from "@/lib/utils";
import {
  Assignment,
  Class,
  Exam,
  Lesson,
  Prisma,
  Result,
  Student,
  Subject,
  Teacher,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type resultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
  type: "exam" | "assignment";
};

const ResultList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  try {
    const { role, currUserId } = await getRole();
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    //RenderRow and Column
    const columns = [
      {
        header: "Title",
        accessor: "title",
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
        className: `${role === "admin" || role === "teacher" ? "" : "hidden"}`,
      },
    ];

    const renderRow = (item: resultList) => (
      <tr
        key={item.id}
        className="border-b border-gray-200 hover:bg-lamaPurpleLight even:bg-slate-50 text-sm"
      >
        <td>
          <div className="flex items-center justify-start gap-4 my-2">
            <h3 className="font-semibold">{item.title}</h3>
          </div>
        </td>
        <td className="mt-4">{item.studentName + " " + item.studentSurname}</td>
        <td className="hidden md:table-cell mt-4">{item.score}</td>
        <td className="hidden md:table-cell mt-4">
          {item.teacherName + " " + item.teacherSurname}
        </td>
        <td className="hidden md:table-cell mt-4">{item.className}</td>
        <td className="hidden md:table-cell mt-4">
          {item.startTime ? new Intl.DateTimeFormat("en-IN").format(item.startTime) : "N/A"}
        </td>
        <td className="flex items-center gap-2 my-2">
          {(role === "admin" ||
            role === "teacher") && (
              <>
                <FormContainer table="result" type="update" data={item} />
                <FormContainer table="result" type="delete" id={item.id} />
              </>
            )}
        </td>
      </tr>
    );

    //URL PARAMS CONDITIONS
    const query: Prisma.ResultWhereInput = {};

    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;

          case "search":
            query.OR = [
              {
                student: {
                  name: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
              },
              {
                exam: {
                  title: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
              },
              {
                assignment: {
                  title: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
              },
            ];
            break;

          default:
            break;
        }
      }
    }

    // Store role-based OR conditions separately
    let roleConditions: any[] = [];

    switch (role) {
      case "admin":
        break;

      case "teacher":
        roleConditions = [
          {
            exam: {
              lesson: {
                teacherId: currUserId!,
              },
            },
          },
          {
            assignment: {
              lesson: {
                teacherId: currUserId!,
              },
            },
          },
        ];
        break;

      case "student":
        query.studentId = currUserId!;
        break;

      case "parent":
        query.student = {
          parentId: currUserId!,
        };
        break;
    }

    // Merge search and role-based OR conditions (if they exist)
    if (query.OR && roleConditions.length) {
      query.AND = [{ OR: query.OR }, { OR: roleConditions }];
      delete query.OR; // Remove OR from root to prevent conflicts
    } else if (roleConditions.length) {
      query.OR = roleConditions; // If no search, just apply role conditions
    }

    // Split the transaction to avoid potential timeout issues
    let dataResp:any[] = [];
    let count = 0;
    
    try {
      dataResp = await prisma.result.findMany({
        where: query,
        include: {
          student: true,
          exam: {
            include: {
              lesson: {
                include: {
                  teacher: true,
                  subject: true,
                  class: true,
                },
              },
            },
          },
          assignment: {
            include: {
              lesson: {
                include: {
                  teacher: true,
                  subject: true,
                  class: true,
                },
              },
            },
          },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      });
    } catch (error) {
      console.error("Error fetching result data:", error);
      dataResp = [];
    }

    try {
      count = await prisma.result.count({
        where: query,
      });
    } catch (error) {
      console.error("Error counting results:", error);
      count = 0;
    }

    // Filter out null values and handle potential data issues
    const data = dataResp.map((item) => {
      const assesment = item.exam || item.assignment;

      if (!assesment) return null;

      const isExam = "startTime" in assesment;
      
      try {
        return {
          id: item.id,
          title: assesment.title || "Untitled",
          studentName: item.student?.name || "Unknown",
          studentSurname: item.student?.surname || "",
          teacherName: assesment.lesson?.teacher?.name || "Unknown",
          teacherSurname: assesment.lesson?.teacher?.surname || "",
          score: item.score || 0,
          className: assesment.lesson?.class?.name || "Unknown",
          startTime: isExam ? assesment.startTime : assesment.startDate,
          type: isExam ? "exam" : "assignment",
        };
      } catch (error) {
        console.error("Error processing result item:", error);
        return null;
      }
    }).filter(Boolean);

    //Prisma Query For Graphical Representations - with error handling
    let dataGraph:any[] = [];
    try {
      dataGraph = await prisma.result.findMany({
        where: query,
        include: {
          student: true,
          exam: {
            include: {
              lesson: {
                include: {
                  teacher: true,
                  subject: true,
                  class: true,
                },
              },
            },
          },
          assignment: {
            include: {
              lesson: {
                include: {
                  teacher: true,
                  subject: true,
                  class: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching graph data:", error);
      dataGraph = [];
    }

    //Average Chart Operations with null checks
    let averageData = [];
    let marksCount = dataGraph.reduce((acc, item) => {
      return acc + (item.score || 0);
    }, 0);
    
    let average = dataGraph.length > 0 ? marksCount / dataGraph.length : 0;
    averageData = [
      { name: "Average", value: average, fill: "#C3EBFA" }, 
      { name: "nonAverage", value: 100 - average, fill: "#FAE27C" }
    ];

    //Pass Fail Chart Operations with null checks
    let passFailData = [];
    let passCount = dataGraph.filter((item) => (item.score || 0) >= 40).length;
    let failCount = dataGraph.length - passCount;
    let passPercentage = dataGraph.length > 0 ? (passCount / dataGraph.length) * 100 : 0;
    let failPercentage = dataGraph.length > 0 ? (failCount / dataGraph.length) * 100 : 0;
    
    passFailData = [
      { name: "Pass", value: passPercentage }, 
      { name: "Fail", value: failPercentage }
    ];

    //Mark Distribution Chart Operations with null checks
    let distributionData = [
      { range: "0-10", frequency: 0 },
      { range: "11-20", frequency: 0 },
      { range: "21-30", frequency: 0 },
      { range: "31-40", frequency: 0 },
      { range: "41-50", frequency: 0 },
      { range: "51-60", frequency: 0 },
      { range: "61-70", frequency: 0 },
      { range: "71-80", frequency: 0 },
      { range: "81-90", frequency: 0 },
      { range: "91-100", frequency: 0 },
    ];
    
    dataGraph.forEach((item) => {
      const score = item.score || 0;
      if(score >= 0 && score <= 10){
        distributionData[0].frequency++;
      }
      else if(score >= 11 && score <= 20){
        distributionData[1].frequency++;
      }
      else if(score >= 21 && score <= 30){
        distributionData[2].frequency++;
      }
      else if(score >= 31 && score <= 40){
        distributionData[3].frequency++;
      }
      else if(score >= 41 && score <= 50){
        distributionData[4].frequency++;
      }
      else if(score >= 51 && score <= 60){
        distributionData[5].frequency++;
      }
      else if(score >= 61 && score <= 70){
        distributionData[6].frequency++;
      }
      else if(score >= 71 && score <= 80){
        distributionData[7].frequency++;
      }
      else if(score >= 81 && score <= 90){
        distributionData[8].frequency++;
      }
      else if(score >= 91 && score <= 100){
        distributionData[9].frequency++;
      }
    });

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
              {(role === "admin" ||
                role === "teacher") && (
                  <FormContainer table="result" type="create" />
                )}
            </div>
          </div>
        </div>

        {/*TEACHER LIST*/}
        {data.length > 0 ? (
          <Table columns={columns} renderRow={renderRow} data={data} />
        ) : (
          <div className="text-center py-8">No results found</div>
        )}

        {/*PAGINATION*/}
        {count > 0 && <Pagination page={p} count={count} />}

        {/* GRAPHICAL REPRESENTSTIONS - Only render if we have data */}
        {dataGraph.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            {/* BOTH CIRCULAR GRAPHS */}
            <div className="w-full h-[600px] md:w-1/2 lg:w-1/3 rounded-md flex flex-col gap-4 justify-between">
              {/* PIE CHART */}
              <div className="h-[48%] bg-gray-100 p-4 rounded-md flex-col gap-4">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold">Pass & Fail</h1>
                  <Image src={"/moreDark.png"} alt="more" height={20} width={20} />
                </div>

                <ResultPie data={passFailData}/>

                {/* LABEL DIV */}
                <div className="flex justify-between gap-4 mx-4 relative bottom-8">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#c7f5a9]" />
                    <h2 className="text-xl font-semibold">Pass</h2>
                    <h2 className="text-s font-semibold">{Math.round(passPercentage) || 0}%</h2>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#f5a9a9]" />
                    <h2 className="text-xl font-semibold">Fail</h2>
                    <h2 className="text-s font-semibold">{Math.round(failPercentage) || 0}%</h2>
                  </div>
                </div>
              </div>

              {/* AVG GRAPH */}
              <div className="h-[48%] bg-gray-100 p-4 rounded-md flex-col gap-4">
                <ResultAverage data={averageData}/>
              </div>
            </div>

            <div className="w-full h-[600px] md:w-1/2 lg:w-2/3 bg-gray-100 p-4 rounded-md flex-col gap-4">
              <div className="flex justify-between mb-6">
                <h1 className="text-xl font-semibold">Marks Distribution</h1>
                <Image src={"/moreDark.png"} alt="more" height={20} width={20} />
              </div>

              <ResultGraph data={distributionData}/>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Fatal error in ResultList component:", error);
    return (
      <div className="p-4 m-4 mt-0 bg-white rounded-md flex-1">
        <h1 className="text-lg font-semibold">Error Loading Results</h1>
        <p>Sorry, there was a problem loading the results data. Please try refreshing the page.</p>
      </div>
    );
  }
};

export default ResultList;