"use client";
import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { createAssignment, updateAssignment } from "@/lib/actions";

const assignmentSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title name must be at least 3 characters long!" })
    .max(50, { message: "Title name must be at most 50 characters long!" }),

  startDate: z.coerce.date({ message: "Start date is required" }),

  endDate: z.coerce.date({ message: "End date is required" }),

  lessonId: z.coerce.number({ message: "Lesson is required" }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

const AssignmentForm = ({
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
    formState: { errors },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
  });

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
      let response = await createAssignment(dataFromForm);
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    } else {
      let response = await updateAssignment({ id: data.id, dataFromForm });
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    }
  });

  let { lessons } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Register a new Assignment"
          : "Update a existing Assignment"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Title of Exam</label>
          <input
            type={"text"}
            {...register("title")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.title}
          />
          {errors.title?.message && (
            <p className="text-xs text-red-500">
              {errors.title?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex gap-2 flex-col w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: any) => {
              return (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.class.grade.level} - {lesson.class.name} -{" "}
                  {lesson.subject.name} - {lesson.name}
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
          <label className="text-xs text-gray-400">Start Date</label>
          <input
            type={"date"}
            {...register("startDate")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.startDate.toISOString().split("T")[0]}
          />
          {errors.startDate?.message && (
            <p className="text-xs text-red-500">
              {errors.startDate?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">End Date</label>
          <input
            type={"date"}
            {...register("endDate")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.dueDate.toISOString().split("T")[0]}
          />
          {errors.endDate?.message && (
            <p className="text-xs text-red-500">
              {errors.endDate?.message.toString()}
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

export default AssignmentForm;
