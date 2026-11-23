"use client";

import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Send,
  GraduationCap,
  ShieldCheck,
  Building,
} from "lucide-react";

const ASSIGNED_CLASS_TEACHER = {
  className: "Grade 10",
  sectionName: "Section A",
  display: "Grade 10 - Section A",
  room: "Room 201",
  academicYear: "2026-2027",
  totalStudents: 20,
};

const DEMO_CLASS_TEACHER_STUDENTS = [
  { id: "std-10a-01", name: "Aakash Gupta", rollNo: "01", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10101" },
  { id: "std-10a-02", name: "Aarav Sharma", rollNo: "02", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10102" },
  { id: "std-10a-03", name: "Aditi Rao", rollNo: "03", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10103" },
  { id: "std-10a-04", name: "Ananya Bansal", rollNo: "04", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10104" },
  { id: "std-10a-05", name: "Aryan Singh", rollNo: "05", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10105" },
  { id: "std-10a-06", name: "Bhavya Joshi", rollNo: "06", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10106" },
  { id: "std-10a-07", name: "Devika Pillai", rollNo: "07", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10107" },
  { id: "std-10a-08", name: "Divyansh Roy", rollNo: "08", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10108" },
  { id: "std-10a-09", name: "Ishaan Chawla", rollNo: "09", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10109" },
  { id: "std-10a-10", name: "Kavya Kulkarni", rollNo: "10", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10110" },
  { id: "std-10a-11", name: "Meera Sen", rollNo: "11", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10111" },
  { id: "std-10a-12", name: "Mihir Nair", rollNo: "12", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10112" },
  { id: "std-10a-13", name: "Navya Saxena", rollNo: "13", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10113" },
  { id: "std-10a-14", name: "Pranav Jain", rollNo: "14", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10114" },
  { id: "std-10a-15", name: "Riya Aggarwal", rollNo: "15", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10115" },
  { id: "std-10a-16", name: "Rohan Varma", rollNo: "16", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10116" },
  { id: "std-10a-17", name: "Samarth Bhat", rollNo: "17", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10117" },
  { id: "std-10a-18", name: "Shreya Menon", rollNo: "18", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10118" },
  { id: "std-10a-19", name: "Tarun Chopra", rollNo: "19", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10119" },
  { id: "std-10a-20", name: "Yash Vardhan", rollNo: "20", className: "Grade 10", sectionName: "Section A", parentPhone: "+91 98765 10120" },
];

const INITIAL_ATTENDANCE = {
  "std-10a-01": { status: "present", time: "07:51 AM", reason: "" },
  "std-10a-02": { status: "present", time: "07:54 AM", reason: "" },
  "std-10a-03": { status: "present", time: "07:52 AM", reason: "" },
  "std-10a-04": { status: "late", time: "08:14 AM", reason: "Bus delayed near Ring Road" },
  "std-10a-05": { status: "present", time: "07:49 AM", reason: "" },
  "std-10a-06": { status: "present", time: "07:55 AM", reason: "" },
  "std-10a-07": { status: "absent", time: "-", reason: "Viral fever - Parent notified" },
  "std-10a-08": { status: "present", time: "07:48 AM", reason: "" },
  "std-10a-09": { status: "present", time: "07:56 AM", reason: "" },
  "std-10a-10": { status: "present", time: "07:53 AM", reason: "" },
  "std-10a-11": { status: "present", time: "07:50 AM", reason: "" },
  "std-10a-12": { status: "present", time: "07:57 AM", reason: "" },
  "std-10a-13": { status: "late", time: "08:18 AM", reason: "Metro signal delay" },
  "std-10a-14": { status: "present", time: "07:52 AM", reason: "" },
  "std-10a-15": { status: "present", time: "07:54 AM", reason: "" },
  "std-10a-16": { status: "present", time: "07:50 AM", reason: "" },
  "std-10a-17": { status: "absent", time: "-", reason: "Out of station - Medical leave" },
  "std-10a-18": { status: "present", time: "07:55 AM", reason: "" },
  "std-10a-19": { status: "present", time: "07:49 AM", reason: "" },
  "std-10a-20": { status: "present", time: "07:53 AM", reason: "" },
};

const PAGE_SIZE = 10;

export default function AttendancePage() {
  const [students, setStudents] = useState(DEMO_CLASS_TEACHER_STUDENTS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teacherName, setTeacherName] = useState("Dr. Sarah Jenkins");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("staffData");
      if (stored) {
        const parsed = JSON.parse(stored);
        const name = `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim();
        if (name) setTeacherName(name);
      }
    } catch (e) {}
  }, []);

  // Absentee Dialog
  const [activeStudentForReason, setActiveStudentForReason] = useState(null);
  const [reasonCategory, setReasonCategory] = useState("Medical Leave");
  const [reasonNotes, setReasonNotes] = useState("");

  const handleMarkStatus = (studentId, status) => {
    if (status === "absent") {
      const student = students.find((s) => s.id === studentId);
      setActiveStudentForReason(student);
      setReasonCategory("Medical / Sickness");
      setReasonNotes(attendance[studentId]?.reason || "");
      return;
    }

    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        status,
        time: status === "present" ? "07:55 AM" : status === "late" ? "08:15 AM" : "-",
        reason: "",
      },
    }));
  };

  const handleSaveAbsentReason = (e) => {
    e.preventDefault();
    if (!activeStudentForReason) return;

    setAttendance((prev) => ({
      ...prev,
      [activeStudentForReason.id]: {
        status: "absent",
        time: "-",
        reason: `${reasonCategory}: ${reasonNotes || "Parent confirmed"}`,
      },
    }));

    setActiveStudentForReason(null);
    setReasonNotes("");
  };

  const handleMarkAllPresent = () => {
    const updated = { ...attendance };
    filteredStudents.forEach((st) => {
      updated[st.id] = {
        status: "present",
        time: "07:55 AM",
        reason: "",
      };
    });
    setAttendance(updated);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.includes(searchQuery);
      const studentStatus = attendance[s.id]?.status || "unmarked";
      const matchesStatus = selectedStatus === "all" || studentStatus === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, selectedStatus, attendance]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, currentPage]);

  const presentCount = Object.values(attendance).filter((a) => a.status === "present").length;
  const absentCount = Object.values(attendance).filter((a) => a.status === "absent").length;
  const lateCount = Object.values(attendance).filter((a) => a.status === "late").length;
  const attendancePercent = Math.round((presentCount / students.length) * 100);

  return (
    <Layout>
      <div className="space-y-4 w-full pb-8 min-w-0">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
                Designated Class Teacher Register
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-normal text-[#1F1E1D] tracking-tight flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-[#1F1E1D]" />
              Classroom Attendance — {ASSIGNED_CLASS_TEACHER.display}
            </h1>
            <p className="text-xs font-normal text-[#8E8A80] mt-0.5">
              Live morning roll-call, absentee reason tracking, and automated parent SMS notifications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-34 h-8.5 text-xs rounded-full bg-white border-[#E0DBD0] text-[#1F1E1D]"
            />
            <Button
              onClick={handleMarkAllPresent}
              className="bg-[#1F1E1D] hover:bg-[#2F2D2B] text-white rounded-full text-xs font-normal h-8.5 shadow-xs flex items-center gap-1.5 px-4 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F5A623]" />
              1-Click Mark All Present
            </Button>
          </div>
        </div>

        {/* ── ASSIGNED CLASS TEACHER BANNER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#ECE7DE] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1F1E1D] text-[#F5A623] flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="w-5.5 h-5.5 text-[#F5A623]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1F1E1D]">
                  {ASSIGNED_CLASS_TEACHER.display}
                </span>
                <span className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2D6A4F] border border-[#C8E6C9] font-medium">
                  Your Assigned Class
                </span>
              </div>
              <p className="text-xs text-[#8E8A80] mt-0.5">
                Class Teacher: <strong className="text-[#1F1E1D] font-medium">{teacherName}</strong> • {ASSIGNED_CLASS_TEACHER.room} • Academic Session {ASSIGNED_CLASS_TEACHER.academicYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6E6A60] bg-[#FBF9F4] px-3.5 py-2 rounded-xl border border-[#ECE7DE] self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>Attendance access authorized for Class Teacher only</span>
          </div>
        </div>

        {/* ── STAT STRIP ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Total Enrolled</span>
            <p className="text-xl font-normal text-[#1F1E1D] mt-0.5">
              {students.length} <span className="text-xs text-[#8E8A80]">Students</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#2D6A4F]">Present Today</span>
            <p className="text-xl font-normal text-[#2D6A4F] mt-0.5">
              {presentCount} <span className="text-xs text-[#2D6A4F]/70 font-normal">({attendancePercent}%)</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-rose-600">Absentees</span>
            <p className="text-xl font-normal text-rose-600 mt-0.5">
              {absentCount} <span className="text-xs text-rose-600/70 font-normal">Recorded</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#B45309]">Late Arrivals</span>
            <p className="text-xl font-normal text-[#B45309] mt-0.5">
              {lateCount} <span className="text-xs text-[#B45309]/70 font-normal">Grace</span>
            </p>
          </Card>
        </div>

        {/* ── FILTERS & ACTIVE CLASS LOCK ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#ECE7DE] shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
            <div className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#1F1E1D] text-white border border-[#1F1E1D] shadow-xs flex items-center gap-1.5 shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-[#F5A623]" />
              <span>{ASSIGNED_CLASS_TEACHER.display} (Your Class • {students.length} Students)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-8.5 px-3 rounded-full border border-[#E0DBD0] bg-[#FBF9F4] text-xs text-[#1F1E1D] outline-none"
            >
              <option value="all">All Status</option>
              <option value="present">Present Only</option>
              <option value="absent">Absent Only</option>
              <option value="late">Late Only</option>
            </select>

            <div className="relative w-44 sm:w-52">
              <Search className="w-3.5 h-3.5 text-[#8E8A80] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search name, roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 h-8.5 text-xs bg-[#FBF9F4] border-[#E0DBD0] rounded-full text-[#1F1E1D]"
              />
            </div>
          </div>
        </div>

        {/* ── HIGH-DENSITY ATTENDANCE TABLE ── */}
        <div className="bg-white rounded-2xl border border-[#ECE7DE] shadow-xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="bg-[#F8F6F1] border-b border-[#ECE7DE] text-[#78746B] font-normal uppercase tracking-wider">
                  <th className="py-2.5 px-3.5 w-16">Roll No</th>
                  <th className="py-2.5 px-3.5">Student Name</th>
                  <th className="py-2.5 px-3.5">Class &amp; Section</th>
                  <th className="py-2.5 px-3.5 text-center">Attendance Status</th>
                  <th className="py-2.5 px-3.5">Marked Time</th>
                  <th className="py-2.5 px-3.5">Reason / Notes</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DE] text-[#1F1E1D]">
                {paginatedStudents.map((st) => {
                  const record = attendance[st.id] || { status: "unmarked", time: "-", reason: "" };
                  const isPresent = record.status === "present";
                  const isAbsent = record.status === "absent";
                  const isLate = record.status === "late";

                  return (
                    <tr key={st.id} className="hover:bg-[#FAF8F4] transition-colors">
                      <td className="py-2.5 px-3.5 font-mono font-medium text-[#1F1E1D]">
                        #{st.rollNo}
                      </td>

                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6.5 h-6.5 rounded-full bg-[#EFECE5] text-[#1F1E1D] flex items-center justify-center font-normal text-xs shrink-0">
                            {st.name.charAt(0)}
                          </div>
                          <span className="font-normal text-[#1F1E1D]">{st.name}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3.5">
                        <Badge variant="outline" className="text-[10.5px] font-normal border-[#E0DBD0] text-[#6E6A60] bg-[#FBF9F4]">
                          {st.className} ({st.sectionName})
                        </Badge>
                      </td>

                      <td className="py-2.5 px-3.5 text-center">
                        <div className="inline-flex items-center p-0.5 rounded-full border border-[#ECE7DE] bg-[#FBF9F4] gap-1">
                          <button
                            onClick={() => handleMarkStatus(st.id, "present")}
                            className={`px-2.5 py-0.5 rounded-full text-xs font-normal transition-all cursor-pointer ${
                              isPresent
                                ? "bg-[#2D6A4F] text-white shadow-2xs"
                                : "text-[#6E6A60] hover:text-[#2D6A4F]"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleMarkStatus(st.id, "absent")}
                            className={`px-2.5 py-0.5 rounded-full text-xs font-normal transition-all cursor-pointer ${
                              isAbsent
                                ? "bg-rose-600 text-white shadow-2xs"
                                : "text-[#6E6A60] hover:text-rose-700"
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => handleMarkStatus(st.id, "late")}
                            className={`px-2.5 py-0.5 rounded-full text-xs font-normal transition-all cursor-pointer ${
                              isLate
                                ? "bg-[#F5A623] text-white shadow-2xs"
                                : "text-[#6E6A60] hover:text-[#B45309]"
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </td>

                      <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#8E8A80]">
                        {record.time}
                      </td>

                      <td className="py-2.5 px-3.5">
                        {record.reason ? (
                          <span
                            onClick={() => {
                              setActiveStudentForReason(st);
                              setReasonCategory(record.reason.split(":")[0] || "Medical");
                              setReasonNotes(record.reason.split(":")[1]?.trim() || "");
                            }}
                            className="inline-flex items-center gap-1 text-[10.5px] text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 cursor-pointer hover:bg-rose-100 max-w-[200px] truncate"
                          >
                            <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                            <span className="truncate">{record.reason}</span>
                          </span>
                        ) : (
                          <span className="text-[#C6C0B4] text-xs">—</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveStudentForReason(st);
                            setReasonCategory("Reason Note");
                            setReasonNotes(record.reason || "");
                          }}
                          className="text-[#1F1E1D] hover:bg-[#EFECE5] text-xs font-normal h-7 px-2.5 rounded-full"
                        >
                          Note
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 bg-[#F8F6F1] border-t border-[#ECE7DE] text-xs text-[#6E6A60]">
            <div>
              Showing{" "}
              <span className="font-medium text-[#1F1E1D]">
                {filteredStudents.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium text-[#1F1E1D]">
                {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)}
              </span>{" "}
              of <span className="font-medium text-[#1F1E1D]">{filteredStudents.length}</span> records
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2.5 rounded-full text-xs border-[#E0DBD0] text-[#1F1E1D] hover:bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 rounded-full text-xs transition-colors ${
                    currentPage === pg
                      ? "bg-[#1F1E1D] text-white font-medium"
                      : "text-[#6E6A60] hover:bg-[#EFECE5]"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2.5 rounded-full text-xs border-[#E0DBD0] text-[#1F1E1D] hover:bg-white disabled:opacity-40"
              >
                Next <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* ── ABSENTEE REASON MODAL ── */}
        <Dialog open={!!activeStudentForReason} onOpenChange={() => setActiveStudentForReason(null)}>
          <DialogContent className="sm:max-w-[460px] rounded-2xl text-left">
            {activeStudentForReason && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-base font-normal text-gray-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Record Absence • {activeStudentForReason.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-gray-400">
                    Roll #{activeStudentForReason.rollNo} • {activeStudentForReason.className}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSaveAbsentReason} className="space-y-3 pt-1">
                  <div>
                    <Label className="text-xs text-gray-700 font-normal">Absence Reason</Label>
                    <select
                      value={reasonCategory}
                      onChange={(e) => setReasonCategory(e.target.value)}
                      className="w-full text-xs rounded-xl border border-gray-200 bg-white h-8.5 px-3 mt-1 outline-none"
                    >
                      <option value="Medical / Sickness">Medical / Health Sickness</option>
                      <option value="Family Function">Family Event / Function</option>
                      <option value="Uninformed Absence">Uninformed / Absent Without Notice</option>
                      <option value="Transport / Bus Delay">Transport / Bus Breakdown</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-700 font-normal">Remarks</Label>
                    <Textarea
                      rows={2}
                      placeholder="e.g. Fever - spoke with parent."
                      value={reasonNotes}
                      onChange={(e) => setReasonNotes(e.target.value)}
                      className="text-xs rounded-xl mt-1"
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveStudentForReason(null)}
                      className="rounded-xl text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs shadow-xs"
                    >
                      Save Absence
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}
