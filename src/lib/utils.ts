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
    startOfWeek.setDate(today.getDate() + 1);
  }

  if (day === 6) {
    startOfWeek.setDate(today.getDate() + 2);
  } else {
    startOfWeek.setDate(today.getDate() - (day - 1));
  }
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
};

export const adjustScheduleTOCurrentWeek = (
  lesson: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const startOfWeek = currentWorkWeek();
  return lesson.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();

    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustStartDate = new Date(startOfWeek);
    adjustStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
    adjustStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds(),
      lesson.start.getMilliseconds()
    );

    const adjustEndDate = new Date(adjustStartDate);
    adjustEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
      lesson.end.getMilliseconds()
    );

    return {
      title: lesson.title,
      start: adjustStartDate,
      end: adjustEndDate,
    };
  });
};
