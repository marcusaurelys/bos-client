'use server'

import { Base64 } from 'js-base64'

const CRISP_WEBSITE_ID = process.env.CRISP_WEBSITE_ID
const CRISP_API_ID = process.env.CRISP_API_ID
const CRISP_API_KEY = process.env.CRISP_API_KEY

export const fuckNextChat = async() => {
  
} 

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
   const response = crispRes.json()
   return response
}

export const getMessages = async(session_id: string, page_number: int) => {
  const auth = Base64.encode(`${CRISP_API_ID}:${CRISP_API_KEY}`);
  // console.log({ auth });
  const crispRes = await fetch(`https://api.crisp.chat/v1/website/${CRISP_WEBSITE_ID}/conversation/${session_id}/messages`, {
    method: 'GET',
    headers: {
    Authorization: `Basic ${auth}`,
      'X-Crisp-Tier': 'plugin',
    },
   });
   const response = crispRes.json()
   return response
}
