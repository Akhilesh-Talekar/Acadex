import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole } from "@/lib/utils";
import { Class, Event, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type eventList = Event & { class: Class };



const EventList = async ({
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
      header: "Class",
      accessor: "class",
    },
  
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
  
    {
      header: "Start Time",
      accessor: "starttime",
      className: "hidden md:table-cell",
    },
  
    {
      header: "End Time",
      accessor: "endtime",
      className: "hidden md:table-cell",
    },
  
    {
      header: "Actions",
      accessor: "actions",
      className: `${role === "admin" ? "" : "hidden"}`,
    },
  ];
  
  const renderRow = (item: eventList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 hover:bg-lamaPurpleLight even:bg-slate-50 text-sm"
    >
      <td>
        <div className="flex items-center justify-start gap-4 my-2">
          <h3 className="font-semibold">{item.title}</h3>
        </div>
      </td>
      <td className="mt-4">{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell mt-4">
        {new Intl.DateTimeFormat("en-IN").format(item.startTime)}
      </td>
      <td className="hidden md:table-cell mt-4">
        {item.startTime.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </td>
      <td className="hidden md:table-cell mt-4">
        {item.endTime.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </td>
      <td className="flex items-center gap-2 my-2">
        {role === "admin" && (
          <>
            <FormModal table="event" type="update" data={item} />
            <FormModal table="event" type="delete" id={item.id} />
          </>
        )}
      </td>
    </tr>
  );

  //URL PARAMS CONDITIONS

  const query: Prisma.EventWhereInput = {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      switch (key) {
        case "search":
          query.OR = [
            {
              title: {
                contains: value,
                mode: "insensitive",
              },
            },
            {
              class: {
                name: {
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
  
  // Role Conditions
  let roleConditions:any = [];
  
  switch (role) {
    case "admin":
      break;
  
    case "teacher":
      roleConditions = [
        { classId: null },
        { class: { lessons: { some: { teacherId: currUserId! } } } },
      ];
      break;
  
    case "student":
      roleConditions = [
        { classId: null },
        { class: { students: { some: { id: currUserId! } } } },
      ];
      break;
  
    case "parent":
      roleConditions = [
        { classId: null },
        { class: { students: { some: { parentId: currUserId! } } } },
      ];
      break;
  }
  
  // Ensure AND condition between search and role-based filtering
  query.AND = [
    query.OR ? { OR: query.OR } : {}, // Search conditions
    roleConditions.length ? { OR: roleConditions } : {}, // Role conditions
  ];
  
  delete query.OR; // Remove OR from root to avoid conflict
  

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),

    prisma.event.count({
      where: query,
    }),
  ]);
  return (
    <div className="p-4 m-4 mt-0 bg-white rounded-md flex-1">
      {/*TOP*/}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold hidden md:block">All Events</h1>
        <div className="flex flex-col gap-4 md:flex-row items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
              <Image src={"/filter.png"} alt="fltr" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
              <Image src={"/sort.png"} alt="fltr" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="event" type="create" />}
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

export default EventList;
