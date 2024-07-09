'use server'

import { useDB } from "@/db/mongo"
import { ObjectId } from "mongodb"
import { ITicket } from '@/types'
import ticket from "@/app/(home)/ticket/page"
import { revalidatePath } from "next/cache"
import { validateUser } from "./users"

const db = await useDB()
const tickets = db.collection('tickets')

export const fuckNextTickets = async() => {
    
    
}

export const getTicketByStatus = async (status : string, filters: string[]) => {
    let ticketsData : ITicket[] = []

    const result = await tickets.find({status : status, priority_score: {$in: filters}}).toArray()

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

   // console.log(status, filters, ticketsData)

    return ticketsData
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

export const getTicket = async(id: string) => {
    const result = await tickets.findOne({_id: new ObjectId(id)})
    try {
        const ticket = {
            id: result._id.toString(),
            title: result.name ?? "No title found",
            description: result.description ?? "No description found",
            status: result.status ?? "open",
            priority: result.priority_score ?? "high",
            userIDs: result.userIDs ?? [],
            tags: result.tags ?? [],
            dateCreated: result.date_created.toString() ?? "You should crash at this point"
        }
        return ticket
    } catch (error) {
        console.log(error)
        return null
    }

    
}

export const changeStatus = async (id: string, status: string) => {
    await tickets.updateOne({_id: new ObjectId(id)}, {$set: {status: status}})
}

export const refreshTicket = async (id: string, params: {}) => {
    const user = await validateUser()
    console.log(params)

    if(!user) {
        return false
    }

    try {
        await tickets.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...params } }
        )
        return true;
      } catch (error) {
        console.error(error)
        return false
      }
}

export const revalidateTicket = (id: string) => {
    revalidatePath(`/ticket/${id}`)
}
