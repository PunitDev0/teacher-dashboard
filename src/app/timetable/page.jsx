"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Users, BookOpen, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Map short day names to full names
const DAY_MAP = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const DAYS = Object.values(DAY_MAP);

export default function TimetablePage() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;
  const decoded = token ? jwtDecode(token) : {};
  const instituteId = decoded?.InstitutionId;
  const teacherId = decoded?.id; // 🧠 Extract teacher ID
  console.log(process.env.NEXT_PUBLIC_API_URL);
  

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!instituteId || !teacherId) {
        setError("Please log in to view your timetable.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`
            ${process.env.NEXT_PUBLIC_API_URL}api/timetable`
            , {
          params: { instituteId },
        });

        if (res.data?.success) {
          // Normalize day names (Mon → Monday)
          const allEntries = res.data.data.map((entry) => ({
            ...entry,
            day: DAY_MAP[entry.day] || entry.day,
          }));

          // Filter entries where teacherId matches the logged-in teacher
          const filtered = allEntries.filter(
            (entry) => entry.teacherId === teacherId
          );

          setTimetable(filtered);
        } else {
          setError(res.data?.error || "Failed to load timetable");
        }
      } catch (err) {
        console.error("Timetable fetch error:", err);
        setError("Failed to load timetable. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [instituteId, teacherId]);

  // Group by day and period
  const groupByDay = () => {
    const grouped = {};
    DAYS.forEach((day) => (grouped[day] = {}));

    timetable.forEach((entry) => {
      const day = entry?.day;
      const period = entry?.period;
      if (!day || !period) return;
      grouped[day][period] = entry;
    });

    return grouped;
  };

  const groupedTimetable = groupByDay();
  const allPeriods = [...new Set(timetable.map((t) => t.period))].sort((a, b) => a - b);

  // 🌀 LOADING STATE
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading your timetable...</span>
          </div>
        </main>
      </div>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-6">
            <Calendar className="h-10 w-10 mx-auto text-red-500 mb-3" />
            <p className="text-lg font-medium">Error</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </Card>
        </main>
      </div>
    );
  }

  // 💤 EMPTY STATE
  if (timetable.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          <Card className="text-center py-16">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No timetable entries assigned to you.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Contact the administrator if this seems incorrect.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  // ✅ MAIN VIEW
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />

      <main className="flex-1 overflow-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                My Timetable
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Weekly schedule for your assigned classes
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Badge>
          </div>

          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden md:block overflow-x-auto rounded-lg border">
            <table className="w-full min-w-max table-auto border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Period
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className="border px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allPeriods.map((period) => (
                  <tr key={period} className="hover:bg-muted/20">
                    <td className="border px-4 py-3 font-medium text-sm">
                      Period {period}
                    </td>
                    {DAYS.map((day) => {
                      const entry = groupedTimetable?.[day]?.[period];
                      return (
                        <td key={day} className="border px-4 py-3 text-xs">
                          {entry ? (
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">
                                {entry?.className || "N/A"}{" "}
                                {entry?.sectionName && ` - ${entry?.sectionName}`}
                              </p>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {entry?.subjectName || "Unknown"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="md:hidden space-y-6">
            {DAYS.map((day) => {
              const dayEntries = Object.entries(groupedTimetable?.[day] || {})
                .filter(([_, entry]) => entry)
                .sort(([a], [b]) => a - b);

              if (dayEntries.length === 0) return null;

              return (
                <Card key={day} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {dayEntries.map(([period, entry]) => (
                      <div
                        key={period}
                        className="border-b last:border-b-0 px-4 py-3 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <Badge variant="secondary" className="text-xs">
                            Period {period}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {entry?.className || "N/A"}
                            {entry?.sectionName && ` - ${entry?.sectionName}`}
                          </p>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {entry?.subjectName || "Unknown"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
