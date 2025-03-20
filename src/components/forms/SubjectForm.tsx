"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "../InputField";
import { createSubject } from "@/lib/actions";
import {toast } from "react-toastify";

const schema = z.object({
  name: z.string().min(1, { message: "Subject name is required!" }),
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

  const handleError = (err:string) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg:string) =>
    toast.success(msg, {
      position: "bottom-left",
      autoClose: 2000,
    });
  

  const onSubmit = handleSubmit(async(data) => {
    let response = await createSubject(data);
    if(response.success){
      handleSuccess(response.message);
    }
    else{
      handleError(response.message);
    }
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
        <InputField
          label="Subject Name"
          type="text"
          register={register}
          name="name"
          defaultValue={data?.name}
          err={errors.name}
        />
      </div>
      <button className="bg-blue-500 text-white rounded-md p-2">
        {type == "create" ? "Register" : "Update"}
      </button>
    </form>
  );
};

export default SubjectForm;
