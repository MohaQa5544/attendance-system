import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { schedule, teachers, classes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const teacherId = req.nextUrl.searchParams.get("teacherId");
  const classId = req.nextUrl.searchParams.get("classId");
  const day = req.nextUrl.searchParams.get("day");

  let conditions = [];
  if (teacherId) conditions.push(eq(schedule.teacherId, parseInt(teacherId)));
  if (classId) conditions.push(eq(schedule.classId, parseInt(classId)));
  if (day) conditions.push(eq(schedule.day, day));

  const results = await db
    .select({
      id: schedule.id,
      periodNumber: schedule.periodNumber,
      day: schedule.day,
      subject: schedule.subject,
      room: schedule.room,
      teacherId: schedule.teacherId,
      teacherName: teachers.name,
      classId: schedule.classId,
      className: classes.name,
      classGrade: classes.grade,
    })
    .from(schedule)
    .innerJoin(teachers, eq(schedule.teacherId, teachers.id))
    .innerJoin(classes, eq(schedule.classId, classes.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(schedule.day, schedule.periodNumber);

  return NextResponse.json(results);
}
