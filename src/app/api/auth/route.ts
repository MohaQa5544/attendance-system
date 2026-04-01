import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { teachers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "الكود مطلوب" }, { status: 400 });
  }

  const teacher = await db.query.teachers.findFirst({
    where: eq(teachers.code, code.toUpperCase()),
  });

  if (!teacher) {
    return NextResponse.json({ error: "كود غير صحيح" }, { status: 401 });
  }

  const isAdmin = teacher.subject === "ADMIN";

  return NextResponse.json({
    id: teacher.id,
    name: teacher.name,
    subject: teacher.subject,
    code: teacher.code,
    isAdmin,
  });
}
