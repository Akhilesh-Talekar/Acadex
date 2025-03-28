"use client";
import React, { useEffect, useState } from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { Subject, Teacher } from "@prisma/client";
import toast from "react-hot-toast";
import { createAttendance, createEvent, createLesson, updateAttendance, updateLesson } from "@/lib/actions";

const attendanceSchema = z.object({

  date: z.coerce.date(),

  status: z.string(),

  studentId: z.string().min(1, { message: "Please select student manually" }),

  lessonId: z.coerce.number(),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

const AttendanceForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
  });

  const [students, setStudents] = useState<any[]>([]);

  let lessonId = watch("lessonId");

  useEffect(() => {
    let lessonData = lessons.find((lesson: any) => {
      return lesson.id == lessonId;
    })

    setStudents(lessonData ? lessonData.class.students : []);
  },[lessonId, relatedData?.lessons]);

  
  const handleError = (err: string) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg: string) =>
    toast.success(msg, {
      position: "bottom-left",
      duration: 2000,
    });

  const onSubmit = handleSubmit(async(dataFromForm) => {
    if (type === "create") {
      let response = await createAttendance(dataFromForm);
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    } else {
      let response = await updateAttendance({ id: data.id, dataFromForm });
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    }
  });

  let {lessons} = relatedData;



  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Register a new Attendance"
          : "Update a existing Attendance"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Date</label>
          <input
            type={"date"}
            {...register("date")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.date.toISOString().split("T")[0]}
          />
          {errors.date?.message && (
            <p className="text-xs text-red-500">
              {errors.date?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Status</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("status")}
            defaultValue={data?.present === true ? "present" : "absent"}
          >
            <option value="present" className="bg-green-300">Present</option>
            <option value="absent" className="bg-red-300">Absent</option>
          </select>
          {errors.status?.message && (
            <p className="text-xs text-red-500">
              {errors.status?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: any) => {
              return (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.name} - {lesson.subject.name}
                </option>
              );
            })}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-500">
              {errors.lessonId?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={data?.studentId}
          >
            {students.map((student:any) => {
              return (
                <option value={student.id} key={student.id}>
                  {student.name} {student.surname}
                </option>
              )
            })}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-500">
              {errors.studentId?.message.toString()}
            </p>
          )}
        </div>

      </div>
      <button className="bg-blue-500 text-white rounded-md p-2">
        {type == "create" ? "Register" : "Update"}
      </button>
    </form>
  );
};

export default AttendanceForm;
