"use client";

import Image from "next/image";
import React, { useState } from "react";
import { formDataProps } from "../../types";
import dynamic from "next/dynamic";

const TeacherForm = dynamic(() => import ("./forms/TeacherForm"),{
  loading: () => <h1>Loading...</h1>
})

const StudentForm = dynamic(() => import ("./forms/StudentForm"),{
  loading: () => <h1>Loading...</h1>
})

const ParentForm = dynamic(() => import ("./forms/ParentForm"),{
  loading: () => <h1>Loading...</h1>
})

const SubjectForm = dynamic(() => import ("./forms/SubjectForm"),{
  loading: () => <h1>Loading...</h1>
})

const ClassForm = dynamic(() => import ("./forms/ClassFrom"),{
  loading: () => <h1>Loading...</h1>
})

const LessonForm = dynamic(() => import ("./forms/LessonForm"),{
  loading: () => <h1>Loading...</h1>
})

const ExamForm = dynamic(() => import ("./forms/ExamForm"),{
  loading: () => <h1>Loading...</h1>
})

const AssignmentForm = dynamic(() => import ("./forms/AssignmentForm"),{
  loading: () => <h1>Loading...</h1>
})

const ResultForm = dynamic(() => import ("./forms/ResultForm"),{
  loading: () => <h1>Loading...</h1>
})

const EventForm = dynamic(() => import ("./forms/EventForm"),{
  loading: () => <h1>Loading...</h1>
})

const AnnouncementForm = dynamic(() => import ("./forms/AnnounementForm"),{
  loading: () => <h1>Loading...</h1>
})



const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  parent: (type, data) => <ParentForm type={type} data={data} />,
  subject: (type, data) => <SubjectForm type={type} data={data} />,
  class: (type, data) => <ClassForm type={type} data={data} />,
  lesson: (type, data) => <LessonForm type={type} data={data} />,
  exam: (type, data) => <ExamForm type={type} data={data} />,
  assignment: (type, data) => <AssignmentForm type={type} data={data} />,
  result: (type, data) => <ResultForm type={type} data={data} />,
  event: (type, data) => <EventForm type={type} data={data} />,
  announcement: (type, data) => <AnnouncementForm type={type} data={data} />,
};

const FormModal = ({ table, type, data, id }: formDataProps) => {
  const size = type == "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type == "create"
      ? "bg-lamaYellow"
      : type == "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";
  const imgUrl =
    type == "create"
      ? "/create.png"
      : type == "update"
      ? "/update.png"
      : "/delete.png";

  const [open, setOpen] = useState(false);

  const Form = () => {
    return type == "delete" && id ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-600 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`${imgUrl}`} alt={`${type}`} width={16} height={16} />
      </button>

      {open && (
        <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[30%]">
            <Form />
            <div
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src={"/close.png"} alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
