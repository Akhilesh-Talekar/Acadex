import Image from "next/image";
import React from "react";
import Calendar from "react-calendar";
import EventList from "./EventList";
import EventCalander from "./EventCalander";

const EventCalandarContainer = async ({
  searchParams,
}: {searchParams:{[key:string]:string | undefined}}) => {
  const {date} =  searchParams;

  return (
    <div className="bg-white rounded-xl p-4">
      <EventCalander />
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-semibold">Events</h1>
        <Image src={"/moreDark.png"} alt="more" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <EventList dateParam={date} />
      </div>
    </div>
  );
};

export default EventCalandarContainer;
