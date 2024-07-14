'use client'

import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { handleChangeStatus } from '@/contexts/actions'
import { ITicket } from '@/types'
import { revalidatePath } from 'next/cache'
import React from 'react'
import { useToast } from '@/components/ui/use-toast'

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
            return
        }

       
        try{
            const response = await handleChangeStatus(ticketInfo.id, status)
            if (response){
                toast({
                    description: 'Ticket "' + ticketInfo.title + '"' +  " status updated."
                  })
                
            }
            else{
                toast({
                    variant: "destructive",
                    description: 'Ticket "' + ticketInfo.title + '"' +  " update failed."
                  })
            }
        } 
        catch (error){
            console.error(error)
            toast({
                variant: "destructive",
                description: 'Ticket "' + ticketInfo.title + '"' +  " update failed."
              })
        }
    }

  return (
    <form action={setStatus}>
        <CardFooter>
            <div className="flex flex-row w-full gap-2">
                <Select name='status'>
                <SelectTrigger className="w-2/3">
                    <SelectValue defaultValue={ticketInfo.status} placeholder={ticketInfo.status.charAt(0).toUpperCase() + ticketInfo.status.slice(1)} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
                </Select>
                <Button className="w-1/3">Update</Button>
            </div>
        </CardFooter>
    </form>
)
}

export default UpdateStatusForm