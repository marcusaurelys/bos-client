import Board from "../components/Board";
import { fuckNextTickets } from '@/db/tickets'
import { fuckNextUsers } from '@/db/users'
import { fuckNextDB } from '@/db/mongo'

export default async function Home() {

  fuckNextDB()
  fuckNextUsers()
  fuckNextTickets()

  return (
   <>
    <main className="w-full h-[calc(100vh-3rem)] flex justify-center">
      <div className="w-full flex flex-row">
        <Board/>
      </div>    
   </main>
   </>
  );
  
}


