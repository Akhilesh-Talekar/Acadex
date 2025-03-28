import React from 'react'
import Preformance from './Preformance'
import prisma from '@/lib/prisma';
import { getRandomInRange } from '@/lib/utils';

const PerformanceContainer = async({id, type}:{id?:string, type:string}) => {

    let data:any = [];
    const randomScore = type === 'teacher' ? getRandomInRange({min: 85, max: 93}) : 0;

    switch (type) {
        case 'student':
            let studentPerformance = await prisma.result.findMany({
                where:{
                    studentId: id
                }
            })
            let totalResults = studentPerformance.length;
            let totalMarks = studentPerformance.reduce((acc, curr) => acc + curr.score, 0);
            let average = totalMarks / totalResults;
            data = [
                { name: "Average", value: average, fill: "#C3EBFA" },
                { name: "notAverage", value: 100 - average, fill: "#FAE27C" },
            ]
            break;

        default:
            break;
    }

  return (
    <Preformance data={data} random={randomScore}/>
  )
}

export default PerformanceContainer
