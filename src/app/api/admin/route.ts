import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attendance, students, teachers, classes, schedule } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");
  const date = req.nextUrl.searchParams.get("date");

  if (action === "classes") {
    const allClasses = await db.query.classes.findMany({
      orderBy: [classes.grade, classes.name],
    });
    return NextResponse.json(allClasses);
  }

  if (action === "teachers") {
    const allTeachers = await db
      .select()
      .from(teachers)
      .where(sql`${teachers.subject} != 'ADMIN'`)
      .orderBy(teachers.name);
    return NextResponse.json(allTeachers);
  }

  if (action === "summary" && date) {
    // Get absence count per class for a given date
    const summary = await db
      .select({
        classId: attendance.classId,
        className: classes.name,
        absentCount: sql<number>`COUNT(DISTINCT CASE WHEN ${attendance.status} = 'absent' THEN ${attendance.studentId} END)`,
        lateCount: sql<number>`COUNT(DISTINCT CASE WHEN ${attendance.status} = 'late' THEN ${attendance.studentId} END)`,
        totalRecords: sql<number>`COUNT(*)`,
      })
      .from(attendance)
      .innerJoin(classes, eq(attendance.classId, classes.id))
      .where(eq(attendance.date, date))
      .groupBy(attendance.classId, classes.name)
      .orderBy(classes.name);

    return NextResponse.json(summary);
  }

  if (action === "class-detail") {
    const classId = req.nextUrl.searchParams.get("classId");
    if (!classId || !date) {
      return NextResponse.json({ error: "classId and date required" }, { status: 400 });
    }

    // Get all students in class
    const classStudents = await db.query.students.findMany({
      where: eq(students.classId, parseInt(classId)),
      orderBy: students.name,
    });

    // Get all attendance records for this class on this date
    const records = await db
      .select({
        id: attendance.id,
        studentId: attendance.studentId,
        periodNumber: attendance.periodNumber,
        status: attendance.status,
        teacherName: teachers.name,
        note: attendance.note,
      })
      .from(attendance)
      .leftJoin(teachers, eq(attendance.teacherId, teachers.id))
      .where(
        and(eq(attendance.classId, parseInt(classId)), eq(attendance.date, date))
      )
      .orderBy(attendance.periodNumber);

    return NextResponse.json({ students: classStudents, records });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
