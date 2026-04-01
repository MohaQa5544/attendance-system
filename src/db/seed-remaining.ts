import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "school.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Helpers to look up IDs
function getTeacherId(name: string): number | null {
  const row = db.prepare("SELECT id FROM teachers WHERE name = ?").get(name) as any;
  return row ? row.id : null;
}
function getClassId(name: string): number | null {
  const row = db.prepare("SELECT id FROM classes WHERE name = ?").get(name) as any;
  return row ? row.id : null;
}

const insertSchedule = db.prepare(
  "INSERT INTO schedule (teacher_id, class_id, period_number, day, subject, room) VALUES (?, ?, ?, ?, ?, ?)"
);

// Helper to add schedule for a class
// Each entry: [teacherName, period, day, subject, room]
type Entry = [string, number, string, string, string | null];

function addSchedule(className: string, entries: Entry[]) {
  const cid = getClassId(className);
  if (!cid) {
    console.log(`WARNING: class "${className}" not found!`);
    return;
  }
  let count = 0;
  for (const [teacherName, period, day, subject, room] of entries) {
    const tid = getTeacherId(teacherName);
    if (!tid) {
      console.log(`WARNING: teacher "${teacherName}" not found for ${className}!`);
      continue;
    }
    insertSchedule.run(tid, cid, period, day, subject, room);
    count++;
  }
  console.log(`  ${className}: inserted ${count} schedule entries`);
}

// Delete existing schedules for classes 11.x, 12.x only (keep 10.x)
const classesToSeed = [
  "11.1s", "11.2s", "11.3s", "11.4s", "11.5t", "11.6h", "11.7h",
  "12.1s", "12.2s", "12.3s", "12.4s", "12.5s", "12.6t", "12.7h", "12.8h",
];

console.log("=== Deleting existing schedules for remaining classes ===");
for (const cn of classesToSeed) {
  const cid = getClassId(cn);
  if (cid) {
    const result = db.prepare("DELETE FROM schedule WHERE class_id = ?").run(cid);
    console.log(`  Deleted ${result.changes} existing entries for ${cn}`);
  }
}

console.log("\n=== Inserting schedules for remaining classes ===");

// ===== 11.1s =====
addSchedule("11.1s", [
  // Sunday
  ["محمد شاهر", 1, "sunday", "Eng", null],
  ["علي سليمان", 2, "sunday", "CHM", null],
  ["يمان حسناوي", 3, "sunday", "REL", null],
  ["هاني فوزي", 4, "sunday", "BIO", null],
  ["اسامه مهيدات", 5, "sunday", "MTH", null],
  ["كريم شاشية", 6, "sunday", "PE", "PE.Hall"],
  ["محمد محسن", 7, "sunday", "ARB", null],
  // Monday
  ["علي سليمان", 1, "monday", "CHM", null],
  ["اسامه مهيدات", 2, "monday", "MTH", null],
  ["وسن أحمد", 3, "monday", "C&IT", "Lab2"],
  ["وسن أحمد", 4, "monday", "C&IT", "Lab2"],
  ["محمد لطفي", 5, "monday", "PHS", null],
  ["محمد شاهر", 6, "monday", "Eng", null],
  ["هاني فوزي", 7, "monday", "BIO", null],
  // Tuesday
  ["محمد لطفي", 1, "tuesday", "PHS", null],
  ["محمد محسن", 2, "tuesday", "ARB", null],
  ["محمد شاهر", 3, "tuesday", "Eng", null],
  ["حسام حسن", 4, "tuesday", "L.Sk", null],
  ["كريم شاشية", 5, "tuesday", "PE", "PE.Hall"],
  ["يمان حسناوي", 6, "tuesday", "REL", null],
  ["اسامه مهيدات", 7, "tuesday", "MTH", null],
  // Wednesday
  ["هاني فوزي", 1, "wednesday", "BIO", null],
  ["اسامه مهيدات", 2, "wednesday", "MTH", null],
  ["محمد محسن", 3, "wednesday", "ARB", null],
  ["علي سليمان", 4, "wednesday", "CHM", null],
  ["محمد شاهر", 5, "wednesday", "Eng", null],
  ["محمد لطفي", 6, "wednesday", "PHS", null],
  ["يمان حسناوي", 7, "wednesday", "REL", null],
  // Thursday
  ["اسامه مهيدات", 1, "thursday", "MTH", null],
  ["اسامه مهيدات", 2, "thursday", "MTH", null],
  ["هاني فوزي", 3, "thursday", "BIO", null],
  ["علي سليمان", 4, "thursday", "CHM", null],
  ["حسام حسن", 5, "thursday", "L.Sk", null],
  ["محمد شاهر", 6, "thursday", "Eng", null],
]);

