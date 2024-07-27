'use server'

import { Base64 } from 'js-base64'
import { ObjectID } from 'mongo'   
import { cookies } from 'next/headers'
import { useDB } from '@/db/mongo'
import { getUserByToken } from '@/db/users'
import { revalidatePath } from 'next/cache'

const CRISP_WEBSITE_ID = process.env.CRISP_WEBSITE_ID
const CRISP_API_ID = process.env.CRISP_API_ID
const CRISP_API_KEY = process.env.CRISP_API_KEY
const CHATBOT_URL = process.env.CHATBOT_URL
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY

const db = await useDB()
const chats = db.collection('chats')

/**
 * Empty function to as a workaround for https://github.com/vercel/next.js/issues/54282
 * 
 * @returns {Promise<void>}
 */
export const fuckNextChat = async() => {
  
} 

/**
 * Fetches a list of conversations from the Crisp API.
 * 
 * @param {number} page_number - The page number of the conversations to retrieve.
 * @returns {Promise<Object>} The response from the Crisp API containing the conversations.
 */
export const getConversations = async(page_number) => {
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

/**
 * Fetches a response from a chatbot API based on a given prompt.
 * 
 * @param {string} prompt - The prompt to send to the chatbot.
 * @returns {Promise<Object>} The response from the chatbot API.
 */
export const getMessages = async(session_id) => {
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

/**
 * Fetches a response from a chatbot API based on a given prompt.
 * 
 * @param {string} prompt - The prompt to send to the chatbot.
 * @returns {Promise<Object>} The response from the chatbot API.
 */
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

/**
 * Fetches the chat history of the current user.
 * 
 * @returns {Promise<Object>} The chat history of the user.
 */
export const get_chat_history_of_user = async() => {
  try{
    const token = cookies().get('session')
    const user = await getUserByToken(token.value)

    // No need to verify for user validity since the middleware should prevent this request from running if the token is invalid
    const user_id = user._id

    const response = await chats.find({user_id: user_id})
    const result = await response.json()
    return result 
  }catch(error){
    console.error("get_chat_history_of_user",error)
  }
}

/**
 * Fetches the chat history of a specific ticket for the current user.
 * 
 * @param {string} session_id - The session ID of the chat ticket.
 * @returns {Promise<Object>} The chat history of the ticket.
 */
export const get_chat_history_of_ticket = async(session_id) => {
  try{
    const token = cookies().get('session')
    const user = await getUserByToken(token.value)
  
    // No need to verify for user validity since the middleware should prevent this request from running if the token is invalid
    const user_id = user._id
    
    const response = await chats.findOne({user_id: user_id, session_id: session_id})
    const result = await response.json()
    return result
  }catch(error){
    console.error("get_chat_history_of_ticket",error)
  }
}

/**
 * Updates the chat history of a specific ticket for the current user.
 * 
 * @param {string} session_id - The session ID of the chat ticket.
 * @param {Chat[]} chats - An array of chat objects to update.
 * @returns {Promise<Object>} The result of the update operation.
 */
export const update_chat_history_of_ticket = async(session_id, chats) => {
  try{
    const token = cookies().get('session')
    const user = await getUserByToken(token.value)

    // No need to verify for user validity since the middleware should prevent this request from running if the token is invalid
    const user_id = user._id

    const response = await chats.updateOne({user_id: user_id, session_id: session_id}, {
      $set: {
        chats: chats
      }
    })
    const result = await response.json()
    revalidatePath('/')
    return result
  } catch (error){
    console.error("update_chat_history_of_ticket",error)
  }
}

// TBD: Define initial ticket generation here
export const seed_tickets_collection = async() => {

  
}
