"use client";
import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { createExam, updateExam } from "@/lib/actions";

const examSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title name must be at least 3 characters long!" })
    .max(50, { message: "Title name must be at most 50 characters long!" }),

  date: z.coerce.date(),

  startHour: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z
        .number()
        .min(0, { message: "Start hour must be between 0 and 23" })
        .max(23, { message: "Start hour must be between 0 and 23" })
    )
    .refine((val) => val !== undefined, { message: "Start hour is required" }),

  startMin: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z
        .number()
        .min(0, { message: "Start minute must be between 0 and 59" })
        .max(59, { message: "Start minute must be between 0 and 59" })
    )
    .refine((val) => val !== undefined, {
      message: "Start minute is required",
    }),

  endHour: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z
        .number()
        .min(0, { message: "End hour must be between 0 and 23" })
        .max(23, { message: "End hour must be between 0 and 23" })
    )
    .refine((val) => val !== undefined, { message: "End hour is required" }),

  endMin: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z
        .number()
        .min(0, { message: "End minute must be between 0 and 59" })
        .max(59, { message: "End minute must be between 0 and 59" })
    )
    .refine((val) => val !== undefined, { message: "End minute is required" }),

  lessonId: z.coerce.number().min(1, { message: "Lesson is required" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

const ExamForm = ({
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
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
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
      let response = await createExam(dataFromForm);
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    } else {
      let response = await updateExam({ id: data.id, dataFromForm });
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
        {type === "create" ? "Create a new Exam" : "Update an existing Exam"}
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

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Date of Exam</label>
          <input
            type={"date"}
            {...register("date")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.startTime.toISOString().split("T")[0]}
          />
          {errors.date?.message && (
            <p className="text-xs text-red-500">
              {errors.date?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <span className="text-xs text-gray-400">Start Time</span>
          <div className="flex justify-between items-center bg-gray-200 gap-2 p-2 rounded-md">
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400">Start Hour</label>
              <input
                {...register("startHour")}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-[80%]"
                defaultValue={Intl.DateTimeFormat("en-IN", {
                  hour: "2-digit",
                  hour12: false,
                }).format(data?.startTime)}
              />
              {errors.startHour?.message && (
                <p className="text-xs text-red-500">
                  {errors.startHour?.message.toString()}
                </p>
              )}
            </div>

            <span className="text-xl font-bold">:</span>

            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400">Start Min</label>
              <input
                {...register("startMin")}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-[80%]"
                defaultValue={Intl.DateTimeFormat("en-IN", {
                  minute: "2-digit",
                  hour12: false,
                }).format(data?.startTime)}
              />
              {errors.startMin?.message && (
                <p className="text-xs text-red-500">
                  {errors.startMin?.message.toString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <span className="text-xs text-gray-400">End Time</span>
          <div className="flex justify-between items-center bg-gray-200 gap-2 p-2 rounded-md">
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400">End Hour</label>
              <input
                {...register("endHour")}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-[80%]"
                defaultValue={Intl.DateTimeFormat("en-IN", {
                  hour: "2-digit",
                  hour12: false,
                }).format(data?.startTime)}
              />
              {errors.endHour?.message && (
                <p className="text-xs text-red-500">
                  {errors.endHour?.message.toString()}
                </p>
              )}
            </div>

            <span className="text-xl font-bold">:</span>

            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400">End Min</label>
              <input
                {...register("endMin")}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-[80%]"
                defaultValue={Intl.DateTimeFormat("en-IN", {
                  minute: "2-digit",
                  hour12: false,
                }).format(data?.startTime)}
              />
              {errors.endMin?.message && (
                <p className="text-xs text-red-500">
                  {errors.endMin?.message.toString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center flex-col w-full">
          <label className="text-xs text-gray-400">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full mt-1"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            <option value="" className="text-center">Select Lesson</option>
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
      </div>
      <button className="bg-blue-500 text-white rounded-md p-2">
        {type == "create" ? "Register" : "Update"}
      </button>
    </form>
  );
};

export default ExamForm;
