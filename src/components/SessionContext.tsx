'use client'

import { cookies } from 'next/headers'
import { createContext, useContext, useState } from 'react'
import { getToken } from '@/db/users'


interface User {
    name : string,
    role : string
}

export const SessionContext = createContext<User | null>(null)

export default function SessionContextWrapper({ session, children } : any){
    
    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}