// ===== 11.2s =====
addSchedule("11.2s", [
  // Sunday
  ["احمد ادم", 1, "sunday", "REL", null],
  ["اسامه مهيدات", 2, "sunday", "MTH", null],
  ["محمد ابوعواد", 3, "sunday", "PHS", null],
  ["علي سليمان", 4, "sunday", "CHM", null],
  ["محمد شاهر", 5, "sunday", "Eng", null],
  ["محمد محسن", 6, "sunday", "ARB", null],
  ["سامي السرحان", 7, "sunday", "BIO", null],
  // Monday
  ["اسامه مهيدات", 1, "monday", "MTH", null],
  ["اسامه مهيدات", 2, "monday", "MTH", null],
  ["اسامه مهيدات", 3, "monday", "MTH", null],
  ["محمد محسن", 4, "monday", "ARB", null],
  ["عامر خير", 5, "monday", "PE", "PE.Hall"],
  ["حسام حسن", 6, "monday", "L.Sk", null],
  ["علي سليمان", 7, "monday", "CHM", null],
  // Tuesday
  ["علي سليمان", 1, "tuesday", "CHM", null],
  ["سامي السرحان", 2, "tuesday", "BIO", null],
  ["محمد ابوعواد", 3, "tuesday", "PHS", null],
  ["وسن أحمد", 4, "tuesday", "C&IT", "Lab2"],
  ["وسن أحمد", 5, "tuesday", "C&IT", "Lab2"],
  ["محمد شاهر", 6, "tuesday", "Eng", null],
  ["اسامه مهيدات", 7, "tuesday", "MTH", null],
  // Wednesday
  ["محمد شاهر", 1, "wednesday", "Eng", null],
  ["محمد ابوعواد", 2, "wednesday", "PHS", null],
  ["احمد ادم", 3, "wednesday", "REL", null],
  ["اسامه مهيدات", 4, "wednesday", "MTH", null],
  ["عامر خير", 5, "wednesday", "PE", "PE.Hall"],
  ["حسام حسن", 6, "wednesday", "L.Sk", null],
  ["سامي السرحان", 7, "wednesday", "BIO", null],
  // Thursday
  ["محمد ابوعواد", 1, "thursday", "PHS", null],
  ["محمد شاهر", 2, "thursday", "Eng", null],
  ["علي سليمان", 3, "thursday", "CHM", null],
  ["اسامه مهيدات", 4, "thursday", "MTH", null],
  ["سامي السرحان", 5, "thursday", "BIO", null],
  ["احمد ادم", 6, "thursday", "REL", null],
]);

// ===== 11.3s =====
addSchedule("11.3s", [
  // Sunday
  ["عبدالرحمان عبد الله", 1, "sunday", "MTH", null],
  ["بدر عبد البديع", 2, "sunday", "Eng", null],
  ["احمد ادم", 3, "sunday", "REL", null],
  ["عامر خير", 4, "sunday", "PE", "PE.Hall"],
  ["محمد ابوعواد", 5, "sunday", "PHS", null],
  ["ياسر عبد الوهاب", 6, "sunday", "CHM", null],
  ["عمر أبو غليون", 7, "sunday", "ARB", null],
  // Monday
  ["ياسر عبد الوهاب", 1, "monday", "CHM", null],
  ["عمر أبو غليون", 2, "monday", "ARB", null],
  ["سامي السرحان", 3, "monday", "BIO", null],
  ["محمد ابوعواد", 4, "monday", "PHS", null],
  ["بدر عبد البديع", 5, "monday", "Eng", null],
  ["احمد ادم", 6, "monday", "REL", null],
  ["عبدالرحمان عبد الله", 7, "monday", "MTH", null],
  // Tuesday
  ["سامي السرحان", 1, "tuesday", "BIO", null],
  ["محمد ابوعواد", 2, "tuesday", "PHS", null],
  ["ياسر عبد الوهاب", 3, "tuesday", "CHM", null],
  ["بدر عبد البديع", 4, "tuesday", "Eng", null],
  ["عبدالرحمان عبد الله", 5, "tuesday", "MTH", null],
  ["احمد ادم", 6, "tuesday", "REL", null],
  ["محمد أبوريان", 7, "tuesday", "L.Sk", null],
  // Wednesday
  ["بدر عبد البديع", 1, "wednesday", "Eng", null],
  ["محمد أبوريان", 2, "wednesday", "L.Sk", null],
  ["عمر أبو غليون", 3, "wednesday", "ARB", null],
  ["عبدالرحمان عبد الله", 4, "wednesday", "MTH", null],
  ["سامي السرحان", 5, "wednesday", "BIO", null],
  ["ياسر عبد الوهاب", 6, "wednesday", "CHM", null],
  ["محمد ابوعواد", 7, "wednesday", "PHS", null],
  // Thursday
  ["عامر خير", 1, "thursday", "PE", "PE.Hall"],
  ["عبدالرحمان عبد الله", 2, "thursday", "MTH", null],
  ["وسن أحمد", 3, "thursday", "C&IT", "Lab2"],
  ["وسن أحمد", 4, "thursday", "C&IT", "Lab2"],
  ["سامي السرحان", 5, "thursday", "BIO", null],
  ["بدر عبد البديع", 6, "thursday", "Eng", null],
]);

