'use client'

import { useState } from 'react'
import { get_chatbot_response, update_dev_chat } from '@/db/chat'
import { ScrollArea } from "@/components/ui/scroll-area"
import PlaceholderInput from '@/app/components/PlaceholderInput'
import Loading from '@/app/components/Loading'
import { IMessage } from '@/types'

export default function Bot({chat_id, ticket_id, devchat}: {chat_id: string, ticket_id: string, devchat: any}) {
  const [chat, setChat] = useState(devchat.messages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const generate_response = async(prompt: string) => {

    let chat_logs = ""
    
    for (const message of chat) {
      if (message['from'] === "user") {
        chat_logs += "User: " + message['content'] + "\n"
      } else {
        chat_logs += "Assistant: " + message['content'] + "\n"
      } 
    }


    let output = [{"from": "user", "content": `${prompt}`}]

    setChat([...chat, ...output])
    setIsLoading(true)

    chat_logs += "User: " + prompt + "\n"
    const response = await get_chatbot_response(chat_logs, devchat.problem_statement)
    console.log(response)

    output = [{"from": "user", "content": `${prompt}`}, {"from": "assistant", "content": `${response['response']}`}]

    devchat.messages = [...chat, ...output]
    await update_dev_chat(devchat)  
    // This shallow copies the chat but I see no reason for a deep copy since we won't allow modification to previous messages anyway.
    setChat([...chat, ...output])

    setIsLoading(false)
  }

  const clear_chat = async() => {
    devchat.messages = []
    await update_dev_chat(devchat)
    setChat([])
  }


  return (
  <>
  <div className="flex flex-col h-full w-full p-4 relative">
    <ScrollArea className="h-[calc(65dvh)]">
      <ul>
          {chat.map((message: IMessage, index: any) => (
            message['from'] === "user" 
            ?
            <div className="flex w-full justify-end pr-4" key={index}>
              <div className="flex flex-col m-2 p-2 rounded-lg bg-blue-100 w-fit max-w-xl">
                <li>
                  {message['content']}
                </li>  
              </div>
            </div>
            :
            <div key={index} className="flex flex-col m-2 p-2 rounded-lg bg-stone-100 w-fit max-w-xl">
                <li>
                  {message['content']}
                </li> 
            </div>
          ))}

          {isLoading
          ?
          <div className="flex flex-col m-2 p-2 rounded-lg bg-stone-100 w-fit max-w-xl h-8">
            <Loading />
          </div>
          :
          <div></div>
          }
        </ul>
    </ScrollArea>
    <div className="absolute bottom-3 w-full">
      <PlaceholderInput send={generate_response}/>
    </div>
  </div>
  </>
  )


}
