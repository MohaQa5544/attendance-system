"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookOpen, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("الرجاء إدخال كود الدخول");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "كود غير صحيح");
        return;
      }

      sessionStorage.setItem("user", JSON.stringify(data));

      if (data.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/teacher");
      }
    } catch {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-header" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Logo & Title */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                مدرسة حسان بن ثابت
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                الثانوية للبنين - دولة قطر
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="h-px w-12 bg-border" />
                <span className="text-xs text-muted-foreground">نظام إدارة الغياب</span>
                <div className="h-px w-12 bg-border" />
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-semibold text-foreground">
                كود الدخول
              </label>
              <Input
                id="code"
                type="text"
                placeholder="أدخل الكود المخصص لك"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center text-lg tracking-[0.3em] h-14 font-mono rounded-xl bg-muted/50 border-border/50 focus:bg-white focus:border-primary transition-all"
                maxLength={10}
                dir="ltr"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full h-13 text-base font-semibold gradient-primary hover:opacity-90 transition-opacity rounded-xl shadow-md cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري التحقق...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            وزارة التربية والتعليم والتعليم العالي
          </p>
        </div>
      </div>
    </div>
  );
}
