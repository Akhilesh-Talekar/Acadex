"use client";
import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long!" })
    .max(50, { message: "Name must be at most 50 characters long!" }),

  capacity: z
    .number()
    .int({ message: "Capacity must be an integer!" })
    .positive({ message: "Capacity must be a positive number!" })
    .max(500, { message: "Capacity cannot exceed 500!" }),

  grade: z
    .string()
    .min(1, { message: "Grade is required!" })
    .max(10, { message: "Grade cannot exceed 10 characters!" }),

  supervisor: z
    .string()
    .min(3, { message: "Supervisor name must be at least 3 characters long!" })
    .max(50, {
      message: "Supervisor name must be at most 50 characters long!",
    }),
});

type Inputs = z.infer<typeof schema>;

const ClassForm = ({
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
          ? "Register a new Class"
          : "Update a existing Class"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class Name"
          register={register}
          name="name"
          defaultValue={data?.name}
          err={errors.name}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Capacity</label>
          <input
            type={type}
            {...register("capacity", {valueAsNumber: true})}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.capacity}
          />
          {errors.capacity?.message && (
            <p className="text-xs text-red-500">{errors.capacity?.message.toString()}</p>
          )}
        </div>

        <InputField
          label="Grade"
          register={register}
          name="password"
          defaultValue={data?.grade}
          err={errors.grade}
        />

        <InputField
          label="Supervisor"
          register={register}
          name="supervisor"
          defaultValue={data?.supervisor}
          err={errors.supervisor}
        />
      </div>
      <button className="bg-blue-500 text-white rounded-md p-2">
        {type == "create" ? "Register" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;
