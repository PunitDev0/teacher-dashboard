"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserCheck,
  FileCheck2,
  CalendarDays,
  Plus,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Building2,
  GraduationCap,
  Bell,
  MessageSquare,
  Search,
  Check,
  X,
  Award,
} from "lucide-react"

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState({
    name: "Dr. Sarah Jenkins",
    department: "Mathematics & Science",
    employeeId: "EMP-2025-00025",
  })
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("staffData")
      if (stored) {
        const parsed = JSON.parse(stored)
        const name = `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim()
        if (name) setTeacher((prev) => ({ ...prev, name }))
        if (parsed.department) setTeacher((prev) => ({ ...prev, department: parsed.department }))
        if (parsed.employeeId) setTeacher((prev) => ({ ...prev, employeeId: parsed.employeeId }))
      }
    } catch (e) {}
  }, [])

  // Today's schedule data
  const todayClasses = [
    {
      period: "Period 1",
      time: "09:00 AM - 09:45 AM",
      subject: "Mathematics (Standard)",
      classSection: "Grade 10A",
      room: "Room 201",
      status: "Completed",
      attendanceMarked: true,
      studentsCount: 38,
    },
    {
      period: "Period 2",
      time: "10:00 AM - 10:45 AM",
      subject: "Advanced Algebra",
      classSection: "Grade 11B",
      room: "Room 204",
      status: "In Progress",
      attendanceMarked: true,
      studentsCount: 34,
    },
    {
      period: "Period 4",
      time: "12:15 PM - 01:00 PM",
      subject: "Calculus & Trigonometry",
      classSection: "Grade 12A",
      room: "Math Lab 1",
      status: "Upcoming",
      attendanceMarked: false,
      studentsCount: 36,
    },
    {
      period: "Period 6",
      time: "02:15 PM - 03:00 PM",
      subject: "Geometry Workshop",
      classSection: "Grade 9C",
      room: "Room 108",
      status: "Upcoming",
      attendanceMarked: false,
      studentsCount: 34,
    },
  ]

  // Recent student homework submissions
  const [recentSubmissions, setRecentSubmissions] = useState([
    {
      id: 1,
      student: "Aarav Sharma",
      rollNo: "10A-04",
      class: "Grade 10A",
      title: "Trigonometric Identities HW #4",
      time: "15 mins ago",
      status: "Pending Review",
    },
    {
      id: 2,
      student: "Priya Nair",
      rollNo: "11B-12",
      class: "Grade 11B",
      title: "Quadratic Equations Problem Set",
      time: "42 mins ago",
      status: "Pending Review",
    },
    {
      id: 3,
      student: "Rohan Varma",
      rollNo: "10A-21",
      class: "Grade 10A",
      title: "Polynomials Chapter Test",
      time: "2 hours ago",
      status: "Graded",
      score: "19/20",
    },
    {
      id: 4,
      student: "Ananya Iyer",
      rollNo: "12A-08",
      class: "Grade 12A",
      title: "Integration Assignment 3",
      time: "3 hours ago",
      status: "Pending Review",
    },
  ])

  // Class performance & attendance benchmarks
  const classProgress = [
    {
      className: "Grade 10A",
      subject: "Mathematics",
      attendance: 98,
      syllabus: 85,
      totalStudents: 38,
      avgScore: "87.4%",
    },
    {
      className: "Grade 11B",
      subject: "Algebra",
      attendance: 94,
      syllabus: 78,
      totalStudents: 34,
      avgScore: "82.1%",
    },
    {
      className: "Grade 12A",
      subject: "Calculus",
      attendance: 96,
      syllabus: 90,
      totalStudents: 36,
      avgScore: "89.6%",
    },
    {
      className: "Grade 9C",
      subject: "Geometry",
      attendance: 92,
      syllabus: 72,
      totalStudents: 34,
      avgScore: "79.2%",
    },
  ]

  return (
    <div className="space-y-5 sm:space-y-6 w-full pb-8 min-w-0">
      {/* 1. Hero Welcome Card - Warm Minimalist Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-5 sm:p-7 md:p-8 border border-[#ECE7DE] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFECE5] text-xs font-normal text-[#6E6A60]">
              <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
              <span>Academic Session 2025–26 • Faculty Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[30px] font-normal text-[#1F1E1D] tracking-tight">
              Hello, {teacher.name} 👋
            </h1>
            <p className="text-[#8A857B] text-xs sm:text-sm font-normal leading-relaxed">
              What do you want to teach today? You have <span className="font-medium text-[#1F1E1D]">4 lectures</span> scheduled. Period 2 (Grade 11B) is active in Room 204.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <Link
              href="/timetable"
              className="px-4 py-2 rounded-full bg-[#EFECE5] hover:bg-[#E5E0D5] text-[#1F1E1D] text-xs font-normal transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Calendar size={14} className="text-[#8E8A80]" />
              <span>Daily Schedule</span>
            </Link>
            <Link
              href="/attendance"
              className="px-4.5 py-2 rounded-full bg-[#1F1E1D] hover:bg-[#2F2D2B] text-white text-xs font-normal transition shadow-xs flex items-center gap-2 cursor-pointer group"
            >
              <Plus size={14} className="text-[#F5A623]" />
              <span>Mark Attendance</span>
            </Link>
          </div>
        </div>

        {/* Live Audio / Class Highlight Strip matching screenshot */}
        <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#FBF9F4] border border-[#ECE7DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F1E1D] text-[#F5A623] flex items-center justify-center shrink-0 shadow-xs">
              <Clock size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                  Active Lecture
                </span>
                <span className="text-xs font-normal text-[#1F1E1D]">
                  Advanced Algebra • Grade 11B
                </span>
              </div>
              <p className="text-[11px] font-normal text-[#8A857B] mt-0.5">
                Room 204 • 10:00 AM - 10:45 AM • 34 Students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/attendance"
              className="px-3.5 py-1.5 rounded-full text-xs font-normal bg-[#1F1E1D] text-white hover:bg-[#2F2D2B] transition shadow-2xs flex items-center gap-1.5"
            >
              <UserCheck size={13} className="text-[#F5A623]" />
              <span>Start Attendance</span>
            </Link>
            <Link
              href="/assignments"
              className="px-3.5 py-1.5 rounded-full text-xs font-normal bg-white border border-[#E0DBD0] text-[#1F1E1D] hover:bg-[#EFECE5] transition"
            >
              Homework
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Stat Strip - Warm Ivory & Charcoal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Today's Classes */}
        <div className="rounded-2xl p-4 sm:p-5 border border-[#ECE7DE] bg-white transition hover:shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF5E7] text-[#D97706] flex items-center justify-center">
              <CalendarDays size={19} />
            </div>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#EFECE5] text-[#6E6A60]">
              Today
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-normal text-[#1F1E1D] tracking-tight">
            4 Classes
          </div>
          <div className="text-xs font-normal text-[#8A857B] mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
            <span>2 completed, 2 upcoming</span>
          </div>
        </div>

        {/* Card 2: Total Students */}
        <div className="rounded-2xl p-4 sm:p-5 border border-[#ECE7DE] bg-white transition hover:shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0ECE3] text-[#1F1E1D] flex items-center justify-center">
              <Users size={19} />
            </div>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#EFECE5] text-[#6E6A60]">
              Assigned
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-normal text-[#1F1E1D] tracking-tight">
            142 Students
          </div>
          <div className="text-xs font-normal text-[#8A857B] mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Across 4 grade sections</span>
          </div>
        </div>

        {/* Card 3: Today's Attendance */}
        <div className="rounded-2xl p-4 sm:p-5 border border-[#ECE7DE] bg-white transition hover:shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#B45309] flex items-center justify-center">
              <UserCheck size={19} />
            </div>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
              +2.1%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-normal text-[#1F1E1D] tracking-tight">
            96.4%
          </div>
          <div className="text-xs font-normal text-[#8A857B] mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
            <span>137 of 142 marked present</span>
          </div>
        </div>

        {/* Card 4: Pending Homework */}
        <div className="rounded-2xl p-4 sm:p-5 border border-[#ECE7DE] bg-white transition hover:shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F2EA] text-[#78746B] flex items-center justify-center">
              <BookOpen size={19} />
            </div>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#EFECE5] text-[#6E6A60]">
              Pending
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-normal text-[#1F1E1D] tracking-tight">
            28 Submissions
          </div>
          <div className="text-xs font-normal text-[#8A857B] mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Needs review & evaluation</span>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Today's Schedule & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column (2 Cols): Today's Schedule */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-3xl border border-[#ECE7DE] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1F1E1D] text-[#F5A623] flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-normal text-[#1F1E1D]">
                    Today's Teaching Schedule
                  </h2>
                  <p className="text-xs font-normal text-[#8E8A80]">
                    Daily bell periods and classroom allocation
                  </p>
                </div>
              </div>

              <Link
                href="/timetable"
                className="text-xs font-normal text-[#1F1E1D] hover:text-[#B45309] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Full Timetable</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {todayClasses.map((item, index) => {
                const isCompleted = item.status === "Completed"
                const isInProgress = item.status === "In Progress"

                return (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                      isInProgress
                        ? "bg-[#FEFBF5] border-[#F6E3B8] shadow-xs"
                        : "bg-[#FBF9F4] border-[#ECE7DE] hover:bg-[#F7F4EC]"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="text-center shrink-0 w-16 py-1.5 px-2 rounded-xl bg-white border border-[#ECE7DE] text-[#1F1E1D]">
                        <span className="text-[10px] font-normal uppercase text-[#8E8A80] block">
                          {item.period}
                        </span>
                        <span className="text-xs font-normal text-[#1F1E1D]">
                          {item.time.split(" - ")[0]}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-normal text-[#1F1E1D] truncate">
                            {item.subject}
                          </h3>
                          {isInProgress && (
                            <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-[#1F1E1D] text-[#F5A623]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-ping" />
                              <span>Live Class</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-normal text-[#8E8A80] mt-0.5 flex items-center gap-2">
                          <span>{item.classSection}</span>
                          <span>•</span>
                          <span>{item.room}</span>
                          <span>•</span>
                          <span>{item.studentsCount} Students</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center shrink-0">
                      {isCompleted ? (
                        <span className="text-xs font-normal text-[#2D6A4F] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>Attendance Marked</span>
                        </span>
                      ) : isInProgress ? (
                        <Link
                          href="/attendance"
                          className="text-xs font-normal text-white bg-[#1F1E1D] hover:bg-[#2F2D2B] px-3.5 py-1.5 rounded-full transition shadow-xs flex items-center gap-1.5"
                        >
                          <UserCheck size={13} className="text-[#F5A623]" />
                          <span>Mark Attendance</span>
                        </Link>
                      ) : (
                        <span className="text-xs font-normal text-[#6E6A60] bg-white border border-[#ECE7DE] px-3 py-1 rounded-full">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Class Performance Benchmarks */}
          <div className="rounded-3xl border border-[#ECE7DE] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FEF5E7] text-[#D97706] flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-normal text-[#1F1E1D]">
                    Assigned Classes &amp; Syllabus Coverage
                  </h2>
                  <p className="text-xs font-normal text-[#8E8A80]">
                    Attendance rate and curriculum completion progress
                  </p>
                </div>
              </div>

              <Link
                href="/students"
                className="text-xs font-normal text-[#1F1E1D] hover:text-[#B45309] hover:underline flex items-center gap-1 font-medium"
              >
                <span>View Students</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {classProgress.map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-[#ECE7DE] bg-[#FBF9F4] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-normal text-[#1F1E1D] block">
                        {item.className}
                      </span>
                      <span className="text-[11px] font-normal text-[#8E8A80]">
                        {item.subject} • {item.totalStudents} students
                      </span>
                    </div>
                    <span className="text-[11px] font-normal text-[#B45309] bg-[#FEF5E7] border border-[#FDE68A] px-2.5 py-0.5 rounded-full">
                      Avg {item.avgScore}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-normal text-[#6E6A60]">
                      <span>Syllabus Completion</span>
                      <span className="text-[#1F1E1D] font-medium">{item.syllabus}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#EFECE5] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1F1E1D] transition-all duration-500"
                        style={{ width: `${item.syllabus}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1 text-[11px] font-normal text-[#8E8A80] border-t border-[#ECE7DE]">
                    <span>Attendance Rate</span>
                    <span className="text-[#2D6A4F] font-medium">{item.attendance}% present</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Calendar Widget, Tasks & Submissions matching image */}
        <div className="space-y-5">
          {/* Mini Calendar Widget - Identical to screenshot's "September 2024" calendar */}
          <div className="rounded-3xl border border-[#ECE7DE] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-normal text-[#1F1E1D] tracking-tight">
                November 2026
              </span>
              <div className="flex items-center gap-1">
                <button type="button" className="w-6 h-6 rounded-full border border-[#ECE7DE] flex items-center justify-center text-[#8E8A80] hover:bg-[#F3EFE6]">
                  ‹
                </button>
                <button type="button" className="w-6 h-6 rounded-full border border-[#ECE7DE] flex items-center justify-center text-[#8E8A80] hover:bg-[#F3EFE6]">
                  ›
                </button>
              </div>
            </div>

            {/* Days strip */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#8E8A80] mb-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thr</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              <span className="py-1 text-[#8E8A80]">21</span>
              <span className="py-1 text-[#8E8A80]">22</span>
              {/* Highlight active date like "15" in golden amber circle */}
              <span className="py-1 w-6 h-6 mx-auto rounded-full bg-[#F5A623] text-white flex items-center justify-center font-medium shadow-2xs">
                23
              </span>
              <span className="py-1 text-[#1F1E1D]">24</span>
              <span className="py-1 text-[#1F1E1D]">25</span>
              <span className="py-1 text-[#1F1E1D]">26</span>
              <span className="py-1 text-[#1F1E1D]">27</span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ECE7DE] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
                <span className="text-xs font-normal text-[#1F1E1D]">Staff Briefing</span>
              </div>
              <span className="text-[11px] text-[#8E8A80]">02:30 PM • Hall A</span>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-3xl border border-[#ECE7DE] bg-white p-5 shadow-xs">
            <h2 className="text-xs font-normal text-[#8E8A80] uppercase tracking-wider mb-3">
              Faculty Shortcuts
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/attendance"
                className="p-3 rounded-2xl border border-[#ECE7DE] hover:border-[#1F1E1D]/30 hover:bg-[#FBF9F4] transition text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#FEF5E7] text-[#D97706] flex items-center justify-center mx-auto mb-1.5 group-hover:scale-105 transition">
                  <UserCheck size={16} />
                </div>
                <span className="text-xs font-normal text-[#1F1E1D] block">
                  Attendance
                </span>
              </Link>

              <Link
                href="/assignments"
                className="p-3 rounded-2xl border border-[#ECE7DE] hover:border-[#1F1E1D]/30 hover:bg-[#FBF9F4] transition text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#EFECE5] text-[#1F1E1D] flex items-center justify-center mx-auto mb-1.5 group-hover:scale-105 transition">
                  <BookOpen size={16} />
                </div>
                <span className="text-xs font-normal text-[#1F1E1D] block">
                  New HW
                </span>
              </Link>

              <Link
                href="/exams"
                className="p-3 rounded-2xl border border-[#ECE7DE] hover:border-[#1F1E1D]/30 hover:bg-[#FBF9F4] transition text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#FFFBEB] text-[#B45309] flex items-center justify-center mx-auto mb-1.5 group-hover:scale-105 transition">
                  <Award size={16} />
                </div>
                <span className="text-xs font-normal text-[#1F1E1D] block">
                  Grade Marks
                </span>
              </Link>

              <Link
                href="/communication"
                className="p-3 rounded-2xl border border-[#ECE7DE] hover:border-[#1F1E1D]/30 hover:bg-[#FBF9F4] transition text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#F5F2EA] text-[#6E6A60] flex items-center justify-center mx-auto mb-1.5 group-hover:scale-105 transition">
                  <MessageSquare size={16} />
                </div>
                <span className="text-xs font-normal text-[#1F1E1D] block">
                  Parent Notice
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Homework Submissions - Styled like "Tasks Board" in screenshot */}
          <div className="rounded-3xl border border-[#ECE7DE] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs sm:text-sm font-normal text-[#1F1E1D]">
                Tasks &amp; Homework Board
              </h3>
              <Link
                href="/assignments"
                className="text-[11px] font-normal text-[#B45309] hover:underline"
              >
                Review All
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-2xl border border-[#ECE7DE] bg-[#FBF9F4] hover:bg-[#F6F4ED] transition flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-normal text-[#1F1E1D] truncate">
                      {sub.student} ({sub.rollNo})
                    </p>
                    <p className="text-[11px] font-normal text-[#8E8A80] truncate">
                      {sub.title}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    {sub.status === "Graded" ? (
                      <span className="text-[10px] font-normal text-[#2D6A4F] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                        {sub.score}
                      </span>
                    ) : (
                      <span className="text-[10px] font-normal text-[#B45309] bg-[#FEF5E7] border border-[#FDE68A] px-2.5 py-0.5 rounded-full">
                        Review
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Deadlines */}
          <div className="rounded-3xl border border-[#ECE7DE] bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={15} className="text-[#F5A623]" />
              <h3 className="text-xs sm:text-sm font-normal text-[#1F1E1D]">
                Upcoming Academic Deadlines
              </h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#FEF9EE] border border-[#F6E3B8] text-left">
                <span className="text-[10px] font-normal text-[#B45309] uppercase tracking-wider block">
                  Nov 26, 2026
                </span>
                <p className="text-xs font-normal text-[#1F1E1D] mt-0.5">
                  Grade 10 Mid-Term Math Exam
                </p>
                <p className="text-[11px] font-normal text-[#8A857B] mt-0.5">
                  Question paper moderation finalized
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FBF9F4] border border-[#ECE7DE] text-left">
                <span className="text-[10px] font-normal text-[#6E6A60] uppercase tracking-wider block">
                  Nov 28, 2026
                </span>
                <p className="text-xs font-normal text-[#1F1E1D] mt-0.5">
                  Parent-Teacher Conference (PTM)
                </p>
                <p className="text-[11px] font-normal text-[#8A857B] mt-0.5">
                  09:00 AM - 01:00 PM in Main Auditorium
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
