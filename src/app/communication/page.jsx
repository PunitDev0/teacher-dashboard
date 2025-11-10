import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, Bell } from "lucide-react"

export default function CommunicationPage() {
  const messages = [
    { id: 1, from: "Sarah's Parent", subject: "Progress Update", date: "Today", unread: true },
    { id: 2, from: "Admin", subject: "Staff Meeting Tomorrow", date: "Yesterday", unread: false },
    { id: 3, from: "Mike's Parent", subject: "Attendance Concern", date: "2 days ago", unread: true },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Communication</h1>
                <p className="text-muted-foreground">Messages and announcements</p>
              </div>
              <Button className="bg-accent hover:bg-accent/90">Send Announcement</Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Messages */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-accent" />
                    Messages
                  </CardTitle>
                  <CardDescription>Your recent messages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className={`font-medium ${message.unread ? "font-bold" : ""}`}>{message.from}</p>
                        <p className="text-sm text-muted-foreground">{message.subject}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{message.date}</span>
                        {message.unread && <div className="h-2 w-2 rounded-full bg-accent" />}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Unread Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">2</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bell className="h-4 w-4 text-accent" />
                      Announcements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">5</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Compose Message */}
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Recipient..." />
                <Input placeholder="Subject..." />
                <textarea placeholder="Message..." className="w-full p-3 rounded-lg border border-border min-h-32" />
                <Button className="bg-accent hover:bg-accent/90 w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
