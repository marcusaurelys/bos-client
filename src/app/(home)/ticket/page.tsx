import { getTickets } from "@/db/tickets";  
import { Toaster } from "@/components/ui/toaster";
import Seed from '@/app/components/Seed'
import { fuckNextDB } from '@/db/mongo'
import { fuckNextTickets } from '@/db/tickets'
import { fuckNextChat } from '@/db/chat'
import { fuckNextUsers } from '@/db/users'

export default async function ticket() {

    fuckNextDB()
    fuckNextTickets()
    fuckNextChat()
    fuckNextUsers()
    // await seed_tickets_collection()
    const tickets = await getTickets()

    return (
        <>
            {tickets.map((ticket) => (
                <div key = {ticket.id}>
                    <h1>{ticket.title}</h1>
                    <h2>{ticket.id}</h2>
                </div>
            ))}
            <Seed/>
        </>
    );
  }
