'use client'

import { useState, memo } from 'react'
import { Button } from '@/components/ui/button'
import { refreshTickets } from '@/db/tickets'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
export default function RefreshTickets() {

  const [loading, setLoading] = useState<boolean>(false)
  
  async function handleClick() {
    setLoading(true)
    await refreshTickets()
    setLoading(false)
  }

  if (!loading) {
    return (
      <Button onClick={handleClick} className="h-8 font-sans" variant="outline">
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
