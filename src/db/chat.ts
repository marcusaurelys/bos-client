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
const chat = db.collection('chat')
const tickets = db.collection('tickets')

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
    chat_id: string // 'session_id' of conversation in Crisp
    messages: [{
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
    return result
  } catch (error){
    console.error("update_chat_history_of_ticket",error)
  }
}

// TBD: Define initial ticket generation here

export const seed_chat = async( session_id, messages ) => {

  const response = await chat.insertOne({
    chat_id: session_id,
    messages: messages,
  })
 
}

export const seed_ticket = async(params) => {

  const response = await tickets.insertOne({
    ...params,
    userIDs: [],
  })
}

export const seed_tickets_collection = async() => {

    const messages_dict = {}
    let page_number = 1;
    console.log("page_number: " + page_number)
    console.log("seeding")

    while (true) {
      const conversations_response = await getConversations(page_number)
      const conversations = conversations_response.data
      console.log(conversations)

      if (conversations.length === 0) {
        break;
      }

      for (const conversation of conversations) {
        const session_id = conversation.session_id
        const messages_response = await getMessages(session_id)
        const messages = messages_response.data
        
        // Note that we are specifically using bracket notation for a JSON object to maintain portability with the Flask server
        messages_dict[session_id] = { 
          messages: [],
        }
        messages_dict[session_id].messages = messages.map(message => { return {content: message.content, from: message.from}})

      }

      page_number++
      console.log("page_number: " + page_number)
    }

    Object.entries(messages_dict).map(async([session_id, conversation]) => {
      console.log(session_id)
      console.log(conversation)

      conversation.messages.forEach(message => {
        message['from'] = typeof message['from'] === 'object' ? JSON.stringify(message['from']) : message['from']                    
        message['content'] = typeof message['content'] === 'object' ? JSON.stringify(message['content']) : message['content']
      })

      await seed_chat(session_id, conversation.messages)

      const input = ticket_generation_prompt + JSON.stringify(conversation)
      const response = await get_chatbot_response(input)
      const response_json = await response.json()

      try {
        const ticket = JSON.parse(response_json['response'])
        ticket['status'] = 'closed'
        ticket['date_created'] = new Date().toISOString()

        console.log(`Printing valid JSON:`, ticket)
        await seed_ticket(ticket)
      } catch (error) {
        console.log(`Printing string: ${response_json['response']}`)
      }
      
    })
}
const ticket_generation_prompt = `You are given a JSON object containing a support conversation between a customer and a support agent. Your task is to generate a support ticket with the following fields:

1. Name: A concise title summarizing the main issue discussed.
2. Description: A detailed explanation of the issue.
3. Priority Score: One of the following three values: 'high', 'medium', or 'low'.
4. Tags: A list of relevant keywords or topics related to the issue.

Use the context of the conversation to determine these fields. Ensure that the ticket accurately reflects the problem or request made by the user. The JSON object will be formatted as follows:

Input Format:
{
  "messages": [
    { "content": "Good morning!", "from": "Charlie" },
    { "content": "How are you?", "from": "Dana" }
  ]
}

Output Format:
{
  "name": string,
  "description": string,
  "priority_score": Enum(high, medium, low),
  "tags": [string]
}

Example:
Input:
{
 "messages": [
   { "content": "Good morning!", "from": "Charlie" },
   { "content": "How are you?", "from": "Dana" },
   { "content": "I need help with increasing the size of the server RAM for an upcoming game test.", "from": "Charlie" },
   { "content": "Sure, when do you need this done?", "from": "Dana" },
   { "content": "By the end of the week, if possible.", "from": "Charlie" }
 ]
}

Output:
{
 "name": "Increase size of game server RAM for upcoming test",
 "description": "The user wants to increase the size of the server RAM for his game",
 "priority_score": "high",
 "tags": ["Game", "Server"]
}

Use the context and details provided in the messages to accurately fill out the support ticket fields. 

Now, process the following conversation to generate a support ticket:`
