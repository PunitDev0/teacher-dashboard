
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  UserCheck,
  BarChart3,
  Zap,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />

      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Welcome Section - Improved responsiveness */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-balance text-foreground">Good morning, John!</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Here's what's happening in your classes today.
              </p>
            </div>

            {/* Quick Stats - Better responsive grid */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-foreground">Today's Classes</CardTitle>
                  <Calendar className="h-4 w-4 text-accent flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">6</div>
                  <p className="text-xs text-muted-foreground">Next: Math 10A at 9:00 AM</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-foreground">Pending Assignments</CardTitle>
                  <BookOpen className="h-4 w-4 text-accent flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">23</div>
                  <p className="text-xs text-muted-foreground">To be reviewed</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-foreground">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-accent flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">142</div>
                  <p className="text-xs text-muted-foreground">Across 5 classes</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-foreground">Attendance Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-accent flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">94.2%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last week</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid - Improved responsive grid layout */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Today's Schedule */}
              <Card className="lg:col-span-2 bg-card border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-balance">Today's Timetable</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Your schedule for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { time: "9:00 AM", subject: "Mathematics", class: "10A", room: "Room 201" },
                    { time: "10:30 AM", subject: "Mathematics", class: "10B", room: "Room 201" },
                    { time: "12:00 PM", subject: "Algebra", class: "11A", room: "Room 203" },
                    { time: "2:00 PM", subject: "Calculus", class: "12A", room: "Room 201" },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="text-sm font-medium text-accent whitespace-nowrap">{schedule.time}</div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate">{schedule.subject}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground truncate">
                            {schedule.class} • {schedule.room}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-muted text-foreground border-border whitespace-nowrap">
                        Upcoming
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card className="bg-card border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BarChart3 className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-balance">Performance</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Class averages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { class: "10A", avg: "87%", trend: "up" },
                    { class: "10B", avg: "82%", trend: "down" },
                    { class: "11A", avg: "91%", trend: "up" },
                    { class: "12A", avg: "85%", trend: "stable" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-foreground">{item.class}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-foreground">{item.avg}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                            item.trend === "up"
                              ? "bg-green-900/30 text-green-400"
                              : item.trend === "down"
                                ? "bg-red-900/30 text-red-400"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→"}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-card border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <AlertCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-balance">Recent Activity</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">Latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {[
                    {
                      type: "assignment",
                      message: "New assignment submitted by Sarah Johnson",
                      time: "2 minutes ago",
                      icon: BookOpen,
                    },
                    {
                      type: "attendance",
                      message: "Attendance marked for Math 10A",
                      time: "1 hour ago",
                      icon: CheckCircle,
                    },
                    {
                      type: "exam",
                      message: "Midterm exam scheduled for next week",
                      time: "3 hours ago",
                      icon: Calendar,
                    },
                    {
                      type: "message",
                      message: "Parent meeting request from Mike's parents",
                      time: "5 hours ago",
                      icon: Users,
                    },
                  ].map((activity, index) => {
                    const ActivityIcon = activity.icon
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <ActivityIcon className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-2">
                            {activity.message}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Zap className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-balance">Quick Actions</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">Common tasks you can perform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                  <Button className="h-auto flex-col gap-2 p-4 bg-accent hover:bg-accent/90 text-accent-foreground text-xs sm:text-sm font-medium transition-all">
                    <UserCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-center">Mark Attendance</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-4 bg-transparent border-border text-foreground hover:bg-muted text-xs sm:text-sm font-medium transition-all"
                  >
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-center">Create Assignment</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-4 bg-transparent border-border text-foreground hover:bg-muted text-xs sm:text-sm font-medium transition-all"
                  >
                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-center">View Students</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-4 bg-transparent border-border text-foreground hover:bg-muted text-xs sm:text-sm font-medium transition-all"
                  >
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-center">Schedule Exam</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
