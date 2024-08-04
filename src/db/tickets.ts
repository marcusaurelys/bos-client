'use server'

import { useDB } from "@/db/mongo"
import { ObjectId, WithId } from "mongodb"
import { ITicket} from '@/types'
import ticket from "@/app/(home)/ticket/page"
import { revalidatePath } from "next/cache"
import { validateUser } from "./users"
import { sendMessage } from '@/app/api/listen/server'
import { redirect } from "next/navigation"

const Tickets = async () => {
    const db = await useDB()
    const tickets = db.collection('tickets')
    return tickets
}


/**
 * Empty function to as a workaround for https://github.com/vercel/next.js/issues/54282
 * 
 * @returns {Promise<void>}
 */
export const fuckNextTickets = async() => {
    
    
}


interface ITicketCache {
    [key: string]: ITicket[]
}

let ticketCache: ITicketCache = {}


/**
 * Updates the cache object 
 * @param {string} key - The properties of the cached data.
 * @param {ITicket[]} data - The tickets data to be store din the cache.
 */
const setCache = (key: string, data: ITicket[]) => {
    ticketCache[key] = data
}

/**
 * Returns cached data with properties specified in key
 * @param params 
 * @returns {ITicket[] | undefined} The cached data or undefined if no ticket data matches the specified properties.
 */
const getCache = (key: string) => {
    return ticketCache[key]
}


/**
 * Clears all cached tickets data
 */
const invalidateCache = () => {
    ticketCache = {}
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
        console.error(error)
        return false
    }
}
