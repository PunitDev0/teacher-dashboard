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
  BookOpenCheck,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Sparkles,
  Paperclip,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const INITIAL_ASSIGNMENTS = [
  {
    id: "asg-001",
    title: "Trigonometric Identities HW #4",
    description: "Solve problems 1 to 15 from Chapter 8 NCERT textbook. Focus on Pythagorean identities and reciprocal relations.",
    className: "Grade 10A",
    class: "Grade 10A",
    subject: "Mathematics (Standard)",
    dueDate: "27 Nov 2026",
    dueTime: "11:59 PM",
    totalStudents: 38,
    submittedCount: 34,
    evaluatedCount: 28,
    status: "Active",
    maxMarks: 20,
    attachment: "Chapter8_Trig_Identities_HW4.pdf",
    submissions: [
      { studentId: "std-001", name: "Aarav Sharma", rollNo: "04", submittedAt: "Yesterday, 06:30 PM", marks: 19, status: "Evaluated", comment: "Excellent step-by-step proofs." },
      { studentId: "std-003", name: "Rohan Varma", rollNo: "21", submittedAt: "Today, 08:15 AM", marks: 16, status: "Evaluated", comment: "Good attempt; question 14 had an algebraic error." },
      { studentId: "std-008", name: "Meera Sen", rollNo: "11", submittedAt: "Today, 10:20 AM", marks: 20, status: "Evaluated", comment: "Flawless presentation." },
      { studentId: "std-005", name: "Kabir Mehta", rollNo: "15", submittedAt: "Pending", marks: null, status: "Missing", comment: "Absent on Thursday" },
    ],
  },
  {
    id: "asg-002",
    title: "Complex Numbers Argand Plane Worksheet",
    description: "Plot roots of unity and compute conjugate modulus for exercises 4.2 questions 1 to 10.",
    className: "Grade 11B",
    class: "Grade 11B",
    subject: "Advanced Algebra",
    dueDate: "29 Nov 2026",
    dueTime: "05:00 PM",
    totalStudents: 34,
    submittedCount: 22,
    evaluatedCount: 0,
    status: "Active",
    maxMarks: 25,
    attachment: "Complex_Numbers_Argand_WS.pdf",
    submissions: [
      { studentId: "std-002", name: "Priya Nair", rollNo: "12", submittedAt: "Yesterday, 09:10 PM", marks: null, status: "Submitted", comment: "" },
      { studentId: "std-006", name: "Sanya Kapoor", rollNo: "05", submittedAt: "Today, 07:45 AM", marks: null, status: "Submitted", comment: "" },
      { studentId: "std-010", name: "Tanvi Deshmukh", rollNo: "22", submittedAt: "Today, 11:30 AM", marks: null, status: "Submitted", comment: "" },
    ],
  },
  {
    id: "asg-003",
    title: "Calculus Limits & Continuity Exercise 5.1",
    description: "Evaluate one-sided limits and prove continuity for piecewise trigonometric and rational functions.",
    className: "Grade 12A",
    class: "Grade 12A",
    subject: "Calculus & Trigonometry",
    dueDate: "22 Nov 2026",
    dueTime: "11:59 PM",
    totalStudents: 42,
    submittedCount: 42,
    evaluatedCount: 42,
    status: "Evaluated",
    maxMarks: 30,
    attachment: "Calculus_Continuity_Ex5.1.pdf",
    submissions: [
      { studentId: "std-004", name: "Ananya Iyer", rollNo: "08", submittedAt: "21 Nov 2026", marks: 30, status: "Evaluated", comment: "Outstanding analytical clarity." },
      { studentId: "std-007", name: "Dev Patel", rollNo: "19", submittedAt: "22 Nov 2026", marks: 28, status: "Evaluated", comment: "Well done on trigonometric limits." },
    ],
  },
  {
    id: "asg-004",
    title: "Coordinate Geometry Distance & Section Formula",
    description: "Solve problems 1 to 12 from NCERT exemplar on collinearity and ratio division.",
    className: "Grade 10A",
    class: "Grade 10A",
    subject: "Mathematics (Standard)",
    dueDate: "02 Dec 2026",
    dueTime: "11:59 PM",
    totalStudents: 38,
    submittedCount: 14,
    evaluatedCount: 0,
    status: "Active",
    maxMarks: 20,
    attachment: "Coord_Geometry_Ex7.1.pdf",
    submissions: [],
  },
  {
    id: "asg-005",
    title: "Probability & Bayes Theorem Problem Set",
    description: "Conditional probability theorems and independent events worksheet for board revision.",
    className: "Grade 12A",
    class: "Grade 12A",
    subject: "Calculus & Trigonometry",
    dueDate: "04 Dec 2026",
    dueTime: "11:59 PM",
    totalStudents: 42,
    submittedCount: 8,
    evaluatedCount: 0,
    status: "Active",
    maxMarks: 25,
    attachment: "Bayes_Theorem_WS.pdf",
    submissions: [],
  },
];

