"use client";
import Image from "next/image";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
  {
    id: 1,
    title: "Republic Day Flag Hoisting",
    time: "9:00 AM - 10:00 AM",
    description:
      "There will be sweet distribution and flag hoisting, along with some cultural events.",
  },
  {
    id: 2,
    title: "Annual Sports Day",
    time: "8:00 AM - 3:00 PM",
    description:
      "A day filled with exciting sports activities, competitions, and prize distributions.",
  },
  {
    id: 3,
    title: "Science Exhibition",
    time: "10:00 AM - 4:00 PM",
    description:
      "Students showcase their innovative science projects and experiments.",
  },
  {
    id: 4,
    title: "Music Fest",
    time: "6:00 PM - 9:00 PM",
    description:
      "An evening filled with musical performances from various artists and bands.",
  },
  {
    id: 5,
    title: "Independence Day Celebration",
    time: "8:30 AM - 11:00 AM",
    description:
      "Flag hoisting, patriotic performances, and speeches to honor the nation's freedom.",
  },
  {
    id: 6,
    title: "Blood Donation Camp",
    time: "9:00 AM - 5:00 PM",
    description: "A noble cause to donate blood and help those in need.",
  },
  {
    id: 7,
    title: "Tech Talk",
    time: "2:00 PM - 4:00 PM",
    description:
      "Industry experts share insights on the latest technology trends and innovations.",
  },
  {
    id: 8,
    title: "Christmas Celebration",
    time: "5:00 PM - 8:00 PM",
    description:
      "Christmas carols, Santa Claus meet and greet, and festive games for all.",
  },
  {
    id: 9,
    title: "Cultural Night",
    time: "7:00 PM - 10:00 PM",
    description:
      "A vibrant showcase of cultural performances, dance, and traditional art.",
  },
  {
    id: 10,
    title: "Coding Hackathon",
    time: "10:00 AM - 6:00 PM",
    description:
      "A 24-hour coding challenge to build innovative solutions and win exciting prizes.",
  },
];

const EventCalander = () => {
  const [value, onChange] = useState<Value>(new Date());
  return (
    <div className="bg-white rounded-xl p-4">
      <Calendar onChange={onChange} value={value} />
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-semibold">Events</h1>
        <Image src={"/moreDark.png"} alt="more" width={20} height={20}/>
      </div>
      <div className="flex flex-col gap-4">
        {events.map((event) => (
            <div className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple" key={event.id}>
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-gray-600">{event.title}</h1>
                    <span className="text-gray-300 text-xs">{event.time}</span>
                </div>
                <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalander;
