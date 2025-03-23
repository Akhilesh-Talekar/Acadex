import React from "react";
import { formDataProps } from "../../types";
import FormModal from "./FormModal";
import prisma from "@/lib/prisma";

const FormContainer = async ({ table, type, data, id }: formDataProps) => {
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeacher = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });
        relatedData = { teachers: subjectTeacher };
        break;

      case "class":
        const classGrades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });

        const classSupervisors = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });
        relatedData = { grades: classGrades, supervisors: classSupervisors };
        break;

      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedData = { subjects: teacherSubjects };
        break;

      case "student":
        const studentClass = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
            capacity: true,
            grade: {
              select: {
                level: true,
              },
            },
            _count: {
              select: {
                students: true,
              },
            }
          }
        });

        const studentGrade = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        relatedData = { classes: studentClass, grades: studentGrade };
        break;

      case "parent":
        const students = await prisma.student.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        })
        relatedData = { students: students };
        break;


      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
