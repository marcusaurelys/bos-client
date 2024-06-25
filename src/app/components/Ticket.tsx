import React, {useState} from 'react'
import DropArea from './DropArea'
import {motion} from 'framer-motion'
import { TagIcon } from '@heroicons/react/16/solid'
import {User, ITicket} from "../../types"
import EmployeeTable from './EmployeeTable'
import { useDataContext } from '@/contexts/DataContext'
import Link from 'next/link'
import { changeStatus } from '@/db/tickets'
interface TicketProps {
    ticket: ITicket
}

export default function Ticket({filteredTickets, setFilteredTickets, status, index, ticket}: TicketProps) {
    const [active, setActive] = useState(false)
    const { tickets } = useDataContext()
    let priorityColor
    if(ticket.priority.toLowerCase() === "high") {
        priorityColor = "bg-red-500"
    }
    if(ticket.priority.toLowerCase() === "medium") {
        priorityColor = "bg-yellow-400"
    }
    if(ticket.priority.toLowerCase() === "low") {
        priorityColor = "bg-green-500"
    }
    
    const handle_drag_start = (e) => { 
        e.stopPropagation()
        e.dataTransfer.setData("ticket_id", ticket.id)
        e.dataTransfer.setData("ticket_status", ticket.status)
        e.dataTransfer.setData("ticket_index", index)
        e.dataTransfer.effectAllowed = "all"

    }

    const handle_drag_enter = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setActive(true)
        
        const ticket_status = e.dataTransfer.getData("ticket_status")
    

        if (ticket_status !== status) {
            e.dataTransfer.dropEffect = 'copy'
        } else {
            e.dataTransfer.dropEffect = 'move'
        }
        
    }

    const handle_drag_over = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setActive(true)

        const ticket_status = e.dataTransfer.getData("ticket_status")
        if (ticket_status !== status) {
            e.dataTransfer.dropEffect = 'copy'
        } else {
            e.dataTransfer.dropEffect = 'move'
        }
    
    }

    const handle_drag_leave = (e: React.DragEvent) => {
        e.stopPropagation()
        setActive(false)
    }

    const handle_drag_end = (e: React.DragEvent) => {
        e.stopPropagation()
        setActive(false) 
        // Ticket was successfully dropped
        if (e.dataTransfer.dropEffect === 'copy' && (e.dataTransfer.items.length === 3 || e.dataTransfer.items.length === 11) && e.dataTransfer.getData("ticket_id")) {
            const ticket_id = e.dataTransfer.getData("ticket_id")
            let filtered_copy = filteredTickets.map((ticket) => (
                {...ticket, tags: [...ticket.tags], userIDs: [...ticket.userIDs]}
            ))
            filtered_copy = filtered_copy.filter((ticket) => ticket.id !== ticket_id)
            setFilteredTickets(filtered_copy)
        }
    }
    
    const handle_drop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setActive(false)

 
        if (e.dataTransfer.items.length != 3 && e.dataTransfer.items.length != 11 || !e.dataTransfer.getData("ticket_id")) {
                        
            return
        }

        
        // Assign status to columnStatus to make the functionality clear
        const ticket_id = e.dataTransfer.getData("ticket_id")
        const ticket_status = e.dataTransfer.getData("ticket_status")
        const ticket_index = e.dataTransfer.getData("ticket_index")
        const column_status = status
        
        console.log(`column_status - ${column_status}: ticket_status - ${ticket_status}`)
        console.log(`index to move to - ${index}: ticket_index - ${ticket_index}`) 
        if (ticket_status !== status) {
            e.dataTransfer.dropEffect = 'copy'
        } else {
            e.dataTransfer.dropEffect = 'move'
        }

        // If we are on the same column and the indexes are not the same
        if (column_status === ticket_status && index != ticket_index ) {
            let filtered_copy = filteredTickets.map((ticket) => (
                {...ticket, tags: [...ticket.tags], userIDs: [...ticket.userIDs]}
            ))
            filtered_copy = filtered_copy.filter((ticket) => ticket.id !== ticket_id)

            let ticket_to_transfer = tickets.find((ticket) => ticket.id === ticket_id)
            ticket_to_transfer = {...ticket_to_transfer, tags: [...ticket_to_transfer.tags], userIDs: [...ticket_to_transfer.userIDs]}
            if (!ticket_to_transfer) {
                return
            }

            filtered_copy.splice(index, 0, ticket_to_transfer)
            
            setFilteredTickets(filtered_copy)
            
        } else if ( column_status !== ticket_status ) {
            const filtered_copy = filteredTickets.map((ticket) => (
                {...ticket, tags: [...ticket.tags], userIDs: [...ticket.userIDs]}
            ))
            const ind = tickets.findIndex((ticket) => ticket.id === ticket_id)
            if (ind == -1) {
                return
            }

            const ticket_to_transfer = {...tickets[ind], status, tags: [...tickets[ind].tags], userIDs: [...tickets[ind].userIDs]}
            tickets[ind].status = status
            
            filtered_copy.splice(index, 0, ticket_to_transfer)
            setFilteredTickets(filtered_copy)
            changeStatus(ticket_id, status)
        } 

    }
    
    

  return ( <>

    <motion.div layout layoutId={ticket.id.toString()} 
        onDragStart={handle_drag_start}
        onDragEnter={handle_drag_enter}
        onDragLeave={handle_drag_leave}
        onDragOver={handle_drag_over}
        onDragEnd={handle_drag_end} 
        onDrop={handle_drop} 
        className={`flex flex-col bg-card rounded-sm p-3 text-sm h-fit gap-1 cursor-grab active:cursor-grabbing ${active ? "ring-2 ring-cyan-400 ring-inset" : ""}`}
        draggable="true">
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
        
        <Link href={`ticket/${ticket.id}`}>
            {/* ticket description */}
        <div className="font-semibold">
                <h1>{ticket.title}</h1>
        </div>

        {/* ticket description */}
        <div className="mb-4">
                <h1>{ticket.description}</h1>
        </div>
        </Link>
        

        {/* ticket footer */}
        <div className="flex flex-row mt-auto">
            <EmployeeTable ticket={ticket}/>
            <h1 className="text-xs text-primary/75 ml-auto">{ticket.dateCreated.slice(4,15)}</h1>
        </div>


    </motion.div>

    

    
  </>

    
  )
}
