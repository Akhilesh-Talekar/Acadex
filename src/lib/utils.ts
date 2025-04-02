import { auth } from "@clerk/nextjs/server";

export const getRole = async() => {
  const {userId, sessionClaims} = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currUserId = userId;
  return {
    role: role!,
    currUserId: currUserId!
  }
}


const currentWorkWeek = () => {
  const today = new Date();
  const day = today.getDay();

  const startOfWeek = new Date(today);

  if (day === 0) {
    startOfWeek.setUTCDate(today.getDate() + 1);
  }

  if (day === 6) {
    startOfWeek.setUTCDate(today.getDate() + 2);
  } else {
    startOfWeek.setUTCDate(today.getDate() - (day - 1));
  }
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
};

export const adjustScheduleTOCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const startOfWeek = currentWorkWeek(); 

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1; // Adjust Sunday (0) to be last

    // Adjusted start date
    const adjustedStartDate = new Date(startOfWeek); // Force UTC
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getUTCMinutes(),
      lesson.start.getSeconds(),
      lesson.start.getMilliseconds()
    );

    // Adjusted end date
    const adjustedEndDate = new Date(adjustedStartDate); // Force UTC
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
      lesson.end.getMilliseconds()
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};




export function getRandomInRange({min, max}: {min: number, max: number}) {
  return Math.floor(Math.random() * (max - min) + min) + 1;
}