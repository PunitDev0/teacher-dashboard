"use client";

import { useState } from "react";
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
  BookOpen,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  FileText,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const INITIAL_DIARY_ENTRIES = [
  {
    id: "lp-01",
    date: "23 Nov 2026",
    class: "Grade 10A",
    subject: "Mathematics",
    period: "Period 1 (08:00 - 08:45 AM)",
    chapter: "Chapter 8: Introduction to Trigonometry",
    topic: "Exercise 8.2 Solutions - Specific Trigonometric Ratios (30°, 45°, 60°)",
    methodology: "Smart Board Presentation & Blackboard Derivation",
    homework: "Complete Exercise 8.2 Q3 and Q4 in homework register.",
    status: "Completed",
    remarks: "Students solved standard angle values quickly; Q4 needs revision.",
  },
  {
    id: "lp-02",
    date: "23 Nov 2026",
    class: "Grade 11B",
    subject: "Advanced Algebra",
    period: "Period 2 (08:45 - 09:30 AM)",
    chapter: "Chapter 4: Complex Numbers & Quadratic Equations",
    topic: "Modulus and Conjugate of a Complex Number with geometric plotting",
    methodology: "GeoGebra Graphing Tool Demonstration",
    homework: "Practice worksheet #6 questions 1 to 8.",
    status: "Completed",
    remarks: "Good engagement in visual representation of Argand planes.",
  },
  {
    id: "lp-03",
    date: "24 Nov 2026",
    class: "Grade 12A",
    subject: "Calculus & Trigonometry",
    period: "Period 4 (10:35 - 11:20 AM)",
    chapter: "Chapter 5: Continuity and Differentiability",
    topic: "Derivatives of Inverse Trigonometric Functions & Chain Rule applications",
    methodology: "Step-by-step whiteboard problem dissection",
    homework: "Prepare for 15-minute diagnostic test on product & quotient rules.",
    status: "Planned",
    remarks: "Lesson plan approved by Academic Coordinator.",
  },
  {
    id: "lp-04",
    date: "24 Nov 2026",
    class: "Grade 9C",
    subject: "Geometry Workshop",
    period: "Period 3 (09:30 - 10:15 AM)",
    chapter: "Chapter 6: Lines and Angles",
    topic: "Parallel lines and transversal angles theorem proof",
    methodology: "Interactive student pair construction activity",
    homework: "NCERT Exercise 6.1 questions 1 to 5.",
    status: "Planned",
    remarks: "Remind students to bring compasses and protractors.",
  },
  {
    id: "lp-05",
    date: "22 Nov 2026",
    class: "Grade 10A",
    subject: "Mathematics",
    period: "Period 3 (09:30 - 10:15 AM)",
    chapter: "Chapter 8: Introduction to Trigonometry",
    topic: "Trigonometric Identities Proof (sin²θ + cos²θ = 1)",
    methodology: "Derivation via Pythagoras Theorem on Smart Display",
    homework: "Example 13 & 14 from NCERT textbook.",
    status: "Completed",
    remarks: "Clear conceptual clarity achieved across majority of students.",
  },
  {
    id: "lp-06",
    date: "21 Nov 2026",
    class: "Grade 11B",
    subject: "Advanced Algebra",
    period: "Period 1 (08:00 - 08:45 AM)",
    chapter: "Chapter 3: Trigonometric Functions",
    topic: "Domain and Range of Inverse Circular Functions",
    methodology: "Interactive graphical plots and curve tracing",
    homework: "Worksheet 3.2 problems 1 through 10.",
    status: "Completed",
    remarks: "Quick oral quiz conducted during last 10 minutes.",
  },
  {
    id: "lp-07",
    date: "25 Nov 2026",
    class: "Grade 12A",
    subject: "Calculus & Trigonometry",
    period: "Period 2 (08:45 - 09:30 AM)",
    chapter: "Chapter 6: Application of Derivatives",
    topic: "Rate of change of quantities and spherical volume expansion rates",
    methodology: "Real-world physics modeling & calculus integration",
    homework: "Exercise 6.1 questions 1 to 6.",
    status: "Planned",
    remarks: "Scheduled for smart lab simulation session.",
  },
  {
    id: "lp-08",
    date: "25 Nov 2026",
    class: "Grade 10A",
    subject: "Mathematics",
    period: "Period 5 (11:20 - 12:05 PM)",
    chapter: "Chapter 9: Some Applications of Trigonometry",
    topic: "Heights and Distances - Angle of Elevation & Depression",
    methodology: "Outdoor clinometer measurement demo in school courtyard",
    homework: "Record measurements of flagpole height in project diary.",
    status: "Planned",
    remarks: "Lab assistants instructed to prepare 10 clinometer sets.",
  },
];

