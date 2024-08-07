'use client'

import { refresh_messages } from '@/db/chat'
import { ITicket } from '@/types'
import { RotateCcw } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import React from 'react'

interface Params {
    ticket_info: ITicket
}

function RefreshChatLog({ticket_info}: Params) {

    function handleRefresh() {
        refresh_messages(ticket_info.chat_id, ticket_info._id)
    }

  return (
    <div onClick={handleRefresh}>
      <RotateCcw className='stroke-1'/>
    </div>
  )
}

export default RefreshChatLog
