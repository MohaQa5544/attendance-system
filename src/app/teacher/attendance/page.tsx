"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { statusColors, statusLabels, getTodayDate, subjectNames, dayNames } from "@/lib/helpers";
import {
  ArrowRight, Save, Loader2, Users, UserX, Clock3,
  UserCheck, MessageSquare, ChevronDown, ChevronUp,
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  classId: number;
  studentNumber: string | null;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  periodNumber: number;
  status: string;
  teacherName: string | null;
  note: string | null;
}

interface User {
  id: number;
  name: string;
  subject: string;
}

const statusStyleMap: Record<string, string> = {
  present: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  absent: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  late: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  excused: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
};

function AttendanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const period = searchParams.get("period");
  const className = searchParams.get("className");

  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [allDayRecords, setAllDayRecords] = useState<AttendanceRecord[]>([]);
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(parseInt(period || "1"));
  const [showPrevious, setShowPrevious] = useState(false);
  const today = getTodayDate();

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) { router.push("/"); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    if (!classId) return;
    fetch(`/api/students?classId=${classId}`)
      .then((r) => r.json())
      .then(setStudents);
  }, [classId]);

  useEffect(() => {
    if (!classId) return;
    fetch(`/api/attendance?classId=${classId}&date=${today}`)
      .then((r) => r.json())
      .then((data: AttendanceRecord[]) => {
        setAllDayRecords(data);
        const periodRecords = data.filter((r) => r.periodNumber === selectedPeriod);
        const s: Record<number, string> = {};
        const n: Record<number, string> = {};
        for (const rec of periodRecords) {
          s[rec.studentId] = rec.status;
          if (rec.note) n[rec.studentId] = rec.note;
        }
        setStatuses(s);
        setNotes(n);
      });
  }, [classId, today, selectedPeriod]);

  const toggleStatus = (studentId: number) => {
    const cycle = ["present", "absent", "late", "excused"];
    const current = statuses[studentId] || "present";
    const idx = cycle.indexOf(current);
    const next = cycle[(idx + 1) % cycle.length];
    setStatuses((prev) => ({ ...prev, [studentId]: next }));
  };

  const saveAttendance = async () => {
    if (!user || !classId) return;
    setSaving(true);
    try {
      const entries = students.map((student) => ({
        studentId: student.id,
        classId: parseInt(classId),
        date: today,
        periodNumber: selectedPeriod,
        status: statuses[student.id] || "present",
        teacherId: user.id,
        note: notes[student.id] || null,
      }));

      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
      });

      toast.success("تم حفظ سجل الغياب بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const getStudentDaySummary = (studentId: number) => {
    const studentRecords = allDayRecords.filter(
      (r) => r.studentId === studentId && r.periodNumber !== selectedPeriod
    );
    const absent = studentRecords.filter((r) => r.status === "absent").length;
    const late = studentRecords.filter((r) => r.status === "late").length;
    return { absent, late };
  };

  if (!user || !classId) return null;

  const absentCount = Object.values(statuses).filter((s) => s === "absent").length;
  const lateCount = Object.values(statuses).filter((s) => s === "late").length;
  const presentCount = students.length - absentCount - lateCount;
  const previousRecords = allDayRecords.filter((r) => r.periodNumber !== selectedPeriod && r.status !== "present");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header text-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="text-base font-bold">تسجيل الغياب</h1>
                <p className="text-white/70 text-xs">الصف {className} - {today}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 gap-1 cursor-pointer"
              onClick={() => router.back()}
            >
              رجوع
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5 space-y-4 pb-24">
        {/* Period Selector */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
            <Button
              key={p}
              variant="outline"
              size="sm"
              onClick={() => setSelectedPeriod(p)}
              className={`rounded-xl min-w-[44px] cursor-pointer transition-all ${
                selectedPeriod === p
                  ? "gradient-primary text-white border-transparent shadow-md"
                  : "bg-card border-border hover:bg-accent"
              }`}
            >
              ح{p}
            </Button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs text-emerald-600 font-medium">حاضر</p>
              <p className="text-xl font-bold text-emerald-700">{presentCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-red-50 rounded-xl p-3 border border-red-100">
            <UserX className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-xs text-red-600 font-medium">غائب</p>
              <p className="text-xl font-bold text-red-700">{absentCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-3 border border-amber-100">
            <Clock3 className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs text-amber-600 font-medium">متأخر</p>
              <p className="text-xl font-bold text-amber-700">{lateCount}</p>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="divide-y divide-border/50">
            {students.map((student, idx) => {
              const status = statuses[student.id] || "present";
              const daySummary = getStudentDaySummary(student.id);
              return (
                <div key={student.id} className="flex items-center gap-3 p-3.5 hover:bg-muted/30 transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{student.name}</p>
                    {(daySummary.absent > 0 || daySummary.late > 0) && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {daySummary.absent > 0 && <span className="text-red-500">غياب: {daySummary.absent} حصص </span>}
                        {daySummary.late > 0 && <span className="text-amber-500">تأخير: {daySummary.late} حصص</span>}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`min-w-[70px] rounded-lg text-xs font-semibold border cursor-pointer transition-all ${statusStyleMap[status]}`}
                    onClick={() => toggleStatus(student.id)}
                  >
                    {statusLabels[status]}
                  </Button>
                  <div className="relative w-28 shrink-0">
                    <MessageSquare className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                    <input
                      type="text"
                      placeholder="ملاحظة"
                      value={notes[student.id] || ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [student.id]: e.target.value }))}
                      className="w-full border border-border/60 rounded-lg pr-7 pl-2 py-1.5 text-xs bg-muted/30 focus:bg-white focus:border-primary/40 outline-none transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Previous Periods Summary */}
        {previousRecords.length > 0 && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => setShowPrevious(!showPrevious)}
            >
              <span>سجل الحصص السابقة لهذا اليوم</span>
              {showPrevious ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showPrevious && (
              <div className="px-4 pb-4 space-y-3">
                {[1, 2, 3, 4, 5, 6, 7]
                  .filter((p) => p !== selectedPeriod)
                  .map((p) => {
                    const periodRecs = allDayRecords.filter(
                      (r) => r.periodNumber === p && r.status !== "present"
                    );
                    if (periodRecs.length === 0) return null;
                    return (
                      <div key={p} className="bg-muted/30 rounded-xl p-3">
                        <p className="font-semibold text-xs text-muted-foreground mb-2">
                          الحصة {p} ({periodRecs[0]?.teacherName || ""})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {periodRecs.map((r) => (
                            <Badge key={r.id} className={`${statusColors[r.status]} text-[11px] border-0`} variant="secondary">
                              {r.studentName}: {statusLabels[r.status]}
                              {r.note && ` (${r.note})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="max-w-4xl mx-auto">
          <Button
            className="w-full h-13 text-base font-semibold gradient-primary text-white rounded-xl shadow-lg hover:opacity-90 transition-opacity gap-2 cursor-pointer"
            onClick={saveAttendance}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                حفظ سجل الغياب
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>جاري التحميل...</span>
        </div>
      </div>
    }>
      <AttendanceContent />
    </Suspense>
  );
}
