'use client'

import  Link  from "next/link"
import { usePathname } from "next/navigation"
import { memo } from 'react'

const NavButtons = memo(function NavButtons() {
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
})

export default NavButtons
