  import { changeStatus, getTickets } from "@/db/tickets";
  
  

export default async function ticket() {

    const tickets = await getTickets()

    return (<>
        {tickets.map((ticket) => (
            <div>
                <h1>{ticket.title}</h1>
                <h2>{ticket.id}</h2>
            </div>
            ))}
    </>
    );
  }