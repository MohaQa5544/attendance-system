import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const teachers = sqliteTable("teachers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  code: text("code").notNull().unique(),
});

export const classes = sqliteTable("classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  grade: integer("grade").notNull(),
  track: text("track"), // s=scientific, h=humanities, t=tech, null=general
});

export const periods = sqliteTable("periods", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: integer("number").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  gradeGroup: text("grade_group").notNull(), // "10_11", "12", "thu_10_11", "thu_12"
});

export const schedule = sqliteTable("schedule", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teacherId: integer("teacher_id").notNull().references(() => teachers.id),
  classId: integer("class_id").notNull().references(() => classes.id),
  periodNumber: integer("period_number").notNull(),
  day: text("day").notNull(), // sunday, monday, tuesday, wednesday, thursday
  subject: text("subject").notNull(),
  room: text("room"),
});

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  classId: integer("class_id").notNull().references(() => classes.id),
  studentNumber: text("student_number"),
});

export const attendance = sqliteTable("attendance", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id").notNull().references(() => students.id),
  classId: integer("class_id").notNull().references(() => classes.id),
  date: text("date").notNull(), // YYYY-MM-DD
  periodNumber: integer("period_number").notNull(),
  status: text("status").notNull().default("present"), // present, absent, late, excused
  teacherId: integer("teacher_id").references(() => teachers.id),
  note: text("note"),
  createdAt: text("created_at").notNull(),
});
