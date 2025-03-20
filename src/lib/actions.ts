"use server";

import { revalidatePath } from "next/cache";
import { createSubjectType } from "../../types";
import prisma from "./prisma";

export const createSubject = async (data:createSubjectType) => {
    try{
        await prisma.subject.create({
            data:{
                name: data.name,
            }
        });

        revalidatePath("/list/subjects")   
        return {success: true, message: "Subject created successfully"}
    }
    catch(err){
        console.log("Error while creating subject", err);
        return {success: false, message: "Something went wrong"}
    }
};