'use client'

import { Button } from '@/components/ui/button'
import { refresh_messages } from '@/db/chat'
import { ITicket } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { RotateCcw } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import React, { useState } from 'react'

interface Params {
    ticket_info: ITicket
}

function RefreshChatLog({ticket_info}: Params) {

    const [loading, setLoading] = useState<boolean>(false)

    async function handleRefresh() {
        setLoading(true)
        await refresh_messages(ticket_info.chat_id, ticket_info._id)
        setLoading(false)
    }

  if (!loading){
      return (
        <Button onClick={handleRefresh} className="h-8 font-sans" variant="outline">
           <ArrowPathIcon className="h-4 mr-2"/>         
           Refresh 
        </Button>
      )
  } 

  return (
    <Button disabled className="h-8 font-sans" variant="outline">
      Please wait
    </Button>
  )
}

export default RefreshChatLog
