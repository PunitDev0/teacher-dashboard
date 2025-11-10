"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  School,
  Search,
  Filter,
  Users,
  AlertCircle,
} from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGender, setFilterGender] = useState("all");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("staffToken");
      if (!token) {
        setError("Authentication token missing. Please login again.");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/staff/portal/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );

      if (data.success && Array.isArray(data.students)) {
        setStudents(data.students);
        setFilteredStudents(data.students);
      } else {
        setError(data.message || "No students found.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Is backend running?");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else {
        setError(err.response?.data?.message || "Failed to load students.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Extract unique values for filters
  const uniqueClasses = useMemo(() => {
    const classes = [...new Set(students.map((s) => s.className).filter(Boolean))];
    return classes.sort();
  }, [students]);

  const uniqueYears = useMemo(() => {
    const years = [...new Set(students.map((s) => s.academicYear).filter(Boolean))];
    return years.sort();
  }, [students]);

  // Filter Logic
  useEffect(() => {
    let filtered = students;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.email?.toLowerCase().includes(query) ||
          s.className?.toLowerCase().includes(query)
      );
    }

    if (filterClass !== "all") filtered = filtered.filter((s) => s.className === filterClass);
    if (filterYear !== "all") filtered = filtered.filter((s) => s.academicYear === filterYear);
    if (filterStatus !== "all") filtered = filtered.filter((s) => s.status === filterStatus);
    if (filterGender !== "all") filtered = filtered.filter((s) => s.gender === filterGender);

    setFilteredStudents(filtered);
  }, [searchQuery, filterClass, filterYear, filterStatus, filterGender, students]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterClass("all");
    setFilterYear("all");
    setFilterStatus("all");
    setFilterGender("all");
  };

  const hasActiveFilters =
    searchQuery || filterClass !== "all" || filterYear !== "all" || filterStatus !== "all" || filterGender !== "all";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <DashboardHeader />

      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="space-y-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Students</h1>
              <p className="text-muted-foreground mt-1">View and manage your assigned students</p>
            </div>
            <Button onClick={fetchStudents} variant="outline" size="sm" className="shrink-0">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          </div>

          {/* Search + Filters */}
          <Card className="p-4 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              {/* Filters Row */}
              {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {uniqueClasses.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="h-10 col-span-2 sm:col-span-1 lg:col-span-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div> */}

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students
                </p>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Students Grid */}
          {!loading && !error && filteredStudents.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 overflow-hidden"
                  onClick={() => setSelectedStudent(student)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {student.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <School className="w-3 h-3" />
                          {student.className || "N/A"}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={student.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {student.status || "Active"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Gender</p>
                        <p className="font-medium capitalize flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {student.gender || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Year</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {student.academicYear || "N/A"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                      }}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Enhanced Empty State */}
          {!loading && !error && filteredStudents.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    {hasActiveFilters ? (
                      <Filter className="w-12 h-12 text-primary/50" />
                    ) : (
                      <Users className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">
                {hasActiveFilters ? "No students match your filters" : "No students assigned yet"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {hasActiveFilters
                  ? "Try adjusting your search query or filter criteria to see more results."
                  : "It looks like no students have been assigned to you. Contact your administrator to get started."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {hasActiveFilters && (
                  <Button onClick={clearFilters} size="lg" className="font-medium">
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
                <Button variant="outline" size="lg" onClick={fetchStudents}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl bg-card/98">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-7 h-7 text-primary" />
                    </div>
                    {selectedStudent.name}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2 text-base">
                    <School className="w-4 h-4" />
                    {selectedStudent.className || "N/A"}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedStudent(null)}
                  className="hover:bg-destructive/10 hover:text-destructive rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-xl border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Academic Year
                  </p>
                  <p className="text-xl font-bold text-primary mt-1">
                    {selectedStudent.academicYear || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" /> Gender
                  </p>
                  <p className="text-xl font-bold text-primary mt-1 capitalize">
                    {selectedStudent.gender || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedStudent.status === "active" ? "default" : "secondary"} className="mt-1 text-sm">
                    {selectedStudent.status || "Active"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 border-t pt-5">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Contact Information
                </h3>
                <div className="space-y-3 text-foreground">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium">{selectedStudent.email}</span>
                  </div>
                  {selectedStudent.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="font-medium">{selectedStudent.phone}</span>
                    </div>
                  )}
                  {selectedStudent.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-medium">{selectedStudent.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={() => setSelectedStudent(null)}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                Close Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}