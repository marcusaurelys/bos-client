import client from "@/db/mongo"
import { UUID } from "crypto"
import { ObjectId } from "mongodb"
import {ITicket} from "../types"


export const tickets = client.db('business-os').collection('tickets')

export const getTickets = async () => {
    let ticketsData: ITicket[] = []

    const result = await tickets.find({}).toArray()
    
    result.forEach((t) => {
        try {
            ticketsData.push({
                id: t._id.toString(), 
                title: t.name,
                description: t.description,
                status: t.status,
                priority: t['priority_score'],
                userIDs: t.userIDs ?? [],
                tags: t.tags,
                dateCreated: t.date_created.toString()
            })

        }
        catch(e) {
            console.log("invalid ticket")
        }
        
    })

    console.log(ticketsData)

    return ticketsData
}

export const changeStatus = async (id: string, status: string) => {
    await tickets.updateOne({_id: new ObjectId(id)}, {$set: {status: status}})
}

export const updateTicket = async (id: string, params: {}) => {
    await tickets.updateOne(
        {_id: new ObjectId(id)}, 
        {$set: {
            ...params
        }}
    );
}