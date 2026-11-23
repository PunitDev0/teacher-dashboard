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
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Plus,
  Sparkles,
  ShieldCheck,
  CalendarDays,
  Send,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const INITIAL_LEAVES = [
  {
    id: "lv-101",
    type: "Casual Leave (CL)",
    fromDate: "28 Nov 2026",
    toDate: "28 Nov 2026",
    days: 1,
    reason: "Attending University Mathematics Curriculum Seminar",
    substitute: "Mrs. Sunita Rao (PGT Math)",
    status: "Approved",
    appliedOn: "20 Nov 2026",
    approvedBy: "Principal Dr. Rajesh Khanna",
  },
  {
    id: "lv-098",
    type: "Medical Leave (ML)",
    fromDate: "12 Oct 2026",
    toDate: "13 Oct 2026",
    days: 2,
    reason: "Dental extraction and recovery",
    substitute: "Mr. Vikram Joshi (TGT Math)",
    status: "Approved",
    appliedOn: "10 Oct 2026",
    approvedBy: "Principal Dr. Rajesh Khanna",
  },
  {
    id: "lv-095",
    type: "Casual Leave (CL)",
    fromDate: "15 Sep 2026",
    toDate: "15 Sep 2026",
    days: 1,
    reason: "Family wedding event in hometown",
    substitute: "Dr. Meenakshi Sundaram (Physics)",
    status: "Approved",
    appliedOn: "11 Sep 2026",
    approvedBy: "Vice Principal S. Sengupta",
  },
  {
    id: "lv-091",
    type: "Academic / Duty Leave",
    fromDate: "04 Aug 2026",
    toDate: "05 Aug 2026",
    days: 2,
    reason: "CBSE Central Region Evaluation Workshop on Calculus",
    substitute: "Mrs. Sunita Rao (PGT Math)",
    status: "Approved",
    appliedOn: "28 Jul 2026",
    approvedBy: "Principal Dr. Rajesh Khanna",
  },
  {
    id: "lv-088",
    type: "Casual Leave (CL)",
    fromDate: "19 Jul 2026",
    toDate: "19 Jul 2026",
    days: 1,
    reason: "Personal banking and documentation work",
    substitute: "Mr. Vikram Joshi (TGT Math)",
    status: "Approved",
    appliedOn: "15 Jul 2026",
    approvedBy: "Academic Head Mrs. Verma",
  },
  {
    id: "lv-082",
    type: "Short Leave (2 Hours)",
    fromDate: "02 Jul 2026",
    toDate: "02 Jul 2026",
    days: 0.25,
    reason: "Medical health checkup follow-up",
    substitute: "Arranged self adjustment (Period 6)",
    status: "Approved",
    appliedOn: "01 Jul 2026",
    approvedBy: "Principal Dr. Rajesh Khanna",
  },
];

const RECENT_PUNCH_RECORDS = [
  { date: "23 Nov 2026", day: "Monday", punchIn: "07:48 AM", punchOut: "02:35 PM", status: "On Time", workingHours: "6h 47m" },
  { date: "21 Nov 2026", day: "Saturday", punchIn: "07:52 AM", punchOut: "01:10 PM", status: "On Time", workingHours: "5h 18m" },
  { date: "20 Nov 2026", day: "Friday", punchIn: "07:45 AM", punchOut: "02:30 PM", status: "On Time", workingHours: "6h 45m" },
  { date: "19 Nov 2026", day: "Thursday", punchIn: "07:50 AM", punchOut: "02:32 PM", status: "On Time", workingHours: "6h 42m" },
  { date: "18 Nov 2026", day: "Wednesday", punchIn: "08:02 AM", punchOut: "02:30 PM", status: "Grace (2m)", workingHours: "6h 28m" },
  { date: "17 Nov 2026", day: "Tuesday", punchIn: "07:44 AM", punchOut: "02:30 PM", status: "On Time", workingHours: "6h 46m" },
  { date: "16 Nov 2026", day: "Monday", punchIn: "07:51 AM", punchOut: "02:38 PM", status: "On Time", workingHours: "6h 47m" },
  { date: "14 Nov 2026", day: "Saturday", punchIn: "07:55 AM", punchOut: "01:15 PM", status: "On Time", workingHours: "5h 20m" },
  { date: "13 Nov 2026", day: "Friday", punchIn: "07:49 AM", punchOut: "02:31 PM", status: "On Time", workingHours: "6h 42m" },
  { date: "12 Nov 2026", day: "Thursday", punchIn: "07:46 AM", punchOut: "02:30 PM", status: "On Time", workingHours: "6h 44m" },
];

