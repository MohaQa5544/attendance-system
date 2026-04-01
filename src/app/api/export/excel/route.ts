import { NextResponse } from "next/server";
import { db } from "@/db";
import { teachers } from "@/db/schema";
import { sql } from "drizzle-orm";
import * as XLSX from "xlsx";

export async function GET() {
  const allTeachers = await db
    .select()
    .from(teachers)
    .where(sql`${teachers.subject} != 'ADMIN'`)
    .orderBy(teachers.name);

  const data = allTeachers.map((t) => ({
    "اسم المعلم": t.name,
    "المادة": t.subject,
    "كود الدخول": t.code,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 12 }];

  XLSX.utils.book_append_sheet(wb, ws, "أكواد المعلمين");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=teacher_codes.xlsx",
    },
  });
}
