"use client";
import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";


const schema = z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long!" })
      .max(100, { message: "Title must be at most 100 characters long!" }),
  
    class: z
      .string()
      .min(1, { message: "Class is required!" })
      .max(20, { message: "Class cannot exceed 20 characters!" }),
  
    date: z
      .string()
      .min(1, { message: "Date is required!" })
      .max(20, { message: "Date cannot exceed 20 characters!" }),
  
    startTime: z
      .string()
      .min(1, { message: "Start time is required!" })
      .max(10, { message: "Start time cannot exceed 10 characters!" }),
  
    endTime: z
      .string()
      .min(1, { message: "End time is required!" })
      .max(10, { message: "End time cannot exceed 10 characters!" }),
  });

type Inputs = z.infer<typeof schema>;

const EventForm = ({
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
      <h1 className="text-xl font-semibold">{type === 'create' ? "Create a new Event" : "Update an existing Event"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Event Name"
          register={register}
          name="title"
          defaultValue={data?.title}
          err={errors.title}
        />
        <InputField
          label="Class Name"
          register={register}
          name="class"
          defaultValue={data?.class}
          err={errors.class}
        />
        <InputField
          label="Date"
          register={register}
          name="date"
          defaultValue={data?.date}
          err={errors.date}
        />
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <InputField
          label="Start Time"
          register={register}
          name="startTime"
          defaultValue={data?.startTime}
          err={errors.startTime}
        />
        <InputField
          label="End Time"
          register={register}
          name="endTime"
          defaultValue={data?.endTime}
          err={errors.endTime}
        />
      </div>
      <button className="bg-blue-500 text-white rounded-md p-2">
        {type == "create" ? "Register" : "Update"}
      </button>
    </form>
  );
};

export default EventForm;
