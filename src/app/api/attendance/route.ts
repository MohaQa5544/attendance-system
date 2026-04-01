import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attendance, students, teachers } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const classId = req.nextUrl.searchParams.get("classId");
  const date = req.nextUrl.searchParams.get("date");
  const periodNumber = req.nextUrl.searchParams.get("periodNumber");
  const studentId = req.nextUrl.searchParams.get("studentId");

  let conditions = [];
  if (classId) conditions.push(eq(attendance.classId, parseInt(classId)));
  if (date) conditions.push(eq(attendance.date, date));
  if (periodNumber) conditions.push(eq(attendance.periodNumber, parseInt(periodNumber)));
  if (studentId) conditions.push(eq(attendance.studentId, parseInt(studentId)));

  const results = await db
    .select({
      id: attendance.id,
      studentId: attendance.studentId,
      studentName: students.name,
      classId: attendance.classId,
      date: attendance.date,
      periodNumber: attendance.periodNumber,
      status: attendance.status,
      teacherId: attendance.teacherId,
      teacherName: teachers.name,
      note: attendance.note,
      createdAt: attendance.createdAt,
    })
    .from(attendance)
    .innerJoin(students, eq(attendance.studentId, students.id))
    .leftJoin(teachers, eq(attendance.teacherId, teachers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(attendance.periodNumber, students.name);

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Support batch submission
  const entries = Array.isArray(body) ? body : [body];

  const results = [];
  for (const entry of entries) {
    const { studentId, classId: cId, date, periodNumber: pn, status, teacherId, note } = entry;

    // Check if record exists
    const existing = await db.query.attendance.findFirst({
      where: and(
        eq(attendance.studentId, studentId),
        eq(attendance.date, date),
        eq(attendance.periodNumber, pn)
      ),
    });

    if (existing) {
      // Update
      await db
        .update(attendance)
        .set({ status, teacherId, note, createdAt: new Date().toISOString() })
        .where(eq(attendance.id, existing.id));
      results.push({ ...existing, status, teacherId, note });
    } else {
      // Insert
      const result = await db.insert(attendance).values({
        studentId,
        classId: cId,
        date,
        periodNumber: pn,
        status: status || "present",
        teacherId: teacherId || null,
        note: note || null,
        createdAt: new Date().toISOString(),
      }).returning();
      results.push(result[0]);
    }
  }

  return NextResponse.json(results);
}
