"use server"

// Refactor to seperate server actions 

import { changeStatus, getTickets } from '@/db/tickets'
import { revalidatePath } from 'next/cache'

export const FUCK = async() => {
   
} 

export async function handleChangeStatus(id: string, status: string) {
  try{
    await changeStatus(id, status)
    revalidatePath(`/ticket/${id}`)
    return true
  }
  catch (error){
    console.error(error)
    return false
  }
}


