import { fuckNextDB } from '@/db/mongo'
import { fuckNextUsers } from '@/db/users'
import { fuckNextTickets } from '@/db/tickets'
import { fuckNextChat } from '@/db/chat'
import Bot from '@/app/components/Bot'

export default async function ChatPage() {

  fuckNextDB()
  fuckNextUsers()
  fuckNextTickets()
  fuckNextChat()
  
  return (
    <div className="rounded-lg w-full h-[calc(90dvh)]">
      <Bot/>
    </div>
  );
  
}