const PAGE_SIZE = 4;

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [evaluatingAssignment, setEvaluatingAssignment] = useState(null);

  const [form, setForm] = useState({
    title: "",
    class: "Grade 10A",
    subject: "Mathematics (Standard)",
    dueDate: "",
    dueTime: "11:59 PM",
    maxMarks: 20,
    description: "",
  });

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!form.title || !form.dueDate) return;

    const newAssignment = {
      id: `asg-${Date.now()}`,
      title: form.title,
      description: form.description,
      className: form.class,
      class: form.class,
      subject: form.subject,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      totalStudents: 38,
      submittedCount: 0,
      evaluatedCount: 0,
      status: "Active",
      maxMarks: Number(form.maxMarks) || 20,
      attachment: "Uploaded_Assignment_Doc.pdf",
      submissions: [],
    };

    setAssignments([newAssignment, ...assignments]);
    setIsCreateOpen(false);
    setForm({
      title: "",
      class: "Grade 10A",
      subject: "Mathematics (Standard)",
      dueDate: "",
      dueTime: "11:59 PM",
      maxMarks: 20,
      description: "",
    });
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === "all" || a.className === selectedClass;
      const matchesStatus = selectedStatus === "all" || a.status === selectedStatus;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [assignments, searchQuery, selectedClass, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedClass, selectedStatus]);

  const totalPages = Math.ceil(filteredAssignments.length / PAGE_SIZE) || 1;
  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAssignments.slice(start, start + PAGE_SIZE);
  }, [filteredAssignments, currentPage]);

  const totalActive = assignments.filter((a) => a.status === "Active").length;
  const totalEvaluated = assignments.filter((a) => a.status === "Evaluated").length;
  const totalSubmissions = assignments.reduce((acc, a) => acc + a.submittedCount, 0);
  const totalExpected = assignments.reduce((acc, a) => acc + a.totalStudents, 0);
  const avgSubmissionRate = Math.round((totalSubmissions / totalExpected) * 100);

  return (
    <Layout>
      <div className="space-y-4 w-full pb-8 min-w-0">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                <Sparkles className="w-3 h-3 text-[#F5A623]" />
                Homework &amp; Practice Tasks
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-normal text-[#1F1E1D] tracking-tight flex items-center gap-2">
              <BookOpenCheck className="h-6 w-6 text-[#1F1E1D]" />
              Assignments &amp; Homework
            </h1>
            <p className="text-xs font-normal text-[#78746B] mt-0.5">
              Publish class homework, monitor student submissions, and record evaluation grades
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs font-normal h-8.5 px-4 shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#F5A623]" />
              Create New Homework
            </Button>
          </div>
        </div>

        {/* ── STAT STRIP ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Active Homework</span>
            <p className="text-xl font-normal text-[#1F1E1D] mt-0.5">
              {totalActive} <span className="text-xs text-[#8E8A80] font-normal">Due soon</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Submission Rate</span>
            <p className="text-xl font-normal text-[#2D6A4F] mt-0.5">
              {avgSubmissionRate}% <span className="text-xs text-[#2D6A4F]/70 font-normal">Overall</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Total Submissions</span>
            <p className="text-xl font-normal text-[#1F1E1D] mt-0.5">
              {totalSubmissions} <span className="text-xs text-[#8E8A80] font-normal">/ {totalExpected}</span>
            </p>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-3.5 bg-white text-left">
            <span className="text-[11.5px] font-normal text-[#8E8A80]">Evaluated Tasks</span>
            <p className="text-xl font-normal text-[#B45309] mt-0.5">
              {totalEvaluated} <span className="text-xs text-[#8E8A80] font-normal">Graded</span>
            </p>
          </Card>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#ECE7DE] shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {["all", "Grade 10A", "Grade 11B", "Grade 12A"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer border shrink-0 ${
                  selectedClass === c
                    ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                    : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
                }`}
              >
                {c === "all" ? "All Classes" : c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-8.5 px-3 rounded-full border border-[#E0DBD0] bg-[#FBF9F4] text-xs text-[#1F1E1D] outline-none"
            >
              <option value="all">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Evaluated">Evaluated Only</option>
            </select>

            <div className="relative w-40 sm:w-48">
              <Search className="w-3.5 h-3.5 text-[#8E8A80] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search homework..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 h-8.5 text-xs bg-[#FBF9F4] border-[#E0DBD0] rounded-full text-[#1F1E1D]"
              />
            </div>
          </div>
        </div>

        {/* ── ASSIGNMENTS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedAssignments.map((asg) => {
            const submitPercent = Math.round((asg.submittedCount / asg.totalStudents) * 100);
            return (
              <Card
                key={asg.id}
                className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white hover:shadow-md transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs font-normal border-[#E0DBD0] text-[#78746B] bg-[#FBF9F4]">
                      {asg.className}
                    </Badge>
                    <span
                      className={`text-[10.5px] font-normal px-2.5 py-0.5 rounded-full ${
                        asg.status === "Active"
                          ? "bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]"
                          : "bg-[#EFECE5] text-[#1F1E1D] border border-[#E5E0D5]"
                      }`}
                    >
                      {asg.status}
                    </span>
                  </div>

                  <h3 className="text-base font-normal text-[#1F1E1D] mb-0.5 line-clamp-1">
                    {asg.title}
                  </h3>
                  <p className="text-xs font-normal text-[#8E8A80] mb-2">
                    {asg.subject} • Max Marks: {asg.maxMarks}
                  </p>

                  <p className="text-xs text-[#6E6A60] line-clamp-2 leading-relaxed bg-[#FBF9F4] p-2.5 rounded-xl border border-[#ECE7DE] mb-3">
                    {asg.description}
                  </p>

                  {/* Submission Progress Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span className="text-[#8E8A80] font-normal">Submissions:</span>
                      <strong className="text-[#1F1E1D] font-normal">
                        {asg.submittedCount} / {asg.totalStudents} ({submitPercent}%)
                      </strong>
                    </div>
                    <div className="w-full h-1.5 bg-[#EFECE5] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          submitPercent >= 90
                            ? "bg-[#2D6A4F]"
                            : submitPercent >= 60
                            ? "bg-[#1F1E1D]"
                            : "bg-[#F5A623]"
                        }`}
                        style={{ width: `${submitPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="pt-2 border-t border-[#ECE7DE] flex items-center justify-between text-xs text-[#8E8A80] mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8E8A80]" />
                      Due: {asg.dueDate}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] truncate max-w-[150px]">
                      <Paperclip className="w-3 h-3 text-[#8E8A80] shrink-0" />
                      {asg.attachment}
                    </span>
                  </div>

                  <Button
                    onClick={() => setEvaluatingAssignment(asg)}
                    className="w-full bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs font-normal h-8 shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5 text-[#F5A623]" />
                    Evaluate Submissions ({asg.submittedCount})
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* ── PAGINATION CONTROLS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 bg-white rounded-2xl border border-[#ECE7DE] shadow-xs text-xs text-[#78746B]">
          <div>
            Showing{" "}
            <span className="font-medium text-[#1F1E1D]">
              {filteredAssignments.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium text-[#1F1E1D]">
              {Math.min(currentPage * PAGE_SIZE, filteredAssignments.length)}
            </span>{" "}
            of <span className="font-medium text-[#1F1E1D]">{filteredAssignments.length}</span> assignments
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2.5 rounded-full text-xs border-[#E0DBD0] hover:bg-[#F3EFE6]"
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
                    : "text-[#6E6A60] hover:bg-[#F3EFE6]"
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
              className="h-7 px-2.5 rounded-full text-xs border-[#E0DBD0] hover:bg-[#F3EFE6]"
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </div>
        </div>

        {/* ── CREATE NEW ASSIGNMENT MODAL ── */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-3xl text-left max-h-[90vh] overflow-y-auto border-[#ECE7DE] bg-white">
            <DialogHeader>
              <DialogTitle className="text-base font-normal text-[#1F1E1D] flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-[#F5A623]" />
                Create New Homework Assignment
              </DialogTitle>
              <DialogDescription className="text-xs text-[#8E8A80]">
                Publish assignment tasks to students portal.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateAssignment} className="space-y-3 pt-1">
              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">Assignment Title</Label>
                <Input
                  required
                  placeholder="e.g. Quadratic Equations Practice Set #3"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">Class &amp; Section</Label>
                  <select
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full text-xs rounded-xl border border-[#E0DBD0] bg-[#FBF9F4] h-8.5 px-3 mt-1 outline-none text-[#1F1E1D]"
                  >
                    <option value="Grade 10A">Grade 10 - Section A</option>
                    <option value="Grade 11B">Grade 11 - Section B</option>
                    <option value="Grade 12A">Grade 12 - Section A</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">Subject</Label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">Due Date</Label>
                  <Input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                  />
                </div>

                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">Max Marks</Label>
                  <Input
                    type="number"
                    value={form.maxMarks}
                    onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
                    className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">Instructions</Label>
                <Textarea
                  rows={2}
                  placeholder="Specify problem numbers or chapters..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-full text-xs border-[#E0DBD0] hover:bg-[#F3EFE6]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs shadow-xs px-4"
                >
                  Publish Homework
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ── SUBMISSION EVALUATION MODAL ── */}
        <Dialog open={!!evaluatingAssignment} onOpenChange={() => setEvaluatingAssignment(null)}>
          <DialogContent className="sm:max-w-[580px] rounded-3xl text-left max-h-[90vh] overflow-y-auto border-[#ECE7DE] bg-white">
            {evaluatingAssignment && (
              <>
                <DialogHeader className="border-b border-[#ECE7DE] pb-3">
                  <DialogTitle className="text-base font-normal text-[#1F1E1D] flex items-center justify-between">
                    <span>{evaluatingAssignment.title}</span>
                    <Badge variant="outline" className="text-xs font-normal border-[#E0DBD0] text-[#78746B] bg-[#FBF9F4]">
                      Max: {evaluatingAssignment.maxMarks} Marks
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#8E8A80]">
                    {evaluatingAssignment.className} • Due on {evaluatingAssignment.dueDate}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-2">
                  <h4 className="text-xs font-normal uppercase tracking-wider text-[#8E8A80] mb-2">
                    Student Submissions &amp; Grading
                  </h4>

                  <div className="divide-y divide-[#ECE7DE] border border-[#ECE7DE] rounded-2xl overflow-hidden text-xs max-h-[300px] overflow-y-auto bg-white">
                    {evaluatingAssignment.submissions?.map((sub) => (
                      <div key={sub.studentId} className="p-3 flex items-center justify-between hover:bg-[#FBF9F4]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10.5px] px-1.5 py-0.2 rounded bg-[#EFECE5] text-[#1F1E1D]">
                              #{sub.rollNo}
                            </span>
                            <span className="font-medium text-[#1F1E1D]">{sub.name}</span>
                          </div>
                          <p className="text-[11px] text-[#8E8A80] mt-0.5">
                            Submitted: {sub.submittedAt} {sub.comment && `• "${sub.comment}"`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {sub.marks !== null ? (
                            <span className="font-mono text-[#2D6A4F] font-medium bg-[#E8F5E9] px-2 py-0.5 rounded-md border border-[#C8E6C9]">
                              {sub.marks} / {evaluatingAssignment.maxMarks}
                            </span>
                          ) : (
                            <span className="text-[10.5px] text-[#B45309] bg-[#FEF5E7] px-2 py-0.5 rounded-md border border-[#FDE68A]">
                              Needs Grading
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter className="pt-2 border-t border-[#ECE7DE]">
                  <Button
                    size="sm"
                    onClick={() => setEvaluatingAssignment(null)}
                    className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs px-4"
                  >
                    Close Evaluation
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}
