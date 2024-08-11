'use client'

import { Button } from '@/components/ui/button'
import { refresh_messages } from '@/db/chat'
import { ITicket } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'

interface Params {
    ticket_info: ITicket
}

function RefreshChatLog({ticket_info}: Params) {

    const [loading, setLoading] = useState<boolean>(false)

    /**
     * Refreshes chat logs
     */
    async function handleRefresh() {
        setLoading(true)
        await refresh_messages(ticket_info.chat_id, ticket_info._id)
        setLoading(false)
    }

  if (!loading){
      return (
        <Button onClick={handleRefresh} className="h-8 w-full font-sans" variant="outline">
           <ArrowPathIcon className="h-4 mr-2"/>         
           Refresh Chat Log
        </Button>
      )
  } 

  return (
    <Button className="h-8 w-full font-sans" variant="outline">Please Wait</Button>
  )
}

export default RefreshChatLog
