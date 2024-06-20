import { redirect } from 'next/navigation'
import { validateUser } from "@/lib/auth";
import Board from "../components/Board";
import { fuckNextTickets } from '@/db/tickets'
import { fuckNextUsers } from '@/db/users'
import { fuckNextDB } from '@/db/mongo'

export default async function Home() {

  const user = await validateUser(['admin', 'member'])

  if(!user){
    redirect('/login')
  }

  fuckNextDB()
  fuckNextUsers()
  fuckNextTickets()

  return (
   <>
    <main className=" w-full h-[calc(100vh-3rem)] flex justify-center">
      <div className="w-full flex flex-row">
        <Board/>
      </div>    
   </main>
   </>
  );
  
}


