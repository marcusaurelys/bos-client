'use server'

import { Base64 } from 'js-base64'

const CRISP_WEBSITE_ID = process.env.CRISP_WEBSITE_ID
const CRISP_API_ID = process.env.CRISP_API_ID
const CRISP_API_KEY = process.env.CRISP_API_KEY
const CHATBOT_URL = process.env.CHATBOT_URL
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY

export const fuckNextChat = async() => {
  
} 

// Crisp Chat History
export const getConversations = async(page_number: int) => {
  const auth = Base64.encode(`${CRISP_API_ID}:${CRISP_API_KEY}`);
  // console.log({ auth });
  const crispRes = await fetch(`https://api.crisp.chat/v1/website/${CRISP_WEBSITE_ID}/conversations/${page_number}`, {
    method: 'GET',
    headers: {
    Authorization: `Basic ${auth}`,
      'X-Crisp-Tier': 'plugin',
    },
   });
   const response = await crispRes.json()
   return response
}

export const getMessages = async(session_id: string) => {
  const auth = Base64.encode(`${CRISP_API_ID}:${CRISP_API_KEY}`);
  // console.log({ auth });
  const crispRes = await fetch(`https://api.crisp.chat/v1/website/${CRISP_WEBSITE_ID}/conversation/${session_id}/messages`, {
    method: 'GET',
    headers: {
    Authorization: `Basic ${auth}`,
      'X-Crisp-Tier': 'plugin',
    },
   });
   const response = await crispRes.json()
   return response
}

// Chatbot Endpoints

export const get_chatbot_response = async(prompt) => {
  const response = await fetch(`${CHATBOT_URL}`, {
    method: 'POST',
    headers: {
      "x-api-key": `${CHATBOT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: prompt }),      
  })
  
  const output = await response.json() 
  return output 
} 
