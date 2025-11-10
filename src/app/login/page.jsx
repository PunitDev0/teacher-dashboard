"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState("") // 👈 use employeeId instead of email
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // 👇 Axios call to ERP API
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/staff/portal/login`,
        { employeeId, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      )

      // ✅ Save token & staff details
      localStorage.setItem("staffToken", data.token)
      localStorage.setItem("staffData", JSON.stringify(data.staff))

      // Redirect to dashboard
      router.push("/students")
    } catch (err) {
      console.error("Login error:", err)
      const message =
        err.response?.data?.message ||
        "Invalid Employee ID or Password. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-bold text-accent-foreground">TP</span>
          </div>
          <h1 className="text-3xl font-bold text-balance mb-2">
            Teacher Portal
          </h1>
          <p className="text-muted-foreground">
            Sign in to manage your classes and students
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border bg-card">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Employee ID Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Employee ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="EMP-2025-00025"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-100 p-2 rounded-md border border-red-300">
                  {error}
                </div>
              )}

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link
                  href="#"
                  className="text-accent hover:text-accent/90 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-10 font-medium transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="mb-4">
            By signing in, you agree to our{" "}
            <Link
              href="#"
              className="text-accent hover:text-accent/90 underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-accent hover:text-accent/90 underline"
            >
              Privacy Policy
            </Link>
          </p>
          <div className="space-y-2 pt-4 border-t border-border">
            <p>Need help? Contact support at support@teacherportal.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
