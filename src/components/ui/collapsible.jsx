"use client"

import * as React from "react"

export function Collapsible({ open, onOpenChange, children, className = "" }) {
  return (
    <div className={className} data-state={open ? "open" : "closed"}>
      {children}
    </div>
  )
}

export function CollapsibleTrigger({ asChild, children, ...props }) {
  return (
    <div {...props} className="cursor-pointer">
      {children}
    </div>
  )
}

export function CollapsibleContent({ children, className = "" }) {
  return <div className={className}>{children}</div>
}
