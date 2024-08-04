'use client'

import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { changeStatus } from '@/db/tickets'
import { ITicket } from '@/types'
import React from 'react'
import { useToast } from '@/components/ui/use-toast'
import { revalidatePath } from 'next/cache'

interface UpdateStatusForm{
    ticketInfo: ITicket
}

const UpdateStatusForm = ({ticketInfo}: UpdateStatusForm) => {

    const {toast} = useToast()

    async function setStatus(formData : FormData){
        const status = (formData.get('status') as string).toLowerCase()
        
        if(status == '' || status == ticketInfo.status){
            toast({
                description: 'Nothing to update.'
            })
        }

        try{
            const response = await changeStatus(ticketInfo._id, status)
            if (response){
                toast({
                    description: 'Ticket "' + ticketInfo.name + '"' +  " status updated."
                  })
                
            }
            else{
                toast({
                    variant: "destructive",
                    description: 'Ticket "' + ticketInfo.name + '"' +  " update failed."
                  })
            }
        } 
        catch (error){
            console.error(error)
            toast({
                variant: "destructive",
                description: 'Ticket "' + ticketInfo.name + '"' +  " update failed."
              })
        }
    }

  return (
    <form action={setStatus}>
        <CardFooter>
            <div data-test="ticket-update" className="flex flex-row w-full gap-2">
                <Select name='status'>
                <SelectTrigger className="w-2/3">
                    <SelectValue defaultValue={ticketInfo.status} placeholder={ticketInfo.status.charAt(0).toUpperCase() + ticketInfo.status.slice(1)} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem data-test="pending-update" value="pending">Pending</SelectItem>
                    <SelectItem data-test="open-update" value="open">Open</SelectItem>
                    <SelectItem data-test="closed-update" value="closed">Closed</SelectItem>
                </SelectContent>
                </Select>
                <Button data-test="update-button" className="w-1/3">Update</Button>
            </div>
        </CardFooter>
    </form>
)
}

export default UpdateStatusForm
