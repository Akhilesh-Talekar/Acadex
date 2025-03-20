import prisma from '@/lib/prisma'
import React from 'react'
import BigCalendar from './BigCalander';
import { title } from 'process';
import { adjustScheduleTOCurrentWeek } from '@/lib/utils';

const BigCalanderContainer = async({type, id}:{type: "teacherId" | "classId", id: string | number}) => {

    const query:{[key:string]:string | number} = {};
    switch(type){
        case "teacherId":
        query.teacherId = id as string;
        break;
        
        case "classId":
        query.classId = id as number;
    }
    
    const dataRes = await prisma.lesson.findMany({
        where: query,
    });

    const data = dataRes.map((lesson) => {
        return {
            title: lesson.name,
            start: lesson.startTime,
            end: lesson.endTime,
        }
    })

    const schedule = adjustScheduleTOCurrentWeek(data);

  return (
    
    <div>
      <BigCalendar data={schedule}/>
    </div>
  )
}

export default BigCalanderContainer
