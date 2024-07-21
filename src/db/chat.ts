'use server'

import { Base64 } from 'js-base64'
import { ObjectID } from 'mongo'   
import { cookies } from 'next/headers'
import { useDB } from '@/db/mongo'
import { get_user_by_token } from '@/db/users'

const CRISP_WEBSITE_ID = process.env.CRISP_WEBSITE_ID
const CRISP_API_ID = process.env.CRISP_API_ID
const CRISP_API_KEY = process.env.CRISP_API_KEY
const CHATBOT_URL = process.env.CHATBOT_URL
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY

const db = await useDB()
const chats = db.collection('chats')

export const fuckNextChat = async() => {
  
} 

// Crisp Chat History
export const getConversations = async(page_number: int) => {
  try {
    const auth = Base64.encode(`${CRISP_API_ID}:${CRISP_API_KEY}`);
  
    const crispRes = await fetch(`https://api.crisp.chat/v1/website/${CRISP_WEBSITE_ID}/conversations/${page_number}`, {
      method: 'GET',
      headers: {
      Authorization: `Basic ${auth}`,
        'X-Crisp-Tier': 'plugin',
      },
    });
    const response = await crispRes.json()
    return response
  } catch(error){
    console.error("getConverstaions error: ",error);
  }
}

export const getMessages = async(session_id: string) => {
  try{
    const auth = Base64.encode(`${CRISP_API_ID}:${CRISP_API_KEY}`);
    
    const crispRes = await fetch(`https://api.crisp.chat/v1/website/${CRISP_WEBSITE_ID}/conversation/${session_id}/messages`, {
      method: 'GET',
      headers: {
      Authorization: `Basic ${auth}`,
        'X-Crisp-Tier': 'plugin',
      },
    });
    const response = await crispRes.json()
    return response
  } catch(error){
    console.error("getMessages error: ",error);
  }
}

// Chatbot Endpoints
export const get_chatbot_response = async(prompt) => {
  try {
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
  } catch (error){
    console.error("get_chatbot_response error: ",error);
  }
} 

// Chatbot History 

/*
Chat Object
  {
    id_: ObjectID // irrelevant in this case
    user_id: ObjectID // user id in user collection
    chat_id: string // 'session_id' of conversation in Crisp
    chats: [{
      sender: string
      message: string
    }]
  }
*/

export const get_chat_history_of_user = async() => {
  try{
    const token = cookies().get('session')
    const user = await get_user_by_token(token.value)

    // No need to verify for user validity since the middleware should prevent this request from running if the token is invalid
    const user_id = user._id

    const response = await chats.find({user_id: user_id})
    const result = await response.json()
    return result 
  }catch(error){
    console.error("get_chat_history_of_user",error)
  }
}

export const get_chat_history_of_ticket = async(session_id: string) => {
  try{
    const token = cookies().get('session')
    const user = await get_user_by_token(token.value)
  
    // No need to verify for user validity since the middleware should prevent this request from running if the token is invalid
    const user_id = user._id
    
    const response = await chats.findOne({user_id: user_id, session_id: session_id})
    const result = await response.json()
    return result
  }catch(error){
    console.error("get_chat_history_of_ticket",error)
  }
}

// Universal update, delete, patch, append. Pass an array here.
export const update_chat_history_of_ticket = async(session_id: string, chats: Chat[]) => {
  try{
    const token = cookies().get('session')
    const user = await get_user_by_token(token.value)

    // No need to verify for user validity since the middleware should prevent this request from running if the token is invalid
    const user_id = user._id

    const response = await chats.updateOne({user_id: user_id, session_id: session_id}, {
      $set: {
        chats: chats
      }
    })
    const result = await response.json()
    return result
  } catch (error){
    console.error("update_chat_history_of_ticket",error)
  }
}

// TBD: Define initial ticket generation here
export const seed_tickets_collection = async() => {

  
}