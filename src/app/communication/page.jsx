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
  MessageSquare,
  Send,
  Bell,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Paperclip,
  CheckCheck,
  User,
  Megaphone,
  AlertCircle,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const INITIAL_MESSAGES = [
  {
    id: 1,
    from: "Mrs. Kavita Sharma (Mother of Aarav - Grade 10A)",
    student: "Aarav Sharma",
    class: "Grade 10A",
    subject: "Query regarding Trigonometry formulas and homework #4",
    body: "Respected Sir, Aarav was having difficulty in solving Question 12 of Trigonometry Homework #4. Could you please share the reference solution or guide him in tomorrow's doubt session? Thank you.",
    date: "Today, 10:15 AM",
    unread: true,
    category: "Homework",
    replies: [],
  },
  {
    id: 2,
    from: "Academic Coordinator Office",
    student: "Staff Circular",
    class: "All Faculty",
    subject: "Faculty Meeting: Midterm Exam Schedule & Syllabus Lock",
    body: "Dear Faculty Members, a brief 15-minute briefing will be held tomorrow at 02:30 PM in Conference Hall A regarding midterm test paper submission and moderation.",
    date: "Yesterday, 04:30 PM",
    unread: false,
    category: "Circular",
    replies: [
      {
        sender: "Me (Punit Nigam)",
        text: "Noted with thanks. Grade 10 Math question papers are ready for submission.",
        time: "Yesterday, 05:10 PM",
      },
    ],
  },
  {
    id: 3,
    from: "Mr. Rajesh Varma (Father of Rohan - Grade 10A)",
    student: "Rohan Varma",
    class: "Grade 10A",
    subject: "Medical Leave Application for 24th - 25th Nov",
    body: "Sir, Rohan has caught viral fever and has been advised rest by Dr. Sen for 2 days. He will resume classes on Wednesday. Requesting you to grant leave.",
    date: "2 days ago",
    unread: true,
    category: "Leave",
    replies: [],
  },
  {
    id: 4,
    from: "Mrs. Deepa Nair (Mother of Priya - Grade 11B)",
    student: "Priya Nair",
    class: "Grade 11B",
    subject: "Appreciation for Problem Solving Lab session",
    body: "Good morning Sir, Priya mentioned that the Algebra graphical workshop yesterday was very engaging. Thank you for taking extra efforts with Grade 11B.",
    date: "3 days ago",
    unread: false,
    category: "Appreciation",
    replies: [
      {
        sender: "Me (Punit Nigam)",
        text: "Thank you for the kind feedback! Priya participated enthusiastically.",
        time: "3 days ago, 02:00 PM",
      },
    ],
  },
  {
    id: 5,
    from: "Mr. Sanjeev Kapoor (Father of Ishaan - Grade 12A)",
    student: "Ishaan Kapoor",
    class: "Grade 12A",
    subject: "Clarification on Calculus Midterm Weightage",
    body: "Respected Teacher, could you kindly confirm whether limits and continuity will carry 15 or 20 marks in the upcoming Term 1 Examination?",
    date: "4 days ago",
    unread: false,
    category: "Exams",
    replies: [
      {
        sender: "Me (Punit Nigam)",
        text: "Dear Mr. Kapoor, Continuity and Differentiability carries exactly 18 marks as per the official blueprint distributed.",
        time: "4 days ago, 06:15 PM",
      },
    ],
  },
  {
    id: 6,
    from: "Mrs. Sunita Rao (Peer Faculty - PGT Math)",
    student: "Staff Proxy",
    class: "Department",
    subject: "Exchange of Period 4 on Friday",
    body: "Hi Punit, could you kindly cover my Period 4 in Grade 11A on Friday as I need to attend an online CBSE evaluator meeting? I will take your Period 2 on Monday.",
    date: "5 days ago",
    unread: false,
    category: "Staff",
    replies: [],
  },
];

