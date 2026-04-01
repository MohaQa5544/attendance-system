import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attendance, students, teachers, classes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, AlignmentType, WidthType, BorderStyle, HeadingLevel,
} from "docx";

export async function GET(req: NextRequest) {
  const classId = req.nextUrl.searchParams.get("classId");
  const date = req.nextUrl.searchParams.get("date");

  if (!classId || !date) {
    return NextResponse.json({ error: "classId and date required" }, { status: 400 });
  }

  const cls = await db.query.classes.findFirst({
    where: eq(classes.id, parseInt(classId)),
  });

  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const classStudents = await db.query.students.findMany({
    where: eq(students.classId, parseInt(classId)),
    orderBy: students.name,
  });

  const records = await db
    .select({
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
    );

  // Build lookup: studentId -> period -> record
  const recordMap: Record<number, Record<number, { status: string; teacherName: string | null; note: string | null }>> = {};
  for (const r of records) {
    if (!recordMap[r.studentId]) recordMap[r.studentId] = {};
    recordMap[r.studentId][r.periodNumber] = {
      status: r.status,
      teacherName: r.teacherName,
      note: r.note,
    };
  }

  const statusArabic: Record<string, string> = {
    present: "حاضر",
    absent: "غائب",
    late: "متأخر",
    excused: "معذور",
  };

  const periods = [1, 2, 3, 4, 5, 6, 7];

  // Build table rows
  const headerCells = [
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: "#", bold: true, size: 20, font: "Arial" })], alignment: AlignmentType.CENTER, bidirectional: true })],
      width: { size: 5, type: WidthType.PERCENTAGE },
    }),
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: "اسم الطالب", bold: true, size: 20, font: "Arial" })], alignment: AlignmentType.CENTER, bidirectional: true })],
      width: { size: 20, type: WidthType.PERCENTAGE },
    }),
    ...periods.map(
      (p) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: `ح${p}`, bold: true, size: 20, font: "Arial" })], alignment: AlignmentType.CENTER, bidirectional: true })],
          width: { size: 10, type: WidthType.PERCENTAGE },
        })
    ),
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: "ملاحظات", bold: true, size: 20, font: "Arial" })], alignment: AlignmentType.CENTER, bidirectional: true })],
      width: { size: 15, type: WidthType.PERCENTAGE },
    }),
  ];

  const headerRow = new TableRow({ children: headerCells, tableHeader: true });

  const dataRows = classStudents.map((student, idx) => {
    const studentRecords = recordMap[student.id] || {};
    const notes = Object.values(studentRecords)
      .filter((r) => r.note)
      .map((r) => r.note)
      .join(", ");

    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: String(idx + 1), size: 18, font: "Arial" })], alignment: AlignmentType.CENTER })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: student.name, size: 18, font: "Arial" })], alignment: AlignmentType.RIGHT, bidirectional: true })],
        }),
        ...periods.map((p) => {
          const rec = studentRecords[p];
          const text = rec ? statusArabic[rec.status] || rec.status : "-";
          const color = rec?.status === "absent" ? "FF0000" : rec?.status === "late" ? "FF8800" : "000000";
          return new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text, size: 18, font: "Arial", color })], alignment: AlignmentType.CENTER, bidirectional: true })],
          });
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: notes || "-", size: 16, font: "Arial" })], alignment: AlignmentType.RIGHT, bidirectional: true })],
        }),
      ],
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
        children: [
          new Paragraph({
            children: [new TextRun({ text: "مدرسة حسان بن ثابت الثانوية للبنين", bold: true, size: 32, font: "Arial" })],
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "وزارة التربية والتعليم والتعليم العالي - دولة قطر", size: 22, font: "Arial" })],
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `تقرير الغياب - الصف ${cls.name}`, bold: true, size: 28, font: "Arial" })],
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `التاريخ: ${date}`, size: 22, font: "Arial" })],
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { after: 300 },
          }),
          new Table({
            rows: [headerRow, ...dataRows],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const uint8 = new Uint8Array(buffer);

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=attendance_${cls.name}_${date}.docx`,
    },
  });
}
