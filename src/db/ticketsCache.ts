import { ITicket } from "@/types"

interface ITicketCache {
    [key: string]: ITicket[]
}

let ticketCache: ITicketCache = {}


/**
 * Updates the cache object 
 * @param {string} key - The properties of the cached data.
 * @param {ITicket[]} data - The tickets data to be store din the cache.
 */
export const setCache = (key: string, data: ITicket[]) => {
    ticketCache[key] = data
}

/**
 * Returns cached data with properties specified in key
 * @param params 
 * @returns {ITicket[] | undefined} The cached data or undefined if no ticket data matches the specified properties.
 */
export const getCache = (key: string) => {
    return ticketCache[key]
}


/**
 * Clears all cached tickets data
 */
export const invalidateCache = () => {
    ticketCache = {}
}