"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  MapPin,
  Printer,
  ChevronRight,
  Sparkles,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
} from "lucide-react";
import Link from "next/link";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const PERIOD_TIMINGS = [
  { period: 1, time: "08:00 AM - 08:45 AM", label: "Period 1" },
  { period: 2, time: "08:45 AM - 09:30 AM", label: "Period 2" },
  { period: 3, time: "09:30 AM - 10:15 AM", label: "Period 3" },
  { period: "break", time: "10:15 AM - 10:35 AM", label: "Morning Recess" },
  { period: 4, time: "10:35 AM - 11:20 AM", label: "Period 4" },
  { period: 5, time: "11:20 AM - 12:05 PM", label: "Period 5" },
  { period: 6, time: "12:05 PM - 12:50 PM", label: "Period 6" },
];

const SUBJECT_THEMES = {
  "Mathematics (Standard)": {
    bg: "bg-blue-50/80",
    border: "border-blue-200/90",
    text: "text-blue-700",
    pill: "bg-blue-100 text-blue-700",
    dot: "#3b82f6",
  },
  "Advanced Algebra": {
    bg: "bg-indigo-50/80",
    border: "border-indigo-200/90",
    text: "text-indigo-700",
    pill: "bg-indigo-100 text-indigo-700",
    dot: "#6366f1",
  },
  "Calculus & Trigonometry": {
    bg: "bg-violet-50/80",
    border: "border-violet-200/90",
    text: "text-violet-700",
    pill: "bg-violet-100 text-violet-700",
    dot: "#8b5cf6",
  },
  "Geometry Workshop": {
    bg: "bg-emerald-50/80",
    border: "border-emerald-200/90",
    text: "text-emerald-700",
    pill: "bg-emerald-100 text-emerald-700",
    dot: "#10b981",
  },
  "Practical Problem Solving": {
    bg: "bg-amber-50/80",
    border: "border-amber-200/90",
    text: "text-amber-800",
    pill: "bg-amber-100 text-amber-800",
    dot: "#f59e0b",
  },
  "Algebra Revision": {
    bg: "bg-cyan-50/80",
    border: "border-cyan-200/90",
    text: "text-cyan-700",
    pill: "bg-cyan-100 text-cyan-700",
    dot: "#06b6d4",
  },
  "Problem Solving Lab": {
    bg: "bg-rose-50/80",
    border: "border-rose-200/90",
    text: "text-rose-700",
    pill: "bg-rose-100 text-rose-700",
    dot: "#f43f5e",
  },
  "Weekly Math Quiz": {
    bg: "bg-purple-50/80",
    border: "border-purple-200/90",
    text: "text-purple-700",
    pill: "bg-purple-100 text-purple-700",
    dot: "#a855f7",
  },
  "Board Prep Doubt Session": {
    bg: "bg-teal-50/80",
    border: "border-teal-200/90",
    text: "text-teal-700",
    pill: "bg-teal-100 text-teal-700",
    dot: "#14b8a6",
  },
};

function getSubjectTheme(subjectName) {
  return (
    SUBJECT_THEMES[subjectName] || {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      pill: "bg-gray-100 text-gray-700",
      dot: "#6b7280",
    }
  );
}

