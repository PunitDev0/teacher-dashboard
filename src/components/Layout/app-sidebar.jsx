"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Users,
  UserCheck,
  CalendarDays,
  BookOpenCheck,
  BookOpen,
  FileCheck2,
  MessageSquare,
  LogOut,
  User,
  Settings,
  HelpCircle,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const teacherNavigation = [
  {
    label: "Main Workspace",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        aliases: ["/", "/dashboard"],
        icon: Home,
        badge: "Live",
      },
      {
        title: "My Students",
        url: "/students",
        aliases: ["/students"],
        icon: Users,
      },
      {
        title: "Daily Attendance",
        url: "/attendance",
        aliases: ["/attendance"],
        icon: UserCheck,
      },
    ],
  },
  {
    label: "Academics & Classroom",
    items: [
      {
        title: "Class Timetable",
        url: "/timetable",
        aliases: ["/timetable"],
        icon: CalendarDays,
      },
      {
        title: "Assignments & HW",
        url: "/assignments",
        aliases: ["/assignments"],
        icon: BookOpenCheck,
      },
      {
        title: "Lesson Diary & Plans",
        url: "/lesson-plan",
        aliases: ["/lesson-plan"],
        icon: BookOpen,
      },
      {
        title: "Exams & Grading",
        url: "/exams",
        aliases: ["/exams"],
        icon: FileCheck2,
      },
    ],
  },
  {
    label: "Engagement & Support",
    items: [
      {
        title: "Communication",
        url: "/communication",
        aliases: ["/communication"],
        icon: MessageSquare,
      },
      {
        title: "My Leaves & Punch",
        url: "/leaves",
        aliases: ["/leaves"],
        icon: UserCheck,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname() || "/"
  const router = useRouter()
  const [staffInfo, setStaffInfo] = React.useState({
    name: "Dr. Sarah Jenkins",
    role: "Senior Faculty",
    employeeId: "EMP-2025-00025",
    email: "sarah.jenkins@schoolerp.edu",
    department: "Mathematics & Science",
  })

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("staffData")
      if (stored) {
        const parsed = JSON.parse(stored)
        const name = `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim()
        setStaffInfo({
          name: name || parsed.name || "Dr. Sarah Jenkins",
          role: parsed.designation || parsed.role || "Senior Faculty",
          employeeId: parsed.employeeId || "EMP-2025-00025",
          email: parsed.emailAddress || parsed.email || "sarah.jenkins@schoolerp.edu",
          department: parsed.department || "Mathematics & Science",
        })
      }
    } catch (e) {
      console.warn("Failed to read staffData", e)
    }
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
    <Sidebar className="border-r border-[#ECE7DE] bg-[#FBF9F4]">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-[#ECE7DE]/70 pb-3 bg-[#FBF9F4]">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-[#F3EFE6] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1F1E1D] text-[#F5A623] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
            <GraduationCap className="w-5.5 h-5.5 text-[#F5A623]" />
          </div>

          <div className="flex flex-col text-left leading-tight min-w-0">
            <span className="text-sm font-semibold text-[#1F1E1D] tracking-tight truncate">
              School ERP
            </span>
            <span className="text-[11px] font-normal text-[#B45309] flex items-center gap-1 mt-0.5">
              <span>Teacher Portal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation Groups */}
      <SidebarContent className="bg-[#FBF9F4] px-1">
        {teacherNavigation.map((section, idx) => (
          <SidebarGroup key={idx} className="py-1">
            <SidebarGroupLabel className="text-[11px] font-medium tracking-wider text-[#8A857B] uppercase px-2.5 pt-2 pb-1 select-none">
              {section.label}
            </SidebarGroupLabel>

            <SidebarMenu className="gap-1">
              {section.items.map((item) => {
                const isActive =
                  item.aliases?.includes(pathname) ||
                  (item.url !== "/" && pathname.startsWith(item.url))

                return (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      href={item.url}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-medium transition-all cursor-pointer select-none ${
                        isActive
                          ? "bg-[#1F1E1D] text-white shadow-xs"
                          : "text-[#6E6A60] hover:text-[#1F1E1D] hover:bg-[#F3EFE6]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.icon && (
                          <item.icon
                            size={18}
                            className={`shrink-0 ${
                              isActive ? "text-[#F5A623]" : "text-[#8E8A80]"
                            }`}
                          />
                        )}
                        <span className="truncate">{item.title}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium leading-none shrink-0 ${
                            isActive
                              ? "bg-white/20 text-[#F5A623]"
                              : "bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}

        {/* Quick Help Card */}
        <div className="mt-auto px-1 pt-3 pb-1">
          <div className="p-3.5 rounded-2xl bg-[#FEF9EE] border border-[#F6E3B8] text-left">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#9A6B0A] mb-1">
              <Sparkles size={14} className="text-[#F5A623]" />
              <span>Exam Marks Entry</span>
            </div>
            <p className="text-xs font-normal text-[#7A6B52] leading-relaxed mb-2.5">
              Mid-term grade evaluation is active for Classes 10A &amp; 11B.
            </p>
            <Link
              href="/exams"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1F1E1D] hover:text-[#B45309] transition"
            >
              <span>Submit marks</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </SidebarContent>

      {/* Footer Profile Dropdown */}
      <SidebarFooter className="border-t border-[#ECE7DE]/70 pt-2 pb-3 bg-[#FBF9F4]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 p-2.5 rounded-2xl bg-white hover:bg-[#F3EFE6] border border-[#ECE7DE] transition-all cursor-pointer text-left shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1F1E1D] text-[#F5A623] flex items-center justify-center text-sm font-semibold shadow-xs shrink-0">
                {staffInfo.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[#1F1E1D] truncate leading-tight">
                  {staffInfo.name}
                </div>
                <div className="text-[11px] font-normal text-[#8E8A80] truncate mt-0.5">
                  {staffInfo.employeeId}
                </div>
              </div>

              <ChevronsUpDown size={15} className="text-[#8E8A80] shrink-0" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" side="top" className="w-56 rounded-2xl p-1.5 border-[#ECE7DE] bg-white shadow-xl">
            <DropdownMenuLabel className="font-normal px-2.5 py-1.5">
              <div className="text-xs text-[#1F1E1D] font-normal">{staffInfo.name}</div>
              <div className="text-[11px] text-[#8E8A80] font-normal truncate">{staffInfo.email}</div>
              <div className="text-[10px] text-[#B45309] font-normal mt-0.5">{staffInfo.department}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-[#ECE7DE]" />
            <DropdownMenuItem
              onClick={() => router.push("/students")}
              className="rounded-xl px-2.5 py-2 text-xs font-normal text-[#1F1E1D] cursor-pointer hover:bg-[#F3EFE6] flex items-center gap-2"
            >
              <User size={14} className="text-[#8E8A80]" />
              <span>My Classes & Students</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/timetable")}
              className="rounded-xl px-2.5 py-2 text-xs font-normal text-[#1F1E1D] cursor-pointer hover:bg-[#F3EFE6] flex items-center gap-2"
            >
              <CalendarDays size={14} className="text-[#8E8A80]" />
              <span>Teaching Schedule</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-[#ECE7DE]" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl px-2.5 py-2 text-xs font-normal text-rose-600 cursor-pointer hover:bg-rose-50 flex items-center gap-2"
            >
              <LogOut size={14} className="text-rose-500" />
              <span>Logout Portal</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
