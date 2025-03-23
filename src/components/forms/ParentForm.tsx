"use client";
import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import toast from "react-hot-toast";
import { createParent, updateParent } from "@/lib/actions";
import { Student } from "@prisma/client";

const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters long!" })
    .max(20, { message: "Username must be atmost 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string(),
  address: z.string().min(1, { message: "address is required!" }),
  students: z.array(z.string()).optional(),
});

export type ParentSchema = z.infer<typeof parentSchema>;

const ParentForm = ({
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
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
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
      let response = await createParent(dataFromForm);
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    } else {
      let response = await updateParent({ id: data.id, dataFromForm });
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    }
  });

  const { students } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Register a new Parent"
          : "Update a existing Parent"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          register={register}
          name="username"
          defaultValue={data?.username}
          err={errors.username}
        />
        <InputField
          label="email"
          register={register}
          name="email"
          defaultValue={data?.email}
          err={errors.email}
        />
        <InputField
          label="Password"
          register={register}
          name="password"
          defaultValue={data?.password}
          err={errors.password}
          type="password"
        />
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Presonal Information
      </span>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <InputField
          label="Name"
          register={register}
          name="name"
          defaultValue={data?.name}
          err={errors.name}
        />
        <InputField
          label="Surname"
          register={register}
          name="surname"
          defaultValue={data?.surname}
          err={errors.surname}
        />
        <InputField
          label="Phone"
          register={register}
          name="phone"
          defaultValue={data?.phone}
          err={errors.phone}
        />
        <InputField
          label="Address"
          register={register}
          name="address"
          defaultValue={data?.address}
          err={errors.address}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Students</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("students")}
            defaultValue={data?.students}
          >
            {students.map((student: Student) => {
              return (
                <option key={student.id} value={student.id}>
                  {student.name} {student.surname}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <button className="bg-blue-500 text-white rounded-md p-2">
        {type == "create" ? "Register" : "Update"}
      </button>
    </form>
  );
};

export default ParentForm;
