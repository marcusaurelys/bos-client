'use client'

import { useState, useEffect, createContext, useContext} from 'react'

import {
    getTickets,
} from '@/db/tickets'

import {
    getAllUsers
} from '@/db/users'

type DataContext = {
    tite: string;
}

export const DataContext = createContext<DataContext | null>(null)

export default function DataContextProvider({ children }){
    const [tickets, setTickets] = useState<ITicket[]>([])
    const [filters, setFilters] = useState<string[]>([])
    const [ticketsTrigger, setTicketsTrigger] = useState(0)
    // Filter Functions
    const addFilter = (toAdd: string) => {
      setFilters([...filters, toAdd]);
    }

    const removeFilter = (toRemove: string) => {
      setFilters(filters.filter(filter => filter != toRemove));
    };

    const clearFilters = () => {
      setFilters([])
    }

    // Fetch tickets on initial page load
    useEffect(() => {
        const fetchTickets = async() => {
          const tickets = await getTickets()
          setTickets(tickets)
        } 
        
        fetchTickets()
        
    }, [ticketsTrigger])
    
    return (
        <DataContext.Provider 
            value={
            {
                tickets,
                setTickets,
                filters,
                setFilters,
                addFilter,
                removeFilter,
                clearFilters,
                ticketsTrigger,
                setTicketsTrigger,
            }
        }
        >
            {children}
        </DataContext.Provider>
    )
}

export function useDataContext() {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error(
            "Context is undefined"
        )
    }

    return context
}