// ===== 11.4s =====
addSchedule("11.4s", [
  // Sunday
  ["محسن ابوحقب", 1, "sunday", "PE", "PE.Hall"],
  ["محمد أبوريان", 2, "sunday", "L.Sk", null],
  ["بدر عبد البديع", 3, "sunday", "Eng", null],
  ["عبدالرحمان عبد الله", 4, "sunday", "MTH", null],
  ["ياسر عبد الوهاب", 5, "sunday", "CHM", null],
  ["هاني فوزي", 6, "sunday", "BIO", null],
  ["هاني فوزي", 7, "sunday", "BIO", null],
  // Monday
  ["عبدالرحمان عبد الله", 1, "monday", "MTH", null],
  ["هاني فوزي", 2, "monday", "BIO", null],
  ["احمد ادم", 3, "monday", "REL", null],
  ["محمد فتحي", 4, "monday", "PHS", null],
  ["بدر عبد البديع", 5, "monday", "Eng", null],
  ["عبدالرحمان عبد الله", 6, "monday", "MTH", null],
  ["محمد أبوريان", 7, "monday", "L.Sk", null],
  // Tuesday
  ["عمر أبو غليون", 1, "tuesday", "ARB", null],
  ["بدر عبد البديع", 2, "tuesday", "Eng", null],
  ["هاني فوزي", 3, "tuesday", "BIO", null],
  ["احمد ادم", 4, "tuesday", "REL", null],
  ["محمد فتحي", 5, "tuesday", "PHS", null],
  ["ياسر عبد الوهاب", 6, "tuesday", "CHM", null],
  ["عبدالرحمان عبد الله", 7, "tuesday", "MTH", null],
  // Wednesday
  ["محمد فتحي", 1, "wednesday", "PHS", null],
  ["عبدالرحمان عبد الله", 2, "wednesday", "MTH", null],
  ["بدر عبد البديع", 3, "wednesday", "Eng", null],
  ["عمر أبو غليون", 4, "wednesday", "ARB", null],
  ["محسن ابوحقب", 5, "wednesday", "PE", null],
  ["هاني فوزي", 6, "wednesday", "BIO", null],
  ["ياسر عبد الوهاب", 7, "wednesday", "CHM", null],
  // Thursday
  ["بدر عبد البديع", 1, "thursday", "Eng", null],
  ["احمد ادم", 2, "thursday", "REL", null],
  ["ياسر عبد الوهاب", 3, "thursday", "CHM", null],
  ["محمد فتحي", 4, "thursday", "PHS", null],
  ["عبدالرحمان عبد الله", 5, "thursday", "MTH", null],
  ["عمر أبو غليون", 6, "thursday", "ARB", null],
]);

// ===== 11.5t =====
addSchedule("11.5t", [
  // Sunday
  ["ابراهيم خليل", 1, "sunday", "CS", "Lab1"],
  ["ابراهيم خليل", 2, "sunday", "CS", "Lab1"],
  ["صلاح الدين النمر", 3, "sunday", "MTH", null],
  ["صالح المرزوقي", 4, "sunday", "Eng", null],
  ["محمد فتحي", 5, "sunday", "PHS", null],
  ["محمد أبوريان", 6, "sunday", "L.Sk", null],
  ["محمد وحيد", 7, "sunday", "BM", null],
  // Monday
  ["احمد ادم", 1, "monday", "REL", null],
  ["محمد فتحي", 2, "monday", "PHS", null],
  ["صالح المرزوقي", 3, "monday", "Eng", null],
  ["صلاح الدين النمر", 4, "monday", "MTH", null],
  ["محمد النجار", 5, "monday", "IT", "Lab1"],
  ["محمد النجار", 6, "monday", "IT", "Lab1"],
  ["عمر أبو غليون", 7, "monday", "ARB", null],
  // Tuesday
  ["صالح المرزوقي", 1, "tuesday", "Eng", null],
  ["صلاح الدين النمر", 2, "tuesday", "MTH", null],
  ["عمر أبو غليون", 3, "tuesday", "ARB", null],
  ["ابراهيم خليل", 4, "tuesday", "CS", "Lab1"],
  ["علي نادي", 5, "tuesday", "PE", "PE.Hall"],
  ["ابراهيم خليل", 6, "tuesday", "CS", "Lab1"],
  ["احمد ادم", 7, "tuesday", "REL", null],
  // Wednesday
  ["صالح المرزوقي", 1, "wednesday", "Eng", null],
  ["محمد وحيد", 2, "wednesday", "BM", null],
  ["محمد النجار", 3, "wednesday", "IT", "Lab1"],
  ["محمد النجار", 4, "wednesday", "IT", "Lab1"],
  ["محمد أبوريان", 5, "wednesday", "L.Sk", null],
  ["صلاح الدين النمر", 6, "wednesday", "MTH", null],
  ["محمد فتحي", 7, "wednesday", "PHS", null],
  // Thursday
  ["صلاح الدين النمر", 1, "thursday", "MTH", null],
  ["علي نادي", 2, "thursday", "PE", "PE.Hall"],
  ["عمر أبو غليون", 3, "thursday", "ARB", null],
  ["صلاح الدين النمر", 4, "thursday", "MTH", null],
  ["محمد فتحي", 5, "thursday", "PHS", null],
  ["صالح المرزوقي", 6, "thursday", "Eng", null],
]);

// ===== 11.6h =====
addSchedule("11.6h", [
  // Sunday
  ["شريف ابراهيم", 1, "sunday", "ARB", null],
  ["حسام الحاجي", 2, "sunday", "His", null],
  ["احمد اسماعيل", 3, "sunday", "Eng", null],
  ["محمد أبوريان", 4, "sunday", "L.Sk", null],
  ["احمد ادم", 5, "sunday", "REL", null],
  ["ناصر السرخي", 6, "sunday", "G.S", null],
  ["ناصر السرخي", 7, "sunday", "G.S", null],
  // Monday
  ["حسام الحاجي", 1, "monday", "His", null],
  ["ناصر السرخي", 2, "monday", "G.S", null],
  ["شريف ابراهيم", 3, "monday", "ARB", null],
  ["حمدي دويب", 4, "monday", "Geq", null],
  ["صالح الهاذلي", 5, "monday", "MTH", null],
  ["احمد اسماعيل", 6, "monday", "Eng", null],
  ["شريف ابراهيم", 7, "monday", "ARB", null],
  // Tuesday
  ["احمد اسماعيل", 1, "tuesday", "Eng", null],
  ["احمد ادم", 2, "tuesday", "REL", null],
  ["ناصر السرخي", 3, "tuesday", "G.S", null],
  ["محسن ابوحقب", 4, "tuesday", "PE", "PE.Hall"],
  ["شريف ابراهيم", 5, "tuesday", "ARB", null],
  ["حمدي دويب", 6, "tuesday", "Geq", null],
  ["حمدي دويب", 7, "tuesday", "Geq", null],
  // Wednesday
  ["ناصر السرخي", 1, "wednesday", "G.S", null],
  ["شريف ابراهيم", 2, "wednesday", "ARB", null],
  ["حمدي دويب", 3, "wednesday", "Geq", null],
  ["احمد ادم", 4, "wednesday", "REL", null],
  ["حسام الحاجي", 5, "wednesday", "His", null],
  ["صالح الهاذلي", 6, "wednesday", "MTH", null],
  ["احمد اسماعيل", 7, "wednesday", "Eng", null],
  // Thursday
  ["حمدي دويب", 1, "thursday", "Geq", null],
  ["احمد اسماعيل", 2, "thursday", "Eng", null],
  ["حسام الحاجي", 3, "thursday", "His", null],
  ["شريف ابراهيم", 4, "thursday", "ARB", null],
  ["محسن ابوحقب", 5, "thursday", "PE", "PE.Hall"],
  ["محمد أبوريان", 6, "thursday", "L.Sk", null],
]);

