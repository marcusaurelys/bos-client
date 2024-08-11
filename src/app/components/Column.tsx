'use client'

import React, { useCallback, useRef, useState, memo } from 'react'
import Ticket from './Ticket'
import { motion } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { ITicket } from '../../types'
import Sort from './Sort'
interface ColumnProps {
    title: string,
    status: string,
    tickets: ITicket[] | null
}

// allTickets -> not filtered
// tickets -> filtered by priority
// filteredTickets -> filtered by column

const Column = memo(function Column({title, status, tickets}: ColumnProps) {
  const [topCounter, setTopCounter] = useState(0)
  const [bottomCounter, setBottomCounter] = useState(30)
  const top_observer = useRef<IntersectionObserver>()
  const bottom_observer = useRef<IntersectionObserver>()

  const [numberOfTickets, setNumber] = useState(20)
  const observer = useRef<IntersectionObserver>()

  if(tickets === null) {
    tickets = []
  }

  /**
   *  Renders the top 10 tickets when the node intersects with the listener
   * 
   *  @param {HTMLElement | null} node - current index being checked
   */
  const top_trigger = useCallback((node : HTMLElement | null) => {
    if(top_observer.current) top_observer.current.disconnect()
    top_observer.current = new IntersectionObserver(entries => {
        if(topCounter > 0 && entries[0].isIntersecting){
          setTopCounter(prev => prev - 10);
          setBottomCounter(prev => prev - 10);
        }
    })
    if(node) top_observer.current.observe(node)
  }, [topCounter])
  
  /**
   * Renders the bottom 10 tickets when the node intersects with the listener
   * 
   * @param {HTMLElement | null} node - current index being checked
   */
  const bottom_trigger = useCallback((node : HTMLElement | null) => {
    if(bottom_observer.current) bottom_observer.current.disconnect()
    bottom_observer.current = new IntersectionObserver(entries => {
        if(bottomCounter < tickets.length && entries[0].isIntersecting){
            setTopCounter(prev => prev+10)
            setBottomCounter(prev => prev+10)
        }
    })
    if(node) bottom_observer.current.observe(node)
  }, [bottomCounter, tickets.length])

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
            {
            <div className="m-2" ref={top_trigger}></div>
            }
            { 
                tickets.slice(topCounter, bottomCounter).map((ticket, index) => {
                  if(index == tickets.length - 1){}
                   return <Ticket ticket={ticket} key={ticket._id}/>
                           
                })
            }
            {
            bottomCounter < tickets.length &&
            <div ref={bottom_trigger}> Loading More Tickets... </div>
            }
        </div>
        </ScrollArea>

    </motion.div>
  )
})

export default Column