const INITIAL_NOTICES = [
  {
    id: "not-01",
    title: "Mid-Term Mathematics Formula Booklet Uploaded",
    target: "Grade 10 (Section A & B)",
    date: "21 Nov 2026",
    type: "Academic",
    status: "Delivered (76 Parents)",
    body: "Formula summary sheet for Trigonometric Identities and Quadratic Equations is uploaded to the student portal. Please revise before Friday's quiz.",
  },
  {
    id: "not-02",
    title: "Geometry Workshop Geometry Box Requirement",
    target: "Grade 9 (Section C)",
    date: "19 Nov 2026",
    type: "Class Instruction",
    status: "Delivered (36 Parents)",
    body: "Students must carry complete geometry sets and compass for Wednesday's practical construction period.",
  },
  {
    id: "not-03",
    title: "Calculus Diagnostic Test - Question Blueprint Released",
    target: "Grade 12 (Section A)",
    date: "18 Nov 2026",
    type: "Exam Blueprint",
    status: "Delivered (42 Parents)",
    body: "Diagnostic test on Derivatives and Inverse Trig is scheduled for Tuesday morning. Practice sheet questions are available on school LMS.",
  },
  {
    id: "not-04",
    title: "Doubt Solving Clinic every Thursday 02:45 PM",
    target: "Grade 10 & 11",
    date: "14 Nov 2026",
    type: "Remedial",
    status: "Delivered (85 Parents)",
    body: "Students scoring below 65% in recent monthly tests are requested to attend the remedial clinic in Room 201.",
  },
  {
    id: "not-05",
    title: "National Mathematics Olympiad Registration Deadline",
    target: "All Grades (9 to 12)",
    date: "10 Nov 2026",
    type: "Competition",
    status: "Delivered (140 Parents)",
    body: "Interested students should submit consent forms to Mr. Nigam before Friday afternoon. Practice material will be distributed in Math Lab.",
  },
];

