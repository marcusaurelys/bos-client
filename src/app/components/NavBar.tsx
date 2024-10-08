import Link from "next/link"
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getUserByToken, logout } from '@/db/users'
import { cookies } from "next/headers"
import NavButtons from "./NavButtons"
import { redirect } from "next/navigation"

export default async function NavBar() {

  const userString = cookies().get('user')?.value

  if (!userString) {
      redirect('/login')
  }

  const user = JSON.parse(userString)

  return (
    <header className="flex items-center justify-between px-16 h-12 text-primary border-b ">
      <Link href="/" className="flex items-center" prefetch={true}>
        <span className="text-lg font-bold text-primary">business</span>
        <span className="text-lg font-bold text-sky-600">OS</span>
      </Link>
      <nav className="hidden md:flex items-center gap-4">
          <NavButtons/>
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
          <Link href="/login" className={`text-sm font-medium hover:underline`} prefetch={true}>
            Login
          </Link> 

        }
        
      </nav>
      
    </header>
  )
}
