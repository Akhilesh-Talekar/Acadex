"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createResult, updateResult } from "@/lib/actions";
import toast from "react-hot-toast";

const resultSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  examId: z.string().optional(),
  assignmentId: z.string().optional(),
  studentId: z.string().min(1, { message: "Student is required" }),
  score: z.coerce
    .number()
    .min(0, { message: "Score must be at least 0" })
    .max(100, { message: "Score can be at most 100" }),
});

export type ResultSchema = z.infer<typeof resultSchema>;

const ResultForm = ({
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
  // Set initial state and loading indicators
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      type: data?.type || "",
      examId: data?.examId || "",
      assignmentId: data?.assignmentId || "",
      studentId: data?.studentId || "",
      score: data?.score || 0,
    }
  });

  // Extract related data
  const { exams = [], assignments = [] } = relatedData || {};
  
  // Watch form fields for changes
  const selectedType = watch("type");
  const selectedExamId = watch("examId");
  const selectedAssignmentId = watch("assignmentId");

  // Load initial data for edit mode
  useEffect(() => {
    if (type === "update" && data) {
      loadInitialStudents();
    }
  }, []);

  // Function to load initial students in edit mode
  const loadInitialStudents = () => {
    if (!data) return;
    
    try {
      if (data.type === "exam" && data.examId) {
        const examData = exams.find((exam: any) => exam.id == data.examId);
        if (examData?.lesson?.class?.students) {
          setStudents(examData.lesson.class.students);
        }
      } else if (data.type === "assignment" && data.assignmentId) {
        const assignmentData = assignments.find(
          (assignment: any) => assignment.id == data.assignmentId
        );
        if (assignmentData?.lesson?.class?.students) {
          setStudents(assignmentData.lesson.class.students);
        }
      }
    } catch (error) {
      console.error("Error loading initial students:", error);
    }
  };

  // Update students when type or selection changes
  useEffect(() => {
    // Clear students when type changes
    if (!selectedType) {
      setStudents([]);
      setValue("studentId", "");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      if (selectedType === "exam") {
        // Clear assignmentId when type is exam
        setValue("assignmentId", "");
        
        if (!selectedExamId) {
          setStudents([]);
          setValue("studentId", "");
          setLoading(false);
          return;
        }
        
        // Find exam and get its students
        const examData = exams.find((exam: any) => exam.id == selectedExamId);
        if (examData?.lesson?.class?.students) {
          setStudents(examData.lesson.class.students);
        } else {
          setStudents([]);
          setValue("studentId", "");
          setError("No students found for this exam");
        }
      } 
      else if (selectedType === "assignment") {
        // Clear examId when type is assignment
        setValue("examId", "");
        
        if (!selectedAssignmentId) {
          setStudents([]);
          setValue("studentId", "");
          setLoading(false);
          return;
        }
        
        // Find assignment and get its students
        const assignmentData = assignments.find(
          (assignment: any) => assignment.id == selectedAssignmentId
        );
        if (assignmentData?.lesson?.class?.students) {
          setStudents(assignmentData.lesson.class.students);
        } else {
          setStudents([]);
          setValue("studentId", "");
          setError("No students found for this assignment");
        }
      }
    } catch (error) {
      console.error("Error updating student list:", error);
      setError("Error loading students");
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedExamId, selectedAssignmentId, exams, assignments, setValue]);

  // Toast handlers
  const handleError = (err: string) =>
    toast.error(err, { position: "bottom-left" });
  
  const handleSuccess = (msg: string) =>
    toast.success(msg, { position: "bottom-left", duration: 2000 });

  // Form submission handler
  const onSubmit = handleSubmit(async (formData) => {
    try {
      let response;
      if (type === "create") {
        response = await createResult(formData);
      } else {
        response = await updateResult({ id: data.id, dataFromForm: formData });
      }
      
      if (response.success) {
        handleSuccess(response.message);
        setOpen(false);
      } else {
        handleError(response.message);
      }
    } catch (error) {
      handleError("An unexpected error occurred");
    }
  });

  // Helper function to determine student dropdown status text
  const getStudentPlaceholderText = () => {
    if (loading) return "Loading students...";
    if (error) return error;
    if (students.length === 0) {
      if (!selectedType) return "Select a type first";
      if (selectedType === "exam" && !selectedExamId) return "Select an exam first";
      if (selectedType === "assignment" && !selectedAssignmentId) return "Select an assignment first";
      return "No students available";
    }
    return "Select a student";
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Result" : "Update an existing Result"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Type Selection */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-400">Type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("type")}
          >
            <option value="">Select Type</option>
            <option value="exam">Exam</option>
            <option value="assignment">Assignment</option>
          </select>
          {errors.type?.message && (
            <p className="text-xs text-red-500">{errors.type.message}</p>
          )}
        </div>

        {/* Exam Selection */}
        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Exam</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full disabled:cursor-not-allowed disabled:bg-gray-200"
            {...register("examId")}
            disabled={selectedType !== "exam"}
          >
            <option value="">
              {selectedType !== "exam" 
                ? "Select type 'exam' first" 
                : "Select an Exam"}
            </option>
            {exams?.map((exam: any) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
          {errors.examId?.message && (
            <p className="text-xs text-red-500">{errors.examId.message}</p>
          )}
        </div>

        {/* Assignment Selection */}
        <div className="flex flex-col gap-2 w-full md:w-[45%]">
          <label className="text-xs text-gray-400">Assignment</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full disabled:cursor-not-allowed disabled:bg-gray-200"
            {...register("assignmentId")}
            disabled={selectedType !== "assignment"}
          >
            <option value="">
              {selectedType !== "assignment" 
                ? "Select type 'assignment' first" 
                : "Select an Assignment"}
            </option>
            {assignments?.map((assignment: any) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
          {errors.assignmentId?.message && (
            <p className="text-xs text-red-500">{errors.assignmentId.message}</p>
          )}
        </div>
        
        {/* Student Selection */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-400">Student</label>
          <select
            className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full ${
              loading ? "opacity-70" : ""
            } ${students.length === 0 ? "disabled:cursor-not-allowed disabled:bg-gray-200" : ""}`}
            {...register("studentId")}
            disabled={students.length === 0 || loading}
          >
            <option value="">{getStudentPlaceholderText()}</option>
            {students.map((student: any) => (
              <option key={student.id} value={student.id}>
                {student.name} {student.surname}
              </option>
            ))}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-500">{errors.studentId.message}</p>
          )}
        </div>
        
        {/* Score Input */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-400">Score</label>
          <input
            type="number"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("score")}
            min="0"
            max="100"
          />
          {errors.score?.message && (
            <p className="text-xs text-red-500">{errors.score.message}</p>
          )}
        </div>
      </div>
      
      <button 
        className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition-colors" 
        disabled={loading}
      >
        {loading ? "Loading..." : type === "create" ? "Register" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;