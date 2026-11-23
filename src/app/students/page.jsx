"use client";

import { useEffect, useState, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Users,
  User,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

const DEMO_STUDENTS = [
  {
    _id: "std-001",
    id: "std-001",
    name: "Aarav Sharma",
    rollNumber: "10A-04",
    rollNo: "04",
    email: "aarav.sharma@schoolerp.edu",
    phone: "+91 98765 43210",
    className: "Grade 10A",
    classId: "cls-10a",
    sectionName: "Section A",
    sectionId: "sec-10a",
    academicYear: "2026-2027",
    status: "Active",
    gender: "Male",
    dob: "14 May 2010",
    bloodGroup: "O+",
    address: "B-42, Shanti Vihar, New Delhi",
    parentName: "Mr. Rajesh Sharma",
    parentPhone: "+91 98765 11111",
    parentRelation: "Father",
    attendanceRate: 98,
    gpa: "9.4 / 10",
    house: "Tagore House (Blue)",
  },
  {
    _id: "std-002",
    id: "std-002",
    name: "Priya Nair",
    rollNumber: "11B-12",
    rollNo: "12",
    email: "priya.nair@schoolerp.edu",
    phone: "+91 98765 43211",
    className: "Grade 11B",
    classId: "cls-11b",
    sectionName: "Section B",
    sectionId: "sec-11b",
    academicYear: "2026-2027",
    status: "Active",
    gender: "Female",
    dob: "22 Aug 2009",
    bloodGroup: "B+",
    address: "Flat 204, Palm Grove, Bengaluru",
    parentName: "Mr. Suresh Nair",
    parentPhone: "+91 98765 22222",
    parentRelation: "Father",
    attendanceRate: 95,
    gpa: "9.1 / 10",
    house: "Ashoka House (Green)",
  },
  {
    _id: "std-003",
    id: "std-003",
    name: "Rohan Varma",
    rollNumber: "10A-21",
    rollNo: "21",
    email: "rohan.varma@schoolerp.edu",
    phone: "+91 98765 43212",
    className: "Grade 10A",
    classId: "cls-10a",
    sectionName: "Section A",
    sectionId: "sec-10a",
    academicYear: "2026-2027",
    status: "Active",
    gender: "Male",
    dob: "18 Feb 2010",
    bloodGroup: "A+",
    address: "74-A, Civil Lines, Jaipur",
    parentName: "Mr. Vikram Varma",
    parentPhone: "+91 98765 33333",
    parentRelation: "Father",
    attendanceRate: 92,
    gpa: "8.8 / 10",
    house: "Raman House (Yellow)",
  },
  {
    _id: "std-004",
    id: "std-004",
    name: "Ananya Iyer",
    rollNumber: "12A-08",
    rollNo: "08",
    email: "ananya.iyer@schoolerp.edu",
    phone: "+91 98765 43213",
    className: "Grade 12A",
    classId: "cls-12a",
    sectionName: "Section A",
    sectionId: "sec-12a",
    academicYear: "2026-2027",
    status: "Active",
    gender: "Female",
    dob: "03 Nov 2008",
    bloodGroup: "AB+",
    address: "12, Kasturba Road, Chennai",
    parentName: "Dr. K. Iyer",
    parentPhone: "+91 98765 44444",
    parentRelation: "Mother",
    attendanceRate: 99,
    gpa: "9.8 / 10",
    house: "Tagore House (Blue)",
  },
  {
    _id: "std-005",
    id: "std-005",
    name: "Kabir Mehta",
    rollNumber: "10B-15",
    rollNo: "15",
    email: "kabir.mehta@schoolerp.edu",
    phone: "+91 98765 43214",
    className: "Grade 10B",
    classId: "cls-10b",
    sectionName: "Section B",
    sectionId: "sec-10b",
    academicYear: "2026-2027",
    status: "Active",
    gender: "Male",
    dob: "29 Sep 2010",
    bloodGroup: "O-",
    address: "Plot 89, Sector 14, Gurugram",
    parentName: "Mrs. Neha Mehta",
    parentPhone: "+91 98765 55555",
    parentRelation: "Mother",
    attendanceRate: 88,
    gpa: "8.2 / 10",
    house: "Shivaji House (Red)",
  },
  {
    _id: "std-006",
    id: "std-006",
    name: "Sanya Kapoor",
    rollNumber: "11B-05",
    rollNo: "05",
    email: "sanya.kapoor@schoolerp.edu",
    phone: "+91 98765 43215",
    className: "Grade 11B",
    classId: "cls-11b",
    sectionName: "Section B",
    sectionId: "sec-11b",
    academicYear: "2026-2027",
    status: "Active",
    gender: "Female",
    dob: "11 Dec 2009",
    bloodGroup: "B+",
    address: "C-12, Model Town, Ludhiana",
    parentName: "Mr. Rajan Kapoor",
    parentPhone: "+91 98765 66666",
    parentRelation: "Father",
    attendanceRate: 94,
    gpa: "8.9 / 10",
    house: "Ashoka House (Green)",
  },
  {
    _id: "std-007",
    id: "std-007",
    name: "Dev Patel",
    rollNumber: "12A-19",
    rollNo: "19",
    email: "dev.patel@schoolerp.edu",
    phone: "+91 98765 43216",
    className: "Grade 12A",
    classId: "cls-12a",
    sectionName: "Section A",
    sectionId: "sec-12a",
    academicYear: "2026-2027",
    status: "Active",
    gender: "Male",
    dob: "17 Jan 2008",
    bloodGroup: "A-",
    address: "55, Navrangpura, Ahmedabad",
    parentName: "Mr. Bhavesh Patel",
    parentPhone: "+91 98765 77777",
    parentRelation: "Father",
    attendanceRate: 96,
    gpa: "9.3 / 10",
    house: "Raman House (Yellow)",
  },
  {
    _id: "std-008",
    id: "std-008",
    name: "Meera Sen",
    rollNumber: "10A-11",
    rollNo: "11",
    email: "meera.sen@schoolerp.edu",
    phone: "+91 98765 43217",
    className: "Grade 10A",
    classId: "cls-10a",
    sectionName: "Section A",
    sectionId: "sec-10a",
    academicYear: "2026-2027",
    status: "Active",
    gender: "Female",
    dob: "05 Apr 2010",
    bloodGroup: "O+",
    address: "18/2, Ballygunge, Kolkata",
    parentName: "Mr. Subhash Sen",
    parentPhone: "+91 98765 88888",
    parentRelation: "Father",
    attendanceRate: 97,
    gpa: "9.6 / 10",
    house: "Tagore House (Blue)",
  },
  {
    _id: "std-009",
    id: "std-009",
    name: "Arjun Reddy",
    rollNumber: "10B-08",
    rollNo: "08",
    email: "arjun.reddy@schoolerp.edu",
    phone: "+91 98765 43218",
    className: "Grade 10B",
    classId: "cls-10b",
    sectionName: "Section B",
    sectionId: "sec-10b",
    academicYear: "2026-2027",
    status: "Active",
    gender: "Male",
    dob: "19 Jul 2010",
    bloodGroup: "B-",
    address: "Road No. 10, Banjara Hills, Hyderabad",
    parentName: "Dr. Srinivas Reddy",
    parentPhone: "+91 98765 99999",
    parentRelation: "Father",
    attendanceRate: 91,
    gpa: "8.5 / 10",
    house: "Shivaji House (Red)",
  },
  {
    _id: "std-010",
    id: "std-010",
    name: "Tanvi Deshmukh",
    rollNumber: "11B-22",
    rollNo: "22",
    email: "tanvi.deshmukh@schoolerp.edu",
    phone: "+91 98765 43219",
    className: "Grade 11B",
    classId: "cls-11b",
    sectionName: "Section B",
    sectionId: "sec-11b",
    academicYear: "2026-2027",
    status: "Active",
    gender: "Female",
    dob: "30 Mar 2009",
    bloodGroup: "AB-",
    address: "Prabhat Road, Pune",
    parentName: "Mr. Anil Deshmukh",
    parentPhone: "+91 98765 00000",
    parentRelation: "Father",
    attendanceRate: 93,
    gpa: "9.0 / 10",
    house: "Ashoka House (Green)",
  },
];

const PAGE_SIZE = 5;

export default function StudentsPage() {
  const [students, setStudents] = useState(DEMO_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const classes = useMemo(() => {
    const list = [...new Set(students.map((s) => s.className))];
    return list.sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === "all" || s.className === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, selectedClass]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedClass]);

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, currentPage]);

  const maleCount = students.filter((s) => s.gender === "Male").length;
  const femaleCount = students.filter((s) => s.gender === "Female").length;
  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length
  );

  return (
    <Layout>
      <div className="space-y-4 w-full pb-8 min-w-0">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                <Sparkles className="w-3 h-3 text-[#F5A623]" />
                Academic Session 2026-27
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-normal text-[#1F1E1D] tracking-tight flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-[#1F1E1D]" />
              My Students Directory
            </h1>
            <p className="text-xs font-normal text-[#8E8A80] mt-0.5">
              Complete student roster, attendance health, academic progress, and 360° profiles
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/attendance">
              <Button className="bg-[#1F1E1D] hover:bg-[#2F2D2B] text-white rounded-full text-xs font-normal h-8.5 shadow-xs flex items-center gap-1.5 px-4 cursor-pointer">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5A623]" />
                Take Class Attendance
              </Button>
            </Link>
          </div>
        </div>

        {/* ── STAT STRIP ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Total Assigned</span>
            <p className="text-xl font-normal text-[#1F1E1D] mt-0.5">
              {students.length} <span className="text-xs text-[#8E8A80]">Students</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Gender Ratio</span>
            <p className="text-xl font-normal text-[#1F1E1D] mt-0.5">
              {maleCount}M <span className="text-[#D6D0C5] font-light">•</span> {femaleCount}F
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Avg. Attendance</span>
            <p className="text-xl font-normal text-[#2D6A4F] mt-0.5">
              {avgAttendance}% <span className="text-xs text-[#2D6A4F]/80 font-normal">Healthy</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Allocated Classes</span>
            <p className="text-xl font-normal text-[#1F1E1D] mt-0.5">
              {classes.length} <span className="text-xs text-[#8E8A80]">Sections</span>
            </p>
          </Card>
        </div>

        {/* ── FILTER BAR & VIEW TOGGLE ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#ECE7DE] shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setSelectedClass("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer border shrink-0 ${
                selectedClass === "all"
                  ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                  : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
              }`}
            >
              All Classes ({students.length})
            </button>
            {classes.map((c) => {
              const count = students.filter((s) => s.className === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedClass(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer border shrink-0 ${
                    selectedClass === c
                      ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                      : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
                  }`}
                >
                  {c} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#8E8A80] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search name, roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 h-8.5 text-xs bg-[#FBF9F4] border-[#E0DBD0] rounded-full text-[#1F1E1D] focus:border-[#1F1E1D]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#F5F2EA] p-1 rounded-full border border-[#E0DBD0] shrink-0">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-full text-xs cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-[#1F1E1D] shadow-xs"
                    : "text-[#8E8A80] hover:text-[#1F1E1D]"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-full text-xs cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-[#1F1E1D] shadow-xs"
                    : "text-[#8E8A80] hover:text-[#1F1E1D]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ══════════ VIEW 1: HIGH-DENSITY ERP TABLE ══════════ */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl border border-[#ECE7DE] shadow-xs overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead>
                  <tr className="bg-[#F8F6F1] border-b border-[#ECE7DE] text-[#78746B] font-normal uppercase tracking-wider">
                    <th className="py-2.5 px-3.5 w-16">Roll No</th>
                    <th className="py-2.5 px-3.5">Student Name</th>
                    <th className="py-2.5 px-3.5">Class &amp; Section</th>
                    <th className="py-2.5 px-3.5">Gender</th>
                    <th className="py-2.5 px-3.5">Attendance</th>
                    <th className="py-2.5 px-3.5">Guardian Phone</th>
                    <th className="py-2.5 px-3.5 text-right">360° Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE7DE] text-[#1F1E1D]">
                  {paginatedStudents.map((st) => (
                    <tr
                      key={st.id}
                      onClick={() => setSelectedStudent(st)}
                      className="hover:bg-[#FAF8F4] transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-3.5">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-[#EFECE5] text-[#1F1E1D] font-medium">
                          #{st.rollNo}
                        </span>
                      </td>

                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#EFECE5] text-[#1F1E1D] flex items-center justify-center font-normal text-xs shrink-0">
                            {st.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-normal text-[#1F1E1D] group-hover:text-[#B45309] transition-colors leading-tight">
                              {st.name}
                            </p>
                            <p className="text-[10.5px] text-[#8E8A80]">{st.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3.5">
                        <Badge variant="outline" className="text-[10.5px] font-normal border-[#E0DBD0] text-[#6E6A60]">
                          {st.className} ({st.sectionName})
                        </Badge>
                      </td>

                      <td className="py-2.5 px-3.5 text-[#8E8A80]">{st.gender}</td>

                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-14 h-1.5 bg-[#EFECE5] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                st.attendanceRate >= 95
                                  ? "bg-[#2D6A4F]"
                                  : st.attendanceRate >= 90
                                  ? "bg-[#F5A623]"
                                  : "bg-amber-600"
                              }`}
                              style={{ width: `${st.attendanceRate}%` }}
                            />
                          </div>
                          <span className="font-medium text-[#1F1E1D] text-[11px]">
                            {st.attendanceRate}%
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3.5">
                        <span className="text-[#6E6A60] font-mono text-[11px] flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-[#8E8A80]" />
                          {st.parentPhone}
                        </span>
                      </td>

                      <td className="py-2.5 px-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#1F1E1D] hover:bg-[#EFECE5] text-xs font-normal h-7 px-2.5 rounded-full"
                        >
                          View <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-[#8E8A80]" />
                        </Button>
                      </td>
                    </tr>
                  ))}
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
                of <span className="font-medium text-[#1F1E1D]">{filteredStudents.length}</span> students
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
        )}

        {/* ══════════ VIEW 2: CARDS GRID ══════════ */}
        {viewMode === "grid" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {paginatedStudents.map((st) => (
                <Card
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#EFECE5] text-[#1F1E1D]">
                        Roll #{st.rollNo}
                      </span>
                      <span className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#2D6A4F] border border-[#A7F3D0]">
                        {st.attendanceRate}% Attendance
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#EFECE5] text-[#1F1E1D] flex items-center justify-center font-normal text-sm shrink-0">
                        {st.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-normal text-[#1F1E1D] group-hover:text-[#B45309] transition-colors leading-tight">
                          {st.name}
                        </h3>
                        <p className="text-[11px] text-[#8E8A80]">{st.className} • {st.sectionName}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-[#6E6A60] bg-[#FBF9F4] p-2.5 rounded-xl border border-[#ECE7DE] mb-2">
                      <p className="flex items-center justify-between">
                        <span className="text-[#8E8A80]">Guardian:</span>
                        <strong className="text-[#1F1E1D] font-normal">{st.parentName}</strong>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-[#8E8A80]">Phone:</span>
                        <span>{st.parentPhone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#ECE7DE] flex items-center justify-between text-xs text-[#1F1E1D]">
                    <span className="text-[#8E8A80] text-[10.5px]">{st.house}</span>
                    <span className="flex items-center gap-0.5 font-normal text-[#B45309]">
                      Profile <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Grid Pagination */}
            <div className="flex items-center justify-between px-4 py-2 bg-white rounded-full border border-[#ECE7DE] text-xs text-[#6E6A60]">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-7 px-3 rounded-full text-xs border-[#E0DBD0] text-[#1F1E1D] hover:bg-[#F3EFE6]"
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-7 px-3 rounded-full text-xs border-[#E0DBD0] text-[#1F1E1D] hover:bg-[#F3EFE6]"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── STUDENT 360° PROFILE MODAL ── */}
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="sm:max-w-[580px] rounded-3xl p-5 text-left max-h-[90vh] overflow-y-auto bg-white border border-[#ECE7DE]">
            {selectedStudent && (
              <>
                <DialogHeader className="border-b border-[#ECE7DE] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1F1E1D] text-[#F5A623] flex items-center justify-center font-normal text-lg shadow-xs">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <DialogTitle className="text-lg font-normal text-[#1F1E1D] flex items-center gap-2">
                        {selectedStudent.name}
                        <Badge variant="outline" className="text-xs font-normal border-[#E0DBD0] text-[#6E6A60]">
                          {selectedStudent.className}
                        </Badge>
                      </DialogTitle>
                      <DialogDescription className="text-xs text-[#8E8A80] mt-0.5">
                        Roll: {selectedStudent.rollNumber} • Admission ID: {selectedStudent.id}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-[#FBF9F4] border border-[#ECE7DE] text-center">
                      <span className="text-[10px] text-[#8E8A80] uppercase tracking-wider block">Attendance</span>
                      <strong className="text-base text-[#2D6A4F] font-normal">{selectedStudent.attendanceRate}%</strong>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#FEF5E7] border border-[#FDE68A] text-center">
                      <span className="text-[10px] text-[#B45309] uppercase tracking-wider block">GPA Score</span>
                      <strong className="text-base text-[#B45309] font-normal">{selectedStudent.gpa}</strong>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#FBF9F4] border border-[#ECE7DE] text-center">
                      <span className="text-[10px] text-[#8E8A80] uppercase tracking-wider block">Blood Group</span>
                      <strong className="text-base text-rose-600 font-normal">{selectedStudent.bloodGroup}</strong>
                    </div>
                  </div>

                  <div className="bg-[#FBF9F4] p-3.5 rounded-2xl border border-[#ECE7DE] space-y-1.5 text-xs text-[#1F1E1D]">
                    <p className="flex justify-between border-b border-[#ECE7DE] pb-1">
                      <span className="text-[#8E8A80]">Date of Birth:</span>
                      <span>{selectedStudent.dob}</span>
                    </p>
                    <p className="flex justify-between border-b border-[#ECE7DE] pb-1">
                      <span className="text-[#8E8A80]">Gender:</span>
                      <span>{selectedStudent.gender}</span>
                    </p>
                    <p className="flex justify-between border-b border-[#ECE7DE] pb-1">
                      <span className="text-[#8E8A80]">Address:</span>
                      <span className="truncate max-w-[240px]">{selectedStudent.address}</span>
                    </p>
                    <p className="flex justify-between border-b border-[#ECE7DE] pb-1">
                      <span className="text-[#8E8A80]">Parent / Guardian:</span>
                      <span>{selectedStudent.parentName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-[#8E8A80]">Phone:</span>
                      <span className="text-[#B45309] font-medium">{selectedStudent.parentPhone}</span>
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <Link href="/communication">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs font-normal text-[#1F1E1D] border-[#E0DBD0] hover:bg-[#F3EFE6] px-4"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1 text-[#8E8A80]" />
                        Message Parent
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => setSelectedStudent(null)}
                      className="bg-[#1F1E1D] hover:bg-[#2F2D2B] text-white rounded-full text-xs font-normal px-4"
                    >
                      Close Profile
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}
