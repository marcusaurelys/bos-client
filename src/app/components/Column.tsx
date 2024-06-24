import React, { useEffect, useState } from 'react'
import Ticket from './Ticket'
import DropArea from './DropArea'
import { motion } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { ITicket } from '../../types'
import { useDataContext } from '@/contexts/DataContext'
import { changeStatus } from '@/db/tickets'
interface ColumnProps {
    title: string,
    status: string,
}

// allTickets -> not filtered
// tickets -> filtered by priority
// filteredTickets -> filtered by column

export default function Column({title, status}: ColumnProps) {
    const [active, setActive] = useState(false)
    const { tickets, setTickets } = useDataContext()
    const { filters, setFilters } = useDataContext()
    const [filteredTickets, setFilteredTickets] = useState<ITicket[]>([])
    
    useEffect(() => {
        const filtered_tickets_by_status = tickets.filter((ticket) => ticket.status.toLowerCase() === status.toLowerCase())
        
        if (filters.length > 0) {
             const filtered_tickets_by_priority = filters.map((filter) => {
                  return filtered_tickets_by_status.filter((ticket) => ticket.priority.toLowerCase() === filter.toLowerCase())
             }).flat()

             setFilteredTickets(filtered_tickets_by_priority)
        } else {
             setFilteredTickets(filtered_tickets_by_status)
        }
        return () => {
           // console.log(filteredTickets)
        }

    }, [tickets, filters])

    const handle_drag_enter = (e: React.DragEvent) => {
        e.preventDefault()
        setActive(true)
    }
  
    const handle_drag_over = (e: React.DragEvent) => {
        e.preventDefault()
        setActive(true)

        const ticket_status = e.dataTransfer.getData("ticket_status")
    
        if (ticket_status !== status) {
            e.dataTransfer.dropEffect = 'copy'
        }

    }

    const handle_drag_leave = (e: React.DragEvent) => {
        setActive(false)
    }

    const handle_drag_end = (e: React.DragEvent) => {
        setActive(false) 
        // Ticket was successfully dropped

        if (e.dataTransfer.dropEffect === 'copy') {
            const ticket_id = e.dataTransfer.getData("ticket_id")
            const filtered_copy = filteredTickets.filter((ticket) => ticket.id !== ticket_id)
            setFilteredTickets(filtered_copy)
        }
    }
    
    const handle_drop = (e: React.DragEvent) => {
        e.stopPropagation()
        setActive(false)

        const index = 0;
        // Assign status to columnStatus to make the functionality clear
        const ticket_id = e.dataTransfer.getData("ticket_id")
        const ticket_status = e.dataTransfer.getData("ticket_status")
        const ticket_index = e.dataTransfer.getData("ticket_index")
        const column_status = status
        
        console.log(`column_status - ${column_status}: ticket_status - ${ticket_status}`)
        console.log(`index to move to - ${index}: ticket_index - ${ticket_index}`)

        // If we are on the same column and the indexes are not the same
        if (column_status === ticket_status && index != ticket_index ) {

            const filtered_copy = filteredTickets.filter((ticket) => ticket.id !== ticket_id)

            let ticket_to_transfer = tickets.find((ticket) => ticket.id === ticket_id)
            ticket_to_transfer = {...ticket_to_transfer}
            if (!ticket_to_transfer) {
                return
            }

            filtered_copy.splice(index, 0, ticket_to_transfer)
            
            setFilteredTickets(filtered_copy)
            
        } else if ( column_status !== ticket_status ) {
    
            const filtered_copy = [...filteredTickets]
            let ticket_to_transfer = tickets.find((ticket) => ticket.id === ticket_id)
            ticket_to_transfer = {...ticket_to_transfer, status}
            if (!ticket_to_transfer) {
                return
            }

            filtered_copy.splice(index, 0, ticket_to_transfer)
            setFilteredTickets(filtered_copy)
            changeStatus(ticket_id, status)
            
        } 

    }

  return (
    <motion.div layout
       onDragEnter={handle_drag_enter}        
       onDragOver={handle_drag_over}
       onDragLeave={handle_drag_leave}
       onDragEnd={handle_drag_end}
       onDrop={handle_drop} 
       className={`z-0 relative shadow-sm flex flex-col h-[calc(100vh-12rem)] bg-muted w-96 rounded-md p-3 ${active ? "ring-2 ring-cyan-400" : ""}`}>
      
        {/* column header*/}
        <motion.div layout className="flex flex-row gap-2 items-center my-1 h-7">
            <h1 className="font-semibold">{title}</h1>
            <p className="text-primary/50 text-sm">{filteredTickets.length}</p>
        </motion.div>

        {/* column body */}
        <ScrollArea>
        <div className="h-full flex-auto gap-2 flex flex-col"> 
            {   // The handle drag and drop functions are inside ticket now
                // Btw, consider moving these functions to a context if this gets refactored 
                filteredTickets.map((ticket, index) => {
                    return <Ticket filteredTickets={filteredTickets} setFilteredTickets={setFilteredTickets} status={status} index={index} key={ticket.id} ticket={ticket} /> 
                })
            }
        </div>
        </ScrollArea>

    </motion.div>
  )
}
