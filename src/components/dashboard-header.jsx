"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  MessageSquare,
  LogOut,
  Settings,
  Table,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  // {
  //   name: "Dashboard",
  //   href: "/",
  //   icon: LayoutDashboard,
  // },
  {
    name: "Students",
    href: "/students",
    icon: Users,
  },
  {
    name: "Attendance",
    href: "/attendance",
    icon: UserCheck,
  },
  {
    name: "Time-Table",
    href: "/timetable",
    icon: Table,
  },
  // {
  //   name: "Exams & Results",
  //   href: "/exams",
  //   icon: GraduationCap,
  // },
  {
    name: "Assignments",
    href: "/assignments",
    icon: BookOpen,
  },
  // {
  //   name: "Communication",
  //   href: "/communication",
  //   icon: MessageSquare,
  // },
];

export function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-3 sm:px-4 md:px-6 relative">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-sm font-bold text-accent-foreground">TP</span>
          </div>
          <h1 className="text-lg font-bold hidden sm:block text-foreground">
            Teacher Portal
          </h1>
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25"
                    : "text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden lg:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 hover:bg-muted text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 hover:bg-muted"
              >
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-xs font-medium text-accent-foreground">
                    JD
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-card border-border"
            >
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">
                    Mathematics Teacher
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-foreground focus:bg-muted cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground focus:bg-muted cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-foreground focus:bg-muted cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
          <nav className="flex flex-col gap-1 p-3 sm:p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25"
                      : "text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
