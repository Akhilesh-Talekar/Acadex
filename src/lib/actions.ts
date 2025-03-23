"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { SubjectSchema } from "@/components/forms/SubjectForm";
import { ClassSchema } from "@/components/forms/ClassFrom";
import { TeacherSchema } from "@/components/forms/TeacherForm";
import { createClerkClient } from "@clerk/nextjs/server";
import { StudentSchema } from "@/components/forms/StudentForm";
import { ParentSchema } from "@/components/forms/ParentForm";

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
