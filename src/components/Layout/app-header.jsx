"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Calendar,
  Sparkles,
  BookOpen,
  UserCheck,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function UserNav() {
  const router = useRouter()
  const [teacherName, setTeacherName] = useState("Dr. Sarah Jenkins")
  const [employeeId, setEmployeeId] = useState("EMP-2025-00025")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("staffData")
      if (stored) {
        const parsed = JSON.parse(stored)
        const name = `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim()
        if (name) setTeacherName(name)
        if (parsed.employeeId) setEmployeeId(parsed.employeeId)
      }
    } catch (e) {}
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("staffToken")
    localStorage.removeItem("staffData")
    if (typeof document !== "undefined") {
      document.cookie = "staffToken=; path=/; max-age=0;"
    }
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-2xl hover:bg-gray-50 border border-gray-200/80 transition cursor-pointer"
        >
          {/* Avatar with deep charcoal & golden amber */}
          <div className="w-8 h-8 rounded-full bg-[#1F1E1D] text-[#F5A623] flex items-center justify-center text-xs font-normal shadow-xs">
            {teacherName.charAt(0)}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-normal text-[#1F1E1D] leading-tight">
              {teacherName}
            </div>
            <div className="text-[10px] font-normal text-[#8E8A80]">
              {employeeId}
            </div>
          </div>
          <ChevronDown size={13} className="text-[#8E8A80] hidden sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 border-[#ECE7DE] bg-white shadow-xl">
        <DropdownMenuLabel className="font-normal px-2.5 py-1.5">
          <div className="text-xs text-[#1F1E1D] font-normal">{teacherName}</div>
          <div className="text-[11px] text-[#8E8A80] font-normal">Faculty Member</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-[#ECE7DE]" />
        <DropdownMenuItem
          onClick={() => router.push("/students")}
          className="rounded-xl px-2.5 py-2 text-xs font-normal text-[#1F1E1D] cursor-pointer hover:bg-[#F3EFE6] flex items-center gap-2"
        >
          <User size={14} className="text-[#8E8A80]" />
          <span>My Classes</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/timetable")}
          className="rounded-xl px-2.5 py-2 text-xs font-normal text-[#1F1E1D] cursor-pointer hover:bg-[#F3EFE6] flex items-center gap-2"
        >
          <Calendar size={14} className="text-[#8E8A80]" />
          <span>Daily Schedule</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-[#ECE7DE]" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-xl px-2.5 py-2 text-xs font-normal text-rose-600 cursor-pointer hover:bg-rose-50 flex items-center gap-2"
        >
          <LogOut size={14} className="text-rose-500" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function AppHeader() {
  const pathname = usePathname() || "/"
  const { toggleSidebar } = useSidebar()
  const [search, setSearch] = useState("")

  const routeTitles = {
    "/": "Teacher Dashboard",
    "/dashboard": "Teacher Dashboard",
    "/students": "Student Directory",
    "/attendance": "Daily Attendance",
    "/timetable": "Class Timetable",
    "/assignments": "Assignments & Homework",
    "/exams": "Examinations & Grading",
    "/communication": "Communication & Notices",
  }

  const currentTitle = routeTitles[pathname] || "Teacher Portal"

  // Live formatted date
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date())

  return (
    <header className="h-16 shrink-0 z-30 flex w-full items-center justify-between bg-[#FBF9F4]/95 backdrop-blur-md border-b border-[#ECE7DE] px-4 md:px-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      {/* Left Section: Sidebar Toggle + Title Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="w-9 h-9 rounded-full border border-[#ECE7DE] bg-white hover:bg-[#F3EFE6] active:bg-[#ECE7DE] flex items-center justify-center text-[#1F1E1D] transition cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu size={17} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-normal text-[#8E8A80] hidden sm:inline">
            Faculty /
          </span>
          <h1 className="text-sm md:text-base font-normal text-[#1F1E1D] tracking-tight">
            {currentTitle}
          </h1>

          <div className="hidden lg:flex items-center gap-1.5 ml-2 px-3 py-1 rounded-full bg-[#EFECE5] border border-[#E3DDD1] text-[11px] font-normal text-[#6E6A60]">
            <Clock size={12} className="text-[#F5A623]" />
            <span>{todayFormatted}</span>
          </div>
        </div>
      </div>

      {/* Center Section: Quick Search in pill shape like image */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8A80] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search students, roll no, homework..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-white border border-[#E0DBD0] rounded-full text-xs font-normal text-[#1F1E1D] placeholder:text-[#8E8A80] focus:outline-none focus:ring-2 focus:ring-[#1F1E1D]/10 focus:border-[#1F1E1D] transition"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8E8A80] font-mono">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Section: Quick Action + Notifications + User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Shortcut CTA - Deep Charcoal pill */}
        <Link
          href="/attendance"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-normal text-white bg-[#1F1E1D] hover:bg-[#2F2D2B] transition shadow-xs cursor-pointer group"
        >
          <UserCheck size={14} className="text-[#F5A623]" />
          <span>Mark Attendance</span>
        </Link>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative w-9 h-9 rounded-full border border-[#ECE7DE] bg-white hover:bg-[#F3EFE6] flex items-center justify-center text-[#1F1E1D] transition cursor-pointer"
              aria-label="View notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F5A623] ring-2 ring-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 border-[#ECE7DE] bg-white shadow-xl">
            <div className="px-3 py-2 flex items-center justify-between border-b border-[#ECE7DE] mb-1">
              <span className="text-xs font-normal text-[#1F1E1D]">Notifications</span>
              <span className="text-[10px] text-[#B45309] font-normal cursor-pointer hover:underline">
                Mark all read
              </span>
            </div>

            <div className="space-y-1">
              <div className="p-2.5 rounded-xl hover:bg-[#F3EFE6] transition cursor-pointer flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FEF5E7] text-[#B45309] flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-normal text-gray-800 leading-snug">
                    5 new homework submissions in Math 10A
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">15 mins ago</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-normal text-gray-800 leading-snug">
                    Next lecture: Algebra (Room 203) at 11:30 AM
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">1 hour ago</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Pill Nav */}
        <UserNav />
      </div>
    </header>
  )
}