// ===== 11.7h =====
addSchedule("11.7h", [
  // Sunday
  ["صالح الهاذلي", 1, "sunday", "MTH", null],
  ["أيمن مفلح", 2, "sunday", "REL", null],
  ["حمدي دويب", 3, "sunday", "Geq", null],
  ["حسام الحاجي", 4, "sunday", "His", null],
  ["محمد وحيد", 5, "sunday", "BM", null],
  ["صالح المرزوقي", 6, "sunday", "Eng", null],
  ["عامر خير", 7, "sunday", "PE", "PE.Hall"],
  // Monday
  ["صالح المرزوقي", 1, "monday", "Eng", null],
  ["حمدي دويب", 2, "monday", "Geq", null],
  ["حسام الحاجي", 3, "monday", "His", null],
  ["أيمن مفلح", 4, "monday", "REL", null],
  ["محمد محسن", 5, "monday", "ARB", null],
  ["تامر صلاح", 6, "monday", "G.S", null],
  ["محمد محسن", 7, "monday", "ARB", null],
  // Tuesday
  ["تامر صلاح", 1, "tuesday", "G.S", null],
  ["محمد محسن", 2, "tuesday", "ARB", null],
  ["محمد محسن", 3, "tuesday", "ARB", null],
  ["عامر خير", 4, "tuesday", "PE", null],
  ["حسام الحاجي", 5, "tuesday", "His", null],
  ["صالح الهاذلي", 6, "tuesday", "MTH", null],
  ["صالح المرزوقي", 7, "tuesday", "Eng", null],
  // Wednesday
  ["محمد وحيد", 1, "wednesday", "BM", null],
  ["محمد محسن", 2, "wednesday", "ARB", null],
  ["محمد أبوريان", 3, "wednesday", "L.Sk", null],
  ["صالح المرزوقي", 4, "wednesday", "Eng", null],
  ["حمدي دويب", 5, "wednesday", "Geq", null],
  ["أيمن مفلح", 6, "wednesday", "REL", null],
  ["تامر صلاح", 7, "wednesday", "G.S", null],
  // Thursday
  ["حسام الحاجي", 1, "thursday", "His", null],
  ["تامر صلاح", 2, "thursday", "G.S", null],
  ["صالح المرزوقي", 3, "thursday", "Eng", null],
  ["صالح الهاذلي", 4, "thursday", "MTH", null],
  ["حمدي دويب", 5, "thursday", "Geq", null],
  ["محمد محسن", 6, "thursday", "ARB", null],
]);

// ===== 12.1s =====
addSchedule("12.1s", [
  // Sunday
  ["محمد محسن", 1, "sunday", "ARB", null],
  ["صالح المرزوقي", 2, "sunday", "Eng", null],
  ["صالح الهاذلي", 3, "sunday", "MTH", null],
  ["عمار الشيخ", 4, "sunday", "BIO", null],
  ["أيمن مفلح", 5, "sunday", "REL", null],
  ["وليد الششتاوي", 6, "sunday", "CHM", null],
  ["محمد ابوعواد", 7, "sunday", "PHS", null],
  // Monday
  ["وليد الششتاوي", 1, "monday", "CHM", null],
  ["صالح الهاذلي", 2, "monday", "MTH", null],
  ["علي حسن", 3, "monday", "C&IT", "Lab1"],
  ["علي حسن", 4, "monday", "C&IT", "Lab1"],
  ["صالح المرزوقي", 5, "monday", "Eng", null],
  ["محمد ابوعواد", 6, "monday", "PHS", null],
  ["صالح الهاذلي", 7, "monday", "MTH", null],
  // Tuesday
  ["صالح الهاذلي", 1, "tuesday", "MTH", null],
  ["وليد الششتاوي", 2, "tuesday", "CHM", null],
  ["صالح المرزوقي", 3, "tuesday", "Eng", null],
  ["محمد أبوريان", 4, "tuesday", "L.Sk", null],
  ["عمار الشيخ", 5, "tuesday", "BIO", null],
  ["محمد محسن", 6, "tuesday", "ARB", null],
  ["أيمن مفلح", 7, "tuesday", "REL", null],
  // Wednesday
  ["عمار الشيخ", 1, "wednesday", "BIO", null],
  ["صالح الهاذلي", 2, "wednesday", "MTH", null],
  ["أيمن مفلح", 3, "wednesday", "REL", null],
  ["محمد ابوعواد", 4, "wednesday", "PHS", null],
  ["محمد محسن", 5, "wednesday", "ARB", null],
  ["صالح المرزوقي", 6, "wednesday", "Eng", null],
  ["علي نادي", 7, "wednesday", "PE", "PE.Hall"],
  // Thursday
  ["صالح المرزوقي", 1, "thursday", "Eng", null],
  ["عمار الشيخ", 2, "thursday", "BIO", null],
  ["محمد ابوعواد", 3, "thursday", "PHS", null],
  ["محمد أبوريان", 4, "thursday", "L.Sk", null],
  ["صالح الهاذلي", 5, "thursday", "MTH", null],
  ["وليد الششتاوي", 6, "thursday", "CHM", null],
  ["صالح المرزوقي", 7, "thursday", "Eng", null],
]);

