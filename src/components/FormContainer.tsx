import React from "react";
import { formDataProps } from "../../types";
import FormModal from "./FormModal";
import prisma from "@/lib/prisma";
import { getRole } from "@/lib/utils";

const FormContainer = async ({ table, type, data, id }: formDataProps) => {
  let relatedData = {};
  let {role, currUserId} = await getRole();

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

      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where:{
            ...(role === "teacher" ? {teacherId: String(currUserId)} : {})
          },
          select:{
            id:true,
            name:true,
            subject:{
              select:{
                name:true
              }
            },
            class:{
              select:{
                name:true,
                grade:{
                  select:{
                    level:true
                  }
                }
              }
            }
          }
        });
        relatedData = { lessons: examLessons };
        break;

      case "assignment":
        const assignmentLessons = await prisma.lesson.findMany({
          where:{
            ...(role === "teacher" ? {teacherId: String(currUserId)} : {})
          },
          select:{
            id:true,
            name:true,
            subject:{
              select:{
                name:true
              }
            },
            class:{
              select:{
                name:true,
                grade:{
                  select:{
                    level:true
                  }
                }
              }
            }
          }
        });
        relatedData = { lessons: assignmentLessons };
        break;

      case "announcement":
        const announcementClasses = await prisma.class.findMany({
          select:{
            id:true,
            name:true,
            grade:{
              select:{
                level:true
              }
            }
          }
        });
        relatedData = { classes: announcementClasses };
        break;

      case "event": 
      const eventClasses = await prisma.class.findMany({
        select:{
          id:true,
          name:true,
          grade:{
            select:{
              level:true
            }
          }
        }
      });
      relatedData = {classes: eventClasses};
      break;

    case "lesson":
      const lessonClasses = await prisma.class.findMany({
        select:{
          id:true,
          name:true,
          grade:{
            select:{
              level:true
            }
          }
        }
      });

      const lessonSubjects = await prisma.subject.findMany({
        select:{
          id:true,
          name:true,
          teachers:{
            select:{
              id:true,
              name:true,
              surname:true
            }
          }
        }
      });
      relatedData = {classes: lessonClasses, subjects: lessonSubjects};
      break;

      case "attendance":
        const attendanceData = await prisma.lesson.findMany({
          select:{
            id:true,
            name:true,
            subject:{
              select:{
                name:true
              }
            },
            class:{
              select:{
                students:{
                  select:{
                    id:true,
                    name:true,
                    surname:true
                  }
                }
              }
            }
          
          }
        });
        relatedData = {lessons: attendanceData};
        break;

      case "result":
        const resultExamData = await prisma.exam.findMany({
          where: {
            ...(role === "teacher" ? {lesson:{
              teacherId: String(currUserId)
            }} : {})
          },
          select:{
            id:true,
            title:true,
            lesson:{
              select:{
                class:{
                  select:{
                    students:true,
                  }
                }
              }
            }
          }
        })

        const resultAssignmentData = await prisma.assignment.findMany({
          where:{
            ...(role === "teacher" ? {lesson:{
              teacherId: String(currUserId)
            }} : {})
          },
          select:{
            id:true,
            title:true,
            lesson:{
              select:{
                class:{
                  select:{
                    students:true,
                  }
                }
              }
            }
          }
        });
        relatedData = {exams: resultExamData, assignments: resultAssignmentData};
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
