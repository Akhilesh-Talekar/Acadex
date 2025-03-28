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
        {new Intl.DateTimeFormat("en-IN").format(item.startTime)}
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
    }),

    prisma.result.count({
      where: query,
    }),
  ]);

  const data = dataResp.map((item) => {
    const assesment = item.exam || item.assignment;

    if (!assesment) return null;

    const isExam = "startTime" in assesment;
    return {
      id: item.id,
      title: assesment.title,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assesment.lesson.teacher.name,
      teacherSurname: assesment.lesson.teacher.surname,
      score: item.score,
      className: assesment.lesson.class.name,
      startTime: isExam ? assesment.startTime : assesment.startDate,
      type: isExam ? "exam" : "assignment",
    };
  });

  //Prisma Query For Graphical Representations
  const dataGraph = await prisma.result.findMany({
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

  //Average Chart Operations
  let averageData = [];
  let marksCount = dataGraph.reduce((acc, item) => {
    return acc + item.score;
  },0)
  let average = marksCount / dataGraph.length;
  averageData = [{ name: "Average", value: average, fill: "#C3EBFA" }, { name: "nonAverage", value: 100 - average, fill: "#FAE27C" }];

  //Pass Fail Chart Operations
  let passFailData = [];
  let passCount = dataGraph.filter((item) => item.score >= 40).length;
  let failCount = dataGraph.length - passCount;
  let passPercentage = (passCount / dataGraph.length) * 100;
  let failPercentage = (failCount / dataGraph.length) * 100;
  passFailData = [{ name: "Pass", value: passPercentage }, { name: "Fail", value: failPercentage }];

  //Mark Distribution Chart Operations
  let marksDistribution = [];
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
  dataGraph.forEach((item) => {
    if(item.score >= 0 && item.score <= 10){
      distributionData[0].frequency++;
    }
    else if(item.score >= 11 && item.score <= 20){
      distributionData[1].frequency++;
    }
    else if(item.score >= 21 && item.score <= 30){
      distributionData[2].frequency++;
    }
    else if(item.score >= 31 && item.score <= 40){
      distributionData[3].frequency++;
    }
    else if(item.score >= 41 && item.score <= 50){
      distributionData[4].frequency++;
    }
    else if(item.score >= 51 && item.score <= 60){
      distributionData[5].frequency++;
    }
    else if(item.score >= 61 && item.score <= 70){
      distributionData[6].frequency++;
    }
    else if(item.score >= 71 && item.score <= 80){
      distributionData[7].frequency++;
    }
    else if(item.score >= 81 && item.score <= 90){
      distributionData[8].frequency++;
    }
    else if(item.score >= 91 && item.score <= 100){
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
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/*PAGINATION*/}
      <Pagination page={p} count={count} />

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
    </div>
  );
};

export default ResultList;