// ===== 12.2s =====
addSchedule("12.2s", [
  // Sunday
  ["ياسر عبد الوهاب", 1, "sunday", "CHM", null],
  ["محمد العكاوي", 2, "sunday", "MTH", null],
  ["محمد ابوعواد", 3, "sunday", "PHS", null],
  ["محمد شاهر", 4, "sunday", "Eng", null],
  ["ابراهيم الشيخ", 5, "sunday", "L.Sk", null],
  ["محمد العكاوي", 6, "sunday", "MTH", null],
  ["مروان عوض", 7, "sunday", "ARB", null],
  // Monday
  ["محمد ابوعواد", 1, "monday", "PHS", null],
  ["محسن ابوحقب", 2, "monday", "PE", "PE.Hall"],
  ["ياسر عبد الوهاب", 3, "monday", "CHM", null],
  ["مهند ربيع", 4, "monday", "REL", null],
  ["محمد شاهر", 5, "monday", "Eng", null],
  ["عمار الشيخ", 6, "monday", "BIO", null],
  ["محمد العكاوي", 7, "monday", "MTH", null],
  // Tuesday
  ["محمد العكاوي", 1, "tuesday", "MTH", null],
  ["ابراهيم الشيخ", 2, "tuesday", "L.Sk", null],
  ["عمار الشيخ", 3, "tuesday", "BIO", null],
  ["محمد ابوعواد", 4, "tuesday", "PHS", null],
  ["محمد شاهر", 5, "tuesday", "Eng", null],
  ["مهند ربيع", 6, "tuesday", "REL", null],
  ["ياسر عبد الوهاب", 7, "tuesday", "CHM", null],
  // Wednesday
  ["علي حسن", 1, "wednesday", "C&IT", "Lab1"],
  ["علي حسن", 2, "wednesday", "C&IT", "Lab1"],
  ["محمد شاهر", 3, "wednesday", "Eng", null],
  ["مروان عوض", 4, "wednesday", "ARB", null],
  ["محمد العكاوي", 5, "wednesday", "MTH", null],
  ["مهند ربيع", 6, "wednesday", "REL", null],
  ["عمار الشيخ", 7, "wednesday", "BIO", null],
  // Thursday
  ["مروان عوض", 1, "thursday", "ARB", null],
  ["محمد شاهر", 2, "thursday", "Eng", null],
  ["ياسر عبد الوهاب", 3, "thursday", "CHM", null],
  ["محمد شاهر", 4, "thursday", "Eng", null],
  ["محمد ابوعواد", 5, "thursday", "PHS", null],
  ["محمد العكاوي", 6, "thursday", "MTH", null],
  ["محمد ابوعواد", 7, "thursday", "PHS", null],
]);

// ===== 12.3s =====
addSchedule("12.3s", [
  // Sunday
  ["ابراهيم رميح", 1, "sunday", "MTH", null],
  ["خليل وليد", 2, "sunday", "PHS", null],
  ["الحبيب جبنون", 3, "sunday", "Eng", null],
  ["وائل محمد", 4, "sunday", "CHM", null],
  ["محمد النجار", 5, "sunday", "C&IT", "Lab1"],
  ["محمد النجار", 6, "sunday", "C&IT", "Lab1"],
  ["أيمن مفلح", 7, "sunday", "REL", null],
  // Monday
  ["خليل وليد", 1, "monday", "PHS", null],
  ["ابراهيم رميح", 2, "monday", "MTH", null],
  ["وائل محمد", 3, "monday", "CHM", null],
  ["الحبيب جبنون", 4, "monday", "Eng", null],
  ["شريف ابراهيم", 5, "monday", "ARB", null],
  ["محسن ابوحقب", 6, "monday", "PE", "PE.Hall"],
  ["فيصل احمد", 7, "monday", "BIO", null],
  // Tuesday
  ["فيصل احمد", 1, "tuesday", "BIO", null],
  ["الحبيب جبنون", 2, "tuesday", "Eng", null],
  ["ابراهيم الشيخ", 3, "tuesday", "L.Sk", null],
  ["ابراهيم رميح", 4, "tuesday", "MTH", null],
  ["ابراهيم رميح", 5, "tuesday", "MTH", null],
  ["خليل وليد", 6, "tuesday", "PHS", null],
  ["الحبيب جبنون", 7, "tuesday", "Eng", null],
  // Wednesday
  ["أيمن مفلح", 1, "wednesday", "REL", null],
  ["فيصل احمد", 2, "wednesday", "BIO", null],
  ["شريف ابراهيم", 3, "wednesday", "ARB", null],
  ["الحبيب جبنون", 4, "wednesday", "Eng", null],
  ["وائل محمد", 5, "wednesday", "CHM", null],
  ["ابراهيم رميح", 6, "wednesday", "MTH", null],
  ["ابراهيم الشيخ", 7, "wednesday", "L.Sk", null],
  // Thursday
  ["وائل محمد", 1, "thursday", "CHM", null],
  ["فيصل احمد", 2, "thursday", "BIO", null],
  ["أيمن مفلح", 3, "thursday", "REL", null],
  ["ابراهيم رميح", 4, "thursday", "MTH", null],
  ["شريف ابراهيم", 5, "thursday", "ARB", null],
  ["خليل وليد", 6, "thursday", "PHS", null],
  ["الحبيب جبنون", 7, "thursday", "Eng", null],
]);

