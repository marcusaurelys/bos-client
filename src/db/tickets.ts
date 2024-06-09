import { useDB } from "@/db/mongo"
import { UUID } from "crypto"
import { ObjectId } from "mongodb"
import { Ticket } from '@/types'

const db = await useDB()
export const tickets = db.collection('tickets')

export const getTickets = async () => {
    let ticketsData: Ticket[] = []

    const result = await tickets.find({}).toArray()
    
    result.forEach((t) => {
        try {
            ticketsData.push({
                id: t._id.toString(), 
                title: t.name,
                description: t.description,
                status: t.status,
                priority: t['priority_score'],
                tags: t.tags,
                dateCreated: t.date_created.toString()
            })

        }
        catch(e) {
            console.log("invalid ticket")
        }
        
    })

    //console.log(ticketsData)

    return ticketsData
}

export const changeStatus = async (id: string, status: string) => {
    await tickets.updateOne({_id: new ObjectId(id)}, {$set: {status: status}})
}