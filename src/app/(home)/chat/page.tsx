import { fuckNextDB } from '@/db/mongo'
import { fuckNextTicket } from '@/db/tickets'
import { fuckNextUsers } from '@/db/users'
import { getConversations, getMessages } from '@/db/chat'

const fetchMessages = async() => {

  // Right now, we are only going to fetch the first page since we only have a limited amount of API calls.
  let page_number = 1;
  const messages_dict = {}

 // while (true) {
    const conversations_response = await getConversations(page_number)
    const conversations = conversations_response.data

    if (conversations.length === 0) {
      return {}
    }

    for (const conversation of conversations) {
      const session_id = conversation.session_id
      const messages_response = await getMessages(session_id)
      const messages = messages_response.data

      // Note that we are specifically using bracket notation for a JSON object to maintain portability with the Flask server
      messages_dict[session_id] = messages.map(message => [message.content, message.from])
    }

    return messages_dict

 // }  
}

export default function Chat() {
  const [messages, setMessages] = useState({})

  useEffect(() => {
    let abort = false
    
    const response = await fetchMessages()
    if (!abort) {
      setMessages(response)  
    }

    return () => {
      abort = true
    }
  }, [])    


  return (
    <>
      {Object.keys(messagesDict).length === 0 ? (
                <p>I hate Next.js</p>
            ) : (
                Object.entries(messagesDict).map(([sessionId, messages]) => (
                    <div key={sessionId}>
                        <h1>Conversation {sessionId}</h3>
                        <div>
                            {messages.map((message, index) => (
                                <div key={index}>
                                    {message[1]}: {message[0]}
                                </div>
                            ))}
                        </div>
                    </div>
               ))
      )}
    </>
    
  )
  
}