// ===== 12.4s =====
addSchedule("12.4s", [
  // Sunday
  ["وائل محمد", 1, "sunday", "CHM", null],
  ["ايهاب عفيفي", 2, "sunday", "MTH", null],
  ["محمد أبوريان", 3, "sunday", "L.Sk", null],
  ["سامح محمد", 4, "sunday", "Eng", null],
  ["شريف ابراهيم", 5, "sunday", "ARB", null],
  ["محمد لطفي", 6, "sunday", "PHS", null],
  ["ايهاب عفيفي", 7, "sunday", "MTH", null],
  // Monday
  ["ايهاب عفيفي", 1, "monday", "MTH", null],
  ["سامح محمد", 2, "monday", "Eng", null],
  ["سامح محمد", 3, "monday", "Eng", null],
  ["هاني فوزي", 4, "monday", "BIO", null],
  ["وائل محمد", 5, "monday", "CHM", null],
  ["أيمن مفلح", 6, "monday", "REL", null],
  ["ايهاب عفيفي", 7, "monday", "MTH", null],
  // Tuesday
  ["شريف ابراهيم", 1, "tuesday", "ARB", null],
  ["أيمن مفلح", 2, "tuesday", "REL", null],
  ["ايهاب عفيفي", 3, "tuesday", "MTH", null],
  ["محمد لطفي", 4, "tuesday", "PHS", null],
  ["وائل محمد", 5, "tuesday", "CHM", null],
  ["هاني فوزي", 6, "tuesday", "BIO", null],
  ["سامح محمد", 7, "tuesday", "Eng", null],
  // Wednesday
  ["محمد لطفي", 1, "wednesday", "PHS", null],
  ["محسن ابوحقب", 2, "wednesday", "PE", "PE.Hall"],
  ["هاني فوزي", 3, "wednesday", "BIO", null],
  ["ايهاب عفيفي", 4, "wednesday", "MTH", null],
  ["شريف ابراهيم", 5, "wednesday", "ARB", null],
  ["سامح محمد", 6, "wednesday", "Eng", null],
  ["وائل محمد", 7, "wednesday", "CHM", null],
  // Thursday
  ["أيمن مفلح", 1, "thursday", "REL", null],
  ["سامح محمد", 2, "thursday", "Eng", null],
  ["ايهاب عفيفي", 3, "thursday", "MTH", null],
  ["هاني فوزي", 4, "thursday", "BIO", null],
  ["محمد أبوريان", 5, "thursday", "L.Sk", null],
  ["محمد لطفي", 6, "thursday", "PHS", null],
]);

// ===== 12.5s =====
addSchedule("12.5s", [
  // Sunday
  ["محمد لطفي", 1, "sunday", "PHS", null],
  ["أحمد عيد", 2, "sunday", "Eng", null],
  ["شريف ابراهيم", 3, "sunday", "ARB", null],
  ["عبد العزيز شنينة", 4, "sunday", "REL", null],
  ["محسن ابوحقب", 5, "sunday", "PE", "PE.Hall"],
  ["عمار الشيخ", 6, "sunday", "BIO", null],
  ["صلاح الدين النمر", 7, "sunday", "MTH", null],
  // Monday
  ["عمار الشيخ", 1, "monday", "BIO", null],
  ["صلاح الدين النمر", 2, "monday", "MTH", null],
  ["حسام حسن", 3, "monday", "L.Sk", null],
  ["علي سليمان", 4, "monday", "CHM", null],
  ["أحمد عيد", 5, "monday", "Eng", null],
  ["عبد العزيز شنينة", 6, "monday", "REL", null],
  ["محمد لطفي", 7, "monday", "PHS", null],
  // Tuesday
  ["محمد النجار", 1, "tuesday", "C&IT", "Lab1"],
  ["محمد النجار", 2, "tuesday", "C&IT", "Lab1"],
  ["أحمد عيد", 3, "tuesday", "Eng", null],
  ["صلاح الدين النمر", 4, "tuesday", "MTH", null],
  ["علي سليمان", 5, "tuesday", "CHM", null],
  ["صلاح الدين النمر", 6, "tuesday", "MTH", null],
  ["عمار الشيخ", 7, "tuesday", "BIO", null],
  // Wednesday
  ["علي سليمان", 1, "wednesday", "CHM", null],
  ["صلاح الدين النمر", 2, "wednesday", "MTH", null],
  ["عمار الشيخ", 3, "wednesday", "BIO", null],
  ["محمد لطفي", 4, "wednesday", "PHS", null],
  ["أحمد عيد", 5, "wednesday", "Eng", null],
  ["عبد العزيز شنينة", 6, "wednesday", "REL", null],
  ["شريف ابراهيم", 7, "wednesday", "ARB", null],
  // Thursday
  ["أحمد عيد", 1, "thursday", "Eng", null],
  ["شريف ابراهيم", 2, "thursday", "ARB", null],
  ["صلاح الدين النمر", 3, "thursday", "MTH", null],
  ["أحمد عيد", 4, "thursday", "Eng", null],
  ["حسام حسن", 5, "thursday", "L.Sk", null],
  ["محمد لطفي", 6, "thursday", "PHS", null],
]);