export default function LeavesPage() {
  const [leaves, setLeaves] = useState(INITIAL_LEAVES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("applications"); // "applications" | "punch"
  const [leavePage, setLeavePage] = useState(1);
  const LEAVE_PAGE_SIZE = 4;
  const [punchPage, setPunchPage] = useState(1);
  const PUNCH_PAGE_SIZE = 5;

  const [form, setForm] = useState({
    type: "Casual Leave (CL)",
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
    days: 1,
    reason: "",
    substitute: "Mrs. Sunita Rao (PGT Math)",
  });

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!form.reason) return;

    const newLeave = {
      id: `lv-${Date.now()}`,
      type: form.type,
      fromDate: form.fromDate,
      toDate: form.toDate,
      days: form.days || 1,
      reason: form.reason,
      substitute: form.substitute,
      status: "Pending Review",
      appliedOn: "Today",
      approvedBy: "Awaiting Principal Approval",
    };

    setLeaves([newLeave, ...leaves]);
    setIsModalOpen(false);
    setLeavePage(1);
    setForm({
      type: "Casual Leave (CL)",
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      days: 1,
      reason: "",
      substitute: "Mrs. Sunita Rao (PGT Math)",
    });
  };

  // Leaves Pagination Calculations
  const leaveTotalPages = Math.ceil(leaves.length / LEAVE_PAGE_SIZE) || 1;
  const paginatedLeaves = leaves.slice(
    (leavePage - 1) * LEAVE_PAGE_SIZE,
    leavePage * LEAVE_PAGE_SIZE
  );
  const leaveStartIdx = (leavePage - 1) * LEAVE_PAGE_SIZE;
  const leaveEndIdx = Math.min(leaveStartIdx + LEAVE_PAGE_SIZE, leaves.length);

  // Biometric Logs Pagination Calculations
  const punchTotalPages = Math.ceil(RECENT_PUNCH_RECORDS.length / PUNCH_PAGE_SIZE) || 1;
  const paginatedPunch = RECENT_PUNCH_RECORDS.slice(
    (punchPage - 1) * PUNCH_PAGE_SIZE,
    punchPage * PUNCH_PAGE_SIZE
  );
  const punchStartIdx = (punchPage - 1) * PUNCH_PAGE_SIZE;
  const punchEndIdx = Math.min(punchStartIdx + PUNCH_PAGE_SIZE, RECENT_PUNCH_RECORDS.length);

  return (
    <Layout>
      <div className="space-y-5 w-full pb-8 min-w-0">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                <Sparkles className="w-3 h-3 text-[#F5A623]" />
                Faculty Self-Service Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#1F1E1D] tracking-tight flex items-center gap-2">
              <CalendarDays className="h-7 w-7 text-[#1F1E1D]" />
              My Leaves &amp; Attendance
            </h1>
            <p className="text-xs sm:text-sm font-normal text-[#78746B] mt-1">
              Faculty leave balance, leave requests, proxy arrangements, and monthly biometric attendance logs
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs font-normal h-9 px-4 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#F5A623]" />
              Apply for Leave
            </Button>
          </div>
        </div>

        {/* ── LEAVE BALANCE TILES ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white text-left">
            <span className="text-xs font-normal text-[#8E8A80]">Casual Leave (CL)</span>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-normal text-[#1F1E1D]">
                8 <span className="text-xs text-[#8E8A80] font-normal">/ 12 remaining</span>
              </p>
              <span className="text-[11px] text-[#2D6A4F] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                4 Used
              </span>
            </div>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white text-left">
            <span className="text-xs font-normal text-[#8E8A80]">Medical Leave (ML)</span>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-normal text-[#1F1E1D]">
                7 <span className="text-xs text-[#8E8A80] font-normal">/ 10 remaining</span>
              </p>
              <span className="text-[11px] text-[#B45309] bg-[#FEF5E7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                3 Used
              </span>
            </div>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white text-left">
            <span className="text-xs font-normal text-[#8E8A80]">Duty / Academic Leave</span>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-normal text-[#1F1E1D]">
                4 <span className="text-xs text-[#8E8A80] font-normal">days available</span>
              </p>
              <span className="text-[11px] text-[#1F1E1D] bg-[#EFECE5] px-2 py-0.5 rounded-full border border-[#E5E0D5]">
                Special
              </span>
            </div>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 bg-white text-left">
            <span className="text-xs font-normal text-[#8E8A80]">Biometric Punch Ratio</span>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-normal text-[#2D6A4F]">98.5%</p>
              <span className="text-[11px] text-[#8E8A80]">Nov 2026</span>
            </div>
          </Card>
        </div>

        {/* ── TABS: LEAVE APPLICATIONS VS BIOMETRIC LOGS ── */}
        <div className="flex items-center gap-2 border-b border-[#ECE7DE] pb-2">
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 rounded-full text-xs font-normal transition-all cursor-pointer border flex items-center gap-2 ${
              activeTab === "applications"
                ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Leave History &amp; Applications ({leaves.length})
          </button>

          <button
            onClick={() => setActiveTab("punch")}
            className={`px-4 py-2 rounded-full text-xs font-normal transition-all cursor-pointer border flex items-center gap-2 ${
              activeTab === "punch"
                ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Monthly Biometric Punch Logs
          </button>
        </div>

        {/* ══════════ TAB 1: LEAVE APPLICATIONS ══════════ */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedLeaves.map((lv) => (
                <Card
                  key={lv.id}
                  className="rounded-2xl border-[#ECE7DE] shadow-xs p-5 text-left flex flex-col justify-between hover:shadow-md transition-all bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                        {lv.type}
                      </span>
                      <span
                        className={`text-[11px] font-normal px-2.5 py-0.5 rounded-full ${
                          lv.status === "Approved"
                            ? "bg-[#E8F5E9] text-[#2D6A4F] border border-[#C8E6C9]"
                            : "bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]"
                        }`}
                      >
                        {lv.status}
                      </span>
                    </div>

                    <h3 className="text-base font-normal text-[#1F1E1D] mb-1">
                      {lv.reason}
                    </h3>

                    <div className="space-y-1.5 text-xs text-[#6E6A60] bg-[#FBF9F4] p-3 rounded-xl border border-[#ECE7DE] my-3">
                      <p className="flex items-center justify-between">
                        <span className="text-[#8E8A80]">Duration:</span>
                        <strong className="text-[#1F1E1D] font-normal">
                          {lv.fromDate} to {lv.toDate} ({lv.days} {lv.days > 1 ? "Days" : "Day"})
                        </strong>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-[#8E8A80]">Proxy Teacher Nominated:</span>
                        <strong className="text-[#B45309] font-normal">{lv.substitute}</strong>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-[#8E8A80]">Applied On:</span>
                        <span>{lv.appliedOn}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#ECE7DE] flex items-center justify-between text-[11px] text-[#8E8A80]">
                    <span className="flex items-center gap-1 text-[#6E6A60]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      {lv.approvedBy}
                    </span>
                    <span>Ref: #{lv.id}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Tab 1 Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#ECE7DE] shadow-xs text-xs text-[#78746B]">
              <div>
                Showing{" "}
                <span className="font-medium text-[#1F1E1D]">
                  {leaves.length === 0 ? 0 : leaveStartIdx + 1}
                </span>{" "}
                to <span className="font-medium text-[#1F1E1D]">{leaveEndIdx}</span> of{" "}
                <span className="font-medium text-[#1F1E1D]">{leaves.length}</span> leave records
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={leavePage <= 1}
                  onClick={() => setLeavePage((p) => Math.max(1, p - 1))}
                  className="h-8 rounded-full px-3 text-xs border-[#E0DBD0] hover:bg-[#F3EFE6] disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Button>

                {Array.from({ length: leaveTotalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={leavePage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLeavePage(page)}
                    className={`h-8 w-8 rounded-full text-xs p-0 font-normal ${
                      leavePage === page
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
                  disabled={leavePage >= leaveTotalPages}
                  onClick={() => setLeavePage((p) => Math.min(leaveTotalPages, p + 1))}
                  className="h-8 rounded-full px-3 text-xs border-[#E0DBD0] hover:bg-[#F3EFE6] disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TAB 2: BIOMETRIC PUNCH LOGS ══════════ */}
        {activeTab === "punch" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#ECE7DE] shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#ECE7DE] bg-[#FBF9F4] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-normal text-[#1F1E1D]">
                    Biometric Punch Registry • November 2026
                  </h3>
                  <p className="text-xs text-[#8E8A80]">
                    Campus Gate 1 Biometric Machine records
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-normal border-[#E0DBD0] text-[#78746B] bg-white">
                  Faculty Code: EMP-MATH-2024
                </Badge>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead>
                    <tr className="bg-[#FBF9F4] text-[#78746B] uppercase border-b border-[#ECE7DE]">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Day</th>
                      <th className="py-3 px-4">Punch In</th>
                      <th className="py-3 px-4">Punch Out</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE7DE] text-[#1F1E1D]">
                    {paginatedPunch.map((rec, i) => (
                      <tr key={i} className="hover:bg-[#FBF9F4] transition-colors">
                        <td className="py-3 px-4 font-normal text-[#1F1E1D]">{rec.date}</td>
                        <td className="py-3 px-4 text-[#8E8A80]">{rec.day}</td>
                        <td className="py-3 px-4 text-[#2D6A4F] font-mono font-normal">
                          {rec.punchIn}
                        </td>
                        <td className="py-3 px-4 text-[#1F1E1D] font-mono font-normal">
                          {rec.punchOut}
                        </td>
                        <td className="py-3 px-4">{rec.workingHours}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10.5px] bg-[#E8F5E9] text-[#2D6A4F] border border-[#C8E6C9]">
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tab 2 Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#ECE7DE] shadow-xs text-xs text-[#78746B]">
              <div>
                Showing{" "}
                <span className="font-medium text-[#1F1E1D]">
                  {RECENT_PUNCH_RECORDS.length === 0 ? 0 : punchStartIdx + 1}
                </span>{" "}
                to <span className="font-medium text-[#1F1E1D]">{punchEndIdx}</span> of{" "}
                <span className="font-medium text-[#1F1E1D]">{RECENT_PUNCH_RECORDS.length}</span> punch logs
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={punchPage <= 1}
                  onClick={() => setPunchPage((p) => Math.max(1, p - 1))}
                  className="h-8 rounded-full px-3 text-xs border-[#E0DBD0] hover:bg-[#F3EFE6] disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Button>

                {Array.from({ length: punchTotalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={punchPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPunchPage(page)}
                    className={`h-8 w-8 rounded-full text-xs p-0 font-normal ${
                      punchPage === page
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
                  disabled={punchPage >= punchTotalPages}
                  onClick={() => setPunchPage((p) => Math.min(punchTotalPages, p + 1))}
                  className="h-8 rounded-full px-3 text-xs border-[#E0DBD0] hover:bg-[#F3EFE6] disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL: APPLY FOR LEAVE ── */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[520px] rounded-3xl border-[#ECE7DE] bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-normal text-[#1F1E1D] flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#F5A623]" />
                Submit Staff Leave Application
              </DialogTitle>
              <DialogDescription className="text-xs text-[#8E8A80]">
                Leave requests are automatically notified to the Academic Head and timetable proxy coordinator.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleApplyLeave} className="space-y-4 pt-2 text-left">
              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">Leave Category</Label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full text-xs rounded-xl border border-[#E0DBD0] bg-[#FBF9F4] h-9 px-3 mt-1 outline-none text-[#1F1E1D]"
                >
                  <option value="Casual Leave (CL)">Casual Leave (CL) - 8 Remaining</option>
                  <option value="Medical Leave (ML)">Medical Leave (ML) - 7 Remaining</option>
                  <option value="Academic / Duty Leave">Academic / Duty Leave (Conference/Workshop)</option>
                  <option value="Short Leave (2 Hours)">Short Leave (2 Hours)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">From Date</Label>
                  <Input
                    type="date"
                    required
                    value={form.fromDate}
                    onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                    className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                  />
                </div>
                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">To Date</Label>
                  <Input
                    type="date"
                    required
                    value={form.toDate}
                    onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                    className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">
                  Nominated Substitute Teacher for Period Coverage
                </Label>
                <select
                  value={form.substitute}
                  onChange={(e) => setForm({ ...form, substitute: e.target.value })}
                  className="w-full text-xs rounded-xl border border-[#E0DBD0] bg-[#FBF9F4] h-9 px-3 mt-1 outline-none text-[#1F1E1D]"
                >
                  <option value="Mrs. Sunita Rao (PGT Math)">Mrs. Sunita Rao (PGT Math)</option>
                  <option value="Mr. Vikram Joshi (TGT Math)">Mr. Vikram Joshi (TGT Math)</option>
                  <option value="Dr. Meenakshi Sundaram (Physics)">Dr. Meenakshi Sundaram (Physics)</option>
                  <option value="Academic Proxy Coordinator will allocate">Let Proxy Coordinator Allocate</option>
                </select>
              </div>

              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">Reason for Leave</Label>
                <Textarea
                  required
                  rows={3}
                  placeholder="Provide legitimate reason for absence..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
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
                  Submit Application
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}