const DEMO_TIMETABLE = [
  // Monday
  { day: "Monday", period: 1, time: "08:00 AM - 08:45 AM", className: "Grade 10", sectionName: "Section A", subjectName: "Mathematics (Standard)", room: "Room 201", strength: 38 },
  { day: "Monday", period: 2, time: "08:45 AM - 09:30 AM", className: "Grade 11", sectionName: "Section B", subjectName: "Advanced Algebra", room: "Room 204", strength: 34 },
  { day: "Monday", period: 4, time: "10:35 AM - 11:20 AM", className: "Grade 12", sectionName: "Section A", subjectName: "Calculus & Trigonometry", room: "Math Lab 1", strength: 42 },
  { day: "Monday", period: 5, time: "11:20 AM - 12:05 PM", className: "Grade 9", sectionName: "Section C", subjectName: "Geometry Workshop", room: "Room 108", strength: 36 },

  // Tuesday
  { day: "Tuesday", period: 1, time: "08:00 AM - 08:45 AM", className: "Grade 11", sectionName: "Section B", subjectName: "Advanced Algebra", room: "Room 204", strength: 34 },
  { day: "Tuesday", period: 3, time: "09:30 AM - 10:15 AM", className: "Grade 10", sectionName: "Section A", subjectName: "Mathematics (Standard)", room: "Room 201", strength: 38 },
  { day: "Tuesday", period: 4, time: "10:35 AM - 11:20 AM", className: "Grade 12", sectionName: "Section A", subjectName: "Calculus & Trigonometry", room: "Math Lab 1", strength: 42 },
  { day: "Tuesday", period: 6, time: "12:05 PM - 12:50 PM", className: "Grade 10", sectionName: "Section B", subjectName: "Practical Problem Solving", room: "Room 202", strength: 35 },

  // Wednesday
  { day: "Wednesday", period: 2, time: "08:45 AM - 09:30 AM", className: "Grade 10", sectionName: "Section A", subjectName: "Mathematics (Standard)", room: "Room 201", strength: 38 },
  { day: "Wednesday", period: 3, time: "09:30 AM - 10:15 AM", className: "Grade 9", sectionName: "Section C", subjectName: "Geometry Workshop", room: "Room 108", strength: 36 },
  { day: "Wednesday", period: 5, time: "11:20 AM - 12:05 PM", className: "Grade 11", sectionName: "Section B", subjectName: "Algebra Revision", room: "Room 204", strength: 34 },

  // Thursday
  { day: "Thursday", period: 1, time: "08:00 AM - 08:45 AM", className: "Grade 12", sectionName: "Section A", subjectName: "Calculus & Trigonometry", room: "Math Lab 1", strength: 42 },
  { day: "Thursday", period: 2, time: "08:45 AM - 09:30 AM", className: "Grade 10", sectionName: "Section B", subjectName: "Practical Problem Solving", room: "Room 202", strength: 35 },
  { day: "Thursday", period: 4, time: "10:35 AM - 11:20 AM", className: "Grade 10", sectionName: "Section A", subjectName: "Mathematics (Standard)", room: "Room 201", strength: 38 },
  { day: "Thursday", period: 5, time: "11:20 AM - 12:05 PM", className: "Grade 11", sectionName: "Section B", subjectName: "Advanced Algebra", room: "Room 204", strength: 34 },

  // Friday
  { day: "Friday", period: 1, time: "08:00 AM - 08:45 AM", className: "Grade 10", sectionName: "Section A", subjectName: "Mathematics (Standard)", room: "Room 201", strength: 38 },
  { day: "Friday", period: 2, time: "08:45 AM - 09:30 AM", className: "Grade 12", sectionName: "Section A", subjectName: "Calculus & Trigonometry", room: "Math Lab 1", strength: 42 },
  { day: "Friday", period: 3, time: "09:30 AM - 10:15 AM", className: "Grade 11", sectionName: "Section B", subjectName: "Problem Solving Lab", room: "Math Lab 1", strength: 34 },
  { day: "Friday", period: 6, time: "12:05 PM - 12:50 PM", className: "Grade 9", sectionName: "Section C", subjectName: "Geometry Workshop", room: "Room 108", strength: 36 },

  // Saturday
  { day: "Saturday", period: 1, time: "08:00 AM - 08:45 AM", className: "Grade 10", sectionName: "Section A", subjectName: "Weekly Math Quiz", room: "Room 201", strength: 38 },
  { day: "Saturday", period: 2, time: "08:45 AM - 09:30 AM", className: "Grade 12", sectionName: "Section A", subjectName: "Board Prep Doubt Session", room: "Room 204", strength: 42 },
];

