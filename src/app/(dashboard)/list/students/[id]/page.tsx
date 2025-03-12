import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalander";
import FormModal from "@/components/FormModal";
import Preformance from "@/components/Preformance";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SingleStudentPage = () => {
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
                src={
                  "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
                alt="profile"
                height={144}
                width={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>

            <div className="w-2/3 flex flex-col gap-4 justify-between">
            <div className="flex items-center gap-4">
                <h1 className="text=xl font-semibold">Chrissy Wans</h1>
                <FormModal
                  table="student"
                  type="update"
                  data={{
                    id: 1,
                    username: "LoganPaul",
                    password: "password",
                    firstName: "Logan",
                    lastName: "Paul",
                    phone: "5793164822",
                    address: "Logan's House",
                    bloodType: "A+",
                    dateOfBirth: "08-03-2025",
                    sex: "male",
                    img: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Class topper with exilence in all subjects expecially maths
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/date.png"} alt="BG" width={14} height={14} />
                  <span>08-03-2025</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/phone.png"} alt="BG" width={14} height={14} />
                  <span>5793164822</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/mail.png"} alt="BG" width={14} height={14} />
                  <span>LoganYapper@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src={"/blood.png"} alt="BG" width={14} height={14} />
                  <span>A+</span>
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
                <h1 className="text-xl font-semibold">6A</h1>
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
                <h1 className="text-xl font-semibold">18</h1>
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
                <h1 className="text-xl font-semibold">6th</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="text-xl font-semibold">Stundent's Schedule</h1>
          <BigCalendar />
        </div>
      </div>

      {/*RIGHT*/}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link href={"/"} className="p-3 rounded-md bg-lamaSkyLight">
              Students's Results
            </Link>
            <Link href={"/"} className="p-3 rounded-md bg-lamaPurpleLight">
              Students's Teachers
            </Link>
            <Link href={"/"} className="p-3 rounded-md bg-lamaYellowLight">
              Students's Lessons
            </Link>
            <Link href={"/"} className="p-3 rounded-md bg-pink-50">
              Students's Exams
            </Link>
            <Link href={"/"} className="p-3 rounded-md bg-lamaSkyLight">
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
