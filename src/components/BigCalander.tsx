"use client";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = ({data}:{data:{title:string, start:Date, end:Date}[]}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  }
  

  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "98%" }}
      views={[Views.WORK_WEEK, Views.DAY]}
      view={view}
      onView={handleOnChangeView}
      min={new Date(2025, 0, 0, 8, 0, 0)}
      max={new Date(2025, 0, 0, 17, 0, 0)}
    />
  );
};

export default BigCalendar;
