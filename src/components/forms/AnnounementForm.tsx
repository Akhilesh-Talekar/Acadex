"use client";
import React from "react";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import toast from "react-hot-toast";
import { createAnnouncement, updateAnnouncement} from "@/lib/actions";

const announcementSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long!" })
    .max(100, { message: "Title must be at most 100 characters long!" }),

  description: z
    .string()
    .min(1, { message: "Class is required!" })
    .max(50, { message: "Class cannot exceed 20 characters!" }),

  date: z.coerce.date(),

  classId: z.coerce.number({ message: "Class ID is required!" }).optional(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

const AnnouncementForm = ({
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
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
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
      let response = await createAnnouncement(dataFromForm);
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    } else {
      let response = await updateAnnouncement({ id: data.id, dataFromForm });
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    }
  });

  let { classes } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new Announcement"
          : "Update an existing Announcement"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Title of Assignment</label>
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
          <label className="text-xs text-gray-400">Description</label>
          <input
            type={"text"}
            {...register("description")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.description}
          />
          {errors.description?.message && (
            <p className="text-xs text-red-500">
              {errors.description?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Date</label>
          <input
            type={"date"}
            {...register("date")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.date.toISOString().split("T")[0]}
          />
          {errors.date?.message && (
            <p className="text-xs text-red-500">
              {errors.date?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex justify-center items-center flex-col w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.lessonId}
          >
            <option value="">For All</option>
            {classes?.map((classItem: any) => {
              return (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.grade.level} - {classItem.name}
                </option>
              );
            })}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-500">
              {errors.classId?.message.toString()}
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

export default AnnouncementForm;
