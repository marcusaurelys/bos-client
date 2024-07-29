'use client'

import React, { useCallback, useRef, useState } from 'react'
import Ticket from './Ticket'
import { motion } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { ITicket } from '../../types'
import { changeStatus } from '@/db/tickets'
import { Button } from '@/components/ui/button'
import Sort from './Sort'
interface ColumnProps {
    title: string,
    status: string,
    tickets: ITicket[] | null
}

// allTickets -> not filtered
// tickets -> filtered by priority
// filteredTickets -> filtered by column

export default function Column({title, status, tickets}: ColumnProps) {

  const [numberOfTickets, setNumber] = useState(4)
  const observer = useRef<IntersectionObserver>()

  if(tickets === null) {
    tickets = []
  }
  
  const trigger = useCallback((node : HTMLElement | null) => {
    if(observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
        if(numberOfTickets < tickets.length && entries[0].isIntersecting){
            setNumber(prev => prev+4)
        }
    })
    if(node) observer.current.observe(node)
  }, [numberOfTickets, tickets.length])

  return (
    <motion.div layout
        id={`#column-${title}`}
       className={`z-0 relative shadow-sm flex flex-col h-[calc(100vh-12rem)] bg-muted w-96 rounded-md p-3`}>
      
        {/* column header*/}
        <motion.div layout className="flex flex-row gap-2 items-center my-1 h-7">
            <h1 className="font-semibold">{title}</h1>
            <p className="text-primary/50 text-sm">{tickets.length}</p>
            <div className="ml-auto">
                <Sort column={title}/>
            </div>
            
            
        </motion.div>

        {/* column body */}
        <ScrollArea data-test={`scrollarea-${title}`}>
        <div className="h-full flex-auto gap-2 flex flex-col" data-test={`header-${title}`}> 
            {   // The handle drag and drop functions are inside ticket now
                // Btw, consider moving these functions to a context if this gets refactored 
                tickets.slice(0, numberOfTickets).map((ticket, index) => {
                 
                   return <Ticket ticket={ticket} key={ticket.id}/>
                           
                })
            }
            <div ref={trigger}/>
        </div>
        </ScrollArea>

    </motion.div>
  )
}
