"use client";
import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  subject: z
    .string()
    .min(3, { message: "Subject name must be at least 3 characters long!" })
    .max(50, { message: "Subject name must be at most 50 characters long!" }),

  class: z
    .string()
    .min(1, { message: "Class is required!" })
    .max(10, { message: "Class cannot exceed 10 characters!" }),

  teacher: z
    .string()
    .min(3, { message: "Teacher's name must be at least 3 characters long!" })
    .max(50, { message: "Teacher's name must be at most 50 characters long!" }),

  student: z
    .string()
    .min(3, { message: "Student name must be at least 3 characters long!" })
    .max(50, { message: "Student name must be at most 50 characters long!" }),

  date: z
    .string()
    .min(1, { message: "Date is required!" })
    .max(20, { message: "Date cannot exceed 20 characters!" }),

  type: z.enum(["exam", "assignment"], { message: "Type is required!" }),

  score: z
    .number()
    .int({ message: "Score must be an integer!" })
    .nonnegative({ message: "Score cannot be negative!" })
    .max(100, { message: "Score cannot exceed 100!" }),
});

type Inputs = z.infer<typeof schema>;

const ResultForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new Result"
          : "Update an existing Result"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Name"
          register={register}
          name="subject"
          defaultValue={data?.subject}
          err={errors.subject}
        />

        <InputField
          label="Class"
          register={register}
          name="class"
          defaultValue={data?.class}
          err={errors.class}
        />

        <InputField
          label="Teacher Name"
          register={register}
          name="teacher"
          defaultValue={data?.teacher}
          err={errors.teacher}
        />

        <InputField
          label="Student Name"
          register={register}
          name="student"
          defaultValue={data?.student}
          err={errors.student}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Date</label>
          <input
            {...register("date")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.date}
            placeholder="YYYY-MM-DD"
          />
          {errors.date?.message && (
            <p className="text-xs text-red-500">
              {errors.date?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Type of result</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("type")}
            defaultValue={data?.type}
          >
            <option value="exam">Exam</option>
            <option value="assignment">Assignment</option>
          </select>
          {errors.type?.message && (
            <p className="text-xs text-red-500">
              {errors.type?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Score</label>
          <input
            {...register("date")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.score}
          />
          {errors.score?.message && (
            <p className="text-xs text-red-500">
              {errors.score?.message.toString()}
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

export default ResultForm;
