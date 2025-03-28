import { text } from "stream/consumers";

export const ITEM_PER_PAGE = 10;

type RoutAccessMap = {
    [key: string]: string[];
}

export const routAccessMap: RoutAccessMap = {
    "/admin(.*)": ["admin"],
    "/teacher(.*)": ["teacher"],
    "/student(.*)": ["student"],
    "/parent(.*)": ["parent"],
    "/list/teachers": ["admin", "teacher"],
    "/list/students": ["admin", "teacher"],
    "/list/parents": ["admin", "teacher"],
    "/list/subjects": ["admin"],
    "/list/classes": ["admin", "teacher"],
    "/list/exams": ["admin", "teacher", "student", "parent"],
    "/list/assignments": ["admin", "teacher", "student", "parent"],
    "/list/announcements": ["admin", "teacher", "student", "parent"],
    "/list/events": ["admin", "teacher", "student", "parent"],
    "/list/attendance": ["admin", "teacher", "student", "parent"],
    "/list/results": ["admin", "teacher", "student", "parent"],
    "/list/lessons": ["admin", "teacher"],
}

export const attendanceStyle = {
    present: {
        borderColor: "border-green-500",
        dotColor: "bg-green-500",
        textColour: "text-green-700",
        backGroundColor: "bg-green-50",
    },

    absent: {
        borderColor: "border-red-500",
        dotColor: "bg-red-500",
        textColour: "text-red-700",
        backGroundColor: "bg-red-100",
    }
}