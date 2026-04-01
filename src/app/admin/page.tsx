"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getTodayDate, statusColors, statusLabels } from "@/lib/helpers";
import {
  LayoutDashboard, LogOut, CalendarDays, UserX, Clock3,
  School, FileSpreadsheet, FileText, Download, Users,
  CheckCircle2, AlertTriangle,
} from "lucide-react";

interface ClassInfo {
  id: number;
  name: string;
  grade: number;
  track: string | null;
}

interface Summary {
  classId: number;
  className: string;
  absentCount: number;
  lateCount: number;
  totalRecords: number;
}

interface StudentRecord {
  id: number;
  name: string;
  studentNumber: string | null;
}

interface AttendanceDetail {
  studentId: number;
  periodNumber: number;
  status: string;
  teacherName: string | null;
  note: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [date, setDate] = useState(getTodayDate());
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classStudents, setClassStudents] = useState<StudentRecord[]>([]);
  const [classRecords, setClassRecords] = useState<AttendanceDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (!u.isAdmin) { router.push("/teacher"); return; }
  }, [router]);

  useEffect(() => {
    fetch("/api/admin?action=classes").then((r) => r.json()).then(setClasses);
  }, []);

  useEffect(() => {
    if (date) {
      fetch(`/api/admin?action=summary&date=${date}`)
        .then((r) => r.json())
        .then(setSummary);
    }
  }, [date]);

  useEffect(() => {
    if (selectedClass && date) {
      setLoading(true);
      fetch(`/api/admin?action=class-detail&classId=${selectedClass}&date=${date}`)
        .then((r) => r.json())
        .then((data) => {
          setClassStudents(data.students || []);
          setClassRecords(data.records || []);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedClass, date]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/");
  };

  const downloadExcel = () => {
    window.open("/api/export/excel", "_blank");
    toast.success("جاري تحميل ملف الإكسيل");
  };

  const downloadDocx = () => {
    if (!selectedClass || !date) {
      toast.error("اختر الصف والتاريخ أولاً");
      return;
    }
    window.open(`/api/export/docx?classId=${selectedClass}&date=${date}`, "_blank");
    toast.success("جاري تحميل تقرير Word");
  };

  const totalAbsent = summary.reduce((acc, s) => acc + s.absentCount, 0);
  const totalLate = summary.reduce((acc, s) => acc + s.lateCount, 0);

  const recordMap: Record<number, Record<number, AttendanceDetail>> = {};
  for (const r of classRecords) {
    if (!recordMap[r.studentId]) recordMap[r.studentId] = {};
    recordMap[r.studentId][r.periodNumber] = r;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">لوحة تحكم الإدارة</h1>
                <p className="text-white/70 text-sm">مدرسة حسان بن ثابت الثانوية للبنين</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5 cursor-pointer"
                onClick={downloadExcel}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">أكواد المعلمين</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Picker */}
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium mb-1">التاريخ</p>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-8 text-sm border-0 bg-muted/50 rounded-lg p-1.5"
                dir="ltr"
              />
            </div>
          </div>

          {/* Total Absent */}
          <div className="stat-card gradient-danger">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/70 font-medium">إجمالي الغياب</p>
                <p className="text-4xl font-bold mt-1">{totalAbsent}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <UserX className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Total Late */}
          <div className="stat-card gradient-warning">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/70 font-medium">إجمالي التأخير</p>
                <p className="text-4xl font-bold mt-1">{totalLate}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Clock3 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Classes Recorded */}
          <div className="stat-card gradient-info">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/70 font-medium">الفصول المسجلة</p>
                <p className="text-4xl font-bold mt-1">{summary.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Class Overview Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            ملخص الغياب حسب الصف - {date}
          </h2>
          {summary.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد سجلات لهذا اليوم</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {summary.map((s) => {
                const isSelected = selectedClass === String(s.classId);
                const isGood = s.absentCount === 0 && s.lateCount === 0;
                return (
                  <div
                    key={s.classId}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedClass(String(s.classId))}
                  >
                    <p className="font-bold text-lg text-foreground">{s.className}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {s.absentCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-red-100 text-red-700 rounded-md px-1.5 py-0.5">
                          <UserX className="w-3 h-3" /> {s.absentCount}
                        </span>
                      )}
                      {s.lateCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-100 text-amber-700 rounded-md px-1.5 py-0.5">
                          <AlertTriangle className="w-3 h-3" /> {s.lateCount}
                        </span>
                      )}
                      {isGood && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-700 rounded-md px-1.5 py-0.5">
                          <CheckCircle2 className="w-3 h-3" /> ممتاز
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Class Detail Table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <School className="w-5 h-5 text-primary" />
              تفاصيل الصف
            </h2>
            <div className="flex gap-2 items-center">
              <Select value={selectedClass} onValueChange={(v) => setSelectedClass(v ?? "")}>
                <SelectTrigger className="w-36 rounded-xl h-9 text-sm">
                  <SelectValue placeholder="اختر الصف" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadDocx}
                disabled={!selectedClass}
                className="rounded-xl gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                تصدير Word
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                جاري التحميل...
              </div>
            ) : !selectedClass ? (
              <div className="text-center py-16">
                <School className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">اختر صفاً لعرض التفاصيل</p>
              </div>
            ) : classStudents.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">لا يوجد طلاب في هذا الصف</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-3 text-right font-semibold text-muted-foreground border-b border-border w-10">#</th>
                      <th className="p-3 text-right font-semibold text-muted-foreground border-b border-border">اسم الطالب</th>
                      {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                        <th key={p} className="p-3 text-center font-semibold text-muted-foreground border-b border-border w-16">
                          ح{p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-muted/20 transition-colors border-b border-border/30 last:border-0">
                        <td className="p-2.5 text-center text-muted-foreground text-xs">{idx + 1}</td>
                        <td className="p-2.5 font-medium text-foreground text-sm">{student.name}</td>
                        {[1, 2, 3, 4, 5, 6, 7].map((p) => {
                          const rec = recordMap[student.id]?.[p];
                          return (
                            <td key={p} className="p-1.5 text-center">
                              {rec ? (
                                <div>
                                  <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md ${statusColors[rec.status]}`}>
                                    {statusLabels[rec.status]}
                                  </span>
                                  {rec.note && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[60px] mx-auto" title={rec.note}>
                                      {rec.note}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-border text-xs">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
