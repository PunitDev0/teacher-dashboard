"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("staffToken");

    // If not logged in and not already on /login
    if (!token && pathname !== "/login") {
      router.replace("/login");
    }
  }, [router, pathname]);

  return null; // this component doesn't render anything
}
