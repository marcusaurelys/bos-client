'use client'

import { useRef, useEffect } from 'react'
import { updateObject } from '@/app/api/listen/client'
import { revalidateTicket } from '@/db/tickets'
import { useRouter } from 'next/navigation'

export default function Listener() {

  const router = useRouter()
  const firstLoad = useRef(true)
  
  useEffect(() => {
    const eventSource = new EventSource(`/api/listen`)
    console.log("connected to listener")
    console.log("updateObject client: " + updateObject.update)

    eventSource.onmessage = (event) => {
      const data = event.data && JSON.parse(event.data)
      console.log("received event from server")

      if (firstLoad.current === true) {
        updateObject.update = data.update 
        firstLoad.current = false
      }
      
      if (data.update != updateObject.update) {
        console.log("revalidating")
        updateObject.update = data.update

        // Clear the Server-side Full Route Cache and the Client-side Router Cache
        revalidateTicket()
        router.refresh()
      }
    
    }

    return () => {
      eventSource.close()
    }
  }, [router])

  return null
}
