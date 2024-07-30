'use client'

import { useState, useEffect } from 'react'
import { getConversations, getMessages } from '@/db/chat'

interface IMessagesDict {
  session_id: string
}

interface Chat{
  session: String
}

export default function Chat({session}:Chat) {
  const [messagesDict, setMessagesDict] = useState({})
  
  const fetchMessages = async() => {
    
    // Right now, we are only going to fetch the first page since we only have a limited amount of API calls.
    let page_number = 1;
    const messages_dict: any = {}

    // while (true) {
    const conversations_response = await getConversations(page_number)
    const conversations = conversations_response.data
    if (conversations.length === 0) {
      return {}
    }

    console.log(conversations.length)

    for (const conversation of conversations) {
      const session_id = conversation.session_id
      const messages_response = await getMessages(session_id)
      const messages = messages_response.data

      // Note that we are specifically using bracket notation for a JSON object to maintain portability with the Flask server
      messages_dict[session_id] = { 
        messages: [],
      }
      messages_dict[session_id].messages = messages.map((message: any) => { return {content: message.content, from: message.from}})
    }

    return messages_dict
    // }
  }

  const messagesArray = messagesDict[session];
  
  useEffect(() => {
    let abort = false
    
    const startFetching = async() => {
      const response = await fetchMessages()
      if (!abort) {
        
         Object.entries(response).map(([sessionId, conversation]: [string, any]) => {
           console.log(sessionId)
           console.log(conversation)
           
           conversation.messages.map((message: any) => {
               const sender = typeof message['from'] === 'object' ? JSON.stringify(message['from']) : message['from']                    
               const chat = typeof message['content'] === 'object' ? JSON.stringify(message['content']) : message['content']
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
       Object.entries(messagesDict).map(([sessionId, conversation]: [string, any]) => (
         <div key={sessionId}>
           <h3>Conversation {sessionId}</h3>
               <ul>
                  {conversation.messages.map((message: any, index: number) => {
                     const sender = typeof message['from'] === 'object' ? JSON.stringify(message['from']) : message['from']                    
                     const chat = typeof message['content'] === 'object' ? JSON.stringify(message['content']) : message['content']
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