// ===== 12.6t =====
addSchedule("12.6t", [
  // Sunday
  ["أحمد شغميم", 1, "sunday", "MTH", null],
  ["يمان حسناوي", 2, "sunday", "REL", null],
  ["وسن أحمد", 3, "sunday", "IT", "Lab1"],
  ["وسن أحمد", 4, "sunday", "IT", "Lab1"],
  ["أحمد علي", 5, "sunday", "ARB", null],
  ["أحمد شغميم", 6, "sunday", "MTH", null],
  ["أحمد عيد", 7, "sunday", "Eng", null],
  // Monday
  ["جابر أحمد", 1, "monday", "CS", "Lab1"],
  ["جابر أحمد", 2, "monday", "CS", "Lab1"],
  ["محمد أبوريان", 3, "monday", "L.Sk", null],
  ["أحمد عيد", 4, "monday", "Eng", null],
  ["علي نادي", 5, "monday", "PE", null],
  ["السيد شعبان", 6, "monday", "PHS", null],
  ["أحمد شغميم", 7, "monday", "MTH", null],
  // Tuesday
  ["أحمد عيد", 1, "tuesday", "Eng", null],
  ["وائل محمد", 2, "tuesday", "CHM", null],
  ["أحمد علي", 3, "tuesday", "ARB", null],
  ["يمان حسناوي", 4, "tuesday", "REL", null],
  ["السيد شعبان", 5, "tuesday", "PHS", null],
  ["أحمد شغميم", 6, "tuesday", "MTH", null],
  ["أحمد عيد", 7, "tuesday", "Eng", null],
  // Wednesday
  ["السيد شعبان", 1, "wednesday", "PHS", null],
  ["أحمد عيد", 2, "wednesday", "Eng", null],
  ["يمان حسناوي", 3, "wednesday", "REL", null],
  ["أحمد شغميم", 4, "wednesday", "MTH", null],
  ["وسن أحمد", 5, "wednesday", "IT", "Lab1"],
  ["وسن أحمد", 6, "wednesday", "IT", "Lab1"],
  ["أحمد علي", 7, "wednesday", "ARB", null],
  // Thursday
  ["أحمد شغميم", 1, "thursday", "MTH", null],
  ["أحمد عيد", 2, "thursday", "Eng", null],
  ["السيد شعبان", 3, "thursday", "PHS", null],
  ["جابر أحمد", 4, "thursday", "CS", "Lab1"],
  ["جابر أحمد", 5, "thursday", "CS", "Lab1"],
  ["محمد أبوريان", 6, "thursday", "L.Sk", null],
]);

// ===== 12.7h =====
addSchedule("12.7h", [
  // Sunday
  ["حمدي دويب", 1, "sunday", "Geq", null],
  ["مروان عوض", 2, "sunday", "ARB", null],
  ["ناصر السرخي", 3, "sunday", "G.S", null],
  ["بدر عبد البديع", 4, "sunday", "Eng", null],
  ["مهند ربيع", 5, "sunday", "REL", null],
  ["حسام الحاجي", 6, "sunday", "His", null],
  ["اسامه مهيدات", 7, "sunday", "MTH", null],
  // Monday
  ["مروان عوض", 1, "monday", "ARB", null],
  ["بدر عبد البديع", 2, "monday", "Eng", null],
  ["مروان عوض", 3, "monday", "ARB", null],
  ["ناصر السرخي", 4, "monday", "G.S", null],
  ["محمد أبوريان", 5, "monday", "L.Sk", null],
  ["حمدي دويب", 6, "monday", "Geq", null],
  ["حسام الحاجي", 7, "monday", "His", null],
  // Tuesday
  ["مهند ربيع", 1, "tuesday", "REL", null],
  ["محسن ابوحقب", 2, "tuesday", "PE", "PE.Hall"],
  ["اسامه مهيدات", 3, "tuesday", "MTH", null],
  ["مروان عوض", 4, "tuesday", "ARB", null],
  ["حمدي دويب", 5, "tuesday", "Geq", null],
  ["ناصر السرخي", 6, "tuesday", "G.S", null],
  ["بدر عبد البديع", 7, "tuesday", "Eng", null],
  // Wednesday
  ["حسام الحاجي", 1, "wednesday", "His", null],
  ["محمد أبوريان", 2, "wednesday", "L.Sk", null],
  ["بدر عبد البديع", 3, "wednesday", "Eng", null],
  ["مهند ربيع", 4, "wednesday", "REL", null],
  ["اسامه مهيدات", 5, "wednesday", "MTH", null],
  ["مروان عوض", 6, "wednesday", "ARB", null],
  ["حمدي دويب", 7, "wednesday", "Geq", null],
  // Thursday
  ["بدر عبد البديع", 1, "thursday", "Eng", null],
  ["محمد النجار", 2, "thursday", "C&IT", "Lab1"],
  ["محمد النجار", 3, "thursday", "C&IT", "Lab1"],
  ["ناصر السرخي", 4, "thursday", "G.S", null],
  ["حسام الحاجي", 5, "thursday", "His", null],
  ["بدر عبد البديع", 6, "thursday", "Eng", null],
  ["مروان عوض", 7, "thursday", "ARB", null],
]);

