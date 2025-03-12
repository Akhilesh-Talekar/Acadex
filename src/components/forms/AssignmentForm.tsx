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
  
    dueDate: z
      .string()
      .min(1, { message: "Due date is required!" })
      .max(20, { message: "Due date cannot exceed 20 characters!" }),
  });

type Inputs = z.infer<typeof schema>;

const AssignmentForm = ({
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
        {type === "create" ? "Register a new Assignment" : "Update a existing Assignment"}
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

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Date</label>
          <input
            type={type}
            {...register("dueDate")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.dueDate}
            placeholder="YYYY-MM-DD"
          />
          {errors.dueDate?.message && (
            <p className="text-xs text-red-500">{errors.dueDate?.message.toString()}</p>
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
