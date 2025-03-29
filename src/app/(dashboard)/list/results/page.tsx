import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import ResultAverage from "@/components/ResultAverage";
import ResultGraph from "@/components/ResultGraph";
import ResultPie from "@/components/ResultPie";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";

type ResultItem = {
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

type DistributionItem = {
  range: string;
  frequency: number;
};

type ChartItem = {
  name: string;
  value: number;
  fill?: string;
};

// Remove the ErrorBoundary - it's causing issues since this is a Server Component
const ResultList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  try {
    const { role, currUserId } = await getRole();
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    // Column definitions
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

    const renderRow = (item: ResultItem) => (
      <tr
        key={item.id}
        className="border-b border-gray-200 hover:bg-lamaPurpleLight even:bg-slate-50 text-sm"
      >
        <td>
          <div className="flex items-center justify-start gap-4 my-2">
            <h3 className="font-semibold">{item.title}</h3>
          </div>
        </td>
        <td className="mt-4">{`${item.studentName} ${item.studentSurname}`}</td>
        <td className="hidden md:table-cell mt-4">{item.score}</td>
        <td className="hidden md:table-cell mt-4">
          {`${item.teacherName} ${item.teacherSurname}`}
        </td>
        <td className="hidden md:table-cell mt-4">{item.className}</td>
        <td className="hidden md:table-cell mt-4">
          {item.startTime instanceof Date ? new Intl.DateTimeFormat("en-IN").format(item.startTime) : "N/A"}
        </td>
        <td className="flex items-center gap-2 my-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="result" type="update" data={item} />
              <FormContainer table="result" type="delete" id={item.id} />
            </>
          )}
        </td>
      </tr>
    );

    // URL PARAMS CONDITIONS
    const query: Prisma.ResultWhereInput = {};

    // Process query parameters
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
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
        }
      }
    }

    // Role-based conditions
    const roleConditions: Prisma.ResultWhereInput[] = [];

    switch (role) {
      case "admin":
        // No additional conditions for admin
        break;
      case "teacher":
        if (currUserId) {
          roleConditions.push(
            {
              exam: {
                lesson: {
                  teacherId: currUserId,
                },
              },
            },
            {
              assignment: {
                lesson: {
                  teacherId: currUserId,
                },
              },
            }
          );
        }
        break;
      case "student":
        if (currUserId) {
          query.studentId = currUserId;
        }
        break;
      case "parent":
        if (currUserId) {
          query.student = {
            parentId: currUserId,
          };
        }
        break;
    }

    // Merge search and role-based conditions
    if (query.OR && roleConditions.length) {
      query.AND = [{ OR: query.OR }, { OR: roleConditions }];
      delete query.OR;
    } else if (roleConditions.length) {
      query.OR = roleConditions;
    }

    // Efficiently fetch data using a transaction
    const [dataResp, count] = await prisma.$transaction([
      prisma.result.findMany({
        where: query,
        include: {
          student: true,
          exam: {
            include: {
              lesson: {
                include: {
                  teacher: true,
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
                  class: true,
                },
              },
            },
          },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.result.count({
        where: query,
      }),
    ]);

    // Map and filter out null values
    const data: ResultItem[] = dataResp
      .map((item) => {
        const assessment = item.exam || item.assignment;
        if (!assessment) return null;

        const isExam = Boolean(item.exam);
        const startTime = isExam 
          ? item.exam?.startTime 
          : item.assignment?.startDate;

        if (!startTime) return null;

        return {
          id: item.id,
          title: assessment.title,
          studentName: item.student.name,
          studentSurname: item.student.surname,
          teacherName: assessment.lesson.teacher.name,
          teacherSurname: assessment.lesson.teacher.surname,
          score: item.score,
          className: assessment.lesson.class.name,
          startTime,
          type: isExam ? "exam" : "assignment",
        };
      })
      .filter((item): item is ResultItem => item !== null);

    // Simplified data for graphs
    const dataGraph = await prisma.result.findMany({
      where: query,
      select: {
        score: true,
      },
    });

    // Calculate statistics only if there is data
    const scores = dataGraph.map(item => item.score);
    const totalCount = scores.length;

    // Average calculation with safeguards
    const average = totalCount > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / totalCount 
      : 0;
    
    const averageData: ChartItem[] = [
      { name: "Average", value: average, fill: "#C3EBFA" },
      { name: "nonAverage", value: 100 - average, fill: "#FAE27C" }
    ];

    // Pass/Fail statistics with safeguards
    const passCount = scores.filter(score => score >= 40).length;
    const failCount = totalCount - passCount;
    
    const passPercentage = totalCount > 0 ? (passCount / totalCount) * 100 : 0;
    const failPercentage = totalCount > 0 ? (failCount / totalCount) * 100 : 0;
    
    const passFailData: ChartItem[] = [
      { name: "Pass", value: passPercentage },
      { name: "Fail", value: failPercentage }
    ];

    // Score distribution calculation - initialize array once
    const distributionData: DistributionItem[] = [
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

    // Calculate frequency in a single pass
    scores.forEach(score => {
      const index = Math.min(Math.floor(score / 10), 9);
      distributionData[index].frequency++;
    });

    return (
      <div className="p-4 m-4 mt-0 bg-white rounded-md flex-1">
        {/* TOP SECTION */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold hidden md:block">All Results</h1>
          <div className="flex flex-col gap-4 md:flex-row items-center w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
                <Image src="/filter.png" alt="Filter" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
                <Image src="/sort.png" alt="Sort" width={14} height={14} />
              </button>
              {(role === "admin" || role === "teacher") && (
                <FormContainer table="result" type="create" />
              )}
            </div>
          </div>
        </div>

        {/* RESULTS TABLE */}
        <Table columns={columns} renderRow={renderRow} data={data} />

        {/* PAGINATION */}
        <Pagination page={p} count={count} />

        {/* GRAPHICAL REPRESENTATIONS */}
        {totalCount > 0 ? (
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            {/* CIRCULAR GRAPHS */}
            <div className="w-full h-[600px] md:w-1/2 lg:w-1/3 rounded-md flex flex-col gap-4 justify-between">
              {/* PIE CHART */}
              <div className="h-[48%] bg-gray-100 p-4 rounded-md flex-col gap-4">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold">Pass & Fail</h1>
                  <Image src="/moreDark.png" alt="More" height={20} width={20} />
                </div>

                <ResultPie data={passFailData} />

                {/* LABELS */}
                <div className="flex justify-between gap-4 mx-4 relative bottom-8">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#c7f5a9]" />
                    <h2 className="text-xl font-semibold">Pass</h2>
                    <h2 className="text-s font-semibold">{Math.round(passPercentage)}%</h2>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#f5a9a9]" />
                    <h2 className="text-xl font-semibold">Fail</h2>
                    <h2 className="text-s font-semibold">{Math.round(failPercentage)}%</h2>
                  </div>
                </div>
              </div>

              {/* AVERAGE CHART */}
              <div className="h-[48%] bg-gray-100 p-4 rounded-md flex-col gap-4">
                <ResultAverage data={averageData} />
              </div>
            </div>

            {/* MARKS DISTRIBUTION */}
            <div className="w-full h-[600px] md:w-1/2 lg:w-2/3 bg-gray-100 p-4 rounded-md flex-col gap-4">
              <div className="flex justify-between mb-6">
                <h1 className="text-xl font-semibold">Marks Distribution</h1>
                <Image src="/moreDark.png" alt="More" height={20} width={20} />
              </div>

              <ResultGraph data={distributionData} />
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-gray-50 rounded-md text-center">
            <p className="text-gray-500">No data available to display charts</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in ResultList component:", error);
    return (
      <div className="p-4 m-4 bg-red-50 rounded-md">
        <h2 className="text-lg font-semibold text-red-800">An error occurred</h2>
        <p className="text-red-600">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
};

export default ResultList;