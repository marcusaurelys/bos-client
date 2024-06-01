'use client'

import { useState, useContext } from 'react'
import { SessionContext } from '@/components/SessionContext'
import { redirect } from 'next/navigation'




export default function Page(){
    const user = useContext(SessionContext)

    if(user == null || user.role != "admin"){
        redirect('/login')
    }

    return (
        <h1>
            Welcome to Admin Dashboard, {user.name}
        </h1>
    )




}