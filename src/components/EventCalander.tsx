"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


const EventCalander = () => {
  const router = useRouter();
  const [value, onChange] = useState<Value>(new Date());

  useEffect(() => {
    if(value instanceof Date){
      router.push(`?date=${value}`);
    }
  },[value,router]);

  
  return (
    <Calendar onChange={onChange} value={value} locale="en-IN"/>
  );
};

export default EventCalander;
