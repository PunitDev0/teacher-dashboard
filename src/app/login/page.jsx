import { Suspense } from "react"
import Image from "next/image"
import { TeacherLoginForm } from "@/components/teacher/loginForm"

export const metadata = {
  title: "Faculty Login | Teacher Portal",
  description: "Sign in to manage classes, attendance, grading, and students",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#fbfcfe] flex flex-col md:grid md:grid-cols-2 p-4 sm:p-6 md:p-8 lg:p-10 gap-6 lg:gap-14 items-stretch relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute -top-24 -right-24 w-[480px] h-[480px] bg-purple-200/25 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] bg-blue-100/30 rounded-full blur-[110px] pointer-events-none" />

      {/* Left: Blue Hero Card */}
      <section className="bg-[#4f5dfb] text-white rounded-[28px] md:rounded-[36px] lg:rounded-[44px] p-8 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[480px] md:min-h-full shadow-sm">
        {/* Top Text Content */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-normal text-white/95 mb-4 select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Faculty & Teacher Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal text-white tracking-normal leading-[1.2] mb-4">
            Simplify<br />
            teaching with<br />
            our portal
          </h2>
          <p className="text-white/85 text-sm sm:text-base font-normal leading-relaxed max-w-md">
            Seamlessly track student attendance, manage subject assignments, enter examination grades, and communicate with ease.
          </p>
        </div>

        {/* Bottom 3D Graphic */}
        <div className="relative w-full mt-auto pt-8 flex items-end justify-center">
          <div className="relative w-full max-w-[380px] sm:max-w-[420px] rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/25 border border-white/25 bg-white/10 backdrop-blur-sm">
            <Image
              src="/teacher-hero-3d.jpg"
              alt="Faculty & Teacher Portal 3D Illustration"
              width={700}
              height={700}
              className="w-full h-auto object-cover select-none pointer-events-none hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>
      </section>

      {/* Right: Clean Minimal Login Section */}
      <section className="flex flex-col justify-center items-center px-4 sm:px-8 md:px-6 lg:px-12 py-8 relative z-10">
        <div className="w-full max-w-sm">
          <Suspense fallback={<div className="text-center text-sm font-normal text-gray-400">Loading form...</div>}>
            <TeacherLoginForm />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
