import { SessionContext } from "@/components/SessionContext";
import Image from "next/image";
import { useContext } from "react";
import Hi from '@/components/Hi'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getToken } from '@/db/users'
import Board from "../components/Board";


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


export default function Home() {

  const userToken = cookies().get('session')?.value

  return (
   <main className="h-screen w-full p-10">
      <Board />
   </main>
  );
}

