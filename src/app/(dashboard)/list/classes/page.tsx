import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { classesData, role, subjectsData, teachersData } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Grade, Prisma, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type classList = Class & { supervisor: Teacher } & {grade: Grade};

const columns = [
  {
    header: "Class Name",
    accessor: "name",
  },

  {
    header: "Capacity",
    accessor: "capacity",
    className: "hidden md:table-cell",
  },

  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell",
  },

  {
    header: "Supervisor",
    accessor: "supervisor",
    className: "hidden md:table-cell",
  },

  {
    header: "Actions",
    accessor: "actions",
  },
];

const renderRow = (item: classList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 hover:bg-lamaPurpleLight even:bg-slate-50 text-sm"
  >
    <td>
      <div className="flex items-center justify-start gap-4 my-2">
        <h3 className="font-semibold">{item.name}</h3>
      </div>
    </td>
    <td className="hidden md:table-cell mt-4">{item.capacity}</td>
    <td className="hidden md:table-cell mt-4">{item.grade.level}</td>
    <td className="hidden md:table-cell mt-4">{item.supervisor.name + " " + item.supervisor.surname}</td>
    <td className="flex items-center gap-2 my-2">

      {role === "admin" && (
        <>
          <FormModal table="class" type="update" data={item}/>
          <FormModal table="class" type="delete" id={item.id}/>
        </>
      )}
    </td>
  </tr>
);

const ClassList = async({searchParams}: {searchParams:{[key:string]:string | undefined}}) => {
  
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITIONS

  const query: Prisma.ClassWhereInput = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "supervisorId":
          query.supervisorId = value;
          break;

        case "search":
          query.name = {
            contains: value,
            mode: "insensitive",
          };
          break;

        default:
          break;
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
        grade: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),

    prisma.class.count({
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
            {role === "admin" && (
              <FormModal table="class" type="create"/>
            )}
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

export default ClassList;
