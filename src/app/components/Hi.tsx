'use client'

import { SessionContext } from "./SessionContext"
import { useContext } from 'react'


export default function Hi() {
    
    const user = useContext(SessionContext)
    console.log(user)
    console.log(SessionContext)

    return (
      <div>
        Hi {user ? user.name : 'not logged in'}
      </div>
    )
  }