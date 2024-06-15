'use client'

import React from 'react'
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { usePathname } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { UserSession } from '@/types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Command, CommandDialog, CommandItem, CommandList } from '@/components/ui/command'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface NavBarProps {
  user: UserSession | null
}

function NavBar(user: NavBarProps) {
  const pathName = usePathname()

  return (
    <header className="flex items-center justify-between px-4 py-3 text-primary border-b  md:px-6">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <span className="text-lg font-semibold text-primary">businessOS</span>
      </Link>
      <nav className="hidden md:flex items-center gap-4">
        <Link href="/" className={`text-sm font-medium hover:underline ${pathName == "/" ? "text-sky-600": ""}`} prefetch={false}>
          Board
        </Link>
        <Link href="/admin" className={`text-sm font-medium hover:underline ${pathName.startsWith("/admin") ? "text-sky-600": ""}`} prefetch={false}>
          Team
        </Link>
        <Separator className="h-4" orientation="vertical" />
        {
          user 
          ? 
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-6 w-6 cursor-pointer">
                  <AvatarImage src={""}/>
                  <AvatarFallback className="bg-red-500 text-white text-xs">JB</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <p className="text-md">Joel Batac</p>
                    <p className="text-md text-primary/50">joel_batac@dlsu.edu.ph</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                  <Link href="/settings"><DropdownMenuItem>Settings</DropdownMenuItem></Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>



              </DropdownMenuContent>
          </DropdownMenu>
          : 
          <Link href="/login" className={`text-sm font-medium hover:underline ${pathName.startsWith("/login") ? "text-sky-600": ""}`} prefetch={false}>
            Login
          </Link> 

        }
        
      </nav>
      
    </header>
  )
}

export default NavBar
