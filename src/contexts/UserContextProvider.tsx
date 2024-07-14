'use client'

import { UserSession } from "@/types";
import React, { createContext } from "react";

export const UserContext = createContext<UserSession | null>(null)

export default function UserContextProvider({
    user, children,
  }: Readonly<{
    user : UserSession,
    children: React.ReactNode;
  }>) {
    return(

      <UserContext.Provider value={user}>
        {children}
      </UserContext.Provider>
      
    )
}