import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "../../../../lib/settings";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { role } from "@/lib/utils";

type teacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const columns = [
  {
    header: "Info",
    accessor: "info",
  },

  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },

  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },

  {
    header: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell",
  },

  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },

  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },

  {
    header: "Actions",
    accessor: "actions",
    className: `${role === "admin" || role ==="teacher" ? "" : "hidden"}`,
  },
];

const renderRow = (item: teacherList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 hover:bg-lamaPurpleLight even:bg-slate-50 text-sm"
  >
    <td>
      <div className="flex items-center justify-start gap-4 my-2">
        <Image
          src={item.img || "/noAvatar.png"}
          alt="teacher"
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </div>
    </td>
    <td className="hidden md:table-cell mt-4">{item.username}</td>
    <td className="hidden md:table-cell mt-4">
      {item.subjects
        .map((subject) => {
          return subject.name;
        })
        .join(",")}
    </td>
    <td className="hidden md:table-cell mt-4">
      {item.classes
        .map((classItem) => {
          return classItem.name;
        })
        .join(",")}
    </td>
    <td className="hidden lg:table-cell mt-4">{item.phone}</td>
    <td className="hidden lg:table-cell mt-4">{item.address}</td>
    <td className="flex items-center gap-2 mt-4">
      <Link href={`/list/teachers/${item.id}`}>
        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
          <Image src={"/view.png"} alt="" width={16} height={16} />
        </button>
      </Link>

      {role === "admin" && (
        <FormModal table="teacher" type="delete" id={item.id} />
      )}
    </td>
  </tr>
);

const TeacherList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITIONS

  const query: Prisma.TeacherWhereInput = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "classId": 
          query.lessons =  {
            some: {
              classId: parseInt(value),
            }
          }
          break;
        
        case "search": 
          query.name = {
            contains: value,
            mode: "insensitive",
          }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
        lessons: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),

    prisma.teacher.count({
      where: query,
    }),
  ]);

  return (
    <div className="p-4 m-4 mt-0 bg-white rounded-md flex-1">
      {/*TOP*/}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold hidden md:block">All Teachers</h1>
        <div className="flex flex-col gap-4 md:flex-row items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
              <Image src={"/filter.png"} alt="fltr" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
              <Image src={"/sort.png"} alt="fltr" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="teacher" type="create" />}
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

export default TeacherList;
