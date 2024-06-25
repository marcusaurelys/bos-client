'use client'

import { useState, useEffect, createContext, useContext} from 'react'

import {
    getTickets,
} from '@/db/tickets'

import { ITicket } from '@/types'

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
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    
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

    // Fetch tickets and users on initial page load
    useEffect(() => {
        let abort = false
        setLoading(true)
        
        const fetchTickets = async() => {
          const tickets = await getTickets()
          return tickets
        } 

        const fetchUsers = async() => {
            const response = await getAllUsers()
            const users = JSON.parse(response)
            return users
        }

        const fetchData = async() => {
            const [tickets, users] = await Promise.all([fetchTickets(), fetchUsers()])

            if (!abort) { 
                setTickets(tickets)
                setUsers(users)
                setLoading(false)
            }
        }

        fetchData()

        return () => {
            abort = true
        }
        
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
                users,
                setUsers,
                loading,
                setLoading,
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
