'use server'

import { useDB } from "@/db/mongo"
import { ObjectId, WithId } from "mongodb"
import { IMessage, ITicket} from '@/types'
import ticket from "@/app/(home)/ticket/page"
import { revalidatePath } from "next/cache"
import { validateUser } from "./users"
import { sendMessage } from '@/app/api/listen/server'
import { redirect } from "next/navigation"
import { getCache, invalidateCache, setCache } from "./ticketsCache"
import { getMessages } from "./chat"

const Tickets = async () => {
    const db = await useDB()
    const tickets = db.collection('tickets')
    return tickets
}

const Chat = async () => {
    const db = await useDB()
    const chat = db.collection('chat')
  
    return chat
  
  }


/**
 * Empty function to as a workaround for https://github.com/vercel/next.js/issues/54282
 * 
 * @returns {Promise<void>}
 */
export const fuckNextTickets = async() => {
    
    
}




/**
 * Fetches tickets by status and filters them based on priority scores.
 * 
 * @param {string} status - The status of the tickets to retrieve.
 * @param {string[]} filters - An array of priority scores to filter the tickets by.
 * @returns {Promise<ITicket[] | null>} The filtered list of tickets or null if an error occurs.
 */
export const getTicketByStatus = async (status : string, filters: string[], sort: string[] | undefined) => {
    const tickets = await Tickets()

    const cacheParams = `${status}+${filters.toString()}+${sort?.toString()}`
    const cache = getCache(cacheParams)

    if (cache != undefined) {
        return cache
    }

    try{
        let result
        if(sort) {
            const priorityOrder = ["low", "medium", "high"]
            const direction = sort[1] == "desc" ? -1 : 1
            
            const m = {$match: {status : status, priority_score: {$in: filters}}}
            const a = {$addFields: {__order: {$indexOfArray: [priorityOrder, "$priority_score"]}}}
            let s
            if(sort[0] == "priority") {
                s = {$sort: {__order: direction}}
            }
            else if(sort[0] == "date") {
                s = {$sort: {date_created: direction}}
            }
            else {
                s = {$sort: {date_created: -1}}
            }

            result = await tickets.aggregate([m, a, s]).toArray()

        }
        else {
            result = await tickets.find({status : status, priority_score: {$in: filters}}).sort({date_created: -1}).toArray()
        }
        
        const convertedResult: ITicket[] = result.map((ticket: ITicket) => {
            return {
              ...ticket,
              _id: ticket._id.toString(),
            };
          })
        setCache(cacheParams, convertedResult)
        return convertedResult
    }
    catch(error: any){
        console.log(error)
        redirect(`/oops?error=${error}`)
        return null
    }
}

/**
 * Fetches all tickets from the database.
 * 
 * @returns {Promise<ITicket[]>} The list of all tickets.
 */
export const getTickets = async () => {
   
    const tickets = await Tickets()
    try{
        const result = await tickets.find({}).toArray()
        const convertedResult: ITicket[] = result.map((ticket: ITicket) => {
            return {
              ...ticket,
              _id: ticket._id.toString(),
            };
          })
        
        return convertedResult
    }
    catch(error: any){
        console.log(error)
        redirect(`/oops?error=${error}`)
        return []
    }
}

/**
 * Fetches a specific ticket by its ID.
 * 
 * @param {string} id - The ID of the ticket to retrieve.
 * @returns {Promise<ITicket | null>} The ticket object or null if an error occurs.
 */
export const getTicket = async(id: string) => {
    const tickets = await Tickets()

    try{
        const result = await tickets.findOne({_id: new ObjectId(id)})
        return result
    }
    catch(error: any){
        console.log(error)
        redirect(`/oops?error=${error}`)
    }
}

/**
 * Changes the status of a specific ticket.
 * 
 * @param {string} id - The ID of the ticket to update.
 * @param {string} status - The new status to set for the ticket.
 * @returns {Promise<boolean>} True if the update was successful, false otherwise.
 */
export const changeStatus = async (id: string, status: string) => {
    invalidateCache()
    const tickets = await Tickets()

    try{

        let valid = await validateUser()
        if(!JSON.parse(valid)){
            throw new Error('Invalid token!')
        }

        await tickets.updateOne({_id: new ObjectId(id)}, {$set: {status: status}})
        console.log("change ticket status")
        sendMessage()
        return true
    }
    catch(error){
        console.log(error)
        return false
    }
}

/**
 * Updates the properties of a specific ticket.
 * 
 * @param {string} id - The ID of the ticket to update.
 * @param {Object} params - The new properties to set for the ticket.
 * @returns {Promise<boolean>} True if the update was successful, false otherwise.
 */
export const refreshTicket = async (id: string, params: {}) => {
    invalidateCache()
    const tickets = await Tickets()
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
        console.log("refresh ticket")
        sendMessage()
        return true;
      } catch (error) {
        console.error(error)
        return false
      }
}

/**
 * Revalidates the ticket data on the specified path.
 */
export const revalidateTicket = () => {
    revalidatePath('/', 'layout')
}

export const deleteTicket = async (id: string) => {
    invalidateCache()
    const tickets = await Tickets()

    const user = await validateUser()
    if(!user) {
        return false
    }

    try {
        await tickets.deleteOne(
            { _id: new ObjectId(id)}
        )
        sendMessage()
        return true
    } catch (error) {

        redirect(`/oops?error=${error}`)
        console.error(error)
        return false
    }
}

export const addTicket = async(chat_id: string, name: string, description: string, priority_score: string, tags: String[]) => {
    
    try{
        const user = await validateUser()
        const tickets = await Tickets()
        const chat = await Chat()

        if(!user){
            return {success: false, reason: "You are not logged in"}
        }

        //check if a ticket with chat_id already exists within the database
        const findTicket = await tickets.findOne({chat_id : chat_id})
        console.log(findTicket)
        if(findTicket){
            console.log('chat_id is taken')
            return {success: false, reason: "Ticket with session ID already exists!"}
        }

        //check if ticket exists in CRISP
        /*
        const ticketReal = await getMessages(chat_id)
        if(!ticketReal){
            return {success: false, reason: "Ticket is not found in CRISP's database"}
        }
        */

    //MOCK DATA!
    const ticketReal = {data : [{content: "crisp down!!!", from: "user"}]}

    const insertTicket = await tickets.insertOne({
        name: name, 
        description: description,
        priority_score: priority_score,
        tags: tags,
        status: 'pending',
        date_created: new Date().toISOString(),
        chat_id: chat_id,
        userIDs: []
    })
    const insertChat = await chat.insertOne({
            chat_id: chat_id,
            messages: ticketReal.data.map((message: IMessage) => { return {content: message.content, from: message.from}}),
          }
    )

    invalidateCache()
    sendMessage()
    return {success: true, reason: "OK"}

    }catch(e : any){
        console.log(e)
        redirect(`/oops?error=${e}`)
        return {success: false, reason: "Failed to Add ticket. Sorry"}
        
    }

}
