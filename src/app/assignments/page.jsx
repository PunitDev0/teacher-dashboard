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
  const [loading, setLoading] = useState(true);
  const [teacherSubject, setTeacherSubject] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [createDialog, setCreateDialog] = useState(false);

  const [selectedClassFilter, setSelectedClassFilter] = useState("");
  const [selectedSectionFilter, setSelectedSectionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    class: "",
    section: "",
    dueDate: "",
    description: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;
  const decoded = token ? jwtDecode(token) : {};
  const institutionId = decoded.InstitutionId;
  const currentTeacherId = decoded.id;

  // ✅ Fetch assignments (flat structure)
  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/assignments`,
        { params: { institutionId } }
      );

      if (res.data.success && Array.isArray(res.data.data)) {
        const data = res.data.data.map((a) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          dueDate: new Date(a.dueDate),
        }));
        setAssignments(data);
        setFilteredAssignments(data);
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  // ✅ Fetch subject, classes, and sections (for dropdowns)
  const fetchSubjectAllocations = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/subject-allocation`,
        { params: { institutionId, id: currentTeacherId } }
      );

      if (res.data.success && res.data.data) {
        const { subject, classes } = res.data.data;

        // Set subject
        if (subject) setTeacherSubject(subject);

        // Extract unique classes
        const uniqueClasses = classes.map((cls) => ({
          id: cls.classId,
          name: cls.className,
        }));
        setAvailableClasses(uniqueClasses);

        // Flatten sections
        const allSections = classes.flatMap((cls) =>
          cls.sections.map((sec) => ({
            classId: cls.classId,
            sectionId: sec.sectionId,
            sectionName: sec.sectionName,
          }))
        );
        setAvailableSections(allSections);
      }
    } catch (error) {
      console.error("Failed to fetch subject allocations:", error);
    }
  };

  // ✅ Fetch both on load
  useEffect(() => {
    const loadData = async () => {
      if (!institutionId || !currentTeacherId) return;
      setLoading(true);
      await Promise.all([fetchAssignments(), fetchSubjectAllocations()]);
      setLoading(false);
    };
    loadData();
  }, [institutionId, currentTeacherId]);

  // ✅ Filter logic: Class, Section, Date
  useEffect(() => {
    let filtered = assignments;

    if (selectedClassFilter) {
      filtered = filtered.filter((a) => a.className === selectedClassFilter);
    }

    if (selectedSectionFilter) {
      filtered = filtered.filter((a) => a.sectionName === selectedSectionFilter);
    }

    if (dateFrom || dateTo) {
      filtered = filtered.filter((a) => {
        const created = a.createdAt;
        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;
        const afterFrom = !from || created >= from;
        const beforeTo =
          !to || created <= new Date(to.setHours(23, 59, 59, 999));
        return afterFrom && beforeTo;
      });
    }

    setFilteredAssignments(filtered);
  }, [selectedClassFilter, selectedSectionFilter, dateFrom, dateTo, assignments]);

  // ✅ Create assignment
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

    const selectedClass = availableClasses.find(
      (c) => c.name === formData.class
    );
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
      subject: teacherSubject?.name || "Unknown",
      dueDate: formData.dueDate,
      total: 0,
      submitted: 0,
      status: "not-completed",
      createdBy: currentTeacherId,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/assignments`,
        payload
      );
      if (res.data.success) {
        alert("Assignment created successfully!");
        setCreateDialog(false);
        setFormData({
          title: "",
          class: "",
          section: "",
          dueDate: "",
          description: "",
        });
        await fetchAssignments();
      }
    } catch (error) {
      console.error("Failed to create assignment:", error);
      alert("Failed to create assignment.");
    }
  };

  // ✅ Reset filters
  const clearFilters = () => {
    setSelectedClassFilter("");
    setSelectedSectionFilter("");
    setDateFrom("");
    setDateTo("");
  };

  // ✅ Filtered section list (based on class)
  const filteredSections = selectedClassFilter
    ? availableSections.filter(
        (s) =>
          s.classId ===
          availableClasses.find((c) => c.name === selectedClassFilter)?.id
      )
    : [];

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading assignments...</span>
          </div>
        </main>
      </div>
    );
  }

  // ✅ No Subject Assigned
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

  // ✅ UI
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
                  Manage assignments for{" "}
                  <strong>{teacherSubject?.name}</strong>
                </p>
              </div>

              {/* Filters */}
              <div className="flex gap-3 items-center flex-wrap">
                {/* Class Filter */}
                <div className="relative">
                  <select
                    value={selectedClassFilter}
                    onChange={(e) => {
                      setSelectedClassFilter(e.target.value);
                      setSelectedSectionFilter(""); // reset section when class changes
                    }}
                    className="w-40 px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-accent focus:ring-offset-2 outline-none appearance-none"
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

                {/* Section Filter */}
                <div className="relative">
                  <select
                    value={selectedSectionFilter}
                    onChange={(e) => setSelectedSectionFilter(e.target.value)}
                    className="w-36 px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-accent focus:ring-offset-2 outline-none appearance-none"
                    disabled={!selectedClassFilter}
                  >
                    <option value="">All Sections</option>
                    {filteredSections.map((sec) => (
                      <option key={sec.sectionId} value={sec.sectionName}>
                        {sec.sectionName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Date Filters */}
                <div className="relative">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-40 pl-8 text-sm"
                  />
                  <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                <div className="relative">
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-40 pl-8 text-sm"
                  />
                  <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {(selectedClassFilter ||
                  selectedSectionFilter ||
                  dateFrom ||
                  dateTo) && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
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

            {/* Assignment Cards */}
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
                        {assignment.className} - {assignment.sectionName} •{" "}
                        {assignment.subject}
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
    </div>
  );
}
