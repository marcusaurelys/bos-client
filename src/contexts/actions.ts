"use server"

// Refactor to seperate server actions 

import { changeStatus, getTickets } from '@/db/tickets'

export async function handleChangeStatus(id: string, status: string) {
  await changeStatus(id, status)
}


