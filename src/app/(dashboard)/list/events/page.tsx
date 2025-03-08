import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { eventsData,role} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Event = {
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
};

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
  },
];

const EventList = () => {
  const renderRow = (item: Event) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 hover:bg-lamaPurpleLight even:bg-slate-50 text-sm"
    >
      <td>
        <div className="flex items-center justify-start gap-4 my-2">
          <h3 className="font-semibold">{item.title}</h3>
        </div>
      </td>
      <td className="mt-4">{item.class}</td>
      <td className="hidden md:table-cell mt-4">{item.date}</td>
      <td className="hidden md:table-cell mt-4">{item.startTime}</td>
      <td className="hidden md:table-cell mt-4">{item.endTime}</td>
      <td className="flex items-center gap-2 my-2">
        <Link href={`list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src={"/edit.png"} alt="" width={16} height={16} />
          </button>
        </Link>

        {role === "admin" && (
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            <Image src={"/delete.png"} alt="" width={16} height={16} />
          </button>
        )}
      </td>
    </tr>
  );

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
            {role === "admin" && (
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaPurple">
                <Image src={"/plus.png"} alt="fltr" width={14} height={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/*TEACHER LIST*/}
      <Table columns={columns} renderRow={renderRow} data={eventsData} />

      {/*PAGINATION*/}
      <Pagination />
    </div>
  );
};

export default EventList;
