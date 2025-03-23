import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalander";
import BigCalanderContainer from "@/components/BigCalanderContainer";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Preformance from "@/components/Preformance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { getRole } from "@/lib/utils";
import { Attendance, Class, Grade, Lesson, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { role } = await getRole();
  const student = (await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      class: {
        include: {
          lessons: true,
        },
      },
      grade: true,
    },
  })) as Student & { class: Class & { lessons: Lesson[] } } & { grade: Grade };

  if (!student) {
    return (
      <div className="fixed left-0 right-0 h-full w-full flex justify-center items-center">
        <h1 className="text-[80px] font-bold text-lamaPurple">
          Student not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/*LEFT*/}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={student?.img ? student.img : "/noAvatar.png"}
                alt="profile"
                height={144}
                width={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>

            <div className="w-2/3 flex flex-col gap-4 justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text=xl font-semibold">
                  {student.name + " " + student.surname}
                </h1>
                <FormContainer table="student" type="update" data={student}/>
              </div>
              <p className="text-sm text-gray-500">
                Class topper with exilence in all subjects expecially maths
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/date.png"} alt="BG" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("en-IN").format(student.birthday)}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/phone.png"} alt="BG" width={14} height={14} />
                  <span>{student?.phone || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/mail.png"} alt="BG" width={14} height={14} />
                  <span>{student?.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/blood.png"} alt="BG" width={14} height={14} />
                  <span>{student?.bloodType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* OTHER CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={"/singleAttendance.png"}
                alt="Attendance"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <Suspense fallback="loading...">
                <StudentAttendanceCard id={student.id}/>
              </Suspense>
            </div>

            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={"/singleClass.png"}
                alt="Attendance"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={"/singleLesson.png"}
                alt="Attendance"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class.lessons.length}</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={"/singleBranch.png"}
                alt="Attendance"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.grade.level}</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="text-xl font-semibold">Stundent's Schedule</h1>
          <BigCalanderContainer type="classId" id={student.classId}/>
        </div>
      </div>

      {/*RIGHT*/}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link href={`/classes/result?studentId=${student.id}`} className="p-3 rounded-md bg-lamaSkyLight">
              Students's Results
            </Link>
            <Link
              href={`/list/teachers?classId=${student.classId}`}
              className="p-3 rounded-md bg-lamaPurpleLight"
            >
              Students's Teachers
            </Link>
            <Link href={`/list/lessons?classId=${student.classId}`} className="p-3 rounded-md bg-lamaYellowLight">
              Students's Lessons
            </Link>
            <Link href={`/list/exams?studentId=${student.id}`} className="p-3 rounded-md bg-pink-50">
              Students's Exams
            </Link>
            <Link href={`/list/assignments?studentId=${student.id}`} className="p-3 rounded-md bg-lamaSkyLight">
              Students's Assignments
            </Link>
          </div>
        </div>
        <Preformance />
        <Announcement />
      </div>
    </div>
  );
};

export default SingleStudentPage;
