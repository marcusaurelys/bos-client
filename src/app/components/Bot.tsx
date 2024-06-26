'use client'

import { useState, useEffect } from 'react'
import { get_chatbot_response } from '@/db/chat'
import PlaceholderInput from '@/app/components/PlaceholderInput'

export default function Bot() {
  const [chat, setChat] = useState([{"role": "assistant", "content": "How may I assist you today?"}])
  const [input, setInput] = useState('')
  
  const generate_llama3_response = async(prompt: string) => {
    let string_dialogue = "You are a helpful asssistant. You do not respond as 'User'. You only respond once as 'Assistant' \n\n"
    let input = ""
    let output = ""

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
    
    output = await get_chatbot_response(input)
    output = output['response']
    console.log(output)

    output = [{"role": "user", "content": `${prompt}`},{"role": "assistant", "content": `${output}`}]

    // This shallow copies the chat but I see no reason for a deep copy since we won't allow modification to previous messages anyway.
    setChat([...chat, ...output])
    
  }

  const clear_chat = () => {
    setChat([{"role": "assistant", "content": "How may I assist you today?"}])
  }

  return (
  <>
  <h3>Nicebot</h3>
  <div>
    <ul>
      {chat.map((message, index) => (
        <li key={index}>
          <strong>{message['role']}: </strong> {message['content']}
        </li>  
      ))}
    </ul>
  </div>
  <PlaceholderInput send={generate_llama3_response}/>
  </>
  )


}
