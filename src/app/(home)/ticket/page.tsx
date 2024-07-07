import { getTickets } from "@/db/tickets";  
import { Toaster } from "@/components/ui/toaster";

export default async function ticket() {

    const tickets = await getTickets()

    return (
        <>
            {tickets.map((ticket) => (
                <div key = {ticket.id}>
                    <h1>{ticket.title}</h1>
                    <h2>{ticket.id}</h2>
                </div>
            ))}
        </>
    );
  }
