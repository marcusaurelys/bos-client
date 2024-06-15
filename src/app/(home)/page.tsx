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

  async function handleChangeStatus(id: string, status: string) {
    'use server'
    await changeStatus(id, status)
  }

  const tickets = await getTickets()


  return (
   <main className=" w-full  flex justify-center">
      <div className="">
        <Board ticketsData={tickets} changeStatus={handleChangeStatus}/>
      </div>
      
   </main>
  );
}

