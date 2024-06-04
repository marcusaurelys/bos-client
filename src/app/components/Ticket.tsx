import React from 'react'
import DropArea from './DropArea'
import {motion} from 'framer-motion'
import { TagIcon } from '@heroicons/react/16/solid'

interface TicketProps {
    ticket: Ticket
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, ticket: Ticket) => void
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
    <motion.div layout layoutId={ticket.id.toString()} onDragStart={(e) => {handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, ticket)}} className='flex flex-col bg-card rounded-sm p-3 text-sm h-fit gap-1 cursor-grab active:cursor-grabbing' draggable="true" >

        {/* ticket tags */}
        <div className="flex gap-2 flex-wrap">
            <div className={`flex flex-row rounded-md w-fit text-xs py-1 px-2 items-center gap-2 mb-1 text-white ${priorityColor}`}>
                <h1>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</h1>
            </div>
            {
                ticket.tags.map((tag, index) => {
                    return <div key={index} className="flex flex-row rounded-md w-fit text-xs border py-1 px-2 items-center gap-2 mb-1">
                        <TagIcon className="h-4 fill-none stroke-primary/40"/>
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
        <div className="mb-4">
                <h1>{ticket.description}</h1>
        </div>

        {/* ticket footer */}
        <div className="flex flex-row mt-auto">
                <h1 className="text-xs text-primary/75 ml-auto">{ticket.dateCreated.slice(4,15)}</h1>
        </div>


    </motion.div>

    

    
  </>

    
  )
}

export default Ticket
