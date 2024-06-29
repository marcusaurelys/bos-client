'use client'

import  Link  from "next/link"
import { usePathname } from "next/navigation"

interface User {
    role: string,
    email: string,
    name : string
}

export default function NavButtons({ user } : {user: User}){
    const pathName = usePathname()
    return (
        <>
            <Link href="/" className={`text-sm font-medium hover:underline ${pathName == "/" ? "text-sky-600": ""}`} prefetch={false}>
            Board
            </Link>
            {
            user?.role === "admin" 
            ?
            <Link href="/admin" className={`text-sm font-medium hover:underline ${pathName.startsWith("/admin") ? "text-sky-600": ""}`} prefetch={false}>
            Team
            </Link> 
            : <></> }
        </>
    )
}