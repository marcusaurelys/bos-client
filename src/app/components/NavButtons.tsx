'use client'

import  Link  from "next/link"
import { usePathname } from "next/navigation"


export default function NavButtons(){
    const pathName = usePathname()
    return (
        <>
            <Link href="/" className={`text-sm font-medium hover:underline ${pathName == "/" ? "text-sky-600": ""}`} prefetch={false}>
            Board
            </Link>

            <Link href="/admin" className={`text-sm font-medium hover:underline ${pathName.startsWith("/admin") ? "text-sky-600": ""}`} prefetch={false}>
            Team
            </Link> 
        </>
    )
}