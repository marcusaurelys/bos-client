'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getCount, handleStale } from '@/db/tickets'

export default function Listener({initial}) {
  const [count, setCount] = useState(initial)
  const path  = usePathname()
  console.log(count)

  useEffect(() => {
     const fetchCount = async () => {
       const update = await handleStale(count)
     }
     fetchCount()
     console.log("route change")

     return () => {
       // if this component unmounts, it means that we may be navigating away from the page so we check if we need to revalidatePath
       fetchCount()
       console.log('bye')
     }
  }, [path])

  return null
}
