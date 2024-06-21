import { fuckNextDB } from '@/db/mongo'
import { fuckNextUsers } from '@/db/users'
import { fuckNextTickets } from '@/db/tickets'
import { fuckNextChat } from '@/db/chat'
import Bot from '@/app/components/Bot'
import { validateUser } from '@/lib/auth'

export default async function ChatPage() {

  const user = await validateUser(['admin', 'member'])

  if(!user){
    redirect('/login')
  }

  fuckNextDB()
  fuckNextUsers()
  fuckNextTickets()
  fuckNextChat()
  
  return (
     <Bot/>
  );
  
}


