import React from 'react'
import DropArea from './DropArea'

interface TicketProps {
    ticket: Ticket
    handleDragStart: (e: React.DragEvent, ticket: Ticket) => void
}

function Ticket({ticket, handleDragStart}: TicketProps) {

    let priorityColor
    if(ticket.priority == "high") {
        priorityColor = "bg-red-500"
    }
    if(ticket.priority == "medium") {
        priorityColor = "bg-yellow-400"
    }
    if(ticket.priority == "low") {
        priorityColor = "bg-green-500"
    }

  return ( <>

    <DropArea id={ticket.id} status={ticket.status}/>
    <div onDragStart={(e) => handleDragStart(e, ticket)} className='flex flex-col bg-card rounded-sm p-3 text-sm  h-36 gap-1 cursor-grab active:cursor-grabbing' draggable="true" >

        {/* ticket tags */}
        <div className="flex flex-row gap-2">
            <div className={`flex flex-row rounded-md w-fit text-xs py-1 px-2 items-center gap-2 mb-1 text-white ${priorityColor}`}>
                <h1>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</h1>
            </div>
            {
                ticket.tags.map((tag, index) => {
                    return <div key={index} className="flex flex-row rounded-md w-fit text-xs border py-1 px-2 items-center gap-2 mb-1">
                        <h1>{tag.charAt(0).toUpperCase() + tag.slice(1)}</h1>
                    </div>
                })
            }

        </div>
        

        {/* ticket description */}
        <div className="font-semibold">
                <h1>{ticket.title}</h1>
        </div>

        {/* ticket description */}
        <div className="">
                <h1>{ticket.description}</h1>
        </div>

        {/* ticket footer */}
        <div className="flex flex-row mt-auto">
                <h1 className="text-xs text-primary/75 ml-auto">{ticket.dateCreated.slice(0,10)}</h1>
        </div>


    </div>

    

    
  </>

    
  )
}

export default Ticket
