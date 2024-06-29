import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from '@/components/ui/separator'
import { UserSession } from '@/types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Command, CommandDialog, CommandItem, CommandList } from '@/components/ui/command'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getUserByToken, logout } from '@/db/users'
import { cookies } from "next/headers"

import { headers } from 'next/headers'
import NavButtons from "./NavButtons"

export default async function NavBar({}) {

  const pathname = headers().get('url')
  console.log('url: ', headers().get('url'))
  
  const response = await getUserByToken(cookies().get('session')?.value || '')
  const user = {
    name: response?.name,
    email: response?.email,
    role: response?.role
  }

  return (
    <header className="flex items-center justify-between px-16 h-12 text-primary border-b ">
      <Link href="/" className="flex items-center" prefetch={false}>
        <span className="text-lg font-bold text-primary">business</span>
        <span className="text-lg font-bold text-sky-600">OS</span>
      </Link>
      <nav className="hidden md:flex items-center gap-4">
          <NavButtons user={user}/>
        <Separator className="h-4" orientation="vertical" />
        {
          user 
          ? 
          <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row text-primary text-sm items-center gap-2 font-semibold">
                <div>{user?.name}</div>
                <Avatar className="h-6 w-6 cursor-pointer">
                  <AvatarImage src={""}/>
                  <AvatarFallback className="bg-sky-500 text-white text-xs font-semibold">{user?.name.split(" ").map((n : string)=>n[0]).join("")}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <p className="text-md">{user?.name}</p>
                    <p className="text-md text-primary/50">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                {/* <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                  <Link href="/settings"><DropdownMenuItem>Settings</DropdownMenuItem></Link>
                </DropdownMenuGroup> */}
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="text-red-600">
                <form action={logout}>
                  <button>
                    Log out
                  </button>
                </form>
                </DropdownMenuItem>
                
                
              </DropdownMenuContent>
          </DropdownMenu>
          : 
          <Link href="/login" className={`text-sm font-medium hover:underline`} prefetch={false}>
            Login
          </Link> 

        }
        
      </nav>
      
    </header>
  )
}
