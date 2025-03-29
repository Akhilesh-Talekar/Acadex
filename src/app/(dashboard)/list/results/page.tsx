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

// TypeScript interfaces
interface ResultItem {
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
}

interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface GraphData {
  averageData: Array<{ name: string; value: number; fill: string }>;
  passFailData: Array<{ name: string; value: number }>;
  distributionData: Array<{ range: string; frequency: number }>;
}

interface QueryParams {
  [key: string]: string | undefined;
}

interface SearchParams {
  [key: string]: string | undefined;
}

interface RoleData {
  role: string;
  currUserId?: string;
}

const ResultList = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  try {
    const { role, currUserId } = await getRole() as RoleData;
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    // Define columns outside of rendering logic
    const columns: Column[] = [
      { header: "Title", accessor: "title" },
      { header: "Student", accessor: "student" },
      { header: "Score", accessor: "score", className: "hidden md:table-cell" },
      { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
      { header: "Class", accessor: "class", className: "hidden md:table-cell" },
      { header: "Date", accessor: "date", className: "hidden md:table-cell" },
      {
        header: "Actions",
        accessor: "actions",
        className: `${role === "admin" || role === "teacher" ? "" : "hidden"}`,
      },
    ];

    // Build query conditions
    const { query, roleConditions } = buildQueryConditions(queryParams, role, currUserId);

    // Merge conditions
    mergeQueryConditions(query, roleConditions);

    // Execute queries in parallel with error handling
    const [data, count, graphData] = await Promise.all([
      fetchResultData(query, p),
      fetchResultCount(query),
      fetchGraphData(query)
    ]);

    // Process graph data only if we have results
    const { averageData, passFailData, distributionData } = processGraphData(graphData);

    return (
      <div className="p-4 m-4 mt-0 bg-white rounded-md flex-1">
        {/* TOP */}
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
              {(role === "admin" || role === "teacher") && (
                <FormContainer table="result" type="create" />
              )}
            </div>
          </div>
        </div>

        {/* RESULTS TABLE */}
        {data.length > 0 ? (
          <Table 
            columns={columns} 
            data={data} 
            renderRow={(item: ResultItem) => renderResultRow(item, role)} 
          />
        ) : (
          <div className="text-center py-8">No results found</div>
        )}

        {/* PAGINATION */}
        {count > 0 && <Pagination page={p} count={count} />}

        {/* GRAPHICAL REPRESENTATIONS - Only render if we have data */}
        {graphData.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            {/* BOTH CIRCULAR GRAPHS */}
            <div className="w-full h-[600px] md:w-1/2 lg:w-1/3 rounded-md flex flex-col gap-4 justify-between">
              {/* PIE CHART */}
              <div className="h-[48%] bg-gray-100 p-4 rounded-md flex-col gap-4">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold">Pass & Fail</h1>
                  <Image src={"/moreDark.png"} alt="more" height={20} width={20} />
                </div>

                <ResultPie data={passFailData} />

                {/* LABEL DIV */}
                <div className="flex justify-between gap-4 mx-4 relative bottom-8">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#c7f5a9]" />
                    <h2 className="text-xl font-semibold">Pass</h2>
                    <h2 className="text-s font-semibold">{Math.round(passFailData[0]?.value) || 0}%</h2>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#f5a9a9]" />
                    <h2 className="text-xl font-semibold">Fail</h2>
                    <h2 className="text-s font-semibold">{Math.round(passFailData[1]?.value) || 0}%</h2>
                  </div>
                </div>
              </div>

              {/* AVG GRAPH */}
              <div className="h-[48%] bg-gray-100 p-4 rounded-md flex-col gap-4">
                <ResultAverage data={averageData} />
              </div>
            </div>

            <div className="w-full h-[600px] md:w-1/2 lg:w-2/3 bg-gray-100 p-4 rounded-md flex-col gap-4">
              <div className="flex justify-between mb-6">
                <h1 className="text-xl font-semibold">Marks Distribution</h1>
                <Image src={"/moreDark.png"} alt="more" height={20} width={20} />
              </div>

              <ResultGraph data={distributionData} />
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

// Helper functions to improve readability and maintainability
function buildQueryConditions(
  queryParams: QueryParams, 
  role: string, 
  currUserId?: string
): { query: Prisma.ResultWhereInput; roleConditions: any[] } {
  const query: Prisma.ResultWhereInput = {};
  const roleConditions: any[] = [];

  // Process URL parameters
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
                name: { contains: value, mode: "insensitive" },
              },
            },
            {
              exam: {
                title: { contains: value, mode: "insensitive" },
              },
            },
            {
              assignment: {
                title: { contains: value, mode: "insensitive" },
              },
            },
          ];
          break;
      }
    }
  }

  // Apply role-based filters
  switch (role) {
    case "admin":
      // Admin sees all results
      break;
    case "teacher":
      if (currUserId) {
        roleConditions.push(
          {
            exam: {
              lesson: { teacherId: currUserId },
            },
          },
          {
            assignment: {
              lesson: { teacherId: currUserId },
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
        query.student = { parentId: currUserId };
      }
      break;
  }

  return { query, roleConditions };
}

function mergeQueryConditions(query: Prisma.ResultWhereInput, roleConditions: any[]): void {
  if (roleConditions.length === 0) return;

  if (query.OR) {
    // We have both search and role conditions
    query.AND = [{ OR: query.OR }, { OR: roleConditions }];
    delete query.OR; // Remove OR from root to prevent conflicts
  } else {
    // Just role conditions
    query.OR = roleConditions;
  }
}

async function fetchResultData(
  query: Prisma.ResultWhereInput, 
  page: number
): Promise<ResultItem[]> {
  try {
    // Use a select statement to only fetch fields we need
    const dataResp = await prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          select: {
            title: true,
            startTime: true,
            lesson: {
              select: {
                teacher: { select: { name: true, surname: true } },
                class: { select: { name: true } },
              },
            },
          },
        },
        assignment: {
          select: {
            title: true,
            startDate: true,
            lesson: {
              select: {
                teacher: { select: { name: true, surname: true } },
                class: { select: { name: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    });

    // Process the data to flatten structure
    return dataResp
      .map((item) => {
        const assessment = item.exam || item.assignment;
        if (!assessment) return null;

        const isExam = Boolean(item.exam);
        
        return {
          id: item.id,
          title: assessment.title || "Untitled",
          studentName: item.student?.name || "Unknown",
          studentSurname: item.student?.surname || "",
          teacherName: assessment.lesson?.teacher?.name || "Unknown",
          teacherSurname: assessment.lesson?.teacher?.surname || "",
          score: item.score || 0,
          className: assessment.lesson?.class?.name || "Unknown",
          startTime: isExam ? assessment.startTime : assessment.startDate,
          type: isExam ? "exam" : "assignment",
        };
      })
      .filter(Boolean) as ResultItem[];
  } catch (error) {
    console.error("Error fetching result data:", error);
    return [];
  }
}

async function fetchResultCount(query: Prisma.ResultWhereInput): Promise<number> {
  try {
    return await prisma.result.count({ where: query });
  } catch (error) {
    console.error("Error counting results:", error);
    return 0;
  }
}

interface ScoreData {
  score: number | null;
}

async function fetchGraphData(query: Prisma.ResultWhereInput): Promise<ScoreData[]> {
  try {
    // For graph data, we only need scores
    return await prisma.result.findMany({
      where: query,
      select: { score: true },
    });
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return [];
  }
}

function processGraphData(data: ScoreData[]): GraphData {
  // Only calculate if we have data
  if (!data.length) {
    return {
      averageData: [],
      passFailData: [],
      distributionData: []
    };
  }

  // Calculate the average score
  const totalScore = data.reduce((sum, item) => sum + (item.score || 0), 0);
  const average = data.length > 0 ? totalScore / data.length : 0;
  
  const averageData = [
    { name: "Average", value: average, fill: "#C3EBFA" },
    { name: "nonAverage", value: 100 - average, fill: "#FAE27C" }
  ];

  // Calculate pass/fail statistics
  const passCount = data.filter((item) => (item.score || 0) >= 40).length;
  const failCount = data.length - passCount;
  const passPercentage = data.length > 0 ? (passCount / data.length) * 100 : 0;
  const failPercentage = data.length > 0 ? (failCount / data.length) * 100 : 0;
  
  const passFailData = [
    { name: "Pass", value: passPercentage },
    { name: "Fail", value: failPercentage }
  ];

  // Calculate distribution
  const distributionData = [
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
  
  // Efficiently count frequencies
  data.forEach((item) => {
    const score = Math.min(Math.max(Math.floor(item.score || 0), 0), 100);
    const index = Math.min(Math.floor(score / 10), 9);
    distributionData[index].frequency++;
  });

  return { averageData, passFailData, distributionData };
}

function renderResultRow(item: ResultItem, role: string) {
  return (
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
        {(role === "admin" || role === "teacher") && (
          <>
            <FormContainer table="result" type="update" data={item} />
            <FormContainer table="result" type="delete" id={item.id} />
          </>
        )}
      </td>
    </tr>
  );
}

export default ResultList;