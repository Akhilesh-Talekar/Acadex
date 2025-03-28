import Announcement from "@/components/Announcement";
import BigCalanderContainer from "@/components/BigCalanderContainer";
import FormContainer from "@/components/FormContainer";
import PerformanceContainer from "@/components/PerformanceContainer";
import Preformance from "@/components/Preformance";
import prisma from "@/lib/prisma";
import { getRole } from "@/lib/utils";
import { Class, Lesson, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SingleTeacherPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { role } = await getRole();
  const teacher = (await prisma.teacher.findUnique({
    where: {
      id,
    },
    include: {
      classes: true,
      lessons: true,
      subjects: true,
    },
  })) as Teacher & {classes: Class[]} & {lessons: Lesson[]} & {subjects: Class[]};

  if (!teacher) {
    return (
      <div className="fixed left-0 right-0 h-full w-full flex justify-center items-center">
        <h1 className="text-[80px] font-bold text-lamaPurple">
          Teacher not Found
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
                src={teacher?.img ? teacher.img : "/noAvatar.png"}
                alt="profile"
                height={144}
                width={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>

            <div className="w-2/3 flex flex-col gap-4 justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text=xl font-semibold">
                  {teacher.name + " " + teacher.surname}
                </h1>
                {role === "admin" && (
                  <FormContainer table="teacher" type="update" data={teacher} />
                )}
              </div>
              <p className="text-sm text-gray-500">
                A teacher is a mentor, guide, and professional explainer—turning
                confusion into clarity, one lesson at a time. Armed with
                patience and caffeine, they shape minds and futures beyond the
                classroom.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/date.png"} alt="BG" width={14} height={14} />
                  <span>{new Intl.DateTimeFormat("en-IN").format(teacher.birthday)}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/phone.png"} alt="BG" width={14} height={14} />
                  <span>{teacher.phone || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/mail.png"} alt="BG" width={14} height={14} />
                  <span>{teacher.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/blood.png"} alt="BG" width={14} height={14} />
                  <span>{teacher.bloodType}</span>
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
              <div>
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
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
                <h1 className="text-xl font-semibold">{teacher?.classes.length}</h1>
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
                <h1 className="text-xl font-semibold">{teacher?.lessons.length}</h1>
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
                <h1 className="text-xl font-semibold">{teacher?.subjects.length}</h1>
                <span className="text-sm text-gray-400">Subjects</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="text-xl font-semibold">Teachers Schedule</h1>
          <BigCalanderContainer type="teacherId" id={teacher?.id!} />
        </div>
      </div>

      {/*RIGHT*/}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link href={`/list/classes?supervisorId=${teacher.id}`} className="p-3 rounded-md bg-lamaSkyLight">
              Teacher's Classes
            </Link>
            <Link href={`/list/students?teacherId=${teacher.id}`} className="p-3 rounded-md bg-lamaPurpleLight">
              Teacher's Students
            </Link>
            <Link href={`/list/lessons?teacherId=${teacher.id}`} className="p-3 rounded-md bg-lamaYellowLight">
              Teacher's Lessons
            </Link>
            <Link href={`/list/exams?teacherId=${teacher.id}`} className="p-3 rounded-md bg-pink-50">
              Teacher's Exams
            </Link>
            <Link href={`/list/assignments?teacherId=${teacher.id}`} className="p-3 rounded-md bg-lamaSkyLight">
              Teacher's Assignments
            </Link>
          </div>
        </div>
        <PerformanceContainer type="teacher" id={teacher.id}/>
        <Announcement />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