export default function TimetablePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentDay, setCurrentDay] = useState("Monday");

  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[new Date().getDay()];
    if (DAYS.includes(todayName)) {
      setCurrentDay(todayName);
    } else {
      setCurrentDay("Monday");
    }
  }, []);

  const groupedTimetable = {};
  DAYS.forEach((d) => (groupedTimetable[d] = {}));
  DEMO_TIMETABLE.forEach((item) => {
    if (groupedTimetable[item.day]) {
      groupedTimetable[item.day][item.period] = item;
    }
  });

  const todaysClasses = DEMO_TIMETABLE.filter((c) => c.day === currentDay).sort(
    (a, b) => a.period - b.period
  );
  const nextClass = todaysClasses[0] || null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="space-y-5 w-full pb-8 min-w-0">
        
        {/* ── HEADER & ACTIONS ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                <Sparkles className="w-3 h-3 text-[#F5A623]" />
                Academic Schedule 2026-27
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#1F1E1D] tracking-tight flex items-center gap-2">
              <CalendarDays className="h-7 w-7 text-[#1F1E1D]" />
              Faculty Timetable
            </h1>
            <p className="text-xs sm:text-sm font-normal text-[#78746B] mt-1">
              Assigned classes, lecture timings, and lecture room allocations
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="rounded-full border-[#E0DBD0] text-[#1F1E1D] hover:bg-[#F3EFE6] text-xs font-normal h-9 px-4 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-[#8E8A80]" />
              Print Timetable
            </Button>
            <Link href="/attendance">
              <Button className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs font-normal h-9 px-4 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5A623]" />
                Mark Today&apos;s Attendance
              </Button>
            </Link>
          </div>
        </div>

        {/* ── LIVE HIGHLIGHT BANNER: TODAY'S SCHEDULE HIGHLIGHT ── */}
        {nextClass && (
          <div className="rounded-3xl p-5 border border-[#ECE7DE] bg-gradient-to-r from-[#FBF9F4] via-white to-[#FEF5E7] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#1F1E1D] text-[#F5A623] flex items-center justify-center shrink-0 shadow-sm">
                <Clock className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-normal uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                    {currentDay}&apos;s Highlight • Period {nextClass.period}
                  </span>
                  <span className="text-xs text-[#8E8A80]">•</span>
                  <span className="text-xs font-normal text-[#78746B] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#F5A623]" />
                    {nextClass.time}
                  </span>
                </div>
                <h3 className="text-base font-normal text-[#1F1E1D]">
                  {nextClass.subjectName} —{" "}
                  <span className="text-[#B45309]">
                    {nextClass.className} ({nextClass.sectionName})
                  </span>
                </h3>
                <p className="text-xs font-normal text-[#8E8A80] flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#8E8A80]" />
                    {nextClass.room}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#8E8A80]" />
                    {nextClass.strength} Students
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <Link href="/students">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-[#E0DBD0] text-[#1F1E1D] bg-white hover:bg-[#F3EFE6] text-xs font-normal h-8 px-3"
                >
                  View Students <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
              <Link href="/attendance">
                <Button
                  size="sm"
                  className="rounded-full bg-[#1F1E1D] hover:bg-[#33312E] text-white text-xs font-normal h-8 px-3 shadow-xs"
                >
                  Start Class Attendance
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* ── VIEW SWITCHER TABS ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#ECE7DE]">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer border ${
                activeTab === "all"
                  ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                  : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
              }`}
            >
              Full Week Matrix
            </button>
            <button
              onClick={() => setActiveTab("today")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer border flex items-center gap-1.5 ${
                activeTab === "today"
                  ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                  : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
              Today ({currentDay})
            </button>
            <div className="h-4 w-px bg-[#E0DBD0] mx-1 hidden sm:block" />
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setActiveTab(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer border ${
                  activeTab === d
                    ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                    : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="text-xs font-normal text-[#8E8A80]">
            Total Allocated Periods:{" "}
            <span className="text-[#1F1E1D] font-medium">{DEMO_TIMETABLE.length} / week</span>
          </div>
        </div>

        {/* ── MATRIX VIEW: ALL WEEK FULL SCHEDULE ── */}
        {activeTab === "all" && (
          <div className="bg-white rounded-2xl border border-[#ECE7DE] shadow-xs overflow-hidden">
            <div className="overflow-x-auto w-full max-h-[calc(100vh-270px)] overflow-y-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="sticky top-0 bg-[#FBF9F4]/95 backdrop-blur-xs z-10 shadow-xs">
                  <tr className="border-b border-[#ECE7DE] text-xs font-normal text-[#78746B] uppercase tracking-wider">
                    <th className="py-3 px-4 w-40 border-r border-[#ECE7DE]">
                      Period / Timing
                    </th>
                    {DAYS.map((d) => (
                      <th
                        key={d}
                        className={`py-3 px-3 text-center border-r border-[#ECE7DE] last:border-r-0 ${
                          d === currentDay ? "bg-[#FEF5E7] text-[#B45309] font-medium" : ""
                        }`}
                      >
                        <span className="block text-xs font-normal">{d}</span>
                        {d === currentDay && (
                          <span className="text-[10px] text-[#B45309] font-normal uppercase tracking-wider">
                            Today
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE7DE] text-xs font-normal">
                  {PERIOD_TIMINGS.map((slot) => {
                    if (slot.period === "break") {
                      return (
                        <tr key="break" className="bg-[#FEF5E7]/50">
                          <td className="py-2.5 px-4 font-normal text-[#B45309] border-r border-[#ECE7DE] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
                            {slot.label}
                          </td>
                          <td
                            colSpan={6}
                            className="text-center py-2 text-xs font-normal text-[#B45309] tracking-wide"
                          >
                            ☕ Recess Break ({slot.time})
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={slot.period} className="hover:bg-[#FBF9F4] transition-colors">
                        <td className="py-3.5 px-4 border-r border-[#ECE7DE] bg-[#FBF9F4]/60">
                          <p className="font-normal text-[#1F1E1D] text-xs">{slot.label}</p>
                          <p className="text-[11px] text-[#8E8A80] mt-0.5">{slot.time}</p>
                        </td>

                        {DAYS.map((d) => {
                          const entry = groupedTimetable[d]?.[slot.period];
                          const isToday = d === currentDay;

                          if (!entry) {
                            return (
                              <td
                                key={d}
                                className={`p-2.5 text-center border-r border-[#ECE7DE] last:border-r-0 ${
                                  isToday ? "bg-[#FEF5E7]/20" : ""
                                }`}
                              >
                                <span className="text-[#C8C3BA] text-sm select-none">—</span>
                              </td>
                            );
                          }

                          const theme = getSubjectTheme(entry.subjectName);

                          return (
                            <td
                              key={d}
                              className={`p-2.5 border-r border-[#ECE7DE] last:border-r-0 ${
                                isToday ? "bg-[#FEF5E7]/30" : ""
                              }`}
                            >
                              <div
                                className={`p-2.5 rounded-xl border border-[#ECE7DE] bg-[#FBF9F4] transition-all hover:shadow-xs group`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-normal bg-[#EFECE5] text-[#1F1E1D]`}
                                  >
                                    {entry.className}-{entry.sectionName.replace("Section ", "")}
                                  </span>
                                  <span className="text-[10px] text-[#8E8A80] font-normal flex items-center gap-0.5">
                                    <MapPin className="w-2.5 h-2.5 text-[#8E8A80]" />
                                    {entry.room.replace("Room ", "R")}
                                  </span>
                                </div>
                                <p className="font-normal text-[#1F1E1D] text-[11.5px] leading-snug line-clamp-2">
                                  {entry.subjectName}
                                </p>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DAILY CARD VIEW: FOR TODAY OR SPECIFIC DAY ── */}
        {(activeTab === "today" || DAYS.includes(activeTab)) && (
          <div className="space-y-4">
            {(() => {
              const selectedDay = activeTab === "today" ? currentDay : activeTab;
              const entries = DEMO_TIMETABLE.filter((e) => e.day === selectedDay).sort(
                (a, b) => a.period - b.period
              );

              if (entries.length === 0) {
                return (
                  <div className="text-center py-16 bg-white rounded-2xl border border-[#ECE7DE] p-6">
                    <Calendar className="w-10 h-10 text-[#8E8A80] mx-auto mb-2" />
                    <p className="text-base font-normal text-[#1F1E1D]">
                      No lectures scheduled on {selectedDay}
                    </p>
                    <p className="text-xs text-[#8E8A80] mt-1">
                      Enjoy your research day or prepare upcoming assignments!
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
                  {entries.map((item) => {
                    return (
                      <div
                        key={item.period}
                        className={`bg-white rounded-2xl border border-[#ECE7DE] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-normal bg-[#EFECE5] text-[#1F1E1D]">
                              Period {item.period}
                            </span>
                            <span className="text-xs font-normal text-[#8E8A80] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#F5A623]" />
                              {item.time}
                            </span>
                          </div>

                          <h3 className="text-base font-normal text-[#1F1E1D] mb-1">
                            {item.subjectName}
                          </h3>
                          <div className="flex items-center gap-2 mb-4">
                            <Badge variant="secondary" className="text-xs font-normal bg-[#FBF9F4] border-[#E0DBD0] text-[#78746B]">
                              {item.className} ({item.sectionName})
                            </Badge>
                            <span className="text-xs text-[#8E8A80] flex items-center gap-1">
                              <Users className="w-3 h-3 text-[#8E8A80]" />
                              {item.strength} students
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#ECE7DE] flex items-center justify-between text-xs text-[#6E6A60]">
                          <span className="flex items-center gap-1 font-normal">
                            <MapPin className="w-3.5 h-3.5 text-[#8E8A80]" />
                            {item.room}
                          </span>
                          <Link
                            href="/attendance"
                            className="text-[#B45309] hover:underline flex items-center gap-1 font-normal"
                          >
                            Mark Attendance <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── FOOTER GUIDELINES ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-white border border-[#ECE7DE] flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-normal text-[#1F1E1D]">Official Period Timings</p>
              <p className="text-[#8E8A80] mt-0.5">
                Each teaching session is 45 minutes with a 20-minute recess after Period 3.
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#ECE7DE] flex items-start gap-3">
            <Layers className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-normal text-[#1F1E1D]">Lab &amp; Practical Allotment</p>
              <p className="text-[#8E8A80] mt-0.5">
                Math Lab 1 is reserved for Grade 12 Calculus on Mon/Tue/Thu/Fri Period 4.
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#ECE7DE] flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-normal text-[#1F1E1D]">Substitute &amp; Proxy Notifications</p>
              <p className="text-[#8E8A80] mt-0.5">
                Any temporary period substitution will appear here and in your notification bell.
              </p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
