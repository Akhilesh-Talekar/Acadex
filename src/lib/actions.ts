"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { SubjectSchema } from "@/components/forms/SubjectForm";
import { ClassSchema } from "@/components/forms/ClassFrom";
import { TeacherSchema } from "@/components/forms/TeacherForm";
import { createClerkClient } from "@clerk/nextjs/server";
import { StudentSchema } from "@/components/forms/StudentForm";
import { ParentSchema } from "@/components/forms/ParentForm";
import { ExamSchema } from "@/components/forms/ExamForm";
import { AssignmentSchema } from "@/components/forms/AssignmentForm";
import { AnnouncementSchema } from "@/components/forms/AnnounementForm";
import { EventSchema } from "@/components/forms/EventForm";
import { LessonSchema } from "@/components/forms/LessonForm";
import { AttendanceSchema } from "@/components/forms/AttendanceForm";
import { ResultSchema } from "@/components/forms/ResultForm";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const createSubject = async (dataFromForm: SubjectSchema) => {
  try {
    await prisma.subject.create({
      data: {
        name: dataFromForm.name,
        teachers: {
          connect: dataFromForm.teachers?.map((teacherId) => ({
            id: teacherId,
          })),
        },
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, message: "Subject created successfully" };
  } catch (err) {
    console.log("Error while creating subject", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateSubject = async ({
  id,
  dataFromForm,
}: {
  id: number;
  dataFromForm: SubjectSchema;
}) => {
  try {
    await prisma.subject.update({
      where: {
        id: Number(id),
      },
      data: {
        name: dataFromForm.name,
        teachers: {
          set: dataFromForm.teachers?.map((teacherId) => ({
            id: teacherId,
          })),
        },
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, message: "Subject updated successfully" };
  } catch (err) {
    console.log("Error while updating subject", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteSubject = async (id: number) => {
  try {
    await prisma.subject.delete({
      where: {
        id: Number(id),
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, message: "Subject deleted successfully" };
  } catch (err) {
    console.log("Error while deleting subject", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Class Form Actions
export const createClass = async (dataFromForm: ClassSchema) => {
  try {
    await prisma.class.create({
      data: {
        ...dataFromForm,
      },
    });

    revalidatePath("/list/classes");
    return { success: true, message: "Class created successfully" };
  } catch (err) {
    console.log("Error while creating Class", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateClass = async ({
  id,
  dataFromForm,
}: {
  id: number;
  dataFromForm: ClassSchema;
}) => {
  try {
    await prisma.class.update({
      where: {
        id: Number(id),
      },
      data: {
        ...dataFromForm,
      },
    });

    revalidatePath("/list/classes");
    return { success: true, message: "Class updated successfully" };
  } catch (err) {
    console.log("Error while updating Class", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteClass = async (id: number) => {
  try {
    await prisma.class.delete({
      where: {
        id: Number(id),
      },
    });

    revalidatePath("/list/classes");
    return { success: true, message: "Class deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Class", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Teacher Form Actions
export const createTeacher = async (dataFromForm: TeacherSchema) => {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [
        dataFromForm.email || `${dataFromForm.username}@example.com`,
      ],
      username: dataFromForm.username,
      password: dataFromForm.password,
      firstName: dataFromForm.name,
      lastName: dataFromForm.surname,
      publicMetadata: {
        role: "teacher",
      },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: dataFromForm.username,
        name: dataFromForm.name,
        surname: dataFromForm.surname,
        email: dataFromForm.email,
        phone: dataFromForm.phone,
        address: dataFromForm.address,
        img: dataFromForm.img,
        bloodType: dataFromForm.bloodType,
        sex: dataFromForm.sex,
        subjects: {
          connect: dataFromForm.subjects?.map((subjectId) => {
            return { id: Number(subjectId) };
          }),
        },
        birthday: dataFromForm.birthday,
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, message: "Teacher created successfully" };
  } catch (err) {
    console.log("Error while creating Teacher", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateTeacher = async ({
  id,
  dataFromForm,
}: {
  id: string;
  dataFromForm: TeacherSchema;
}) => {
  if (!id) return { success: false, message: "Teacher not found" };
  try {
    const user = await clerkClient.users.updateUser(id, {
      username: dataFromForm.username,
      ...(dataFromForm.password !== "" && { password: dataFromForm.password }),
      firstName: dataFromForm.name,
      lastName: dataFromForm.surname,
    });

    await prisma.teacher.update({
      where: {
        id: id,
      },
      data: {
        username: dataFromForm.username,
        ...(dataFromForm.password !== "" && {
          password: dataFromForm.password,
        }),
        name: dataFromForm.name,
        surname: dataFromForm.surname,
        email: dataFromForm.email,
        phone: dataFromForm.phone,
        address: dataFromForm.address,
        img: dataFromForm.img,
        bloodType: dataFromForm.bloodType,
        sex: dataFromForm.sex,
        subjects: {
          set: dataFromForm.subjects?.map((subjectId) => {
            return { id: Number(subjectId) };
          }),
        },
        birthday: dataFromForm.birthday,
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, message: "Teacher updated successfully" };
  } catch (err) {
    console.log("Error while updating Teacher", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteTeacher = async (id: string) => {
  try {
    const user = await clerkClient.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, message: "Teacher deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Teacher", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Student Form Actions
export const createStudent = async (dataFromForm: StudentSchema) => {
  try {
    const classCapacity = await prisma.class.findUnique({
      where: {
        id: Number(dataFromForm.classId),
      },
      include: {
        students: true,
      },
    });

    if (classCapacity?.students.length! >= classCapacity!.capacity) {
      return { success: false, message: "Class is full" };
    }

    const user = await clerkClient.users.createUser({
      emailAddress: [
        dataFromForm.email || `${dataFromForm.username}@example.com`,
      ],
      username: dataFromForm.username,
      password: dataFromForm.password,
      firstName: dataFromForm.name,
      lastName: dataFromForm.surname,
      publicMetadata: {
        role: "student",
      },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: dataFromForm.username,
        name: dataFromForm.name,
        surname: dataFromForm.surname,
        email: dataFromForm.email,
        phone: dataFromForm.phone,
        address: dataFromForm.address,
        img: dataFromForm.img,
        bloodType: dataFromForm.bloodType,
        sex: dataFromForm.sex,
        classId: Number(dataFromForm.classId),
        parentId: dataFromForm.parentId,
        gradeId: Number(dataFromForm.gradeId),
        birthday: dataFromForm.birthday,
      },
    });

    revalidatePath("/list/students");
    return { success: true, message: "Student created successfully" };
  } catch (err) {
    console.log("Error while creating Student", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateStudent = async ({
  id,
  dataFromForm,
}: {
  id: string;
  dataFromForm: StudentSchema;
}) => {
  if (!id) return { success: false, message: "Student not found" };
  try {
    const user = await clerkClient.users.updateUser(id, {
      username: dataFromForm.username,
      ...(dataFromForm.password !== "" && { password: dataFromForm.password }),
      firstName: dataFromForm.name,
      lastName: dataFromForm.surname,
    });

    await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        username: dataFromForm.username,
        ...(dataFromForm.password !== "" && {
          password: dataFromForm.password,
        }),
        name: dataFromForm.name,
        surname: dataFromForm.surname,
        email: dataFromForm.email,
        phone: dataFromForm.phone,
        address: dataFromForm.address,
        img: dataFromForm.img,
        bloodType: dataFromForm.bloodType,
        sex: dataFromForm.sex,
        classId: Number(dataFromForm.classId),
        parentId: dataFromForm.parentId,
        gradeId: Number(dataFromForm.gradeId),
        birthday: dataFromForm.birthday,
      },
    });

    revalidatePath("/list/students");
    return { success: true, message: "Student updated successfully" };
  } catch (err) {
    console.log("Error while updating Student", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const user = await clerkClient.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/students");
    return { success: true, message: "Student deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Student", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Parent Form Actions

export const createParent = async (dataFromForm: ParentSchema) => {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [
        dataFromForm.email || `${dataFromForm.username}@example.com`,
      ],
      username: dataFromForm.username,
      password: dataFromForm.password,
      firstName: dataFromForm.name,
      lastName: dataFromForm.surname,
      publicMetadata: {
        role: "parent",
      },
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: dataFromForm.username,
        name: dataFromForm.name,
        surname: dataFromForm.surname,
        email: dataFromForm.email,
        phone: dataFromForm.phone,
        address: dataFromForm.address,
        students: {
          connect: dataFromForm.students?.map((student) => {
            return { id: student };
          }),
        },
      },
    });

    revalidatePath("/list/parent");
    return { success: true, message: "Parent created successfully" };
  } catch (err) {
    console.log("Error while creating Parent", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateParent = async ({
  id,
  dataFromForm,
}: {
  id: string;
  dataFromForm: ParentSchema;
}) => {
  if (!id) return { success: false, message: "Student not found" };
  try {
    const user = await clerkClient.users.updateUser(id, {
      username: dataFromForm.username,
      ...(dataFromForm.password !== "" && { password: dataFromForm.password }),
      firstName: dataFromForm.name,
      lastName: dataFromForm.surname,
    });

    await prisma.parent.update({
      where: {
        id: id,
      },
      data: {
        username: dataFromForm.username,
        ...(dataFromForm.password !== "" && {
          password: dataFromForm.password,
        }),
        name: dataFromForm.name,
        surname: dataFromForm.surname,
        email: dataFromForm.email,
        phone: dataFromForm.phone,
        address: dataFromForm.address,
        students: {
          set: dataFromForm.students?.map((student) => {
            return { id: student };
          }),
        },
      },
    });

    revalidatePath("/list/parents");
    return { success: true, message: "Parent updated successfully" };
  } catch (err) {
    console.log("Error while updating Parent", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteParent = async (id: string) => {
  try {
    const user = await clerkClient.users.deleteUser(id);

    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/parents");
    return { success: true, message: "Parent deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Parent", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Exam Form Actions

export const createExam = async (dataFromForm: ExamSchema) => {
  try {
    let examStart = new Date(dataFromForm.date);
    examStart.setHours(
      Number(dataFromForm.startHour),
      Number(dataFromForm.startMin),
      0,
      0
    );
    let examEnd = new Date(dataFromForm.date);
    examEnd.setHours(
      Number(dataFromForm.endHour),
      Number(dataFromForm.endMin),
      0,
      0
    );

    await prisma.exam.create({
      data: {
        title: dataFromForm.title,
        startTime: examStart,
        endTime: examEnd,
        lessonId: dataFromForm.lessonId,
      },
    });

    revalidatePath("/list/exams");
    return { success: true, message: "Exam created successfully" };
  } catch (err) {
    console.log("Error while creating Exam", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateExam = async ({
  id,
  dataFromForm,
}: {
  id: number;
  dataFromForm: ExamSchema;
}) => {
  if (!id) return { success: false, message: "Exam not found" };
  try {
    let examStart = new Date(dataFromForm.date);
    examStart.setHours(
      Number(dataFromForm.startHour),
      Number(dataFromForm.startMin),
      0,
      0
    );
    let examEnd = new Date(dataFromForm.date);
    examEnd.setHours(
      Number(dataFromForm.endHour),
      Number(dataFromForm.endMin),
      0,
      0
    );

    await prisma.exam.update({
      where: {
        id: id,
      },
      data: {
        title: dataFromForm.title,
        startTime: examStart,
        endTime: examEnd,
        lessonId: dataFromForm.lessonId,
      },
    });

    revalidatePath("/list/exams");
    return { success: true, message: "Exam updated successfully" };
  } catch (err) {
    console.log("Error while updating Exam", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteExam = async (id: number) => {
  try {
    await prisma.exam.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/exams");
    return { success: true, message: "Exam deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Exam", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Assignment Form Actions

export const createAssignment = async (dataFromForm: AssignmentSchema) => {
  try {
    await prisma.assignment.create({
      data: {
        title: dataFromForm.title,
        startDate: new Date(dataFromForm.startDate),
        dueDate: new Date(dataFromForm.endDate),
        lessonId: dataFromForm.lessonId,
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, message: "Assignment created successfully" };
  } catch (err) {
    console.log("Error while creating Assignment", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateAssignment = async ({
  id,
  dataFromForm,
}: {
  id: number;
  dataFromForm: AssignmentSchema;
}) => {
  if (!id) return { success: false, message: "Assignment not found" };
  try {
    await prisma.assignment.update({
      where: {
        id: id,
      },
      data: {
        title: dataFromForm.title,
        startDate: new Date(dataFromForm.startDate),
        dueDate: new Date(dataFromForm.endDate),
        lessonId: dataFromForm.lessonId,
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, message: "Assignment updated successfully" };
  } catch (err) {
    console.log("Error while updating Assignment", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteAssignment = async (id: number) => {
  try {
    await prisma.assignment.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, message: "Assignment deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Assignment", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Announcement Form Actions

export const createAnnouncement = async (dataFromForm: AnnouncementSchema) => {
  try {
    await prisma.announcement.create({
      data: {
        title: dataFromForm.title,
        description: dataFromForm.description,
        date: new Date(dataFromForm.date),
        classId: dataFromForm.classId === 0 ? null : dataFromForm.classId,
      },
    });

    revalidatePath("/list/announcements");
    return { success: true, message: "Announcement created successfully" };
  } catch (err) {
    console.log("Error while creating Announcement", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateAnnouncement = async ({
  id,
  dataFromForm,
}: {
  id: number;
  dataFromForm: AnnouncementSchema;
}) => {
  if (!id) return { success: false, message: "Announcement not found" };
  try {
    await prisma.announcement.update({
      where: {
        id: id,
      },
      data: {
        title: dataFromForm.title,
        description: dataFromForm.description,
        date: new Date(dataFromForm.date),
        classId: dataFromForm.classId === 0 ? null : dataFromForm.classId,
      },
    });

    revalidatePath("/list/announcements");
    return { success: true, message: "Announcement updated successfully" };
  } catch (err) {
    console.log("Error while updating Announcement", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteAnnouncement = async (id: number) => {
  try {
    await prisma.announcement.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/announcements");
    return { success: true, message: "Announcement deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Announcement", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Event Form Actions

export const createEvent = async (dataFromForm: EventSchema) => {
  try {
    let eventStart = new Date(dataFromForm.date);
    eventStart.setHours(
      Number(dataFromForm.startHour),
      Number(dataFromForm.startMin),
      0,
      0
    );
    let eventEnd = new Date(dataFromForm.date);
    eventEnd.setHours(
      Number(dataFromForm.endHour),
      Number(dataFromForm.startMin),
      0,
      0
    );

    await prisma.event.create({
      data: {
        title: dataFromForm.title,
        description: dataFromForm.description,
        startTime: eventStart,
        endTime: eventEnd,
        classId: dataFromForm.classId === 0 ? null : dataFromForm.classId,
      },
    });

    revalidatePath("/list/events");
    return { success: true, message: "Event created successfully" };
  } catch (err) {
    console.log("Error while creating Event", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateEvent = async ({
  id,
  dataFromForm,
}: {
  id: number;
  dataFromForm: EventSchema;
}) => {
  if (!id) return { success: false, message: "Event not found" };
  try {
    let eventStart = new Date(dataFromForm.date);
    eventStart.setHours(
      Number(dataFromForm.startHour),
      Number(dataFromForm.startMin),
      0,
      0
    );
    let eventEnd = new Date(dataFromForm.date);
    eventEnd.setHours(
      Number(dataFromForm.endHour),
      Number(dataFromForm.startMin),
      0,
      0
    );

    await prisma.event.update({
      where: {
        id: id,
      },
      data: {
        title: dataFromForm.title,
        description: dataFromForm.description,
        startTime: eventStart,
        endTime: eventEnd,
        classId: dataFromForm.classId === 0 ? null : dataFromForm.classId,
      },
    });

    revalidatePath("/list/events");
    return { success: true, message: "Event updated successfully" };
  } catch (err) {
    console.log("Error while updating Event", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteEvent = async (id: number) => {
  try {
    await prisma.event.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/events");
    return { success: true, message: "Announcement deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Announcement", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Lesson Form Actions

export const createLesson = async (dataFromForm: LessonSchema) => {
  try {
    enum Weekday {
      MONDAY = "MONDAY",
      TUESDAY = "TUESDAY",
      WEDNESDAY = "WEDNESDAY",
      THURSDAY = "THURSDAY",
      FRIDAY = "FRIDAY",
    }
    let lessonStart = new Date(dataFromForm.date);
    // Mapping JavaScript's getDay() output (0-6) to Weekday enum
    const dayMap: { [key: number]: Weekday } = {
      1: Weekday.MONDAY,
      2: Weekday.TUESDAY,
      3: Weekday.WEDNESDAY,
      4: Weekday.THURSDAY,
      5: Weekday.FRIDAY,
    };

    const dayOfWeek = lessonStart.getDay(); // Returns a number (0 = Sunday, 1 = Monday, etc.)
    const weekday = dayMap[dayOfWeek] || null; // Get corresponding enum value
    let lessonEnd = new Date(dataFromForm.date);
    lessonStart.setHours(
      Number(dataFromForm.startHour),
      Number(dataFromForm.startMin),
      0,
      0
    );
    lessonEnd.setHours(
      Number(dataFromForm.endHour),
      Number(dataFromForm.startMin),
      0,
      0
    );

    await prisma.lesson.create({
      data: {
        name: dataFromForm.name,
        day: weekday,
        startTime: lessonStart,
        endTime: lessonEnd,
        teacherId: dataFromForm.teacherId,
        subjectId: dataFromForm.subjectId,
        classId: dataFromForm.classId,
      },
    });

    revalidatePath("/list/lessons");
    return { success: true, message: "Lesson created successfully" };
  } catch (err) {
    console.log("Error while creating Lesson", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateLesson = async ({
  id,
  dataFromForm,
}: {
  id: number;
  dataFromForm: LessonSchema;
}) => {
  if (!id) return { success: false, message: "Lesson not found" };
  try {
    enum Weekday {
      MONDAY = "MONDAY",
      TUESDAY = "TUESDAY",
      WEDNESDAY = "WEDNESDAY",
      THURSDAY = "THURSDAY",
      FRIDAY = "FRIDAY",
    }
    let lessonStart = new Date(dataFromForm.date);
    // Mapping JavaScript's getDay() output (0-6) to Weekday enum
    const dayMap: { [key: number]: Weekday } = {
      1: Weekday.MONDAY,
      2: Weekday.TUESDAY,
      3: Weekday.WEDNESDAY,
      4: Weekday.THURSDAY,
      5: Weekday.FRIDAY,
    };

    const dayOfWeek = lessonStart.getDay(); // Returns a number (0 = Sunday, 1 = Monday, etc.)
    const weekday = dayMap[dayOfWeek] || null; // Get corresponding enum value
    let lessonEnd = new Date(dataFromForm.date);
    lessonStart.setHours(
      Number(dataFromForm.startHour),
      Number(dataFromForm.startMin),
      0,
      0
    );
    lessonEnd.setHours(
      Number(dataFromForm.endHour),
      Number(dataFromForm.startMin),
      0,
      0
    );

    await prisma.lesson.update({
      where: {
        id: id,
      },
      data: {
        name: dataFromForm.name,
        day: weekday,
        startTime: lessonStart,
        endTime: lessonEnd,
        teacherId: dataFromForm.teacherId,
        subjectId: dataFromForm.subjectId,
        classId: dataFromForm.classId,
      },
    });

    revalidatePath("/list/lessons");
    return { success: true, message: "Lesson updated successfully" };
  } catch (err) {
    console.log("Error while updating Lesson", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteLesson = async (id: number) => {
  try {
    await prisma.lesson.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/events");
    return { success: true, message: "Lesson deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Lesson", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Attendance Form Actions

export const createAttendance = async (dataFromForm: AttendanceSchema) => {
  try {
    let status = dataFromForm.status === "present" ? true : false;

    await prisma.attendance.create({
      data: {
        date: new Date(dataFromForm.date),
        present: status,
        lessonId: dataFromForm.lessonId,
        studentId: dataFromForm.studentId,
      },
    });

    revalidatePath("/list/attendance");
    return { success: true, message: "Attendance created successfully" };
  } catch (err) {
    console.log("Error while creating Attendance", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateAttendance = async ({
  id,
  dataFromForm,
}: {
  id: number;
  dataFromForm: AttendanceSchema;
}) => {
  if (!id) return { success: false, message: "Attendance not found" };
  try {

    let status = dataFromForm.status === "present" ? true : false;

    await prisma.attendance.update({
      where: {
        id: id,
      },
      data: {
        date: new Date(dataFromForm.date),
        present: status,
        lessonId: dataFromForm.lessonId,
        studentId: dataFromForm.studentId,
      },
    });

    revalidatePath("/list/attendance");
    return { success: true, message: "Attendance updated successfully" };
  } catch (err) {
    console.log("Error while updating Attendance", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteAttendance = async (id: number) => {
  try {
    await prisma.attendance.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/attendance");
    return { success: true, message: "Attendance deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Attendance", err);
    return { success: false, message: "Something went wrong" };
  }
};

// Result Form Actions

export const createResult = async (dataFromForm: ResultSchema) => {
  try {

    await prisma.result.create({
      data: {
        score: dataFromForm.score,
        studentId: dataFromForm.studentId,
        examId: dataFromForm?.examId ? Number(dataFromForm.examId) : null,
        assignmentId: dataFromForm?.assignmentId ? Number(dataFromForm.assignmentId) : null,
      },
    });

    revalidatePath("/list/attendance");
    return { success: true, message: "Result created successfully" };
  } catch (err) {
    console.log("Error while creating Result", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const updateResult = async ({
  id,
  dataFromForm,
}: {
  id: number;
  dataFromForm: ResultSchema;
}) => {
  if (!id) return { success: false, message: "Result not found" };
  try {

    await prisma.result.update({
      where: {
        id: id,
      },
      data: {
        score: dataFromForm.score,
        studentId: dataFromForm.studentId,
        examId: dataFromForm?.examId ? Number(dataFromForm.examId) : null,
        assignmentId: dataFromForm?.assignmentId ? Number(dataFromForm.assignmentId) : null,
      },
    });

    revalidatePath("/list/results");
    return { success: true, message: "Result updated successfully" };
  } catch (err) {
    console.log("Error while updating Result", err);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteResult = async (id: number) => {
  try {
    await prisma.result.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/result");
    return { success: true, message: "Result deleted successfully" };
  } catch (err) {
    console.log("Error while deleting Result", err);
    return { success: false, message: "Something went wrong" };
  }
};

