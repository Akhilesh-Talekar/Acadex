"use client";
import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters long!" })
    .max(20, { message: "Username must be atmost 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters long!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "last name is required!" }),
  phone: z.string().min(1, { message: "phone number is required!" }),
  address: z.string().min(1, { message: "address is required!" }),
  bloodType: z.string().min(2, { message: "bloodType is required!" }),
  birthDay: z.date({ message: "birthDay name is required!" }),
  sex: z.enum(["male", "female", "other"], { message: "Sex is required!" }),
  img: z.instanceof(File, { message: "Image is required!" }),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
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
      <h1 className="text-xl font-semibold">{type === 'create' ? "Register a new Teacher" : "Update a existing Teacher"}</h1>
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
          defaultValue={data?.username}
          err={errors.email}
        />
        <InputField
          label="Password"
          register={register}
          name="password"
          defaultValue={data?.username}
          err={errors.password}
          type="password"
        />
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Presonal Information
      </span>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <InputField
          label="Firstname"
          register={register}
          name="firstName"
          defaultValue={data?.firstName}
          err={errors.firstName}
        />
        <InputField
          label="Lastname"
          register={register}
          name="lastName"
          defaultValue={data?.lastName}
          err={errors.lastName}
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
        <InputField
          label="BloodGrp"
          register={register}
          name="bloodType"
          defaultValue={data?.bloodType}
          err={errors.bloodType}
        />
        <InputField
          label="DateOfBirth"
          register={register}
          name="birthDay"
          defaultValue={data?.birthDay}
          err={errors.birthDay}
          type="date"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-500">
              {errors.sex?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4 pt-6">
          <label
            className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src={"/upload.png"} alt="upload" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" />
          {errors.img?.message && (
            <p className="text-xs text-red-500">
              {errors.img?.message.toString()}
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

export default TeacherForm;
