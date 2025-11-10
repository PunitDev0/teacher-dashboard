"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  X,
  Plus,
  Loader2,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [createDialog, setCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teacherSubject, setTeacherSubject] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);

  // Filter states
  const [selectedClassFilter, setSelectedClassFilter] = useState("");
  const [dateFrom, setDateFrom] = useState(""); // Created date from
  const [dateTo, setDateTo] = useState("");     // Created date to

  const [formData, setFormData] = useState({
    title: "",
    class: "",
    section: "",
    dueDate: "",
    description: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;
  const decoded = token ? jwtDecode(token) : {};
  const institutionId = decoded.InstitutionId;
  const currentTeacherId = decoded.id;

  // Fetch allocations + assignments
  useEffect(() => {
    const fetchAllData = async () => {
      if (!institutionId || !currentTeacherId) {
        setLoading(false);
        return;
      }

      try {
        // 1. Subject allocations
        const allocRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}api/subject-allocation`
          , {
          params: { institutionId },
        });

        if (!allocRes.data.success || !allocRes.data.data?.length) {
          throw new Error("No subject allocations found");
        }

        const teacherAllocations = allocRes.data.data.filter(
          (alloc) => alloc.teacherId?._id === currentTeacherId
        );

        if (!teacherAllocations.length) {
          throw new Error("No classes or sections assigned to you.");
        }

        const subjectInfo = teacherAllocations[0].subjectId;
        setTeacherSubject(subjectInfo);

        const uniqueClasses = [
          ...new Map(
            teacherAllocations.map((a) => [a.classId._id, a.classId.name])
          ).entries(),
        ].map(([id, name]) => ({ id, name }));
        setAvailableClasses(uniqueClasses);

        const sections = teacherAllocations.map((a) => ({
          classId: a.classId._id,
          sectionId: a.sectionId._id,
          sectionName: a.sectionName || "Unknown",
        }));
        setAvailableSections(sections);

        // 2. Fetch assignments
        await fetchAssignments();
      } catch (error) {
        console.error("Failed to load data:", error);
        alert(error.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [institutionId, currentTeacherId]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`
        ${process.env.NEXT_PUBLIC_API_URL}api/assignments`
        
        , {
        params: { institutionId },
      });

      if (res.data.success) {
        const data = res.data.data.map(a => ({
          ...a,
          createdAt: new Date(a.createdAt), // ensure Date object
          dueDate: new Date(a.dueDate),
        }));
        setAssignments(data);
        setFilteredAssignments(data);
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  // Filter logic: Class + Created Date Range
  useEffect(() => {
    let filtered = assignments;

    // Filter by class
    if (selectedClassFilter) {
      filtered = filtered.filter((a) => a.className === selectedClassFilter);
    }

    // Filter by createdAt (date range)
    if (dateFrom || dateTo) {
      filtered = filtered.filter((a) => {
        const created = a.createdAt;
        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;

        const afterFrom = !from || created >= from;
        const beforeTo = !to || created <= new Date(to.setHours(23, 59, 59, 999));

        return afterFrom && beforeTo;
      });
    }

    setFilteredAssignments(filtered);
  }, [selectedClassFilter, dateFrom, dateTo, assignments]);

  // Create assignment
  const handleCreateAssignment = async () => {
    if (
      !formData.title ||
      !formData.class ||
      !formData.section ||
      !formData.dueDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedClass = availableClasses.find((c) => c.name === formData.class);
    const selectedSection = availableSections.find(
      (s) =>
        s.classId.toString() === selectedClass.id &&
        s.sectionName === formData.section
    );

    const payload = {
      title: formData.title,
      description: formData.description,
      institutionId,
      classId: selectedClass.id,
      className: selectedClass.name,
      sectionId: selectedSection.sectionId,
      sectionName: selectedSection.sectionName,
      subject: teacherSubject.name,
      dueDate: formData.dueDate,
      total: 0,
      submitted: 0,
      status: "not-completed",
      createdBy: currentTeacherId,
    };

    try {
      const res = await axios.post(`
        ${process.env.NEXT_PUBLIC_API_URL}api/assignments`
        , payload);
      if (res.data.success) {
        await fetchAssignments();
        setCreateDialog(false);
        setFormData({
          title: "",
          class: "",
          section: "",
          dueDate: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Failed to create assignment:", error);
      alert("Failed to create assignment.");
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedClassFilter("");
    setDateFrom("");
    setDateTo("");
  };

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading your data...</span>
          </div>
        </main>
      </div>
    );
  }

  // No Subject
  if (!teacherSubject) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-6">
            <X className="h-10 w-10 mx-auto text-red-500 mb-3" />
            <p className="text-lg font-medium">No Subject Assigned</p>
            <p className="text-sm text-muted-foreground mt-1">
              Contact admin to assign you a subject.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Header + Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Assignments</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Manage assignments for <strong>{teacherSubject?.name}</strong>
                </p>
              </div>

              <div className="flex gap-3 items-center flex-wrap">
                {/* Class Filter */}
                <div className="relative">
                  <select
                    value={selectedClassFilter}
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="w-48 px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-accent focus:ring-offset-2 outline-none appearance-none"
                  >
                    <option value="">All Classes</option>
                    {availableClasses.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Created Date From */}
                <div className="relative">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="From"
                    className="w-40 pl-8 text-sm"
                  />
                  <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Created Date To */}
                <div className="relative">
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="To"
                    className="w-40 pl-8 text-sm"
                  />
                  <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Clear Filters */}
                {(selectedClassFilter || dateFrom || dateTo) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                )}

                <Button
                  className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 flex items-center gap-2 px-4 py-2 shadow-sm"
                  onClick={() => setCreateDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  New Assignment
                </Button>
              </div>
            </div>

            {/* Assignments Grid */}
            {filteredAssignments.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAssignments.map((assignment) => (
                  <Card
                    key={assignment._id}
                    className="hover:shadow-md transition-shadow border rounded-xl"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-accent" />
                          {assignment.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          Due: {assignment.dueDate.toLocaleDateString()}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs mt-1 text-muted-foreground">
                        {assignment.className} - {assignment.sectionName} • {assignment.subject}
                        <span className="ml-2 text-xs italic">
                          Created: {assignment.createdAt.toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      {assignment.description ? (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                          {assignment.description}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No description
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border rounded-xl bg-muted/20">
                <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium text-muted-foreground">
                  No assignments found
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting filters or create a new assignment
                </p>
                <Button
                  className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                  onClick={() => setCreateDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Assignment Modal */}
      {createDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-md my-4 shadow-lg border rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <CardTitle className="text-lg font-semibold">
                Create New Assignment
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCreateDialog(false);
                  setFormData({
                    title: "",
                    class: "",
                    section: "",
                    dueDate: "",
                    description: "",
                  });
                }}
                className="h-8 w-8 text-gray-700 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={teacherSubject?.name || ""} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Class *</Label>
                <select
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class: e.target.value,
                      section: "",
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-accent focus:ring-offset-2 outline-none"
                >
                  <option value="">Select a class...</option>
                  {availableClasses.map((cls) => (
                    <option key={cls.id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Section *</Label>
                <select
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-accent focus:ring-offset-2 outline-none"
                  disabled={!formData.class}
                >
                  <option value="">Select a section...</option>
                  {availableSections
                    .filter(
                      (sec) =>
                        sec.classId.toString() ===
                        availableClasses.find((c) => c.name === formData.class)?.id
                    )
                    .map((sec) => (
                      <option key={sec.sectionId} value={sec.sectionName}>
                        {sec.sectionName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  placeholder="e.g., Chapter 5 Exercises"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  placeholder="Enter assignment details..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-accent outline-none"
                  rows="3"
                />
              </div>

              <div className="flex gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setCreateDialog(false);
                    setFormData({
                      title: "",
                      class: "",
                      section: "",
                      dueDate: "",
                      description: "",
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                  onClick={handleCreateAssignment}
                  disabled={
                    !formData.class ||
                    !formData.section ||
                    !formData.title ||
                    !formData.dueDate
                  }
                >
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}