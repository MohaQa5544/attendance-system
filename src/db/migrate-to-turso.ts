/**
 * One-time migration: reads local school.db and pushes all data to Turso.
 * Run with:
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx src/db/migrate-to-turso.ts
 */
import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import path from "path";

const localDb = new Database(path.join(process.cwd(), "school.db"));

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrate() {
  console.log("=== Migrating local SQLite → Turso ===\n");

  // --- Teachers ---
  const teachers = localDb.prepare("SELECT * FROM teachers").all() as any[];
  console.log(`Inserting ${teachers.length} teachers...`);
  for (const t of teachers) {
    await turso.execute({
      sql: "INSERT OR IGNORE INTO teachers (id, name, subject, code) VALUES (?, ?, ?, ?)",
      args: [t.id, t.name, t.subject, t.code],
    });
  }

  // --- Classes ---
  const classes = localDb.prepare("SELECT * FROM classes").all() as any[];
  console.log(`Inserting ${classes.length} classes...`);
  for (const c of classes) {
    await turso.execute({
      sql: "INSERT OR IGNORE INTO classes (id, name, grade, track) VALUES (?, ?, ?, ?)",
      args: [c.id, c.name, c.grade, c.track],
    });
  }

  // --- Periods ---
  const periods = localDb.prepare("SELECT * FROM periods").all() as any[];
  console.log(`Inserting ${periods.length} periods...`);
  for (const p of periods) {
    await turso.execute({
      sql: "INSERT OR IGNORE INTO periods (id, number, start_time, end_time, grade_group) VALUES (?, ?, ?, ?, ?)",
      args: [p.id, p.number, p.start_time, p.end_time, p.grade_group],
    });
  }

  // --- Schedule ---
  const schedule = localDb.prepare("SELECT * FROM schedule").all() as any[];
  console.log(`Inserting ${schedule.length} schedule entries...`);
  for (const s of schedule) {
    await turso.execute({
      sql: "INSERT OR IGNORE INTO schedule (id, teacher_id, class_id, period_number, day, subject, room) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [s.id, s.teacher_id, s.class_id, s.period_number, s.day, s.subject, s.room],
    });
  }

  // --- Students ---
  const students = localDb.prepare("SELECT * FROM students").all() as any[];
  console.log(`Inserting ${students.length} students...`);
  for (const s of students) {
    await turso.execute({
      sql: "INSERT OR IGNORE INTO students (id, name, class_id, student_number) VALUES (?, ?, ?, ?)",
      args: [s.id, s.name, s.class_id, s.student_number],
    });
  }

  console.log("\n=== Migration complete! ===");
  localDb.close();
}

migrate().catch(console.error);
