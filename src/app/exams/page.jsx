"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard-header";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  GraduationCap,
  Users,
  TrendingUp,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  UserCheck,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const PAGE_SIZE = 10;

/* ------------------------------------------------------------------ */
/*  Helper – get institutionId from JWT                               */
/* ------------------------------------------------------------------ */
function getInstitutionIdFromToken() {
  try {
    const token = localStorage.getItem("staffToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.InstitutionId || null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Axios Instance with Auth                                          */
/* ------------------------------------------------------------------ */
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}api`,
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("staffToken");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */
export default function TeacherExamsPage() {
  const [exams, setExams] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [students, setStudents] = useState([]);
  const [existingMarks, setExistingMarks] = useState({});
  const [teacherAllocations, setTeacherAllocations] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSection, setFilterSection] = useState("all");

  /* ---------- Data fetching ---------- */
  const fetchExams = async () => {
    try {
      const { data } = await api.get("/staff/portal/exams");
      if (data.success) setExams(data.data || []);
    } catch {
      toast.error("Failed to load exams");
    }
  };

  const fetchSchedules = async () => {
    try {
      const { data } = await api.get("/staff/portal/exams-schedules");
      if (data.success) setSchedules(data.data || []);
    } catch {
      toast.error("Failed to load schedules");
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/staff/portal/students");
      if (data.success) setStudents(data.students || []);
    } catch {
      toast.error("Failed to load students");
    }
  };

  const fetchExistingMarks = async () => {
    try {
      const { data } = await api.get("/staff/portal/exams-marks");
      if (data.success) {
        const map = {};
        data.data.forEach((m) => {
          const key = `${m.examId}-${m.subject}-${m.studentId}`;
          map[key] = m.marksObtained;
        });
        setExistingMarks(map);
      }
    } catch {}
  };

  const fetchTeacherAllocations = async () => {
    const institutionId = getInstitutionIdFromToken();
    if (!institutionId) {
      toast.error("Institution not found in token");
      return;
    }

    try {
      const { data } = await api.get(`/subject-allocation?institutionId=${institutionId}`);
      if (data.success) setTeacherAllocations(data.data || []);
      else toast.error(data.message || "Failed to load allocations");
    } catch {
      toast.error("Failed to load your class allocations");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchTeacherAllocations(),
        fetchExams(),
        fetchSchedules(),
        fetchStudents(),
        fetchExistingMarks(),
      ]);
      setLoading(false);
    };
    init();
  }, []);

  /* ---------- Derived Data ---------- */
  const filteredStudents = useMemo(() => {
    if (!selectedExam) return [];

    let list = students.filter((s) => s.classId === selectedExam.classId);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q)
      );
    }

    if (filterSection !== "all") {
      list = list.filter((s) => s.sectionName === filterSection);
    }

    return list;
  }, [students, selectedExam, searchQuery, filterSection]);

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, page]);

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);

  const autoSubject = useMemo(() => {
    if (!selectedExam) return null;

    const classAlloc = teacherAllocations.find(
      (a) => a.classId._id === selectedExam.classId
    );
    if (!classAlloc) return null;

    const subjectName = classAlloc.subjectId.name;
    const isScheduled = schedules.some(
      (s) => s.examId === selectedExam._id && s.subject === subjectName
    );

    return isScheduled ? subjectName : null;
  }, [selectedExam, teacherAllocations, schedules]);

  const uniqueSections = useMemo(() => {
    if (!selectedExam) return [];
    const secs = students
      .filter((s) => s.classId === selectedExam.classId)
      .map((s) => s.sectionName)
      .filter(Boolean);
    return [...new Set(secs)].sort();
  }, [students, selectedExam]);

  /* ---------- Handlers ---------- */
  const handleMarkChange = useCallback((studentId, value) => {
    if (!autoSubject) return;
    const num = value === "" ? "" : Math.max(0, Math.min(100, Number(value) || 0));
    const key = `${selectedExam._id}-${autoSubject}-${studentId}`;
    setMarks((prev) => ({ ...prev, [key]: num }));
  }, [selectedExam, autoSubject]);

  const handleSaveMarks = async () => {
    if (!autoSubject) {
      toast.error("You are not assigned to any subject in this exam");
      return;
    }

    setSaving(true);
    const schedule = schedules.find(
      (s) => s.examId === selectedExam._id && s.subject === autoSubject
    );

    const payload = paginatedStudents.map((student) => {
      const key = `${selectedExam._id}-${autoSubject}-${student.id}`;
      const marksObtained = Number(marks[key] ?? existingMarks[key] ?? 0);
      return {
        examId: selectedExam._id,
        subject: autoSubject,
        studentId: student.id,
        studentName: student.name,
        marksObtained,
        maxMarks: schedule?.maxMarks || selectedExam.totalMarks,
      };
    });

    try {
      const { data } = await api.post("/exams-marks", payload);
      if (data.success) {
        toast.success("Marks saved successfully!");
        const newMap = { ...existingMarks };
        payload.forEach((p) => {
          const k = `${p.examId}-${p.subject}-${p.studentId}`;
          newMap[k] = p.marksObtained;
        });
        setExistingMarks(newMap);
        setMarks({});
        setPage(1);
      } else toast.error(data.message || "Save failed");
    } catch (err) {
      toast.error(err.response?.data?.error || "Save error");
    } finally {
      setSaving(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterSection("all");
    setPage(1);
  };

  const hasActiveFilters = searchQuery || filterSection !== "all";

  /* ---------- Loading UI ---------- */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <DashboardHeader />

      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* Teaching Assignments */}
          <Card className="border shadow-sm bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserCheck className="h-5 w-5 text-primary" />
                Your Teaching Assignments
              </CardTitle>
              <CardDescription>Classes and subjects assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              {teacherAllocations.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No subjects assigned yet.</p>
                  <p className="mt-1 text-xs text-muted-foreground">Contact your admin.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {teacherAllocations.map((alloc) => (
                    <div
                      key={alloc._id}
                      className="group flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary group-hover:text-primary/90">
                          {alloc.classId.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {alloc.sectionName}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-sm">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{alloc.subjectId.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exams List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              Exams
            </h2>

            {exams.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-10 w-10 text-primary/60" />
                </div>
                <p className="text-lg font-medium text-foreground">No exams scheduled yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Check back later or contact admin.</p>
              </Card>
            ) : (
              <div className="grid gap-5">
                {exams.map((exam) => {
                  const examStudents = students.filter((s) => s.classId === exam.classId);
                  const canEnter = teacherAllocations.some(
                    (a) => a.classId._id === exam.classId
                  );

                  return (
                    <Card
                      key={exam._id}
                      className="group transition-all hover:shadow-lg border"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-lg group-hover:text-primary transition-colors">
                              <GraduationCap className="h-5 w-5" />
                              {exam.name}
                            </CardTitle>
                            <CardDescription>
                              {exam.className} • {exam.term} • {exam.session}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {new Date(exam.date).toLocaleDateString("en-IN")}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Students</p>
                              <p className="font-semibold">{examStudents.length}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Total Marks</p>
                              <p className="font-semibold">{exam.totalMarks}</p>
                            </div>
                          </div>
                          <div className="flex items-end justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.info("Results feature coming soon")}
                            >
                              View Results
                            </Button>
                            <Button
                              size="sm"
                              disabled={!canEnter}
                              className={
                                canEnter
                                  ? "bg-primary hover:bg-primary/90"
                                  : "bg-muted text-muted-foreground"
                              }
                              onClick={() => {
                                setSelectedExam(exam);
                                setPage(1);
                                clearFilters();
                              }}
                            >
                              {canEnter ? "Enter Marks" : "Not Assigned"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MARKS ENTRY MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl bg-card/98">
            <CardHeader className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <GraduationCap className="h-7 w-7 text-primary" />
                    {selectedExam.name}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                    <span>{selectedExam.className}</span>
                    <span className="text-muted-foreground">•</span>
                    <span>{filteredStudents.length} students</span>
                    {autoSubject && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant="default" className="text-xs">
                          {autoSubject}
                        </Badge>
                      </>
                    )}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedExam(null);
                    setMarks({});
                    setPage(1);
                    clearFilters();
                  }}
                  className="hover:bg-destructive/10 hover:text-destructive rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 h-11"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterSection} onValueChange={(v) => { setFilterSection(v); setPage(1); }}>
                    <SelectTrigger className="flex-1 h-11">
                      <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {uniqueSections.map((sec) => (
                        <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={clearFilters}
                      className="h-11 w-11"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Showing <strong>{paginatedStudents.length}</strong> of <strong>{filteredStudents.length}</strong> students
                </p>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>

              {autoSubject ? (
                filteredStudents.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {paginatedStudents.map((student) => {
                        const key = `${selectedExam._id}-${autoSubject}-${student.id}`;
                        const saved = existingMarks[key];
                        const current = marks[key] ?? saved ?? "";
                        const maxMarks = schedules.find(
                          (s) => s.examId === selectedExam._id && s.subject === autoSubject
                        )?.maxMarks || selectedExam.totalMarks;

                        const isValid = current === "" || (Number(current) >= 0 && Number(current) <= maxMarks);
                        const hasChanges = marks[key] !== undefined;

                        return (
                          <div
                            key={student.id}
                            className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{student.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="capitalize">{student.gender}</span>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">{student.sectionName}</Badge>
                              </div>
                              {saved !== undefined && !hasChanges && (
                                <p className="mt-1 text-xs flex items-center gap-1 text-green-600">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Saved: {saved} / {maxMarks}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <Input
                                  type="number"
                                  min="0"
                                  max={maxMarks}
                                  placeholder="0"
                                  value={current}
                                  onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                  className={`w-24 font-mono text-center h-10 ${!isValid && current !== "" ? "border-destructive focus-visible:ring-destructive" : ""
                                    }`}
                                />
                                {!isValid && current !== "" && (
                                  <XCircle className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground w-10 text-right">
                                / {maxMarks}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 border-t pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {page} of {totalPages}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <Filter className="h-10 w-10 text-primary/60" />
                    </div>
                    <p className="text-lg font-medium">No students match your filters</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try adjusting your search or section filter.
                    </p>
                    <Button onClick={clearFilters} variant="outline" className="mt-4">
                      Clear Filters
                    </Button>
                  </div>
                )
              ) : (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                    <AlertCircle className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-lg font-medium">Not Assigned</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You are not assigned to teach any subject in this exam.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 border-t pt-4 sticky bottom-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 -mx-6 px-6 pb-6">
                <Button
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => {
                    setSelectedExam(null);
                    setMarks({});
                    setPage(1);
                    clearFilters();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 font-medium"
                  onClick={handleSaveMarks}
                  disabled={!autoSubject || saving || paginatedStudents.length === 0}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save All Marks"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}