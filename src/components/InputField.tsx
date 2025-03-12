import React from "react";
import { TeacherFormProps } from "../../types";

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  err,
  inputProps,
}: TeacherFormProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-400">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
        defaultValue={defaultValue}
      />
      {err?.message && (
        <p className="text-xs text-red-500">
          {err?.message.toString()}
        </p>
      )}
    </div>
  );
};

export default InputField;
