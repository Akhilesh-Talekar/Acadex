"use client";
import React, { useState } from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";
import { createStudent, updateStudent } from "@/lib/actions";
import { Class, Grade } from "@prisma/client";

const studentSchema = z.object({
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
  phone: z.string().optional(),
  address: z.string().min(1, { message: "address is required!" }),
  bloodType: z.string().min(2, { message: "bloodType is required!" }),
  birthday: z.coerce.date({ message: "birthDay name is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  img: z.string().optional(),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

const StudentForm = ({
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
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [img, setImg] = useState<any>();

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
      let response = await createStudent({
        ...dataFromForm,
        img: img?.secure_url,
      });
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    } else {
      let response = await updateStudent({ id: data.id, dataFromForm });
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    }
  });

  const { grades, classes } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Register a new Student"
          : "Update a existing Student"}
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
          name="name"
          defaultValue={data?.name}
          err={errors.name}
        />
        <InputField
          label="Lastname"
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
        <InputField
          label="BloodGrp"
          register={register}
          name="bloodType"
          defaultValue={data?.bloodType}
          err={errors.bloodType}
        />
        <InputField
          label="Parent"
          register={register}
          name="parentId"
          defaultValue={data?.parentId}
          err={errors.parentId}
        />
        <InputField
          label="DateOfBirth"
          register={register}
          name="birthday"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          err={errors.birthday}
          type="date"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-500">
              {errors.sex?.message.toString()}
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
            {grades.map((grade: Grade) => {
              return (
                <option key={grade.id} value={grade.id}>
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
          <label className="text-xs text-gray-400">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.map((classs:any) => {
              return (
                <option key={classs.id} value={classs.id}>
                  {classs.grade.level} {classs.name} - {classs._count.students}/{classs.capacity} Capacity
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
        <CldUploadWidget
          uploadPreset="acadex"
          onSuccess={(res, { widget }) => {
            setImg(res.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div
                className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer"
                onClick={() => open()}
              >
                <Image
                  src={"/upload.png"}
                  alt="upload"
                  width={28}
                  height={28}
                />
                <span>Upload a photo</span>
              </div>
            );
          }}
        </CldUploadWidget>
      </div>
      <button className="bg-blue-500 text-white rounded-md p-2">
        {type == "create" ? "Register" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