export default function LessonPlanPage() {
  const [entries, setEntries] = useState(INITIAL_DIARY_ENTRIES);
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    class: "Grade 10A",
    subject: "Mathematics",
    period: "Period 1 (08:00 - 08:45 AM)",
    chapter: "",
    topic: "",
    methodology: "Whiteboard & Smart Screen",
    homework: "",
    remarks: "",
  });

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!form.chapter || !form.topic) return;

    const newEntry = {
      id: `lp-${Date.now()}`,
      date: form.date,
      class: form.class,
      subject: form.subject,
      period: form.period,
      chapter: form.chapter,
      topic: form.topic,
      methodology: form.methodology,
      homework: form.homework || "None assigned",
      status: "Completed",
      remarks: form.remarks || "Topic covered as per syllabus timeline.",
    };

    setEntries([newEntry, ...entries]);
    setIsModalOpen(false);
    setCurrentPage(1);
    setForm({
      date: new Date().toISOString().split("T")[0],
      class: "Grade 10A",
      subject: "Mathematics",
      period: "Period 1 (08:00 - 08:45 AM)",
      chapter: "",
      topic: "",
      methodology: "Whiteboard & Smart Screen",
      homework: "",
      remarks: "",
    });
  };

  const filteredEntries = entries.filter((e) => {
    const matchesClass = selectedClass === "all" || e.class === selectedClass;
    const matchesSearch =
      e.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.class.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const totalPages = Math.ceil(filteredEntries.length / PAGE_SIZE) || 1;
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const startEntryIdx = (currentPage - 1) * PAGE_SIZE;
  const endEntryIdx = Math.min(startEntryIdx + PAGE_SIZE, filteredEntries.length);

  return (
    <Layout>
      <div className="space-y-5 w-full pb-8 min-w-0">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                <Sparkles className="w-3 h-3 text-[#F5A623]" />
                Teacher Academic Logbook
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#1F1E1D] tracking-tight flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-[#1F1E1D]" />
              Daily Lesson Diary &amp; Plans
            </h1>
            <p className="text-xs sm:text-sm font-normal text-[#78746B] mt-1">
              Period-wise syllabus progression, classroom teaching logs, and learning outcomes
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs font-normal h-9 px-4 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#F5A623]" />
              New Lesson Diary Entry
            </Button>
          </div>
        </div>

        {/* ── TOP STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white text-left">
            <span className="text-xs font-normal text-[#8E8A80]">Total Logged Sessions</span>
            <p className="text-2xl font-normal text-[#1F1E1D] mt-1">84 Periods</p>
          </Card>
          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white text-left">
            <span className="text-xs font-normal text-[#8E8A80]">Syllabus Pacing</span>
            <p className="text-2xl font-normal text-[#2D6A4F] mt-1">On Schedule</p>
          </Card>
          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white text-left">
            <span className="text-xs font-normal text-[#8E8A80]">Class 10 Math Completion</span>
            <p className="text-2xl font-normal text-[#B45309] mt-1">74% Done</p>
          </Card>
          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white text-left">
            <span className="text-xs font-normal text-[#8E8A80]">Class 12 Calculus Completion</span>
            <p className="text-2xl font-normal text-[#1F1E1D] mt-1">81% Done</p>
          </Card>
        </div>

        {/* ── FILTERS & SEARCH ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#ECE7DE] shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {["all", "Grade 10A", "Grade 11B", "Grade 12A", "Grade 9C"].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedClass(c);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer border ${
                  selectedClass === c
                    ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                    : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
                }`}
              >
                {c === "all" ? "All Classes" : c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8E8A80] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search chapter or topic..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-8.5 text-xs bg-[#FBF9F4] rounded-full border-[#E0DBD0] text-[#1F1E1D]"
            />
          </div>
        </div>

        {/* ── DIARY ENTRIES GRID ── */}
        {paginatedEntries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#ECE7DE] p-6">
            <BookOpen className="w-10 h-10 text-[#8E8A80] mx-auto mb-2" />
            <p className="text-sm font-normal text-[#1F1E1D]">No lesson diary entries found</p>
            <p className="text-xs text-[#8E8A80] mt-1">Try resetting search or change class filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedEntries.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border-[#ECE7DE] shadow-xs p-5 text-left flex flex-col justify-between hover:shadow-md transition-all bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-normal border-[#E0DBD0] text-[#78746B] bg-[#FBF9F4]">
                        {item.class}
                      </Badge>
                      <span className="text-xs font-normal text-[#8E8A80]">•</span>
                      <span className="text-xs font-normal text-[#78746B]">
                        {item.period}
                      </span>
                    </div>
                    <span
                      className={`text-[10.5px] font-normal px-2.5 py-0.5 rounded-full ${
                        item.status === "Completed"
                          ? "bg-[#E8F5E9] text-[#2D6A4F] border border-[#C8E6C9]"
                          : "bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-base font-normal text-[#1F1E1D] mb-1">
                    {item.chapter}
                  </h3>
                  <p className="text-xs font-normal text-[#B45309] mb-3">
                    Topic: {item.topic}
                  </p>

                  <div className="space-y-2 text-xs text-[#6E6A60] bg-[#FBF9F4] p-3.5 rounded-xl border border-[#ECE7DE] mb-4">
                    <p>
                      <strong className="text-[#1F1E1D] font-normal">Methodology:</strong>{" "}
                      {item.methodology}
                    </p>
                    <p>
                      <strong className="text-[#1F1E1D] font-normal">Homework Given:</strong>{" "}
                      {item.homework}
                    </p>
                    {item.remarks && (
                      <p className="text-[#8E8A80] italic">
                        <strong className="text-[#6E6A60] font-normal">Observation:</strong>{" "}
                        {item.remarks}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ECE7DE] flex items-center justify-between text-[11px] text-[#8E8A80]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#F5A623]" />
                    Date: {item.date}
                  </span>
                  <span>Ref: #{item.id}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── PAGINATION CONTROLS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#ECE7DE] shadow-xs text-xs text-[#78746B]">
          <div>
            Showing{" "}
            <span className="font-medium text-[#1F1E1D]">
              {filteredEntries.length === 0 ? 0 : startEntryIdx + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-[#1F1E1D]">{endEntryIdx}</span> of{" "}
            <span className="font-medium text-[#1F1E1D]">{filteredEntries.length}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 rounded-full px-3 text-xs border-[#E0DBD0] hover:bg-[#F3EFE6] disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-full text-xs p-0 font-normal ${
                  currentPage === page
                    ? "bg-[#1F1E1D] hover:bg-[#33312E] text-white border-[#1F1E1D]"
                    : "border-[#E0DBD0] text-[#6E6A60] hover:bg-[#F3EFE6]"
                }`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 rounded-full px-3 text-xs border-[#E0DBD0] hover:bg-[#F3EFE6] disabled:opacity-40"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* ── MODAL: CREATE LESSON ENTRY ── */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[540px] rounded-3xl border-[#ECE7DE] bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-normal text-[#1F1E1D] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#F5A623]" />
                Log Daily Classroom Diary
              </DialogTitle>
              <DialogDescription className="text-xs text-[#8E8A80]">
                Record topics covered and classroom activities for academic audit and syllabus tracker.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEntry} className="space-y-4 pt-2 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">Date</Label>
                  <Input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                  />
                </div>
                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">Class &amp; Section</Label>
                  <select
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full text-xs rounded-xl border border-[#E0DBD0] bg-[#FBF9F4] h-9 px-3 mt-1 outline-none text-[#1F1E1D]"
                  >
                    <option value="Grade 10A">Grade 10 - Section A</option>
                    <option value="Grade 11B">Grade 11 - Section B</option>
                    <option value="Grade 12A">Grade 12 - Section A</option>
                    <option value="Grade 9C">Grade 9 - Section C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">Period Slot</Label>
                  <select
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    className="w-full text-xs rounded-xl border border-[#E0DBD0] bg-[#FBF9F4] h-9 px-3 mt-1 outline-none text-[#1F1E1D]"
                  >
                    <option value="Period 1 (08:00 - 08:45 AM)">Period 1 (08:00 - 08:45 AM)</option>
                    <option value="Period 2 (08:45 - 09:30 AM)">Period 2 (08:45 - 09:30 AM)</option>
                    <option value="Period 3 (09:30 - 10:15 AM)">Period 3 (09:30 - 10:15 AM)</option>
                    <option value="Period 4 (10:35 - 11:20 AM)">Period 4 (10:35 - 11:20 AM)</option>
                    <option value="Period 5 (11:20 - 12:05 PM)">Period 5 (11:20 - 12:05 PM)</option>
                    <option value="Period 6 (12:05 - 12:50 PM)">Period 6 (12:05 - 12:50 PM)</option>
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

              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">Chapter Name / Unit</Label>
                <Input
                  required
                  placeholder="e.g. Chapter 8: Introduction to Trigonometry"
                  value={form.chapter}
                  onChange={(e) => setForm({ ...form, chapter: e.target.value })}
                  className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                />
              </div>

              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">Specific Topic &amp; Sub-topics Covered</Label>
                <Input
                  required
                  placeholder="e.g. Exercise 8.2 Questions 1-5, Proof of Trigonometric Table values"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                />
              </div>

              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">Homework / Practice Task Assigned</Label>
                <Input
                  placeholder="e.g. Solve textbook problems 6 to 10 in HW notebook"
                  value={form.homework}
                  onChange={(e) => setForm({ ...form, homework: e.target.value })}
                  className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                />
              </div>

              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">Classroom Observation / Doubts Noted</Label>
                <Textarea
                  rows={2}
                  placeholder="Optional observation about student comprehension or pacing..."
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full text-xs border-[#E0DBD0] hover:bg-[#F3EFE6]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs shadow-xs px-4"
                >
                  Save to Diary
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}
