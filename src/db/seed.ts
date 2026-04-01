import Database from "better-sqlite3";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const dbPath = path.join(process.cwd(), "school.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
  );
  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    grade INTEGER NOT NULL,
    track TEXT
  );
  CREATE TABLE IF NOT EXISTS periods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    grade_group TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL REFERENCES teachers(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    period_number INTEGER NOT NULL,
    day TEXT NOT NULL,
    subject TEXT NOT NULL,
    room TEXT
  );
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    student_number TEXT
  );
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    date TEXT NOT NULL,
    period_number INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'present',
    teacher_id INTEGER REFERENCES teachers(id),
    note TEXT,
    created_at TEXT NOT NULL
  );
`);

// Generate unique 6-char codes
function generateCode(): string {
  return uuidv4().substring(0, 6).toUpperCase();
}

// ===== TEACHERS =====
const teacherData: { name: string; subject: string }[] = [
  { name: "زكي أبو نجيله", subject: "Eng" },
  { name: "السيد شعبان", subject: "PHS" },
  { name: "مهند ربيع", subject: "REL" },
  { name: "محمد عايد", subject: "ARB" },
  { name: "ايهاب عفيفي", subject: "MTH" },
  { name: "تامر صلاح", subject: "CHM" },
  { name: "احمد عبدالرحمن", subject: "BIO" },
  { name: "حسام حسن", subject: "L.Sk" },
  { name: "محمد توفيق", subject: "SOC" },
  { name: "كريم شاشية", subject: "PE" },
  { name: "ابراهيم خليل", subject: "C&IT" },
  { name: "محمد جهاد", subject: "MTH" },
  { name: "سامح محمد", subject: "Eng" },
  { name: "نايف بركة", subject: "ARB" },
  { name: "عبدالله ناصر", subject: "CHM" },
  { name: "أحمد شغميم", subject: "MTH" },
  { name: "عبد العزيز شنينة", subject: "REL" },
  { name: "جابر أحمد", subject: "C&IT" },
  { name: "محمد فتحي", subject: "PHS" },
  { name: "سامي السرحان", subject: "BIO" },
  { name: "أحمد عيد", subject: "Eng" },
  { name: "ابراهيم رميح", subject: "MTH" },
  { name: "عمر أبو شريعة", subject: "SOC" },
  { name: "احمد اسماعيل", subject: "Eng" },
  { name: "عامر خير", subject: "PE" },
  { name: "مروان عوض", subject: "ARB" },
  { name: "محمد شاهر", subject: "Eng" },
  { name: "علي سليمان", subject: "CHM" },
  { name: "يمان حسناوي", subject: "REL" },
  { name: "اسامه مهيدات", subject: "MTH" },
  { name: "هاني فوزي", subject: "BIO" },
  { name: "محمد محسن", subject: "ARB" },
  { name: "محمد لطفي", subject: "PHS" },
  { name: "وسن أحمد", subject: "C&IT" },
  { name: "احمد ادم", subject: "REL" },
  { name: "محمد ابوعواد", subject: "PHS" },
  { name: "بدر عبد البديع", subject: "Eng" },
  { name: "عبدالرحمان عبد الله", subject: "MTH" },
  { name: "ياسر عبد الوهاب", subject: "CHM" },
  { name: "محمد أبوريان", subject: "L.Sk" },
  { name: "عمر أبو غليون", subject: "ARB" },
  { name: "هشام محمد", subject: "Gr" },
  { name: "محفوظ شواط", subject: "Fr" },
  { name: "محسن ابوحقب", subject: "PE" },
  { name: "صلاح الدين النمر", subject: "MTH" },
  { name: "صالح المرزوقي", subject: "Eng" },
  { name: "محمد النجار", subject: "IT" },
  { name: "علي نادي", subject: "PE" },
  { name: "محمد وحيد", subject: "BM" },
  { name: "صالح الهاذلي", subject: "MTH" },
  { name: "حسام الحاجي", subject: "His" },
  { name: "ناصر السرخي", subject: "G.S" },
  { name: "حمدي دويب", subject: "Geq" },
  { name: "شريف ابراهيم", subject: "ARB" },
  { name: "أيمن مفلح", subject: "REL" },
  { name: "وليد الششتاوي", subject: "CHM" },
  { name: "عمار الشيخ", subject: "BIO" },
  { name: "محمد العكاوي", subject: "MTH" },
  { name: "الحبيب جبنون", subject: "Eng" },
  { name: "وائل محمد", subject: "CHM" },
  { name: "خليل وليد", subject: "PHS" },
  { name: "فيصل احمد", subject: "BIO" },
  { name: "أحمد علي", subject: "ARB" },
  { name: "علي حسن", subject: "C&IT" },
  { name: "حمد المحيمد", subject: "His" },
  { name: "ابراهيم الشيخ", subject: "L.Sk" },
  { name: "محمد حافظ", subject: "REL" },
  { name: "مصطفى ابراهيم", subject: "ARB" },
  { name: "محمد المندوه", subject: "Eng" },
  { name: "محمود بيلي", subject: "MTH" },
  { name: "محمود عميرة", subject: "SCI" },
  { name: "أحمد جودت", subject: "PE" },
  { name: "ايهاب مصطفى", subject: "SOC" },
];

// Insert teachers
const usedCodes = new Set<string>();
const insertTeacher = sqlite.prepare(
  "INSERT OR IGNORE INTO teachers (name, subject, code) VALUES (?, ?, ?)"
);

const teacherMap: Record<string, number> = {};

for (const t of teacherData) {
  let code: string;
  do {
    code = generateCode();
  } while (usedCodes.has(code));
  usedCodes.add(code);

  const result = insertTeacher.run(t.name, t.subject, code);
  if (result.changes > 0) {
    teacherMap[t.name] = result.lastInsertRowid as number;
  } else {
    const row = sqlite.prepare("SELECT id FROM teachers WHERE name = ?").get(t.name) as any;
    if (row) teacherMap[t.name] = row.id;
  }
}

// Admin code
insertTeacher.run("الإدارة", "ADMIN", "ADMIN1");

// ===== CLASSES =====
const classData = [
  { name: "10.1", grade: 10, track: null },
  { name: "10.2", grade: 10, track: null },
  { name: "10.3", grade: 10, track: null },
  { name: "10.4", grade: 10, track: null },
  { name: "10.5", grade: 10, track: null },
  { name: "10.6", grade: 10, track: null },
  { name: "10.7", grade: 10, track: null },
  { name: "11.1s", grade: 11, track: "s" },
  { name: "11.2s", grade: 11, track: "s" },
  { name: "11.3s", grade: 11, track: "s" },
  { name: "11.4s", grade: 11, track: "s" },
  { name: "11.5t", grade: 11, track: "t" },
  { name: "11.6h", grade: 11, track: "h" },
  { name: "11.7h", grade: 11, track: "h" },
  { name: "12.1s", grade: 12, track: "s" },
  { name: "12.2s", grade: 12, track: "s" },
  { name: "12.3s", grade: 12, track: "s" },
  { name: "12.4s", grade: 12, track: "s" },
  { name: "12.5s", grade: 12, track: "s" },
  { name: "12.6t", grade: 12, track: "t" },
  { name: "12.7h", grade: 12, track: "h" },
  { name: "12.8h", grade: 12, track: "h" },
  { name: "ESE1", grade: 0, track: "ese" },
  { name: "ESE2", grade: 0, track: "ese" },
];

const insertClass = sqlite.prepare(
  "INSERT OR IGNORE INTO classes (name, grade, track) VALUES (?, ?, ?)"
);
const classMap: Record<string, number> = {};

for (const c of classData) {
  const result = insertClass.run(c.name, c.grade, c.track);
  if (result.changes > 0) {
    classMap[c.name] = result.lastInsertRowid as number;
  } else {
    const row = sqlite.prepare("SELECT id FROM classes WHERE name = ?").get(c.name) as any;
    if (row) classMap[c.name] = row.id;
  }
}

// ===== PERIODS =====
const periodData = [
  // Regular days (Sun-Wed) for grade 10-11
  { number: 1, startTime: "07:10", endTime: "07:55", gradeGroup: "10_11" },
  { number: 2, startTime: "08:00", endTime: "08:45", gradeGroup: "10_11" },
  { number: 3, startTime: "09:10", endTime: "09:55", gradeGroup: "10_11" },
  { number: 4, startTime: "10:00", endTime: "10:45", gradeGroup: "10_11" },
  { number: 5, startTime: "10:50", endTime: "11:35", gradeGroup: "10_11" },
  { number: 6, startTime: "11:40", endTime: "12:25", gradeGroup: "10_11" },
  { number: 7, startTime: "12:45", endTime: "13:30", gradeGroup: "10_11" },
  // Regular days for grade 12
  { number: 1, startTime: "07:10", endTime: "07:55", gradeGroup: "12" },
  { number: 2, startTime: "08:00", endTime: "08:45", gradeGroup: "12" },
  { number: 3, startTime: "09:10", endTime: "09:55", gradeGroup: "12" },
  { number: 4, startTime: "10:00", endTime: "10:45", gradeGroup: "12" },
  { number: 5, startTime: "10:50", endTime: "11:35", gradeGroup: "12" },
  { number: 6, startTime: "11:40", endTime: "12:25", gradeGroup: "12" },
  { number: 7, startTime: "12:45", endTime: "13:30", gradeGroup: "12" },
  // Thursday for grade 10-11
  { number: 1, startTime: "07:10", endTime: "07:50", gradeGroup: "thu_10_11" },
  { number: 2, startTime: "07:55", endTime: "08:35", gradeGroup: "thu_10_11" },
  { number: 3, startTime: "08:40", endTime: "09:20", gradeGroup: "thu_10_11" },
  { number: 4, startTime: "09:40", endTime: "10:20", gradeGroup: "thu_10_11" },
  { number: 5, startTime: "10:25", endTime: "11:05", gradeGroup: "thu_10_11" },
  { number: 6, startTime: "11:10", endTime: "11:50", gradeGroup: "thu_10_11" },
  // Thursday for grade 12
  { number: 1, startTime: "07:10", endTime: "07:50", gradeGroup: "thu_12" },
  { number: 2, startTime: "07:55", endTime: "08:35", gradeGroup: "thu_12" },
  { number: 3, startTime: "09:00", endTime: "09:40", gradeGroup: "thu_12" },
  { number: 4, startTime: "09:40", endTime: "10:20", gradeGroup: "thu_12" },
  { number: 5, startTime: "10:25", endTime: "11:05", gradeGroup: "thu_12" },
  { number: 6, startTime: "11:10", endTime: "11:50", gradeGroup: "thu_12" },
];

const insertPeriod = sqlite.prepare(
  "INSERT OR IGNORE INTO periods (number, start_time, end_time, grade_group) VALUES (?, ?, ?, ?)"
);
for (const p of periodData) {
  insertPeriod.run(p.number, p.startTime, p.endTime, p.gradeGroup);
}

// ===== SCHEDULE =====
// Days mapping: الأحد=sunday, الإثنين=monday, الثلاثاء=tuesday, الأربعاء=wednesday, الخميس=thursday
const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];

const insertSchedule = sqlite.prepare(
  "INSERT INTO schedule (teacher_id, class_id, period_number, day, subject, room) VALUES (?, ?, ?, ?, ?, ?)"
);

// Clear existing schedule
sqlite.exec("DELETE FROM schedule");

type ScheduleEntry = [string, string, number, string, string, string | null];

// Helper to add schedule entries for a class
function addSchedule(className: string, entries: ScheduleEntry[]) {
  for (const [teacherName, subject, period, day, subj, room] of entries) {
    const tid = teacherMap[teacherName];
    const cid = classMap[className];
    if (tid && cid) {
      insertSchedule.run(tid, cid, period, day, subj || subject, room);
    }
  }
}

// ===== 10.1 Schedule =====
addSchedule("10.1", [
  // Sunday (الأحد) - periods read right to left: ح1, ح2, ح3, ح4, ح5, ح6, ح7
  ["السيد شعبان", "PHS", 1, "sunday", "PHS", null],
  ["زكي أبو نجيله", "Eng", 2, "sunday", "Eng", null],
  ["مهند ربيع", "REL", 3, "sunday", "REL", null],
  ["محمد عايد", "ARB", 4, "sunday", "ARB", null],
  ["ايهاب عفيفي", "MTH", 5, "sunday", "MTH", null],
  ["تامر صلاح", "CHM", 6, "sunday", "CHM", null],
  ["احمد عبدالرحمن", "BIO", 7, "sunday", "BIO", null],
  // Monday
  ["زكي أبو نجيله", "Eng", 1, "monday", "Eng", null],
  ["ايهاب عفيفي", "MTH", 2, "monday", "MTH", null],
  ["ايهاب عفيفي", "MTH", 3, "monday", "MTH", null],
  ["كريم شاشية", "PE", 3, "monday", "PE", "PE.Hall"],
  ["محمد عايد", "ARB", 4, "monday", "ARB", null],
  ["محمد توفيق", "SOC", 5, "monday", "SOC", null],
  ["حسام حسن", "L.Sk", 6, "monday", "L.Sk", null],
  ["مهند ربيع", "REL", 2, "monday", "REL", null],
  // Tuesday
  ["محمد عايد", "ARB", 1, "tuesday", "ARB", null],
  ["زكي أبو نجيله", "Eng", 2, "tuesday", "Eng", null],
  ["السيد شعبان", "PHS", 3, "tuesday", "PHS", null],
  ["احمد عبدالرحمن", "BIO", 3, "tuesday", "BIO", null],
  ["محمد توفيق", "SOC", 4, "tuesday", "SOC", null],
  ["تامر صلاح", "CHM", 5, "tuesday", "CHM", null],
  ["ايهاب عفيفي", "MTH", 6, "tuesday", "MTH", null],
  ["كريم شاشية", "PE", 7, "tuesday", "PE", "PE.Hall"],
  // Wednesday
  ["محمد عايد", "ARB", 1, "wednesday", "ARB", null],
  ["ايهاب عفيفي", "MTH", 2, "wednesday", "MTH", null],
  ["ابراهيم خليل", "C&IT", 3, "wednesday", "C&IT", "Lab2"],
  ["ابراهيم خليل", "C&IT", 4, "wednesday", "C&IT", "Lab2"],
  ["زكي أبو نجيله", "Eng", 5, "wednesday", "Eng", null],
  ["تامر صلاح", "CHM", 6, "wednesday", "CHM", null],
  ["مهند ربيع", "REL", 7, "wednesday", "REL", null],
  // Thursday
  ["احمد عبدالرحمن", "BIO", 1, "thursday", "BIO", null],
  ["محمد عايد", "ARB", 2, "thursday", "ARB", null],
  ["زكي أبو نجيله", "Eng", 3, "thursday", "Eng", null],
  ["ايهاب عفيفي", "MTH", 4, "thursday", "MTH", null],
  ["محمد توفيق", "SOC", 5, "thursday", "SOC", null],
  ["تامر صلاح", "CHM", 6, "thursday", "CHM", null],
]);

// ===== 10.2 Schedule =====
addSchedule("10.2", [
  // Sunday
  ["احمد عبدالرحمن", "BIO", 1, "sunday", "BIO", null],
  ["محمد جهاد", "MTH", 2, "sunday", "MTH", null],
  ["حسام حسن", "L.Sk", 3, "sunday", "L.Sk", null],
  ["تامر صلاح", "CHM", 4, "sunday", "CHM", null],
  ["محمد عايد", "ARB", 5, "sunday", "ARB", null],
  ["زكي أبو نجيله", "Eng", 6, "sunday", "Eng", null],
  ["محمد توفيق", "SOC", 7, "sunday", "SOC", null],
  // Monday
  ["محمد جهاد", "MTH", 1, "monday", "MTH", null],
  ["محمد عايد", "ARB", 2, "monday", "ARB", null],
  ["السيد شعبان", "PHS", 3, "monday", "PHS", null],
  ["زكي أبو نجيله", "Eng", 4, "monday", "Eng", null],
  ["احمد عبدالرحمن", "BIO", 5, "monday", "BIO", null],
  ["مهند ربيع", "REL", 6, "monday", "REL", null],
  ["كريم شاشية", "PE", 7, "monday", "PE", "PE.Hall"],
  // Tuesday
  ["محمد توفيق", "SOC", 1, "tuesday", "SOC", null],
  ["تامر صلاح", "CHM", 2, "tuesday", "CHM", null],
  ["تامر صلاح", "CHM", 3, "tuesday", "CHM", null],
  ["محمد عايد", "ARB", 4, "tuesday", "ARB", null],
  ["محمد جهاد", "MTH", 5, "tuesday", "MTH", null],
  ["حسام حسن", "L.Sk", 6, "tuesday", "L.Sk", null],
  ["زكي أبو نجيله", "Eng", 7, "tuesday", "Eng", null],
  // Wednesday
  ["محمد عايد", "ARB", 1, "wednesday", "ARB", null],
  ["زكي أبو نجيله", "Eng", 2, "wednesday", "Eng", null],
  ["محمد جهاد", "MTH", 3, "wednesday", "MTH", null],
  ["السيد شعبان", "PHS", 4, "wednesday", "PHS", null],
  ["محمد توفيق", "SOC", 5, "wednesday", "SOC", null],
  ["تامر صلاح", "CHM", 6, "wednesday", "CHM", null],
  ["كريم شاشية", "PE", 7, "wednesday", "PE", "PE.Hall"],
  // Thursday
  ["زكي أبو نجيله", "Eng", 1, "thursday", "Eng", null],
  ["ابراهيم خليل", "C&IT", 2, "thursday", "C&IT", "Lab2"],
  ["ابراهيم خليل", "C&IT", 3, "thursday", "C&IT", "Lab2"],
  ["محمد عايد", "ARB", 4, "thursday", "ARB", null],
  ["مهند ربيع", "REL", 5, "thursday", "REL", null],
  ["احمد عبدالرحمن", "BIO", 6, "thursday", "BIO", null],
]);

// ===== 10.3 Schedule =====
addSchedule("10.3", [
  // Sunday
  ["سامح محمد", "Eng", 1, "sunday", "Eng", null],
  ["محمد عايد", "ARB", 2, "sunday", "ARB", null],
  ["كريم شاشية", "PE", 3, "sunday", "PE", "PE.Hall"],
  ["محمد توفيق", "SOC", 4, "sunday", "SOC", null],
  ["محمد جهاد", "MTH", 5, "sunday", "MTH", null],
  ["السيد شعبان", "PHS", 6, "sunday", "PHS", null],
  ["مهند ربيع", "REL", 7, "sunday", "REL", null],
  // Monday
  ["محمد توفيق", "SOC", 1, "monday", "SOC", null],
  ["تامر صلاح", "CHM", 2, "monday", "CHM", null],
  ["احمد عبدالرحمن", "BIO", 3, "monday", "BIO", null],
  ["محمد عايد", "ARB", 4, "monday", "ARB", null],
  ["حسام حسن", "L.Sk", 5, "monday", "L.Sk", null],
  ["سامح محمد", "Eng", 6, "monday", "Eng", null],
  ["محمد جهاد", "MTH", 7, "monday", "MTH", null],
  // Tuesday
  ["ابراهيم خليل", "C&IT", 1, "tuesday", "C&IT", "Lab2"],
  ["ابراهيم خليل", "C&IT", 2, "tuesday", "C&IT", "Lab2"],
  ["سامح محمد", "Eng", 3, "tuesday", "Eng", null],
  ["محمد جهاد", "MTH", 4, "tuesday", "MTH", null],
  ["احمد عبدالرحمن", "BIO", 5, "tuesday", "BIO", null],
  ["محمد عايد", "ARB", 6, "tuesday", "ARB", null],
  ["السيد شعبان", "PHS", 7, "tuesday", "PHS", null],
  // Wednesday
  ["محمد جهاد", "MTH", 1, "wednesday", "MTH", null],
  ["سامح محمد", "Eng", 2, "wednesday", "Eng", null],
  ["كريم شاشية", "PE", 3, "wednesday", "PE", "PE.Hall"],
  ["محمد عايد", "ARB", 4, "wednesday", "ARB", null],
  ["تامر صلاح", "CHM", 5, "wednesday", "CHM", null],
  ["حسام حسن", "L.Sk", 6, "wednesday", "L.Sk", null],
  ["مهند ربيع", "REL", 7, "wednesday", "REL", null],
  // Thursday
  ["مهند ربيع", "REL", 1, "thursday", "REL", null],
  ["محمد جهاد", "MTH", 2, "thursday", "MTH", null],
  ["سامح محمد", "Eng", 3, "thursday", "Eng", null],
  ["محمد عايد", "ARB", 4, "thursday", "ARB", null],
  ["احمد عبدالرحمن", "BIO", 5, "thursday", "BIO", null],
  ["تامر صلاح", "CHM", 6, "thursday", "CHM", null],
]);

// ===== 10.4 Schedule =====
addSchedule("10.4", [
  ["حسام حسن", "L.Sk", 1, "sunday", "L.Sk", null],
  ["محمد توفيق", "SOC", 2, "sunday", "SOC", null],
  ["عبدالله ناصر", "CHM", 3, "sunday", "CHM", null],
  ["السيد شعبان", "PHS", 4, "sunday", "PHS", null],
  ["نايف بركة", "ARB", 5, "sunday", "ARB", null],
  ["سامح محمد", "Eng", 6, "sunday", "Eng", null],
  ["أحمد شغميم", "MTH", 7, "sunday", "MTH", null],
  ["احمد عبدالرحمن", "BIO", 1, "monday", "BIO", null],
  ["نايف بركة", "ARB", 2, "monday", "ARB", null],
  ["محمد توفيق", "SOC", 3, "monday", "SOC", null],
  ["أحمد شغميم", "MTH", 4, "monday", "MTH", null],
  ["سامح محمد", "Eng", 5, "monday", "Eng", null],
  ["عبدالله ناصر", "CHM", 6, "monday", "CHM", null],
  ["عبد العزيز شنينة", "REL", 7, "monday", "REL", null],
  ["أحمد شغميم", "MTH", 1, "tuesday", "MTH", null],
  ["سامح محمد", "Eng", 2, "tuesday", "Eng", null],
  ["كريم شاشية", "PE", 3, "tuesday", "PE", "PE.Hall"],
  ["عبدالله ناصر", "CHM", 4, "tuesday", "CHM", null],
  ["جابر أحمد", "C&IT", 5, "tuesday", "C&IT", "Lab2"],
  ["جابر أحمد", "C&IT", 6, "tuesday", "C&IT", "Lab2"],
  ["نايف بركة", "ARB", 7, "tuesday", "ARB", null],
  ["سامح محمد", "Eng", 1, "wednesday", "Eng", null],
  ["أحمد شغميم", "MTH", 2, "wednesday", "MTH", null],
  ["حسام حسن", "L.Sk", 3, "wednesday", "L.Sk", null],
  ["عبد العزيز شنينة", "REL", 4, "wednesday", "REL", null],
  ["احمد عبدالرحمن", "BIO", 5, "wednesday", "BIO", null],
  ["نايف بركة", "ARB", 6, "wednesday", "ARB", null],
  ["السيد شعبان", "PHS", 7, "wednesday", "PHS", null],
  ["نايف بركة", "ARB", 1, "thursday", "ARB", null],
  ["كريم شاشية", "PE", 2, "thursday", "PE", "PE.Hall"],
  ["عبد العزيز شنينة", "REL", 3, "thursday", "REL", null],
  ["محمد توفيق", "SOC", 4, "thursday", "SOC", null],
  ["احمد عبدالرحمن", "BIO", 5, "thursday", "BIO", null],
  ["أحمد شغميم", "MTH", 6, "thursday", "MTH", null],
]);

// ===== 10.5 Schedule =====
addSchedule("10.5", [
  ["محمد فتحي", "PHS", 1, "sunday", "PHS", null],
  ["سامي السرحان", "BIO", 2, "sunday", "BIO", null],
  ["نايف بركة", "ARB", 3, "sunday", "ARB", null],
  ["أحمد عيد", "Eng", 4, "sunday", "Eng", null],
  ["جابر أحمد", "C&IT", 5, "sunday", "C&IT", "Lab2"],
  ["جابر أحمد", "C&IT", 6, "sunday", "C&IT", "Lab2"],
  ["ابراهيم رميح", "MTH", 7, "sunday", "MTH", null],
  ["عمر أبو شريعة", "SOC", 1, "monday", "SOC", null],
  ["أحمد عيد", "Eng", 2, "monday", "Eng", null],
  ["عبد العزيز شنينة", "REL", 3, "monday", "REL", null],
  ["عبدالله ناصر", "CHM", 4, "monday", "CHM", null],
  ["نايف بركة", "ARB", 5, "monday", "ARB", null],
  ["ابراهيم رميح", "MTH", 6, "monday", "MTH", null],
  ["سامي السرحان", "BIO", 7, "monday", "BIO", null],
  ["كريم شاشية", "PE", 1, "tuesday", "PE", "PE.Hall"],
  ["ابراهيم رميح", "MTH", 2, "tuesday", "MTH", null],
  ["محمد فتحي", "PHS", 3, "tuesday", "PHS", null],
  ["نايف بركة", "ARB", 4, "tuesday", "ARB", null],
  ["أحمد عيد", "Eng", 5, "tuesday", "Eng", null],
  ["حسام حسن", "L.Sk", 6, "tuesday", "L.Sk", null],
  ["عبد العزيز شنينة", "REL", 7, "tuesday", "REL", null],
  ["نايف بركة", "ARB", 1, "wednesday", "ARB", null],
  ["عبدالله ناصر", "CHM", 2, "wednesday", "CHM", null],
  ["سامي السرحان", "BIO", 3, "wednesday", "BIO", null],
  ["ابراهيم رميح", "MTH", 4, "wednesday", "MTH", null],
  ["عمر أبو شريعة", "SOC", 5, "wednesday", "SOC", null],
  ["حسام حسن", "L.Sk", 6, "wednesday", "L.Sk", null],
  ["أحمد عيد", "Eng", 7, "wednesday", "Eng", null],
  ["كريم شاشية", "PE", 1, "thursday", "PE", "PE.Hall"],
  ["ابراهيم رميح", "MTH", 2, "thursday", "MTH", null],
  ["أحمد عيد", "Eng", 3, "thursday", "Eng", null],
  ["عبد العزيز شنينة", "REL", 4, "thursday", "REL", null],
  ["نايف بركة", "ARB", 5, "thursday", "ARB", null],
  ["عبدالله ناصر", "CHM", 6, "thursday", "CHM", null],
]);

// ===== 10.6 Schedule =====
addSchedule("10.6", [
  ["نايف بركة", "ARB", 1, "sunday", "ARB", null],
  ["ابراهيم رميح", "MTH", 2, "sunday", "MTH", null],
  ["ابراهيم رميح", "MTH", 3, "sunday", "MTH", null],
  ["احمد عبدالرحمن", "BIO", 4, "sunday", "BIO", null],
  ["احمد اسماعيل", "Eng", 5, "sunday", "Eng", null],
  ["عمر أبو شريعة", "SOC", 6, "sunday", "SOC", null],
  ["حسام حسن", "L.Sk", 7, "sunday", "L.Sk", null],
  ["احمد اسماعيل", "Eng", 1, "monday", "Eng", null],
  ["حسام حسن", "L.Sk", 2, "monday", "L.Sk", null],
  ["عامر خير", "PE", 3, "monday", "PE", "PE.Hall"],
  ["ابراهيم رميح", "MTH", 4, "monday", "MTH", null],
  ["ابراهيم خليل", "C&IT", 5, "monday", "C&IT", "Lab2"],
  ["ابراهيم خليل", "C&IT", 6, "monday", "C&IT", "Lab2"],
  ["نايف بركة", "ARB", 7, "monday", "ARB", null],
  ["ابراهيم رميح", "MTH", 1, "tuesday", "MTH", null],
  ["نايف بركة", "ARB", 2, "tuesday", "ARB", null],
  ["عبدالله ناصر", "CHM", 3, "tuesday", "CHM", null],
  ["محمد فتحي", "PHS", 4, "tuesday", "PHS", null],
  ["عبد العزيز شنينة", "REL", 5, "tuesday", "REL", null],
  ["احمد اسماعيل", "Eng", 6, "tuesday", "Eng", null],
  ["احمد عبدالرحمن", "BIO", 7, "tuesday", "BIO", null],
  ["ابراهيم رميح", "MTH", 1, "wednesday", "MTH", null],
  ["احمد اسماعيل", "Eng", 2, "wednesday", "Eng", null],
  ["نايف بركة", "ARB", 3, "wednesday", "ARB", null],
  ["عامر خير", "PE", 4, "wednesday", "PE", "PE.Hall"],
  ["احمد عبدالرحمن", "BIO", 5, "wednesday", "BIO", null],
  ["عبدالله ناصر", "CHM", 6, "wednesday", "CHM", null],
  ["عمر أبو شريعة", "SOC", 7, "wednesday", "SOC", null],
  ["نايف بركة", "ARB", 1, "thursday", "ARB", null],
  ["احمد اسماعيل", "Eng", 2, "thursday", "Eng", null],
  ["محمد فتحي", "PHS", 3, "thursday", "PHS", null],
  ["عمر أبو شريعة", "SOC", 4, "thursday", "SOC", null],
  ["عبدالله ناصر", "CHM", 5, "thursday", "CHM", null],
  ["ابراهيم رميح", "MTH", 6, "thursday", "MTH", null],
]);

// ===== 10.7 Schedule =====
addSchedule("10.7", [
  ["عبدالله ناصر", "CHM", 1, "sunday", "CHM", null],
  ["عامر خير", "PE", 2, "sunday", "PE", "PE.Hall"],
  ["محمد جهاد", "MTH", 3, "sunday", "MTH", null],
  ["مروان عوض", "ARB", 4, "sunday", "ARB", null],
  ["حسام حسن", "L.Sk", 5, "sunday", "L.Sk", null],
  ["عبد العزيز شنينة", "REL", 6, "sunday", "REL", null],
  ["احمد اسماعيل", "Eng", 7, "sunday", "Eng", null],
  ["سامي السرحان", "BIO", 1, "monday", "BIO", null],
  ["عبدالله ناصر", "CHM", 2, "monday", "CHM", null],
  ["احمد اسماعيل", "Eng", 3, "monday", "Eng", null],
  ["محمد جهاد", "MTH", 4, "monday", "MTH", null],
  ["عمر أبو شريعة", "SOC", 5, "monday", "SOC", null],
  ["محمد فتحي", "PHS", 6, "monday", "PHS", null],
  ["مروان عوض", "ARB", 7, "monday", "ARB", null],
  ["محمد جهاد", "MTH", 1, "tuesday", "MTH", null],
  ["عمر أبو شريعة", "SOC", 2, "tuesday", "SOC", null],
  ["عبد العزيز شنينة", "REL", 3, "tuesday", "REL", null],
  ["احمد اسماعيل", "Eng", 4, "tuesday", "Eng", null],
  ["سامي السرحان", "BIO", 5, "tuesday", "BIO", null],
  ["مروان عوض", "ARB", 6, "tuesday", "ARB", null],
  ["عامر خير", "PE", 7, "tuesday", "PE", "PE.Hall"],
  ["مروان عوض", "ARB", 1, "wednesday", "ARB", null],
  ["احمد اسماعيل", "Eng", 2, "wednesday", "Eng", null],
  ["جابر أحمد", "C&IT", 3, "wednesday", "C&IT", "Lab2"],
  ["جابر أحمد", "C&IT", 4, "wednesday", "C&IT", "Lab2"],
  ["محمد فتحي", "PHS", 5, "wednesday", "PHS", null],
  ["محمد جهاد", "MTH", 6, "wednesday", "MTH", null],
  ["عبد العزيز شنينة", "REL", 7, "wednesday", "REL", null],
  ["سامي السرحان", "BIO", 1, "thursday", "BIO", null],
  ["احمد اسماعيل", "Eng", 2, "thursday", "Eng", null],
  ["عمر أبو شريعة", "SOC", 3, "thursday", "SOC", null],
  ["محمد جهاد", "MTH", 4, "thursday", "MTH", null],
  ["حسام حسن", "L.Sk", 5, "thursday", "L.Sk", null],
  ["عبدالله ناصر", "CHM", 6, "thursday", "CHM", null],
]);

// Add sample students for each class (5 per class for demo)
const insertStudent = sqlite.prepare(
  "INSERT INTO students (name, class_id, student_number) VALUES (?, ?, ?)"
);

const sampleStudentNames = [
  "أحمد محمد", "عبدالله سعيد", "خالد يوسف", "محمد علي", "عمر حسن",
  "سعود ناصر", "فهد إبراهيم", "عبدالرحمن خالد", "يوسف عبدالله", "حمد سالم",
  "راشد ماجد", "سلطان أحمد", "ناصر جاسم", "جاسم محمد", "ماجد عبدالله",
  "حسن كريم", "طارق سمير", "بلال أيمن", "كريم فادي", "مصطفى هشام",
  "عادل وليد", "وليد سامي", "سامي رامي", "رامي تامر", "تامر حسام",
];

let studentIdx = 0;
for (const className of Object.keys(classMap)) {
  const classId = classMap[className];
  for (let i = 0; i < 5; i++) {
    const name = sampleStudentNames[(studentIdx + i) % sampleStudentNames.length];
    const num = `${className.replace(".", "")}-${String(i + 1).padStart(3, "0")}`;
    insertStudent.run(name, classId, num);
  }
  studentIdx += 3;
}

console.log("Seed completed successfully!");
console.log(`Teachers: ${Object.keys(teacherMap).length}`);
console.log(`Classes: ${Object.keys(classMap).length}`);

// Print teacher codes for reference
const allTeachers = sqlite.prepare("SELECT name, subject, code FROM teachers ORDER BY name").all() as any[];
console.log("\n=== Teacher Codes ===");
for (const t of allTeachers) {
  console.log(`${t.name} (${t.subject}): ${t.code}`);
}
