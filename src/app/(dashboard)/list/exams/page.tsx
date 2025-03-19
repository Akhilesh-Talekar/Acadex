import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { currUserId, role } from "@/lib/utils";
import { Class, Exam, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type examList = Exam & {lesson: {
  subject: Subject,
  teacher: Teacher,
  class: Class
}}

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },

  {
    header: "Class",
    accessor: "class",
  },

  {
    header: "Teacher",
    accessor: "teachers",
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

const renderRow = (item: examList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 hover:bg-lamaPurpleLight even:bg-slate-50 text-sm"
  >
    <td>
      <div className="flex items-center justify-start gap-4 my-2">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.lesson.subject.name}</h3>
        </div>
      </div>
    </td>
    <td className="mt-4">{item.lesson.class.name}</td>
    <td className="hidden md:table-cell mt-4">{item.lesson.teacher.name}</td>
    <td className="hidden md:table-cell mt-4">{new Intl.DateTimeFormat("en-IN").format(item.startTime)}</td>
    <td className="flex items-center gap-2 my-2">
      {role === "admin" || role === "teacher" && (
        <>
          <FormModal table="exam" type="update" data={item} />
          <FormModal table="exam" type="delete" id={item.id} />
        </>
      )}
    </td>
  </tr>
);

const LessonList = async({searchParams}: {searchParams:{[key:string]:string | undefined}}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITIONS

  const query: Prisma.ExamWhereInput = {};
  query.lesson = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "teacherId":
          query.lesson. teacherId =  value;
          break;

        case "classId":
          query.lesson.classId =  parseInt(value);
          break;

        case "search":
          query.lesson.subject =  {
              name: {
                contains: value,
                mode: "insensitive",
              },
            };
          break;

        default:
          break;
      }
    }
  }

  //Role Conditions

  switch(role) {
    case "admin":
      break;

    case "teacher":
      query.lesson.teacherId = currUserId!;
      break;

    case "student":
      query.lesson.class = {
        students: {
          some: {
            id: currUserId!,
          },
        },
      }
      break;

    case "parent":
      query.lesson.class = {
        students: {
          some: {
            parentId: currUserId!,
          }
        }
      }
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: true,
            teacher: true,
            class: true,
          },
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),

    prisma.exam.count({
      where: query,
    }),
  ]);
  return (
    <div className="p-4 m-4 mt-0 bg-white rounded-md flex-1">
      {/*TOP*/}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold hidden md:block">All Exams</h1>
        <div className="flex flex-col gap-4 md:flex-row items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
              <Image src={"/filter.png"} alt="fltr" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
              <Image src={"/sort.png"} alt="fltr" width={14} height={14} />
            </button>
            {role === "admin" || role === "teacher"  && <FormModal table="exam" type="create" />}
          </div>
        </div>
      </div>

      {/*TEACHER LIST*/}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/*PAGINATION*/}
      <Pagination page={p} count={count}/>
    </div>
  );
};

export default LessonList;