export default function CommunicationPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [activeTab, setActiveTab] = useState("inbox"); // "inbox" | "notices"
  const [selectedMessage, setSelectedMessage] = useState(INITIAL_MESSAGES[0]);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [msgPage, setMsgPage] = useState(1);
  const MSG_PAGE_SIZE = 4;
  const [noticePage, setNoticePage] = useState(1);
  const NOTICE_PAGE_SIZE = 4;

  // Broadcast Modal State
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    targetClass: "Grade 10A",
    type: "Homework",
    priority: "Normal",
    message: "",
  });

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    // Mark as read
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, unread: false } : m))
    );
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    const newReply = {
      sender: "Me (Punit Nigam)",
      text: replyText.trim(),
      time: "Just now",
    };

    const updated = {
      ...selectedMessage,
      replies: [...(selectedMessage.replies || []), newReply],
    };

    setSelectedMessage(updated);
    setMessages((prev) =>
      prev.map((m) => (m.id === selectedMessage.id ? updated : m))
    );
    setReplyText("");
  };

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.message) return;

    const newNotice = {
      id: `not-${Date.now()}`,
      title: noticeForm.title,
      target: noticeForm.targetClass,
      date: "Today",
      type: noticeForm.type,
      status: `Delivered (Active Class)`,
      body: noticeForm.message,
    };

    setNotices((prev) => [newNotice, ...prev]);
    setIsNoticeModalOpen(false);
    setNoticePage(1);
    setNoticeForm({
      title: "",
      targetClass: "Grade 10A",
      type: "Homework",
      priority: "Normal",
      message: "",
    });
    setActiveTab("notices");
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.student.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => m.unread).length;

  // Pagination for Messages
  const msgTotalPages = Math.ceil(filteredMessages.length / MSG_PAGE_SIZE) || 1;
  const paginatedMessages = filteredMessages.slice(
    (msgPage - 1) * MSG_PAGE_SIZE,
    msgPage * MSG_PAGE_SIZE
  );
  const msgStartIdx = (msgPage - 1) * MSG_PAGE_SIZE;
  const msgEndIdx = Math.min(msgStartIdx + MSG_PAGE_SIZE, filteredMessages.length);

  // Pagination for Notices
  const noticeTotalPages = Math.ceil(notices.length / NOTICE_PAGE_SIZE) || 1;
  const paginatedNotices = notices.slice(
    (noticePage - 1) * NOTICE_PAGE_SIZE,
    noticePage * NOTICE_PAGE_SIZE
  );
  const noticeStartIdx = (noticePage - 1) * NOTICE_PAGE_SIZE;
  const noticeEndIdx = Math.min(noticeStartIdx + NOTICE_PAGE_SIZE, notices.length);

  return (
    <Layout>
      <div className="space-y-5 w-full pb-8 min-w-0">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                <Sparkles className="w-3 h-3 text-[#F5A623]" />
                Live Parent &amp; Campus Connect
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#1F1E1D] tracking-tight flex items-center gap-2">
              <MessageSquare className="h-7 w-7 text-[#1F1E1D]" />
              Communication &amp; Notices
            </h1>
            <p className="text-xs sm:text-sm font-normal text-[#78746B] mt-1">
              Direct parent inquiries, school broadcast notices, and academic announcements
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => setIsNoticeModalOpen(true)}
              className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs font-normal h-9 px-4 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5 text-[#F5A623]" />
              Broadcast Notice to Class
            </Button>
          </div>
        </div>

        {/* ── METRICS TILES ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 flex items-center justify-between bg-white text-left">
            <div>
              <span className="text-xs font-normal text-[#8E8A80]">Unread Parent Queries</span>
              <p className="text-2xl font-normal text-[#1F1E1D] mt-1">
                {unreadCount} <span className="text-xs text-[#B45309] font-normal">Action needed</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FEF5E7] text-[#B45309] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#F5A623]" />
            </div>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 flex items-center justify-between bg-white text-left">
            <div>
              <span className="text-xs font-normal text-[#8E8A80]">Notices Sent This Term</span>
              <p className="text-2xl font-normal text-[#1F1E1D] mt-1">
                {notices.length} <span className="text-xs text-[#2D6A4F] font-normal">Delivered</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1F1E1D] text-white flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-[#F5A623]" />
            </div>
          </Card>

          <Card className="rounded-2xl border-[#ECE7DE] shadow-xs p-4 flex items-center justify-between bg-white text-left">
            <div>
              <span className="text-xs font-normal text-[#8E8A80]">Average Response Time</span>
              <p className="text-2xl font-normal text-[#1F1E1D] mt-1">
                &lt; 2 hrs <span className="text-xs text-[#2D6A4F] font-normal">Super fast</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#EFECE5] text-[#1F1E1D] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#1F1E1D]" />
            </div>
          </Card>
        </div>

        {/* ── TAB SELECTOR: INBOX VS NOTICES ── */}
        <div className="flex items-center gap-2 border-b border-[#ECE7DE] pb-2">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-4 py-2 rounded-full text-xs font-normal transition-all cursor-pointer border flex items-center gap-2 ${
              activeTab === "inbox"
                ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            Parent &amp; Staff Inquiries
            {unreadCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === "inbox" ? "bg-[#F5A623] text-[#1F1E1D] font-medium" : "bg-[#FEF5E7] text-[#B45309]"
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("notices")}
            className={`px-4 py-2 rounded-full text-xs font-normal transition-all cursor-pointer border flex items-center gap-2 ${
              activeTab === "notices"
                ? "bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs"
                : "bg-white text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6]"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            Sent Broadcast Notices
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === "notices" ? "bg-white text-[#1F1E1D]" : "bg-[#EFECE5] text-[#6E6A60]"
              }`}
            >
              {notices.length}
            </span>
          </button>
        </div>

        {/* ══════════ TAB 1: INBOX CONVERSATIONS ══════════ */}
        {activeTab === "inbox" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Message List (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#ECE7DE] shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-3.5 border-b border-[#ECE7DE] bg-[#FBF9F4]">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8E8A80] absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="Search parent, student, or topic..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setMsgPage(1);
                      }}
                      className="pl-9 h-9 text-xs bg-white rounded-full border-[#E0DBD0] text-[#1F1E1D]"
                    />
                  </div>
                </div>

                <div className="divide-y divide-[#ECE7DE] max-h-[460px] overflow-y-auto">
                  {paginatedMessages.map((msg) => {
                    const isSelected = selectedMessage?.id === msg.id;
                    return (
                      <div
                        key={msg.id}
                        onClick={() => handleSelectMessage(msg)}
                        className={`p-4 transition-colors cursor-pointer text-left ${
                          isSelected
                            ? "bg-[#FBF9F4] border-l-4 border-l-[#1F1E1D]"
                            : msg.unread
                            ? "bg-[#FEF5E7]/30 hover:bg-[#FBF9F4]"
                            : "hover:bg-[#FBF9F4]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] font-normal text-[#8E8A80] truncate">
                            {msg.class}
                          </span>
                          <span className="text-[10px] text-[#8E8A80] shrink-0">
                            {msg.date}
                          </span>
                        </div>

                        <p
                          className={`text-xs text-[#1F1E1D] truncate mb-1 ${
                            msg.unread ? "font-semibold" : "font-normal"
                          }`}
                        >
                          {msg.from}
                        </p>

                        <p className="text-xs text-[#6E6A60] font-normal line-clamp-1 mb-2">
                          {msg.subject}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-2 py-0.2 font-normal bg-[#EFECE5] text-[#1F1E1D]"
                          >
                            {msg.category}
                          </Badge>
                          {msg.unread && (
                            <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Messages Compact Pagination Footer */}
              <div className="p-3 border-t border-[#ECE7DE] bg-[#FBF9F4] flex items-center justify-between text-xs text-[#78746B]">
                <span className="text-[11px]">
                  Showing{" "}
                  <strong className="text-[#1F1E1D] font-normal">
                    {filteredMessages.length === 0 ? 0 : msgStartIdx + 1}-{msgEndIdx}
                  </strong>{" "}
                  of <strong className="text-[#1F1E1D] font-normal">{filteredMessages.length}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={msgPage <= 1}
                    onClick={() => setMsgPage((p) => Math.max(1, p - 1))}
                    className="h-7 w-7 p-0 rounded-full text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6] disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-[11px] font-normal text-[#1F1E1D] px-1.5">
                    {msgPage} / {msgTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={msgPage >= msgTotalPages}
                    onClick={() => setMsgPage((p) => Math.min(msgTotalPages, p + 1))}
                    className="h-7 w-7 p-0 rounded-full text-[#6E6A60] border-[#E0DBD0] hover:bg-[#F3EFE6] disabled:opacity-30"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Active Thread Detail & Reply (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#ECE7DE] shadow-xs p-6 text-left flex flex-col justify-between min-h-[550px]">
              {selectedMessage ? (
                <>
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between pb-4 border-b border-[#ECE7DE]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs font-normal border-[#E0DBD0] text-[#78746B] bg-[#FBF9F4]">
                            {selectedMessage.class}
                          </Badge>
                          <span className="text-xs text-[#8E8A80]">•</span>
                          <span className="text-xs text-[#78746B] font-normal">
                            Student: <strong className="text-[#1F1E1D]">{selectedMessage.student}</strong>
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-normal text-[#1F1E1D] mt-1">
                          {selectedMessage.subject}
                        </h2>
                        <p className="text-xs text-[#8E8A80] mt-0.5">
                          From: {selectedMessage.from} • {selectedMessage.date}
                        </p>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="py-5 text-xs sm:text-sm text-[#1F1E1D] leading-relaxed bg-[#FBF9F4] p-4 rounded-2xl border border-[#ECE7DE] my-4">
                      {selectedMessage.body}
                    </div>

                    {/* Reply Thread */}
                    {selectedMessage.replies?.length > 0 && (
                      <div className="space-y-3 mb-6">
                        <h4 className="text-xs font-normal uppercase tracking-wider text-[#8E8A80]">
                          Previous Responses:
                        </h4>
                        {selectedMessage.replies.map((r, i) => (
                          <div
                            key={i}
                            className="bg-[#FEF5E7] border border-[#FDE68A] rounded-2xl p-3 text-xs"
                          >
                            <div className="flex items-center justify-between text-[#B45309] font-normal mb-1">
                              <span>{r.sender}</span>
                              <span className="text-[10px] text-[#8E8A80]">{r.time}</span>
                            </div>
                            <p className="text-[#1F1E1D] font-normal">{r.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="pt-4 border-t border-[#ECE7DE] mt-auto">
                    <Label className="text-xs text-[#6E6A60] font-normal mb-1.5 block">
                      Send Teacher Response:
                    </Label>
                    <div className="flex gap-2">
                      <Textarea
                        rows={2}
                        placeholder="Type your response to the parent..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="text-xs rounded-2xl border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D] resize-none"
                      />
                      <Button
                        type="submit"
                        className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-2xl h-auto px-4 shadow-xs cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-[#F5A623]" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-center py-20 text-[#8E8A80]">
                  <MessageSquare className="w-10 h-10 mb-2 stroke-1" />
                  <p className="text-sm font-normal text-[#1F1E1D]">
                    Select a parent conversation from the left to read and reply.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ══════════ TAB 2: SENT BROADCAST NOTICES ══════════ */}
        {activeTab === "notices" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedNotices.map((n) => (
                <Card
                  key={n.id}
                  className="rounded-2xl border-[#ECE7DE] shadow-xs p-5 text-left flex flex-col justify-between hover:shadow-md transition-all bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-[#FEF5E7] text-[#B45309] border border-[#FDE68A]">
                        {n.type}
                      </span>
                      <span className="text-xs text-[#8E8A80]">{n.date}</span>
                    </div>

                    <h3 className="text-base font-normal text-[#1F1E1D] mb-1">
                      {n.title}
                    </h3>

                    <p className="text-xs text-[#8E8A80] mb-3 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#8E8A80]" />
                      Target: <span className="text-[#1F1E1D] font-medium">{n.target}</span>
                    </p>

                    <p className="text-xs text-[#6E6A60] leading-relaxed bg-[#FBF9F4] p-3 rounded-xl border border-[#ECE7DE] mb-4">
                      {n.body}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#ECE7DE] flex items-center justify-between text-xs text-[#2D6A4F] font-normal">
                    <span className="flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      {n.status}
                    </span>
                    <span className="text-[#8E8A80] text-[11px]">Notice ID: #{n.id}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Notices Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#ECE7DE] shadow-xs text-xs text-[#78746B]">
              <div>
                Showing{" "}
                <span className="font-medium text-[#1F1E1D]">
                  {notices.length === 0 ? 0 : noticeStartIdx + 1}
                </span>{" "}
                to <span className="font-medium text-[#1F1E1D]">{noticeEndIdx}</span> of{" "}
                <span className="font-medium text-[#1F1E1D]">{notices.length}</span> broadcast notices
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={noticePage <= 1}
                  onClick={() => setNoticePage((p) => Math.max(1, p - 1))}
                  className="h-8 rounded-full px-3 text-xs border-[#E0DBD0] hover:bg-[#F3EFE6] disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Button>

                {Array.from({ length: noticeTotalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={noticePage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNoticePage(page)}
                    className={`h-8 w-8 rounded-full text-xs p-0 font-normal ${
                      noticePage === page
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
                  disabled={noticePage >= noticeTotalPages}
                  onClick={() => setNoticePage((p) => Math.min(noticeTotalPages, p + 1))}
                  className="h-8 rounded-full px-3 text-xs border-[#E0DBD0] hover:bg-[#F3EFE6] disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── BROADCAST NOTICE MODAL ── */}
        <Dialog open={isNoticeModalOpen} onOpenChange={setIsNoticeModalOpen}>
          <DialogContent className="sm:max-w-[520px] rounded-3xl border-[#ECE7DE] bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-normal text-[#1F1E1D] flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#F5A623]" />
                Broadcast Notice to Class
              </DialogTitle>
              <DialogDescription className="text-xs text-[#8E8A80]">
                This announcement will be delivered immediately to parents&apos; student app and notice board.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateNotice} className="space-y-4 pt-2 text-left">
              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">Notice Title / Headline</Label>
                <Input
                  required
                  placeholder="e.g. Unit Test Revision Sheet Uploaded"
                  value={noticeForm.title}
                  onChange={(e) =>
                    setNoticeForm({ ...noticeForm, title: e.target.value })
                  }
                  className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">Target Class</Label>
                  <select
                    value={noticeForm.targetClass}
                    onChange={(e) =>
                      setNoticeForm({ ...noticeForm, targetClass: e.target.value })
                    }
                    className="w-full text-xs rounded-xl border border-[#E0DBD0] bg-[#FBF9F4] h-9 px-3 mt-1 outline-none text-[#1F1E1D]"
                  >
                    <option value="Grade 10A">Grade 10A (All Students)</option>
                    <option value="Grade 11B">Grade 11B (All Students)</option>
                    <option value="Grade 12A">Grade 12A (Calculus Class)</option>
                    <option value="All My Assigned Classes">All My Assigned Classes</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs text-[#6E6A60] font-normal">Notice Category</Label>
                  <select
                    value={noticeForm.type}
                    onChange={(e) =>
                      setNoticeForm({ ...noticeForm, type: e.target.value })
                    }
                    className="w-full text-xs rounded-xl border border-[#E0DBD0] bg-[#FBF9F4] h-9 px-3 mt-1 outline-none text-[#1F1E1D]"
                  >
                    <option value="Homework">Homework / Assignment</option>
                    <option value="Academic">Academic / Exam Prep</option>
                    <option value="Attendance Alert">Attendance Warning</option>
                    <option value="Disciplinary">Disciplinary / General</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs text-[#6E6A60] font-normal">Notice Description / Instructions</Label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Write clear details for students and parents..."
                  value={noticeForm.message}
                  onChange={(e) =>
                    setNoticeForm({ ...noticeForm, message: e.target.value })
                  }
                  className="text-xs rounded-xl mt-1 border-[#E0DBD0] bg-[#FBF9F4] text-[#1F1E1D]"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="rounded-full text-xs border-[#E0DBD0] hover:bg-[#F3EFE6]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1F1E1D] hover:bg-[#33312E] text-white rounded-full text-xs shadow-xs px-4 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#F5A623]" />
                  Broadcast Now
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}
