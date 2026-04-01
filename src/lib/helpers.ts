export const dayNames: Record<string, string> = {
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
};

export const subjectNames: Record<string, string> = {
  ARB: "اللغة العربية",
  Eng: "اللغة الإنجليزية",
  MTH: "الرياضيات",
  PHS: "الفيزياء",
  CHM: "الكيمياء",
  BIO: "الأحياء",
  SOC: "الدراسات الاجتماعية",
  REL: "التربية الإسلامية",
  PE: "التربية البدنية",
  "L.Sk": "مهارات الحياة",
  "C&IT": "الحوسبة وتكنولوجيا المعلومات",
  IT: "تكنولوجيا المعلومات",
  CS: "علوم الحاسب",
  BM: "إدارة الأعمال",
  His: "التاريخ",
  Geq: "الجغرافيا",
  "G.S": "الدراسات العامة",
  Gr: "اللغة الألمانية",
  Fr: "اللغة الفرنسية",
  SCI: "العلوم",
  ADMIN: "إدارة",
};

export function getCurrentDay(): string {
  const jsDay = new Date().getDay();
  const dayMap: Record<number, string> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
  };
  return dayMap[jsDay] || "sunday";
}

export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getCurrentPeriodInfo(grade: number): { current: number | null; next: number | null; timeLeft: string; periodTimes: { number: number; start: string; end: string }[] } {
  const now = new Date();
  const jsDay = now.getDay();
  const isThursday = jsDay === 4;
  const isWeekend = jsDay === 5 || jsDay === 6;

  let periodTimes: { number: number; start: string; end: string }[];

  if (isThursday) {
    if (grade >= 12) {
      periodTimes = [
        { number: 1, start: "07:10", end: "07:50" },
        { number: 2, start: "07:55", end: "08:35" },
        { number: 3, start: "09:00", end: "09:40" },
        { number: 4, start: "09:40", end: "10:20" },
        { number: 5, start: "10:25", end: "11:05" },
        { number: 6, start: "11:10", end: "11:50" },
      ];
    } else {
      periodTimes = [
        { number: 1, start: "07:10", end: "07:50" },
        { number: 2, start: "07:55", end: "08:35" },
        { number: 3, start: "08:40", end: "09:20" },
        { number: 4, start: "09:40", end: "10:20" },
        { number: 5, start: "10:25", end: "11:05" },
        { number: 6, start: "11:10", end: "11:50" },
      ];
    }
  } else {
    periodTimes = [
      { number: 1, start: "07:10", end: "07:55" },
      { number: 2, start: "08:00", end: "08:45" },
      { number: 3, start: "09:10", end: "09:55" },
      { number: 4, start: "10:00", end: "10:45" },
      { number: 5, start: "10:50", end: "11:35" },
      { number: 6, start: "11:40", end: "12:25" },
      { number: 7, start: "12:45", end: "13:30" },
    ];
  }

  if (isWeekend) {
    return { current: null, next: null, timeLeft: "عطلة نهاية الأسبوع", periodTimes };
  }

  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  let current: number | null = null;
  let next: number | null = null;
  let timeLeft = "";

  for (const p of periodTimes) {
    if (currentTime >= p.start && currentTime <= p.end) {
      current = p.number;
      const [eh, em] = p.end.split(":").map(Number);
      const endMin = eh * 60 + em;
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const diff = endMin - nowMin;
      timeLeft = `${diff} دقيقة متبقية`;
      break;
    }
  }

  if (!current) {
    for (const p of periodTimes) {
      if (currentTime < p.start) {
        next = p.number;
        const [sh, sm] = p.start.split(":").map(Number);
        const startMin = sh * 60 + sm;
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const diff = startMin - nowMin;
        timeLeft = `${diff} دقيقة حتى الحصة القادمة`;
        break;
      }
    }
  } else {
    const idx = periodTimes.findIndex((p) => p.number === current);
    if (idx < periodTimes.length - 1) {
      next = periodTimes[idx + 1].number;
    }
  }

  if (!current && !next) {
    timeLeft = "انتهى الدوام";
  }

  return { current, next, timeLeft, periodTimes };
}

export const statusColors: Record<string, string> = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  late: "bg-yellow-100 text-yellow-800",
  excused: "bg-blue-100 text-blue-800",
};

export const statusLabels: Record<string, string> = {
  present: "حاضر",
  absent: "غائب",
  late: "متأخر",
  excused: "معذور",
};
