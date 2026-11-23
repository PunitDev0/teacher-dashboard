import Layout from "@/components/Layout/Layout"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"

export const metadata = {
  title: "Faculty Dashboard | Teacher Portal",
  description: "Overview of your classes, timetable, attendance, and student performance",
}

export default function DashboardPage() {
  return (
    <Layout>
      <TeacherDashboard />
    </Layout>
  )
}
