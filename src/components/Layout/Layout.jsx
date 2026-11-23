"use client"

import { AppSidebar } from "@/components/Layout/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import AppHeader from "@/components/Layout/app-header"

export default function Layout({ children }) {
  return (
    <SidebarProvider className="h-screen overflow-hidden bg-[#F6F4EE]">
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden min-w-0 flex-1 w-full bg-[#F6F4EE]">
        {/* Fixed Header */}
        <AppHeader />

        {/* Scrollable Main Content Area with Warm Cream Palette */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 w-full min-w-0 bg-[#F6F4EE]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
