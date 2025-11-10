"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { UserCheck, Calendar, BarChart3, AlertCircle, Loader2, Edit3, Filter, X, CalendarIcon } from "lucide-react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

export default function AttendancePage() {
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState({})
  const [markedHistory, setMarkedHistory] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [reason, setReason] = useState("")
  const [showMarked, setShowMarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date()) // Filter date
  const [userData, setUserData] = useState({})
  const reasonInputRef = useRef(null)

  // Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [classFilter, setClassFilter] = useState("all")

  const decodeToken = (token) => {
    try {
      return jwtDecode(token)
    } catch (error) {
      console.error("Invalid token:", error)
      return null
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("staffToken")
    if (token) {
      const decoded = decodeToken(token)
      setUserData(decoded || {})
    }
    fetchStudentsAndAttendance()
  }, [selectedDate]) // Re-fetch when date changes

  // Auto-focus reason input
  useEffect(() => {
    if (isDialogOpen && reasonInputRef.current) {
      setTimeout(() => reasonInputRef.current?.focus(), 100)
    }
  }, [isDialogOpen])

  const fetchStudentsAndAttendance = async () => {
    try {
      setLoading(true)
      setError("")

      const token = localStorage.getItem("staffToken")
      if (!token) {
        setError("No token found. Please login again.")
        setLoading(false)
        return
      }

      const { institutionId } = decodeToken(token) || {}
      const formattedDate = format(selectedDate, "yyyy-MM-dd")

      // Fetch students
      const studentsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/staff/portal/students`
        , {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!studentsRes.data.success) {
        setError(studentsRes.data.message || "Failed to load students.")
        setLoading(false)
        return
      }

      const fetchedStudents = studentsRes.data.students || []

      // Fetch attendance for selected date
      const attendancePromises = fetchedStudents.map((student) =>
        axios
          .get(`
            ${process.env.NEXT_PUBLIC_API_URL}api/staff/portal/students/attendance`
            , {
            params: {
              studentId: student.id,
              date: formattedDate,
              sectionId: student.sectionId,
              institutionId,
            },
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => ({ data: { success: false, data: [] } }))
      )

      const attendanceResults = await Promise.all(attendancePromises)
      const attendanceMap = {}

      attendanceResults.forEach((res, index) => {
        const student = fetchedStudents[index]
        if (res.data.success && res.data.data.length > 0) {
          const record = res.data.data[0]
          attendanceMap[student.id] = {
            status: record.status.toLowerCase(),
            time: new Date(record.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            marked: true,
          }
        } else {
          attendanceMap[student.id] = { status: "unmarked", time: "-", marked: false }
        }
      })

      setStudents(fetchedStudents)
      setAttendanceData(attendanceMap)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data.")
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (studentId, status) => {
    const token = localStorage.getItem("staffToken")
    const student = students.find((s) => s.id === studentId)
    const { id: staffId, InstitutionId } = userData
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const formattedDate = format(selectedDate, "yyyy-MM-dd")

    try {
      const payload = {
        studentId,
        classId: student.classGradeId || student.classId,
        sectionId: student.sectionId,
        date: formattedDate,
        status: status.charAt(0).toUpperCase() + status.slice(1),
        remarks: "",
        markedBy: staffId,
        InstitutionId,
      }

      await axios.post(`
        ${process.env.NEXT_PUBLIC_API_URL}api/staff/portal/students/attendance`
        , payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setAttendanceData((prev) => ({
        ...prev,
        [studentId]: { status, time: status === "present" ? now : "-", marked: true },
      }))
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark attendance")
    }
  }

  const openChangeDialog = (student) => {
    setSelectedStudent(student)
    setSelectedStatus("")
    setReason("")
    setIsDialogOpen(true)
  }

  const handleChangeAttendance = async () => {
    if (!selectedStatus) {
      alert("Please select a new status.")
      return
    }
    if (!reason.trim()) {
      alert("Reason is required to change attendance.")
      return
    }

    const student = selectedStudent
    const previous = attendanceData[student.id]
    const { id: staffId, InstitutionId } = userData
    const token = localStorage.getItem("staffToken")
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const formattedDate = format(selectedDate, "yyyy-MM-dd")

    try {
      const payload = {
        studentId: student.id,
        classId: student.classGradeId || student.classId,
        sectionId: student.sectionId,
        date: formattedDate,
        status: selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1),
        remarks: reason,
        markedBy: staffId,
        InstitutionId,
      }

      await axios.post(`
        ${process.env.NEXT_PUBLIC_API_URL}api/staff/portal/students/attendance`
        , payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setAttendanceData((prev) => ({
        ...prev,
        [student.id]: {
          status: selectedStatus,
          time: selectedStatus === "present" ? now : "-",
          marked: true,
        },
      }))

      setMarkedHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          studentId: student.id,
          studentName: student.name,
          previousStatus: previous.status,
          newStatus: selectedStatus,
          reason,
          timestamp: new Date().toLocaleString(),
        },
      ])

      setIsDialogOpen(false)
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update attendance")
    }
  }

  // Extract unique classes
  const classes = useMemo(() => {
    const unique = [...new Set(students.map(s => s.className))].filter(Boolean)
    return unique.sort()
  }, [students])

  // Filtered students
  const filteredStudents = useMemo(() => {
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    return students.filter((student) => {
      const att = attendanceData[student.id] || { status: "unmarked" }

      // Search
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())

      // Status
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "unmarked" && !att.marked) ||
        att.status === statusFilter

      // Class
      const matchesClass = classFilter === "all" || student.className === classFilter

      return matchesSearch && matchesStatus && matchesClass
    })
  }, [students, attendanceData, searchQuery, statusFilter, classFilter, selectedDate])

  // Stats for filtered data
  const markedStudents = filteredStudents.filter(s => attendanceData[s.id]?.marked)
  const unmarkedStudents = filteredStudents.filter(s => !attendanceData[s.id]?.marked)
  const presentCount = markedStudents.filter(s => attendanceData[s.id]?.status === "present").length
  const lateCount = markedStudents.filter(s => attendanceData[s.id]?.status === "late").length
  const absentCount = markedStudents.filter(s => attendanceData[s.id]?.status === "absent").length

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setClassFilter("all")
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading attendance...</span>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={fetchStudentsAndAttendance} className="mt-4 w-full">
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Attendance</h1>
                <p className="text-muted-foreground">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>

              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </CardTitle>
                  {(searchQuery || statusFilter !== "all" || classFilter !== "all") && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Search</Label>
                    <Input
                      placeholder="Name or Roll No."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="unmarked">Unmarked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Class</Label>
                    <Select value={classFilter} onValueChange={setClassFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Marked</CardTitle>
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{markedStudents.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {filteredStudents.length > 0
                      ? ((markedStudents.length / filteredStudents.length) * 100).toFixed(0)
                      : 0}% of filtered
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Present</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{presentCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {filteredStudents.length > 0
                      ? ((presentCount / filteredStudents.length) * 100).toFixed(0)
                      : 0}% of filtered
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Late</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lateCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {filteredStudents.length > 0
                      ? ((lateCount / filteredStudents.length) * 100).toFixed(0)
                      : 0}% of filtered
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Absent</CardTitle>
                  <BarChart3 className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{absentCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {filteredStudents.length > 0
                      ? ((absentCount / filteredStudents.length) * 100).toFixed(0)
                      : 0}% of filtered
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
              <Button
                variant={!showMarked ? "default" : "ghost"}
                onClick={() => setShowMarked(false)}
                className="pb-3"
              >
                Unmarked ({unmarkedStudents.length})
              </Button>
              <Button
                variant={showMarked ? "default" : "ghost"}
                onClick={() => setShowMarked(true)}
                className="pb-3"
              >
                Marked ({markedStudents.length})
              </Button>
            </div>

            {/* Unmarked Students */}
            {!showMarked && (
              <Card>
                <CardHeader>
                  <CardTitle>Unmarked Students</CardTitle>
                  <CardDescription>Click to mark attendance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {unmarkedStudents.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      {filteredStudents.length === 0 ? "No students match filters." : "All students marked!"}
                    </p>
                  ) : (
                    unmarkedStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted quizzes/50 transition-colors"
                      >
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.rollNumber} • {student.className}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => markAttendance(student.id, "present")}
                          >
                            Present
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => markAttendance(student.id, "late")}>
                            Late
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => markAttendance(student.id, "absent")}
                          >
                            Absent
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* Marked Students */}
            {showMarked && (
              <Card>
                <CardHeader>
                  <CardTitle>Marked Students</CardTitle>
                  <CardDescription>Click "Change" to update with reason</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {markedStudents.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      {filteredStudents.length === 0 ? "No students match filters." : "No students marked yet."}
                    </p>
                  ) : (
                    markedStudents.map((student) => {
                      const att = attendanceData[student.id]
                      return (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-semibold">{student.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge
                                variant={
                                  att.status === "present"
                                    ? "default"
                                    : att.status === "late"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="capitalize"
                              >
                                {att.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{att.time}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => openChangeDialog(student)}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Change
                          </Button>
                        </div>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            )}

            {/* Change Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Change Attendance</DialogTitle>
                  <DialogDescription>
                    Updating attendance for <strong>{selectedStudent?.name}</strong>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                  {selectedStudent && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current:</span>
                      <Badge
                        variant={
                          attendanceData[selectedStudent.id]?.status === "present"
                            ? "default"
                            : attendanceData[selectedStudent.id]?.status === "late"
                              ? "secondary"
                              : "destructive"
                        }
                        className="capitalize"
                      >
                        {attendanceData[selectedStudent.id]?.status}
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>New Status</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["present", "late", "absent"].map((status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant="outline"
                          className={cn(
                            "capitalize border-2 transition-all duration-200",
                            selectedStatus === status
                              ? status === "present"
                                ? "bg-green-600 border-green-700 text-white"
                                : status === "absent"
                                  ? "bg-red-600 border-red-700 text-white"
                                  : "bg-yellow-600 border-yellow-700 text-white"
                              : status === "present"
                                ? "border-green-600 text-green-700 hover:bg-green-100"
                                : status === "absent"
                                  ? "border-red-600 text-red-700 hover:bg-red-100"
                                  : "border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                          )}
                          onClick={() => setSelectedStatus(status)}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">
                      Reason for Change <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="reason"
                      ref={reasonInputRef}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g., Student was marked absent by mistake..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleChangeAttendance}
                    disabled={!selectedStatus || !reason.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Change
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Change History */}
            {markedHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Change History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {markedHistory.map((change) => (
                      <div key={change.id} className="p-3 rounded-lg border text-sm">
                        <p className="font-medium">{change.studentName}</p>
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                          <Badge variant="outline" className="text-xs capitalize">
                            {change.previousStatus}
                          </Badge>
                          <span>→</span>
                          <Badge className="text-xs capitalize">{change.newStatus}</Badge>
                        </div>
                        <p className="mt-1 text-xs">Reason: {change.reason}</p>
                        <p className="text-xs text-muted-foreground">{change.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}