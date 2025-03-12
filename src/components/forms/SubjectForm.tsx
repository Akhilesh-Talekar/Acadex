"use client";
import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

const schema = z.object({
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z
    .array(z.string())
    .min(1, { message: "At least one teacher is required!" }),
});

type Inputs = z.infer<typeof schema>;

const SubjectForm = ({
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
          ? "Register a new Subject"
          : "Update a existing Subject"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Subject Name</label>
          <input
            type="text"
            {...register("name")}
            defaultValue={data?.name}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
        <label className="text-xs text-gray-400">Teachers</label>
        <input
          type="text"
          {...register("teachers", {
            setValueAs: (value) => value.split(",").map((t: any) => t.trim()), // Convert CSV to array
          })}
          defaultValue={data?.teachers?.join(", ")}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          placeholder="Enter teachers (comma-separated)"
        />
        </div>
      </div>
      <button className="bg-blue-500 text-white rounded-md p-2">
        {type == "create" ? "Register" : "Update"}
      </button>
    </form>
  );
};

export default SubjectForm;
