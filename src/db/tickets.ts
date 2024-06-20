'use server'

import { useDB } from "@/db/mongo"
import { ObjectId } from "mongodb"
import { ITicket } from '@/types'

const db = await useDB()
const tickets = db.collection('tickets')

export const fuckNextTickets = async() => {
    
    
}

export const getTickets = async () => {
    let ticketsData: ITicket[] = []
    
    const result = await tickets.find({}).toArray()
    
    result.forEach((ticket) => {
        try {
            ticketsData.push({
                id: ticket._id.toString(), 
                title: ticket.name,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority_score,
                userIDs: ticket.userIDs ?? [],
                tags: ticket.tags,
                dateCreated: ticket.date_created.toString()
            })
        }
        catch(e) {
            console.log("Invalid ticket")
        }
        
    })

    //console.log(ticketsData)

    return ticketsData
}

export const changeStatus = async (id: string, status: string) => {
    await tickets.updateOne({_id: new ObjectId(id)}, {$set: {status: status}})
}

export const refreshTicket = async (id: string, params: {}) => {
    await tickets.updateOne(
        {_id: new ObjectId(id)}, 
        {$set: {
            ...params
        }}
    );
}
