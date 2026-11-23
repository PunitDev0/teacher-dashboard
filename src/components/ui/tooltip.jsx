"use client"

import * as React from "react"

export function TooltipProvider({ children }) {
  return <>{children}</>
}

export function Tooltip({ children }) {
  return <>{children}</>
}

export function TooltipTrigger({ asChild, children, ...props }) {
  return <div className="inline-flex w-full" {...props}>{children}</div>
}

export function TooltipContent({ children }) {
  return null
}
