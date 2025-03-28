"use client";

import Image from "next/image";
import React, { useState } from "react";
import { formDataProps } from "../../types";
import dynamic from "next/dynamic";
import { deleteAnnouncement, deleteAssignment, deleteAttendance, deleteClass, deleteEvent, deleteExam, deleteLesson, deleteParent, deleteResult, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

const AttendanceForm = dynamic(() => import ("./forms/AttendanceForm"),{
  loading: () => <h1>Loading...</h1>
})

const deleteActionMap:{[key:string]: (id:Number | String) => Promise<any>} = {
  teacher:(id) => deleteTeacher(String(id)),
  student:(id) => deleteStudent(String(id)),
  parent:(id) => deleteParent(String(id)),
  subject:(id) => deleteSubject(Number(id)),
  class:(id) => deleteClass(Number(id)),
  lesson:(id) => deleteLesson(Number(id)),
  exam:(id) => deleteExam(Number(id)),
  assignment:(id) => deleteAssignment(Number(id)),
  result:(id) => deleteResult(Number(id)),
  event:(id) => deleteEvent(Number(id)),
  announcement:(id) => deleteAnnouncement(Number(id)),
  attendance:(id) => deleteAttendance(Number(id)),
};

const routMap = {
  teacher: "/list/teachers",
  student: "/list/students",
  parent: "/list/parents",
  subject: "/list/subjects",
  class: "/list/classes",
  lesson: "/list/lessons",
  exam: "/list/exams",
  assignment: "/list/assignments",
  result: "/list/results",
  event: "/list/events",
  announcement: "/list/announcements",
  attendance: "/list/attendance",
}


const forms: {
  [key: string]: (setOpen: React.Dispatch<React.SetStateAction<boolean>>, type: "create" | "update", data?: any, relatedData?: any) => JSX.Element;
} = {
  teacher: (setOpen, type, data, relatedData) => <TeacherForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  student: (setOpen, type, data, relatedData) => <StudentForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  parent: (setOpen, type, data, relatedData) => <ParentForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  subject: (setOpen, type, data, relatedData) => <SubjectForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  class: (setOpen, type, data, relatedData) => <ClassForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  lesson: (setOpen, type, data, relatedData) => <LessonForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  exam: (setOpen, type, data, relatedData) => <ExamForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  assignment: (setOpen, type, data, relatedData) => <AssignmentForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  result: (setOpen, type, data, relatedData) => <ResultForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  event: (setOpen, type, data, relatedData) => <EventForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  announcement: (setOpen, type, data, relatedData) => <AnnouncementForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
  attendance: (setOpen, type, data, relatedData) => <AttendanceForm type={type} data={data} setOpen={setOpen} relatedData = {relatedData}/>,
};

const FormModal = ({ table, type, data, id, relatedData }: formDataProps) => {
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

  const router = useRouter();

  const Form = () => {

    const handleError = (err: string) =>
      toast.error(err, {
        position: "bottom-left",
      });
  
    const handleSuccess = (msg: string) =>
      toast.success(msg, {
        position: "bottom-left",
        duration: 2000,
      });

    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      let response = await deleteActionMap[table](id!);
      if(response.success){
        handleSuccess(response.message);
        setOpen(false);
      }
      else{
        handleError(response.message);
      }
      router.push(routMap[table as keyof typeof routMap]);
    };

    return type == "delete" && id ? (
      <form action="" className="p-4 flex flex-col gap-4" onSubmit={handleDelete}>
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-600 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
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
