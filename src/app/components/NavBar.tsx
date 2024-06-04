import React from 'react'
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"


function NavBar() {
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-gray-900 text-white shadow-md md:px-6">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <span className="text-lg font-semibold">businessOS</span>
      </Link>
      <nav className="hidden md:flex items-center gap-4">
        <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
          KanbanBoard
        </Link>
        <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
          Team
        </Link>
        <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
          Login
        </Link>
      </nav>
      
    </header>
  )
}

export default NavBar