// ===== 12.8h =====
addSchedule("12.8h", [
  // Sunday
  ["حمد المحيمد", 1, "sunday", "His", null],
  ["حمد المحيمد", 2, "sunday", "His", null],
  ["عمر أبو غليون", 3, "sunday", "ARB", null],
  ["عمر أبو شريعة", 4, "sunday", "Geq", null],
  ["ناصر السرخي", 5, "sunday", "G.S", null],
  ["عبدالرحمان عبد الله", 6, "sunday", "MTH", null],
  ["زكي أبو نجيله", 7, "sunday", "Eng", null],
  // Monday
  ["محمد أبوريان", 1, "monday", "L.Sk", null],
  ["أيمن مفلح", 2, "monday", "REL", null],
  ["عبدالرحمان عبد الله", 3, "monday", "MTH", null],
  ["عمر أبو غليون", 4, "monday", "ARB", null],
  ["حمد المحيمد", 5, "monday", "His", null],
  ["زكي أبو نجيله", 6, "monday", "Eng", null],
  ["عمر أبو شريعة", 7, "monday", "Geq", null],
  // Tuesday
  ["ناصر السرخي", 1, "tuesday", "G.S", null],
  ["زكي أبو نجيله", 2, "tuesday", "Eng", null],
  ["عبدالرحمان عبد الله", 3, "tuesday", "MTH", null],
  ["أيمن مفلح", 4, "tuesday", "REL", null],
  ["عمر أبو شريعة", 5, "tuesday", "Geq", null],
  ["عمر أبو غليون", 6, "tuesday", "ARB", null],
  ["حمد المحيمد", 7, "tuesday", "His", null],
  // Wednesday
  ["عمر أبو غليون", 1, "wednesday", "ARB", null],
  ["عمر أبو شريعة", 2, "wednesday", "Geq", null],
  ["ناصر السرخي", 3, "wednesday", "G.S", null],
  ["زكي أبو نجيله", 4, "wednesday", "Eng", null],
  ["حمد المحيمد", 5, "wednesday", "His", null],
  ["عمر أبو غليون", 6, "wednesday", "ARB", null],
  ["زكي أبو نجيله", 7, "wednesday", "Eng", null],
  // Thursday
  ["زكي أبو نجيله", 1, "thursday", "Eng", null],
  ["أيمن مفلح", 2, "thursday", "REL", null],
  ["محسن ابوحقب", 3, "thursday", "PE", "PE.Hall"],
  ["محمد أبوريان", 4, "thursday", "L.Sk", null],
  ["ناصر السرخي", 5, "thursday", "G.S", null],
  ["عمر أبو غليون", 6, "thursday", "ARB", null],
]);

// ===== STUDENTS =====
console.log("\n=== Deleting all existing students ===");
db.exec("DELETE FROM attendance"); // must delete attendance first (FK)
const delResult = db.prepare("DELETE FROM students").run();
console.log(`  Deleted ${delResult.changes} existing students`);

const allClasses = [
  "10.1", "10.2", "10.3", "10.4", "10.5", "10.6", "10.7",
  "11.1s", "11.2s", "11.3s", "11.4s", "11.5t", "11.6h", "11.7h",
  "12.1s", "12.2s", "12.3s", "12.4s", "12.5s", "12.6t", "12.7h", "12.8h",
  "ESE1", "ESE2",
];

const firstNames = [
  "أحمد", "محمد", "عبدالله", "خالد", "عمر", "سعود", "فهد", "عبدالرحمن",
  "يوسف", "حمد", "راشد", "سلطان", "ناصر", "جاسم", "ماجد", "حسن",
  "طارق", "بلال", "كريم", "مصطفى", "عادل", "وليد", "سامي", "رامي",
  "تامر", "حسام", "أيمن", "زياد", "نواف", "سعد", "بدر", "فيصل",
  "تركي", "مشاري", "حمزة", "إبراهيم", "علي", "هاشم", "صالح", "مالك",
];

const lastNames = [
  "المري", "الكواري", "السليطي", "الدوسري", "المهندي", "الحمادي",
  "النعيمي", "البوعينين", "الخاطر", "المعاضيد", "السادة", "الأنصاري",
  "العمادي", "الموسى", "الشمري", "المالكي", "البلوشي", "الهاجري",
  "العتيبي", "الغانم", "الكبيسي", "المناعي", "الخليفي", "الجابري",
  "السعدي", "المطيري", "العجمي", "الحربي", "الزهراني", "التميمي",
];

const insertStudent = db.prepare(
  "INSERT INTO students (name, class_id, student_number) VALUES (?, ?, ?)"
);

const STUDENTS_PER_CLASS = 27;

console.log("\n=== Inserting students ===");
let totalStudents = 0;

for (let ci = 0; ci < allClasses.length; ci++) {
  const className = allClasses[ci];
  const cid = getClassId(className);
  if (!cid) {
    console.log(`  WARNING: class "${className}" not found, skipping students`);
    continue;
  }

  const students: string[] = [];
  // Use class index as offset to get different name combinations per class
  const firstOffset = (ci * 7) % firstNames.length;
  const lastOffset = (ci * 3) % lastNames.length;

  for (let s = 0; s < STUDENTS_PER_CLASS; s++) {
    const fi = (firstOffset + s) % firstNames.length;
    const li = (lastOffset + s) % lastNames.length;
    const fullName = `${firstNames[fi]} ${lastNames[li]}`;

    // Ensure uniqueness within this class
    if (students.includes(fullName)) {
      // Use alternative combination
      const altFi = (fi + 13) % firstNames.length;
      const altName = `${firstNames[altFi]} ${lastNames[li]}`;
      students.push(altName);
    } else {
      students.push(fullName);
    }
  }

  for (let s = 0; s < students.length; s++) {
    const studentNumber = `${className.replace(".", "")}-${String(s + 1).padStart(3, "0")}`;
    insertStudent.run(students[s], cid, studentNumber);
  }

  totalStudents += students.length;
  console.log(`  ${className}: inserted ${students.length} students`);
}

console.log(`\n=== DONE ===`);
console.log(`Total schedule entries added for remaining classes: ${classesToSeed.length} classes`);
console.log(`Total students added across all ${allClasses.length} classes: ${totalStudents}`);

db.close();
