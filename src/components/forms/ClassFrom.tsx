"use client";
import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { createClass, updateClass } from "@/lib/actions";

const classSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long!" })
    .max(50, { message: "Name must be at most 50 characters long!" }),

  capacity: z.coerce
    .number()
    .int({ message: "Capacity must be an integer!" })
    .positive({ message: "Capacity must be a positive number!" })
    .max(500, { message: "Capacity cannot exceed 500!" }),

  gradeId: z.coerce
    .number(),

  supervisorId: z.coerce
    .string()
    .min(3, { message: "Supervisor name must be at least 3 characters long!" })
    .max(50, {
      message: "Supervisor name must be at most 50 characters long!",
    })
    .optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

const ClassForm = ({
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
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
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

  const onSubmit = handleSubmit(async(dataFromForm) => {
    if (type === "create") {
          let response = await createClass(dataFromForm);
          if (response.success) {
            handleSuccess(response.message);
            setOpen(false);
          } else {
            handleError(response.message);
          }
        } else {
          let response = await updateClass({ id: data.id, dataFromForm });
          if (response.success) {
            handleSuccess(response.message);
            setOpen(false);
          } else {
            handleError(response.message);
          }
        }
  });

  let { grades, supervisors } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Register a new Class" : "Update a existing Class"}
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
            {...register("capacity")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.capacity}
          />
          {errors.capacity?.message && (
            <p className="text-xs text-red-500">
              {errors.capacity?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: any) => {
              return (
                <option key={grade.id} value={grade.id} defaultValue={data && data.gradeId == grade.id}>
                  {grade.level}
                </option>
              );
            })}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-500">
              {errors.gradeId?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.supervisorId}
          >
            {supervisors.map((supervisor: any) => {
              return (
                <option key={supervisor.id} value={supervisor.id} defaultValue={data && data.supervisorId == supervisor.id}>
                  {supervisor.name} {supervisor.surname}
                </option>
              );
            })}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-500">
              {errors.supervisorId?.message.toString()}
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

export default ClassForm;
