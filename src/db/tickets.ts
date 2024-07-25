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

let updateCount = 0

export const getCount = async () => {
    return updateCount
}

export const handleStale = async (count) => {
    if (count != updateCount) {
        revalidatePath('/', 'layout')
        console.log("revalidate path: " + updateCount)
    }

    return updateCount
}

export const getTicketByStatus = async (status : string, filters: string[]) => {
    let ticketsData : ITicket[] = []

    try{
        const result = await tickets.find({status : status, priority_score: {$in: filters}}).sort({date_created : -1}).toArray()
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
                return null
            }
            
        })
        return ticketsData
    }
    catch(e){
        return null
    }
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
    try{
        await tickets.updateOne({_id: new ObjectId(id)}, {$set: {status: status}})
        updateCount++
        revalidatePath('/', 'layout')
        console.log("change ticket status")
        return true
    }
    catch(error){
        console.log(error)
        return false
    }
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
        updateCount++
        revalidatePath('/', 'layout')
        console.log("refresh ticket")
        return true;
      } catch (error) {
        console.error(error)
        return false
      }
}

export const revalidateTicket = (id: string) => {
    revalidatePath(`/ticket/${id}`)
}
