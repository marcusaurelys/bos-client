import { getTickets } from "@/db/tickets";
import Seed from '@/app/components/Seed';
import { fuckNextDB } from '@/db/mongo';
import { fuckNextTickets } from '@/db/tickets';
import { fuckNextChat } from '@/db/chat';
import { fuckNextUsers } from '@/db/users';

export default async function ticket() {

    fuckNextDB()
    fuckNextTickets()
    fuckNextChat()
    fuckNextUsers()
//    await seed_tickets_collection()
    const tickets = await getTickets()

    return (
        <>
            {tickets.map((ticket) => (
                <div key = {ticket._id}>
                    <h1>{ticket.name}</h1>
                    <h2>{ticket._id}</h2>
                </div>
            ))}
            <Seed/>
        </>
    );
  }
