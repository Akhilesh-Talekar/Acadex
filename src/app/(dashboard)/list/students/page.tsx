import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole } from "@/lib/utils";
import { Class, Grade, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type studentList = Student & {class: Class} & {grade: Grade};



const StudentList = async ({
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
      header: "Info",
      accessor: "info",
    },
  
    {
      header: "Student ID",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
  
    {
      header: "Grade",
      accessor: "subjects",
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
      className: `${role === "admin" || role === "teacher" ? "" : "hidden"}`,
    },
  ];
  
  const renderRow = (item: studentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 hover:bg-lamaPurpleLight even:bg-slate-50 text-sm"
    >
      <td>
        <div className="flex items-center justify-start gap-4 my-2">
          <Image
            src={item.img || "/noAvatar.png"}
            alt="student"
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.class.name}</p>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell mt-4">{item.username}</td>
      <td className="hidden md:table-cell mt-4">{item.grade.level}</td>
      <td className="hidden lg:table-cell mt-4">{item?.phone}</td>
      <td className="hidden lg:table-cell mt-4">{item.address}</td>
      <td className="flex items-center gap-2 mt-4">
        <Link href={`/list/students/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src={"/view.png"} alt="" width={16} height={16} />
          </button>
        </Link>
  
        {role === "admin" && (
          <FormContainer table="student" type="delete" id={item.id} />
        )}
      </td>
    </tr>
  );

  //URL PARAMS CONDITIONS

  const query: Prisma.StudentWhereInput = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "teacherId":
          query.class = {
            lessons: {
              some: {
                teacherId: value,
              },
            },
          };
          break;

        case "search":
          query.name = {
            contains: value,
            mode: "insensitive",
          };
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
        grade: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),

    prisma.student.count({
      where: query,
    }),
  ]);

  return (
    <div className="p-4 m-4 mt-0 bg-white rounded-md flex-1">
      {/*TOP*/}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold hidden md:block">All Students</h1>
        <div className="flex flex-col gap-4 md:flex-row items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
              <Image src={"/filter.png"} alt="fltr" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
              <Image src={"/sort.png"} alt="fltr" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="student" type="create" />}
          </div>
        </div>
      </div>

      {/*STUDENT LIST*/}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/*PAGINATION*/}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default StudentList;
