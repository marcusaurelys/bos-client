'use server'

import { SessionContext } from "@/components/SessionContext";
import Image from "next/image";
import { useContext } from "react";
import Hi from '@/components/Hi'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getToken } from '@/db/users'
import { validateUser } from "@/lib/auth";
import Board from "../components/Board";
import { changeStatus, getTickets } from "@/db/tickets";

export default async function Home() {

  const user = await validateUser(['admin', 'member'])

  if(!user){
    redirect('/login')
  }
  else {
      redirect('/login?noAccess')
  }

  async function handleChangeStatus(id: string, status: string) {
    await changeStatus(id, status)
  }


  return (
   <main className="h-screen w-full p-10 flex justify-center">
      <div className="">
        <Board ticketsData={tickets}/>
      </div>
      
   </main>
  );
}

