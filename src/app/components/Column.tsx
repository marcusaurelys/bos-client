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
            console.log(filteredTickets)
        }

    }, [tickets, filters])

    
    const handleDragStart = (e: React.DragEvent<HTMLElement>, ticket: ITicket) => {
        e.dataTransfer.setData("ticketId", ticket.id)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        highlightDropArea(e)
        setActive(true)
    }

    const handleDragLeave = () => {
        clearHighlights()
        setActive(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        clearHighlights()
        setActive(false)

        const ticketId = e.dataTransfer?.getData("ticketId")

        const dropAreas = getDropAreas()
        const { element } = getNearestDropArea(e, dropAreas)

        const before = element.dataset.id || "-1"


        if(before !== ticketId) {
            
            let copy = [...tickets]

            let ticketToTransfer = copy.find((c) => c.id == ticketId)

            if (!ticketToTransfer) return

            ticketToTransfer = {...ticketToTransfer, status}

            copy = copy.filter((c) => c.id !== ticketId)

            const moveToBack = before === "-1"

            if(moveToBack) {
                copy.unshift(ticketToTransfer)

            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before)
                
                if(insertAtIndex === undefined ) return
                
                copy.splice(insertAtIndex, 0, ticketToTransfer)
            }

            console.log(copy)
            setTickets(copy)
            changeStatus(ticketId, status)
        }

    }

    const highlightDropArea = (e: React.DragEvent) => {
        const dropAreas = getDropAreas()
        clearHighlights()
        const el = getNearestDropArea(e, dropAreas)
        el.element.style.opacity ="1"
    }

    const clearHighlights = () => {
        const dropAreas = getDropAreas()

        dropAreas.forEach((i) => {
            i.style.opacity = "0"
        })

    }

    const getDropAreas = () => {
        return Array.from(document.querySelectorAll<HTMLElement>(`[data-column="${status}"]`))
    }

    const getNearestDropArea  = (e: React.DragEvent, dropAreas: HTMLElement[]) => {
        const DISTANCE_OFFSET = 75

        const el = dropAreas.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect()
                const offset = e.clientY - (box.top + DISTANCE_OFFSET)

                if(offset < 0 && offset > closest.offset) {
                    return {offset: offset, element: child}
                } else {
                    return closest
                }

            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: dropAreas[dropAreas.length-1]
            }
        )

        return el
    }

  return (
    <motion.div layout onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`z-0 relative shadow-sm flex flex-col h-[calc(100vh-12rem)] bg-muted w-96 rounded-md p-3 ${active ? "ring-2 ring-cyan-400" : ""}`}>
        {/* column header*/}
        <motion.div layout className="flex flex-row gap-2 items-center my-1 h-7">
            <h1 className="font-semibold">{title}</h1>
            <p className="text-primary/50 text-sm">{filteredTickets.length}</p>
        </motion.div>

        {/* column body */}
        <ScrollArea>
        <div className="h-full flex-auto gap-2 flex flex-col"> 
            <DropArea id={"-1"} status={status}/>
            {
                filteredTickets.map((ticket, index) => {
                    return <Ticket key={ticket.id} ticket={ticket} handleDragStart={handleDragStart}/> 
                })
            }
        </div>
        </ScrollArea>

    </motion.div>
  )
}
