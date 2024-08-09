'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { find_new_conversations } from '@/db/chat'
import { CloudDownload } from 'lucide-react'
import React from 'react'

function CheckNewTickets() {

    async function handleClick () {
        const added = await find_new_conversations()
        if (added == -1) {
          toast({
            description: 'Failed to fetch new tickets',
            variant: 'destructive'
          })
        }
        else {
          toast({
            description: `Successfully added ${added} tickets`
        })
        }
    }

  return (
    <div>
      <Button onClick={handleClick} className="h-8 b-gray-50 outline outline-gray-400 outline-1 font-sans" variant="ghost"><CloudDownload className='h-4'/>Fetch New Tickets</Button>
    </div>
  )
}

export default CheckNewTickets
