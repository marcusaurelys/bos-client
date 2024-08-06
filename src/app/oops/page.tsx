'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Page(){
    
    const { toast } = useToast()

    useEffect( () => {
        const searchParams = new URLSearchParams(window.location.search)
        const search = searchParams.get('error')
        console.log(searchParams)
        if(search){
            const timeout = setTimeout(() => {
                toast({
                    description: `Error: ${search}`,
                    variant: "destructive"
            })
            }, 0)
        }
        
    }, [toast])

    return  <div className="flex w-full h-screen items-center justify-center flex-col gap-3">

            <div className="flex flex-col items-center">
                <h1 className='text-3xl'>Oops, Sorry about that...</h1>
                <p>It looks like something went wrong. Things should be back to normal soon.</p>
            </div>
            {/*Perform full reload on click*/}
            <Button onClick={() => window.location.href= '/'} variant="outline">
                Back to home
            </Button>
  </div>

}