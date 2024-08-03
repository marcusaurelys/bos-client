'use client'

import { useState } from 'react'
import { get_chatbot_response } from '@/db/chat'
import { ScrollArea } from "@/components/ui/scroll-area"
import PlaceholderInput from '@/app/components/PlaceholderInput'
import Loading from '@/app/components/Loading'

export default function Bot() {
  const [chat, setChat] = useState([{"role": "assistant", "content": "How may I assist you today?"}])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const generate_llama3_response = async(prompt: string) => {
    let string_dialogue = "You are a helpful asssistant. You do not respond as 'User'. You only respond once as 'Assistant' \n\n"
    let input = ""
    let output = []

    if (prompt.length === 0) {
       return
    }
    
    for (const message of chat) {
      if (message['role'] === "user") {
        string_dialogue += "User: " + message['content'] + "\n\n"
      } else {
        string_dialogue += "Assistant: " + message['content'] + "\n\n"
      } 
    }
    
    input = `${string_dialogue}User: ${prompt}\n\nAssistant: `
    console.log(input)

    output = [{"role": "user", "content": `${prompt}`}]

    setChat([...chat, ...output])
    setIsLoading(true)
    
    output = await get_chatbot_response(input)
    output = output['response']
    console.log(output)

    output = [{"role": "user", "content": `${prompt}`}, {"role": "assistant", "content": `${output}`}]

    // This shallow copies the chat but I see no reason for a deep copy since we won't allow modification to previous messages anyway.
    setChat([...chat, ...output])
    setIsLoading(false)
  }

  const clear_chat = () => {
    setChat([{"role": "assistant", "content": "How may I assist you today?"}])
  }

  return (
  <>
  <div className="flex flex-col h-full w-full p-4 relative">
    <ScrollArea className="h-[calc(65dvh)]">
      <ul>
          {chat.map((message, index) => (
            message['role'] == "user" 
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
            // <div className="bg-accent p-3 rounded-md max-w-xs">
            //   <li key={index}>
            //     <strong>{message['role']}: </strong> {message['content']}
            //   </li>  
            // </div>
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
      <PlaceholderInput send={generate_llama3_response}/>
    </div>
  </div>
  </>
  )


}
