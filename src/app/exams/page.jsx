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
  FileCheck2,
  GraduationCap,
  Users,
  TrendingUp,
  X,
  Calendar,
  BookOpen,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  Download,
  Sparkles,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DEMO_TEACHER_ALLOCATIONS = [
  { _id: "alloc-1", classId: { _id: "cls-10a", name: "Grade 10" }, sectionName: "Section A", subjectId: { _id: "sub-1", name: "Mathematics (Standard)" } },
  { _id: "alloc-2", classId: { _id: "cls-11b", name: "Grade 11" }, sectionName: "Section B", subjectId: { _id: "sub-2", name: "Advanced Algebra" } },
  { _id: "alloc-3", classId: { _id: "cls-12a", name: "Grade 12" }, sectionName: "Section A", subjectId: { _id: "sub-3", name: "Calculus & Trigonometry" } },
];

const DEMO_EXAMS = [
  {
    _id: "exam-001",
    name: "Mid-Term Examination 2026",
    classId: "cls-10a",
    className: "Grade 10 (Section A)",
    term: "Term 1",
    session: "2026-2027",
    date: "2026-11-28",
    totalMarks: 100,
    passingMarks: 40,
    subjectName: "Mathematics (Standard)",
    status: "Upcoming",
  },
  {
    _id: "exam-002",
    name: "Unit Test 2: Algebra & Functions",
    classId: "cls-11b",
    className: "Grade 11 (Section B)",
    term: "Term 1",
    session: "2026-2027",
    date: "2026-11-30",
    totalMarks: 50,
    passingMarks: 20,
    subjectName: "Advanced Algebra",
    status: "Active",
  },
  {
    _id: "exam-003",
    name: "Pre-Board Mock Exam 1",
    classId: "cls-12a",
    className: "Grade 12 (Section A)",
    term: "Term 1",
    session: "2026-2027",
    date: "2026-12-05",
    totalMarks: 100,
    passingMarks: 40,
    subjectName: "Calculus & Trigonometry",
    status: "Scheduled",
  },
];

const DEMO_EXAM_STUDENTS = [
  { id: "std-001", classId: "cls-10a", name: "Aarav Sharma", rollNo: "04", className: "Grade 10", sectionName: "Section A" },
  { id: "std-003", classId: "cls-10a", name: "Rohan Varma", rollNo: "21", className: "Grade 10", sectionName: "Section A" },
  { id: "std-008", classId: "cls-10a", name: "Meera Sen", rollNo: "11", className: "Grade 10", sectionName: "Section A" },
  { id: "std-002", classId: "cls-11b", name: "Priya Nair", rollNo: "12", className: "Grade 11", sectionName: "Section B" },
  { id: "std-006", classId: "cls-11b", name: "Sanya Kapoor", rollNo: "05", className: "Grade 11", sectionName: "Section B" },
  { id: "std-010", classId: "cls-11b", name: "Tanvi Deshmukh", rollNo: "22", className: "Grade 11", sectionName: "Section B" },
  { id: "std-004", classId: "cls-12a", name: "Ananya Iyer", rollNo: "08", className: "Grade 12", sectionName: "Section A" },
  { id: "std-007", classId: "cls-12a", name: "Dev Patel", rollNo: "19", className: "Grade 12", sectionName: "Section A" },
];

const MODAL_PAGE_SIZE = 5;

