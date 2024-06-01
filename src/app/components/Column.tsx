import React, { useState } from 'react'
import Ticket from './Ticket'
import DropArea from './DropArea'

interface ColumnProps {
    title: string,
    status: string,
    tickets: Ticket[]
}

function Column({title, status, tickets}: ColumnProps) {
    const [active, setActive] = useState(false)
    const filteredTickets = tickets.filter((t) => t.status === status)

    const handleDragStart = (e: React.DragEvent, ticket: Ticket) => {
        e.dataTransfer.setData("ticketId", ticket.id.toString())
    }

  return (
    <div className={`bg-muted w-96 rounded-md h-full p-3 active:border ${active ? "ring-2 ring-cyan-400" : ""}`}>
        {/* column header*/}
        <div className="flex flex-row gap-2 items-center my-1">
            <h1 className="font-semibold">{title}</h1>
            <p className="text-primary/50 text-sm">{filteredTickets.length}</p>
        </div>

        {/* column body */}
        <div> 
            
            {
                filteredTickets.map((ticket, index) => {
                    return <Ticket key={ticket.id} ticket={ticket} handleDragStart={handleDragStart}/> 
                })
            }
            <DropArea id={-1} status={status}/>
            
        </div>
        

    </div>
  )
}

export default Column
