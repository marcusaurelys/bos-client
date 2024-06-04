'use server'

import { SessionContext } from "@/components/SessionContext";
import Image from "next/image";
import { useContext } from "react";
import Hi from '@/components/Hi'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getToken } from '@/db/users'
import Board from "../components/Board";
import { changeStatus, getTickets } from "@/db/tickets";


export async function verifyUser(role : string){
  'use server'
  const userToken = cookies().get('session')?.value
  console.log('i am running')

  if(userToken){
      const data = await getToken(userToken)
      if(data && role == data.role){
          return true
      }
  }
  else {
      redirect('/login?noAccess')
  }

}


export default async function Home() {

  const userToken = cookies().get('session')?.value
  const tickets = await getTickets() || []


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

