'use client'

import React, { useEffect, useState } from 'react'
import Ticket from './Ticket'
import { motion } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { ITicket } from '../../types'
import { changeStatus } from '@/db/tickets'
interface ColumnProps {
    title: string,
    status: string,
    tickets: ITicket[]
}

// allTickets -> not filtered
// tickets -> filtered by priority
// filteredTickets -> filtered by column

export default function Column({title, status, tickets}: ColumnProps) {

    
  return (
    <motion.div layout

       className={`z-0 relative shadow-sm flex flex-col h-[calc(100vh-12rem)] bg-muted w-96 rounded-md p-3`}>
      
        {/* column header*/}
        <motion.div layout className="flex flex-row gap-2 items-center my-1 h-7">
            <h1 className="font-semibold">{title}</h1>
            <p className="text-primary/50 text-sm">{tickets.length}</p>
        </motion.div>

        {/* column body */}
        <ScrollArea>
        <div className="h-full flex-auto gap-2 flex flex-col"> 
            {   // The handle drag and drop functions are inside ticket now
                // Btw, consider moving these functions to a context if this gets refactored 
                tickets.map((ticket, index) => {
                    return <Ticket ticket={ticket} key={ticket.id}/> 
                })
            }
        </div>
        </ScrollArea>

    </motion.div>
  )
}
