import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const classId = req.nextUrl.searchParams.get("classId");

  if (!classId) {
    return NextResponse.json({ error: "classId مطلوب" }, { status: 400 });
  }

  const result = await db.query.students.findMany({
    where: eq(students.classId, parseInt(classId)),
    orderBy: students.name,
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const { name, classId, studentNumber } = await req.json();

  if (!name || !classId) {
    return NextResponse.json({ error: "الاسم ورقم الصف مطلوبان" }, { status: 400 });
  }

  const result = await db.insert(students).values({
    name,
    classId: parseInt(classId),
    studentNumber: studentNumber || null,
  }).returning();

  return NextResponse.json(result[0]);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });

  await db.delete(students).where(eq(students.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
