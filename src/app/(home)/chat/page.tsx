import { fuckNextDB } from '@/db/mongo'
import { fuckNextUsers } from '@/db/users'
import { fuckNextTickets } from '@/db/tickets'
import { fuckNextChat } from '@/db/chat'
import Chat from '@/app/components/Chat'

export default async function ChatPage() {

  fuckNextDB()
  fuckNextUsers()
  fuckNextTickets()
  fuckNextChat()
  
  return (
     <Chat session="all"/>
  );
  
}


