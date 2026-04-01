import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { periods } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const gradeGroup = req.nextUrl.searchParams.get("gradeGroup");

  if (gradeGroup) {
    const result = await db.query.periods.findMany({
      where: eq(periods.gradeGroup, gradeGroup),
      orderBy: periods.number,
    });
    return NextResponse.json(result);
  }

  const result = await db.query.periods.findMany({
    orderBy: [periods.gradeGroup, periods.number],
  });
  return NextResponse.json(result);
}
