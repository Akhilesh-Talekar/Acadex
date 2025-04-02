"use client";
import React, { useEffect, useState } from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { Subject, Teacher } from "@prisma/client";
import toast from "react-hot-toast";
import { createEvent, createLesson, updateLesson } from "@/lib/actions";

const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Subject name must be at least 3 characters long!" })
    .max(20, { message: "Subject name must be at most 50 characters long!" }),

  startDate: z.coerce.date(),
  endDate: z.coerce.date(),

  subjectId: z.coerce.number(),

  classId: z.coerce.number(),

  teacherId: z.string().min(1, { message: "Please select teacher manually" }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

const LessonForm = ({
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
  console.log(data);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const [selectedTeachers, setSelectedTeachers] = useState<any[]>([]);

  const subjectId = watch("subjectId");
  let { classes, subjects } = relatedData;

  useEffect(() => {
    // Find the selected subject based on subjectId
    const selectedSubject = subjects.find((subject: Subject) => {
      return subject.id == subjectId;
    });

    // Update state with the teachers of the selected subject
    setSelectedTeachers(selectedSubject ? selectedSubject.teachers : []);
  }, [subjectId, subjects]);

  const handleError = (err: string) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg: string) =>
    toast.success(msg, {
      position: "bottom-left",
      duration: 2000,
    });

  const onSubmit = handleSubmit(async (dataFromForm) => {
    if (type === "create") {
      let response = await createLesson(dataFromForm);
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    } else {
      let response = await updateLesson({ id: data.id, dataFromForm });
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Register a new Lesson"
          : "Update a existing Lesson"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-400">Lesson</label>
          <input
            type={"text"}
            {...register("name")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.name}
          />
          {errors.name?.message && (
            <p className="text-xs text-red-500">
              {errors.name?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">
            <span className="text-[9px]">Start Time</span>
          </label>
          <input
            type={"datetime-local"}
            {...register("startDate")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.startTime
              ? new Date(new Date(data.startTime).getTime() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .slice(0, 16)
              : ""}
          />
          {errors.startDate?.message && (
            <p className="text-xs text-red-500">
              {errors.startDate?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">
            <span className="text-[9px]">End Time</span>
          </label>
          <input
            type={"datetime-local"}
            {...register("endDate")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.endTime
              ? new Date(new Date(data.endTime).getTime() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .slice(0, 16)
              : ""}
          />
          {errors.endDate?.message && (
            <p className="text-xs text-red-500">
              {errors.endDate?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-2 flex-col w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.map((classItem: any) => {
              return (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.grade.level} - {classItem.name}
                </option>
              );
            })}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-500">
              {errors.classId?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-2 flex-col w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId")}
            defaultValue={data?.subjectId}
          >
            {subjects.map((subject: any) => {
              return (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              );
            })}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-500">
              {errors.subjectId?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-2 flex-col w-full">
          <label className="text-xs text-gray-400">Subject Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
            defaultValue={data?.teacherId}
            disabled={selectedTeachers.length === 0}
          >
            {selectedTeachers.map((teacher: Teacher) => {
              return (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} {teacher.surname}
                </option>
              );
            })}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-500">
              {errors.teacherId?.message.toString()}
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

export default LessonForm;
