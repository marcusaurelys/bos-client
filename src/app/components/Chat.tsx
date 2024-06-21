'use client'

import { useState, useEffect } from 'react'
import { getConversations, getMessages } from '@/db/chat'

export default function Chat() {
  const [messagesDict, setMessagesDict] = useState({})
  
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
  
  useEffect(() => {
    let abort = false
    
    const startFetching = async() => {
      const response = await fetchMessages()
      if (!abort) {
         Object.entries(response).map(([sessionId, messages]) => {
          console.log(sessionId)
          messages.map(message => {
            const sender = typeof message[1] === 'object' ? JSON.stringify(message[1]) : message[1]                    
            const chat = typeof message[0] === 'object' ? JSON.stringify(message[0]) : message[0]
            console.log(`${sender}: ${chat}`)
          })
          })
        setMessagesDict(response)  
        
      }
    } 

    startFetching()
    
    return () => {
      abort = true
    };
    
  }, [])    

  return (
  <>
  {Object.keys(messagesDict).length === 0 ? (
      <p>Loading...</p>
    ) : (
       Object.entries(messagesDict).map(([sessionId, messages]) => (
         <div key={sessionId}>
           <h3>Conversation {sessionId}</h3>
               <ul>
                  {messages.map((message, index) => {
                     const sender = typeof message[1] === 'object' ? JSON.stringify(message[1]) : message[1]                    
                     const chat = typeof message[0] === 'object' ? JSON.stringify(message[0]) : message[0]
                     return (                                              
                       <li key={index}>
                         <strong>{sender}:</strong> {chat}
                       </li>
                     ) 
                   })}
               </ul>
         </div>
       ))
  )}
  </>
  )
}
