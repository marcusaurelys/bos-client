import React, { useState } from 'react'
import Ticket from './Ticket'
import DropArea from './DropArea'
import {motion} from 'framer-motion'


interface ColumnProps {
    title: string,
    status: string,
    tickets: Ticket[],
    setTickets: any
}

function Column({title, status, tickets, setTickets}: ColumnProps) {
    const [active, setActive] = useState(false)
    const filteredTickets = tickets.filter((t) => t.status === status)

    const handleDragStart = (e: React.DragEvent<HTMLElement>, ticket: Ticket) => {
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
                copy.push(ticketToTransfer)

            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before)
                
                if(insertAtIndex === undefined ) return
                
                copy.splice(insertAtIndex, 0, ticketToTransfer)
            }

            setTickets(copy)
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
    <motion.div layout onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`flex flex-col bg-muted w-96 rounded-md h-fit p-3 ${active ? "ring-2 ring-cyan-400" : ""}`}>
        {/* column header*/}
        <motion.div layout className="flex flex-row gap-2 items-center my-1 h-7">
            <h1 className="font-semibold">{title}</h1>
            <p className="text-primary/50 text-sm">{filteredTickets.length}</p>
        </motion.div>

        {/* column body */}
        <div className=" flex-auto"> 
            
            {
                filteredTickets.map((ticket, index) => {
                    return <Ticket key={ticket.id} ticket={ticket} handleDragStart={handleDragStart}/> 
                })
            }
            <DropArea id={"-1"} status={status}/>
            
        </div>
        

    </motion.div>
  )
}

export default Column
