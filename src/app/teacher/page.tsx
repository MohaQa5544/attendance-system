"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dayNames, subjectNames, getCurrentDay, getTodayDate, getCurrentPeriodInfo } from "@/lib/helpers";
import {
  BookOpen, Clock, ArrowLeft, CalendarDays, LogOut,
  Timer, ChevronLeft, MapPin, ClipboardList,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  subject: string;
  code: string;
  isAdmin: boolean;
}

interface ScheduleItem {
  id: number;
  periodNumber: number;
  day: string;
  subject: string;
  room: string | null;
  teacherId: number;
  teacherName: string;
  classId: number;
  className: string;
  classGrade: number;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<number | null>(null);
  const [nextPeriod, setNextPeriod] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.isAdmin) { router.push("/admin"); return; }
    setUser(u);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/schedule?teacherId=${user.id}`)
      .then((r) => r.json())
      .then(setSchedule);
  }, [user]);

  const updateTime = useCallback(() => {
    const info = getCurrentPeriodInfo(10);
    setCurrentPeriod(info.current);
    setNextPeriod(info.next);
    setTimeLeft(info.timeLeft);
  }, []);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [updateTime]);

  const todaySchedule = schedule.filter((s) => s.day === selectedDay);
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];

  const currentLesson = todaySchedule.find((s) => s.periodNumber === currentPeriod);
  const nextLesson = todaySchedule.find((s) => s.periodNumber === nextPeriod);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">مدرسة حسان بن ثابت</h1>
                <p className="text-white/70 text-sm">{user.name} - {subjectNames[user.subject] || user.subject}</p>
              </div>
            </div>
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
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Period */}
          <div className="stat-card gradient-primary">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-white/70 font-medium">الحصة الحالية</p>
                {currentLesson ? (
                  <>
                    <p className="text-3xl font-bold">ح{currentLesson.periodNumber}</p>
                    <p className="text-base text-white/90">{subjectNames[currentLesson.subject] || currentLesson.subject}</p>
                    <Badge className="bg-white/20 text-white border-0 mt-1 text-xs">{currentLesson.className}</Badge>
                  </>
                ) : (
                  <p className="text-lg text-white/60 pt-2">لا توجد حصة حالياً</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Next Period */}
          <div className="stat-card gradient-info">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-white/70 font-medium">الحصة القادمة</p>
                {nextLesson ? (
                  <>
                    <p className="text-3xl font-bold">ح{nextLesson.periodNumber}</p>
                    <p className="text-base text-white/90">{subjectNames[nextLesson.subject] || nextLesson.subject}</p>
                    <Badge className="bg-white/20 text-white border-0 mt-1 text-xs">{nextLesson.className}</Badge>
                  </>
                ) : (
                  <p className="text-lg text-white/60 pt-2">لا توجد حصة قادمة</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <ArrowLeft className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Time Left */}
          <div className="stat-card gradient-warning">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-white/70 font-medium">الوقت المتبقي</p>
                <p className="text-2xl font-bold pt-1">{timeLeft}</p>
                <p className="text-sm text-white/60 flex items-center gap-1.5 mt-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {getTodayDate()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <Timer className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex gap-2 flex-wrap">
          {days.map((day) => {
            const isToday = day === getCurrentDay();
            const isSelected = selectedDay === day;
            return (
              <Button
                key={day}
                variant="outline"
                size="sm"
                onClick={() => setSelectedDay(day)}
                className={`rounded-xl px-4 transition-all cursor-pointer ${
                  isSelected
                    ? "gradient-primary text-white border-transparent shadow-md"
                    : "bg-card hover:bg-accent border-border"
                }`}
              >
                {dayNames[day]}
                {isToday && (
                  <span className={`mr-1 text-[10px] ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                    (اليوم)
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Today's Schedule */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            جدول يوم {dayNames[selectedDay]}
          </h2>
          {todaySchedule.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد حصص في هذا اليوم</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaySchedule
                .sort((a, b) => a.periodNumber - b.periodNumber)
                .map((item) => {
                  const isCurrent = item.periodNumber === currentPeriod;
                  return (
                    <div
                      key={item.id}
                      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                        isCurrent
                          ? "bg-primary/5 border-primary/30 shadow-sm"
                          : "bg-card border-border hover:border-primary/20 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base transition-all ${
                          isCurrent
                            ? "gradient-primary text-white shadow-md"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        }`}>
                          ح{item.periodNumber}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {subjectNames[item.subject] || item.subject}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1">
                              <ClipboardList className="w-3.5 h-3.5" />
                              {item.className}
                            </span>
                            {item.room && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {item.room}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="gradient-primary text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity gap-1.5 cursor-pointer"
                        onClick={() => {
                          router.push(
                            `/teacher/attendance?classId=${item.classId}&period=${item.periodNumber}&day=${selectedDay}&className=${item.className}`
                          );
                        }}
                      >
                        تسجيل الغياب
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Weekly Overview */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            الجدول الأسبوعي
          </h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-right font-semibold text-muted-foreground border-b border-border">الحصة</th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className={`p-3 text-center font-semibold border-b border-border transition-colors ${
                          day === getCurrentDay() ? "bg-primary/5 text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {dayNames[day]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                    <tr key={period} className="border-b border-border/50 last:border-0">
                      <td className="p-3 font-bold text-center text-foreground">ح{period}</td>
                      {days.map((day) => {
                        const item = schedule.find(
                          (s) => s.day === day && s.periodNumber === period
                        );
                        const isCurrent = day === getCurrentDay() && period === currentPeriod;
                        const isToday = day === getCurrentDay();
                        return (
                          <td
                            key={day}
                            className={`p-2 text-center text-xs transition-colors ${
                              isCurrent
                                ? "bg-primary/10"
                                : isToday
                                ? "bg-primary/[0.03]"
                                : ""
                            }`}
                          >
                            {item ? (
                              <div className="space-y-0.5">
                                <p className="font-semibold text-foreground">{subjectNames[item.subject] || item.subject}</p>
                                <p className="text-muted-foreground">{item.className}</p>
                              </div>
                            ) : (
                              <span className="text-border">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
