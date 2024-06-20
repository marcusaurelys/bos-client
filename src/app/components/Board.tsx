'use client'

import React, { useState, useEffect } from 'react'
import { useDataContext } from '@/contexts/DataContext'
import Column from './Column'
import Filter from './Filter';
import { WithId } from 'mongodb';
import { ITicket } from '@/types';

export default function Board() {
    const { tickets, setTickets } = useDataContext()
    
    // const [filteredTickets, setFilteredTickets] = useState(tickets)

    // useEffect(() => {
    //   let filtered = [...tickets]
    
    //   if(filters.size > 0) {
    //     let temps = Array.from(filters).map((filter => {
    //       let temp = tickets.filter((t) => t.priority === filter)
    //       return temp
    //     }))
    //     console.log(temps.flat())
    //     filtered = temps.flat()
    //   }

    //   setFilteredTickets(t => filtered)
    // }, [filters])

  return (
    <div className="flex justify-center items-start w-full h-full">
      <div className="flex flex-col w-fit justify-center">
        <div className="z-10 relative my-3" >
          <Filter/>
        </div>
        <div className="flex gap-12 flex-wrap"> 
          <Column title="Pending" status="pending"/>
          <Column title="Open" status="open"/>
          <Column title="Closed" status="closed"/>
        </div>
      </div>   
    </div>
    
  )
}
