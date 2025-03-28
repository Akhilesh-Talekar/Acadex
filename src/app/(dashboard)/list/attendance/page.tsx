import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { attendanceStyle, ITEM_PER_PAGE } from "@/lib/settings";
import { getRole } from "@/lib/utils";
import {
  Announcement,
  Attendance,
  Class,
  Lesson,
  Prisma,
  Student,
  Subject,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import clsx from "clsx";

// const attendanceStyle = {
//   present: {
//     borderColor: "border-green-500",
//     dotColor: "bg-green-500",
//     textColour: "text-green-700",
//     backGroundColor: "bg-green-50",
//   },

//   absent: {
//     borderColor: "border-red-500",
//     dotColor: "bg-red-500",
//     textColour: "text-red-700",
//     backGroundColor: "bg-red-50",
//   },
// };

type attendanceList = Attendance & { student: Student } & {
  lesson: Lesson & { subject: Subject };
};

const AttendanceStatus = ({ status }: { status: boolean }) => {
  let present = status ? "present" : "absent";
  const { borderColor, dotColor, textColour, backGroundColor } =
    attendanceStyle[present as keyof typeof attendanceStyle];

  return (
    <div
      className={clsx(
        "rounded-md p-2 flex items-center justify-center gap-2 border w-[90px]",
        backGroundColor,
        borderColor
      )}
    >
      <div className={clsx("rounded-full w-2 h-2", dotColor)} />
      <p className={clsx("text-sm", textColour)}>
        {status ? "Present" : "Absent"}
      </p>
    </div>
  );
};

const AttendanceList = async ({
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
      header: "Student Name",
      accessor: "studentName",
    },

    {
      header: "Subject Name",
      accessor: "subjectName",
      className: "hidden md:table-cell",
    },

    {
      header: "Lesson",
      accessor: "lesson",
      className: "hidden lg:table-cell",
    },

    {
      header: "Date",
      accessor: "date",
    },

    {
      header: "Present",
      accessor: "present",
    },

    {
      header: "Actions",
      accessor: "actions",
      className: `${role === "admin" ? "" : "hidden"}`,
    },
  ];

  const renderRow = (item: attendanceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 hover:bg-lamaPurpleLight even:bg-slate-50 text-sm"
    >
      <td>
        <div className="flex items-center justify-start gap-4 my-2">
          <div className="flex flex-col">
            <h3 className="font-semibold">
              {item.student.name + "    " + item.student.surname}
            </h3>
          </div>
        </div>
      </td>
      <td className="mt-4 hidden md:table-cell">
        {item.lesson.subject.name || "-"}
      </td>
      <td className="mt-4 hidden lg:table-cell">{item.lesson.name || "-"}</td>
      <td className="mt-4">
        {new Date(item.date).toLocaleDateString("en-IN")}
      </td>
      <td className="mt-4">
        <AttendanceStatus status={item.present} />
      </td>
      <td className="flex items-center gap-2 my-2">
        {(role === "admin" || role === "teacher") && (
          <>
            <FormContainer table="attendance" type="update" data={item} />
            <FormContainer table="attendance" type="delete" id={item.id} />
          </>
        )}
      </td>
    </tr>
  );

  //URL PARAMS CONDITIONS

  const query: Prisma.AttendanceWhereInput = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
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
              lesson: {
                subject: {
                  name: {
                    contains: value,
                    mode: "insensitive",
                  },
                }
              }
            },
          ];
          break;

        default:
          break;
      }
    }
  }

    // Role Conditions

    switch (role) {
      case "admin":
        break;

      case "teacher":
        query.lesson = {
          teacherId: currUserId!,
        }
        break;

      case "student":
        query.studentId = currUserId!;
        break;

      case "parent":
        query.student = {
          parentId : currUserId!
        }
        break;
    }

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: true,
        lesson: {
          include: {
            subject: true,
            teacher: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),

    prisma.attendance.count({}),
  ]);
  return (
    <div className="p-4 m-4 mt-0 bg-white rounded-md flex-1">
      {/*TOP*/}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold hidden md:block">
          All Attendances
        </h1>
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
              <FormContainer table="attendance" type="create" />
            )}
          </div>
        </div>
      </div>

      {/*TEACHER LIST*/}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/*PAGINATION*/}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceList;