export default function ExamsPage() {
  const [exams, setExams] = useState(DEMO_EXAMS);
  const [students, setStudents] = useState(DEMO_EXAM_STUDENTS);
  const [allocations, setAllocations] = useState(DEMO_TEACHER_ALLOCATIONS);

  const [selectedExam, setSelectedExam] = useState(null);
  const [modalPage, setModalPage] = useState(1);
  const [marksMap, setMarksMap] = useState({
    "exam-001-std-001": 92,
    "exam-001-std-003": 84,
    "exam-001-std-008": 96,
    "exam-002-std-002": 44,
    "exam-002-std-006": 41,
    "exam-002-std-010": 46,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const handleMarkInput = (examId, studentId, value, max) => {
    const num = value === "" ? "" : Math.max(0, Math.min(max, Number(value) || 0));
    setMarksMap((prev) => ({
      ...prev,
      [`${examId}-${studentId}`]: num,
    }));
  };

  const handleSaveMarks = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccessMsg("Marks saved to official gradebook successfully!");
      setTimeout(() => setSaveSuccessMsg(""), 3000);
    }, 400);
  };

  const handleDownloadMarksheet = (exam) => {
    const examStudents = students.filter((s) => s.classId === exam.classId);
    let csvContent = "data:text/csv;charset=utf-8,Roll No,Student Name,Class,Section,Max Marks,Marks Obtained,Grade,Status\n";
    examStudents.forEach((st) => {
      const mark = marksMap[`${exam._id}-${st.id}`] ?? Math.floor(75 + ((st.name.charCodeAt(0) * 7) % 23));
      const grade = mark >= 90 ? "A+" : mark >= 80 ? "A" : mark >= 70 ? "B+" : mark >= 60 ? "B" : "C";
      const status = mark >= (exam.passingMarks || 40) ? "Passed" : "Needs Improvement";
      csvContent += `${st.rollNo || ""},"${st.name}","${st.className}","${st.sectionName}",${exam.totalMarks},${mark},${grade},${status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exam.name.replace(/\s+/g, "_")}_Marksheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Modal Students Pagination
  const examStudentsList = useMemo(() => {
    if (!selectedExam) return [];
    return students.filter((s) => s.classId === selectedExam.classId);
  }, [selectedExam, students]);

  const modalTotalPages = Math.ceil(examStudentsList.length / MODAL_PAGE_SIZE) || 1;
  const paginatedModalStudents = useMemo(() => {
    const start = (modalPage - 1) * MODAL_PAGE_SIZE;
    return examStudentsList.slice(start, start + MODAL_PAGE_SIZE);
  }, [examStudentsList, modalPage]);

  return (
    <Layout>
      <div className="space-y-4 w-full pb-8 min-w-0">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                <Sparkles className="w-3 h-3 text-[#F5A623]" />
                Academic Evaluation Cycle
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-normal text-[#1F1E1D] tracking-tight flex items-center gap-2">
              <FileCheck2 className="h-6 w-6 text-[#1F1E1D]" />
              Exams &amp; Gradebook
            </h1>
            <p className="text-xs font-normal text-[#78746B] mt-0.5">
              Class examination schedules, marks entry, automated grade calculation, and marksheet export
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleDownloadMarksheet(exams[0])}
              className="rounded-full border-[#E0DBD0] text-[#1F1E1D] hover:bg-[#F3EFE6] text-xs font-normal h-8.5 px-4 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-[#8E8A80]" />
              Export Term Marksheet (.CSV)
            </Button>
          </div>
        </div>

        {/* ── STAT STRIP ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Scheduled Exams</span>
            <p className="text-xl font-normal text-[#1F1E1D] mt-0.5">
              {exams.length} <span className="text-xs text-[#8E8A80]">Active</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Class Average</span>
            <p className="text-xl font-normal text-[#B45309] mt-0.5">
              88.4% <span className="text-xs text-[#2D6A4F] font-normal">High</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Top Evaluation</span>
            <p className="text-xl font-normal text-[#2D6A4F] mt-0.5">
              98 / 100 <span className="text-xs text-[#8E8A80]">Aarav (Grade 10)</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Pass Percentage</span>
            <p className="text-xl font-normal text-[#2D6A4F] mt-0.5">
              100% <span className="text-xs text-[#2D6A4F]/70 font-normal">Cleared</span>
            </p>
          </Card>
        </div>

        {/* ── TEACHING SUBJECT ALLOCATIONS ── */}
        <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white text-left">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#ECE7DE]">
            <h3 className="text-xs font-normal text-[#1F1E1D] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#F5A623]" />
              Your Teaching Allocations
            </h3>
            <span className="text-[11px] font-normal text-[#8E8A80]">
              3 Classes Assigned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {allocations.map((alloc) => (
              <div
                key={alloc._id}
                className="p-3 rounded-2xl border border-[#ECE7DE] bg-[#FBF9F4] hover:bg-[#F3EFE6] transition-all flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-medium text-[#1F1E1D]">
                    {alloc.classId.name} ({alloc.sectionName})
                  </span>
                  <p className="text-[11.5px] font-normal text-[#78746B] mt-0.5">
                    {alloc.subjectId.name}
                  </p>
                </div>
                <BookOpen className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
              </div>
            ))}
          </div>
        </Card>

        {/* ── SCHEDULED EXAMS CARDS ── */}
        <div className="space-y-3 text-left">
          <h2 className="text-base font-normal text-[#1F1E1D] flex items-center gap-2">
            <GraduationCap className="h-4.5 w-4.5 text-[#F5A623]" />
            Examinations Schedule &amp; Grade Entry
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((exam) => {
              const examStudents = students.filter((s) => s.classId === exam.classId);
              return (
                <Card
                  key={exam._id}
                  className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs font-normal border-[#E0DBD0] text-[#78746B] bg-[#FBF9F4]">
                        {exam.term}
                      </Badge>
                      <span className="text-xs font-normal text-[#8E8A80] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#F5A623]" />
                        {exam.date}
                      </span>
                    </div>

                    <h3 className="text-base font-normal text-[#1F1E1D] mb-0.5 leading-snug">
                      {exam.name}
                    </h3>
                    <p className="text-xs font-normal text-[#B45309] mb-3">
                      {exam.subjectName} • {exam.className}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#FBF9F4] p-2.5 rounded-xl border border-[#ECE7DE] mb-3">
                      <div>
                        <span className="text-[#8E8A80] block text-[10.5px]">Enrolled:</span>
                        <strong className="text-[#1F1E1D] font-normal">{examStudents.length} Students</strong>
                      </div>
                      <div>
                        <span className="text-[#8E8A80] block text-[10.5px]">Max Marks:</span>
                        <strong className="text-[#1F1E1D] font-normal">{exam.totalMarks} Marks</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#ECE7DE] flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadMarksheet(exam)}
                      className="flex-1 rounded-full text-xs font-normal border-[#E0DBD0] hover:bg-[#F3EFE6] text-[#1F1E1D] h-8"
                    >
                      <Download className="w-3 h-3 mr-1 text-[#8E8A80]" />
                      Marksheet
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedExam(exam);
                        setModalPage(1);
                      }}
                      className="flex-1 bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs font-normal h-8 shadow-xs cursor-pointer"
                    >
                      Enter Marks
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── MARKS ENTRY MODAL (SCREEN BOUND & PAGINATED) ── */}
        {selectedExam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl bg-white text-left p-5 border-[#ECE7DE]">
              <div className="flex items-start justify-between pb-3 border-b border-[#ECE7DE] mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant="outline" className="text-xs font-normal border-[#E0DBD0] text-[#78746B] bg-[#FBF9F4]">
                      {selectedExam.className}
                    </Badge>
                    <span className="text-xs text-[#8E8A80]">•</span>
                    <span className="text-xs text-[#B45309] font-normal">
                      Max Marks: {selectedExam.totalMarks}
                    </span>
                  </div>
                  <h3 className="text-base font-normal text-[#1F1E1D]">
                    {selectedExam.name} — Marks Entry
                  </h3>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedExam(null)}
                  className="rounded-full w-7 h-7 p-0 text-[#8E8A80] hover:bg-[#F3EFE6]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {saveSuccessMsg && (
                <div className="mb-3 p-2.5 bg-[#E8F5E9] text-[#2D6A4F] text-xs rounded-xl border border-[#C8E6C9] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  {saveSuccessMsg}
                </div>
              )}

              {/* Marks Table */}
              <div className="border border-[#ECE7DE] rounded-2xl overflow-hidden mb-3">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#FBF9F4] text-[#78746B] uppercase border-b border-[#ECE7DE]">
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3 w-28">Marks</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE7DE] text-[#1F1E1D]">
                    {paginatedModalStudents.map((st) => {
                      const currentMark = marksMap[`${selectedExam._id}-${st.id}`] ?? "";
                      const numMark = Number(currentMark) || 0;
                      const grade =
                        numMark >= 90 ? "A+" : numMark >= 80 ? "A" : numMark >= 70 ? "B+" : numMark >= 60 ? "B" : "C";
                      const isPass = numMark >= selectedExam.passingMarks;

                      return (
                        <tr key={st.id} className="hover:bg-[#FBF9F4]">
                          <td className="py-2.5 px-3 font-mono text-[#8E8A80]">#{st.rollNo}</td>
                          <td className="py-2.5 px-3 font-normal text-[#1F1E1D]">{st.name}</td>
                          <td className="py-2.5 px-3">
                            <Input
                              type="number"
                              min={0}
                              max={selectedExam.totalMarks}
                              value={currentMark}
                              onChange={(e) =>
                                handleMarkInput(selectedExam._id, st.id, e.target.value, selectedExam.totalMarks)
                              }
                              className="h-7 w-20 text-xs font-mono rounded-lg border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="font-mono text-xs font-normal px-2 py-0.5 rounded bg-[#EFECE5] text-[#1F1E1D]">
                              {grade}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full ${
                                isPass
                                  ? "bg-[#E8F5E9] text-[#2D6A4F] border border-[#C8E6C9]"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {isPass ? "Passed" : "Needs Retest"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Modal Pagination */}
              <div className="flex items-center justify-between px-2 py-1.5 text-xs text-[#78746B] mb-3">
                <span>
                  Showing {(modalPage - 1) * MODAL_PAGE_SIZE + 1} to{" "}
                  {Math.min(modalPage * MODAL_PAGE_SIZE, examStudentsList.length)} of {examStudentsList.length}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={modalPage === 1}
                    onClick={() => setModalPage((p) => Math.max(1, p - 1))}
                    className="h-6 px-2.5 text-[11px] rounded-full border-[#E0DBD0] hover:bg-[#F3EFE6]"
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={modalPage === modalTotalPages}
                    onClick={() => setModalPage((p) => Math.min(modalTotalPages, p + 1))}
                    className="h-6 px-2.5 text-[11px] rounded-full border-[#E0DBD0] hover:bg-[#F3EFE6]"
                  >
                    Next
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-[#ECE7DE]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadMarksheet(selectedExam)}
                  className="rounded-full text-xs font-normal text-[#1F1E1D] border-[#E0DBD0] h-8 px-3 hover:bg-[#F3EFE6]"
                >
                  <Download className="w-3 h-3 mr-1 text-[#8E8A80]" />
                  CSV
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedExam(null)}
                    className="rounded-full text-xs h-8 px-4 border-[#E0DBD0] hover:bg-[#F3EFE6]"
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveMarks}
                    disabled={isSaving}
                    className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs h-8 px-4 shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3 h-3 text-[#F5A623]" />
                    {isSaving ? "Saving..." : "Save Marks"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </Layout>
  );
}
