import Board from "../components/Board";
import { fuckNextTickets, getTicketByStatus } from '@/db/tickets'
import { fuckNextUsers } from '@/db/users'
import { fuckNextDB } from '@/db/mongo'
import Column from '@/app/components/Column'
import Filter from '@/app/components/Filter'


export default async function Home() {

  fuckNextDB()
  fuckNextUsers()
  fuckNextTickets()

  const [pending, open, closed] = await Promise.all([getTicketByStatus('pending'), getTicketByStatus('open'), getTicketByStatus('closed')])


  return (
   <>
    <main className="w-full h-[calc(100vh-3rem)] flex justify-center">
      <div className="w-full flex flex-row">
      <div className="flex justify-center items-start w-full h-full">
      <div className="flex flex-col w-fit justify-center">
            <div className="z-10 relative my-3" >
              <Filter/>
            </div>
            <div className="flex gap-12 flex-wrap"> 
              <Column title="Pending" status="pending" tickets={pending}/>
              <Column title="Open" status="open" tickets={open}/>
              <Column title="Closed" status="closed" tickets={closed}/>
            </div>
          </div>   
        </div>
      </div>    
   </main>
   </>
  );
  
}


