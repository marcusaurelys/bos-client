'use client'

import React, { useEffect, useState } from 'react'
import Column from './Column'
import Filter from './Filter';
import { WithId } from 'mongodb';
import Ticket from './Ticket';
import {ITicket} from '../../types'

interface BoardProps {
  ticketsData: ITicket[]
  changeStatus: (id: string, status: string) => void
}

function Board({ticketsData, changeStatus}: BoardProps) {
    const [tickets, setTickets] = useState(ticketsData)
    const [filters, setFilters] = useState(new Set<string>())
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

    const handleSetTickets = (tickets: ITicket[]) => {
        setTickets(tickets)
    }

    const addFilter = (toAdd: string) => {
      setFilters(f => new Set(f).add(toAdd))
      
    }

    const removeFilter = (toRemove: string) => {
      setFilters(f => {
        const newSet = new Set(f);
        newSet.delete(toRemove);
        return newSet;
      });
    };

    const clearFilters = () => {
      setFilters(f => new Set<string>())
    }

    


  return (
    <>
      <div className="z-10 relative my-3" >
        <Filter selected={filters} addFilter={addFilter} removeFilter={removeFilter} clearFilters={clearFilters}/>
      </div>
      <div className="flex gap-4 w-full h-full flex-wrap"> 
        <Column title="Pending" status="pending" tickets={tickets} filters={filters} setTickets={handleSetTickets} changeStatus={changeStatus}/>
        <Column title="Open" status="open" tickets={tickets} filters={filters} setTickets={handleSetTickets} changeStatus={changeStatus}/>
        <Column title="Closed" status="closed" tickets={tickets} filters={filters} setTickets={handleSetTickets} changeStatus={changeStatus}/>
      </div>
    </>
    
  )
}

export default Board
