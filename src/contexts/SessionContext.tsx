'use client'

import { cookies } from 'next/headers'
import { createContext, useContext, useState } from 'react'

interface User {
    name : string,
    role : string
}

export const SessionContext = createContext<User | null>(null)

export default function SessionContextWrapper({ children } : any){
    
    return (
        <SessionContext.Provider value={user}>
            {children}
        </SessionContext.Provider>
    )
}
