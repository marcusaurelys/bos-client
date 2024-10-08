'use server'

import { ObjectId } from 'mongodb'
import { Base64 } from 'js-base64'  
import { useDB } from '@/db/mongo'
import { IChat, IConversation, IMessage, IMessageDict } from '@/types'
import { redirect } from 'next/navigation'
import { sendMessage } from '@/app/api/listen/server'

const CRISP_WEBSITE_ID = process.env.CRISP_WEBSITE_ID
const CRISP_API_ID = process.env.CRISP_API_ID
const CRISP_API_KEY = process.env.CRISP_API_KEY
const CHATBOT_URL = process.env.CHATBOT_URL
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY

const Chat = async () => {
  const db = await useDB()
  const chat = db.collection('chat')

  return chat

}

const Tickets = async () => {
  const db = await useDB()
  const tickets = db.collection('tickets')
  return tickets
}
 
const Fail = async() => {
  const db = await useDB()
  const fail = db.collection('fail')
  return fail
}

const DevChat = async() => {
  const db = await useDB()
  const devchat = db.collection('devchat')
  return devchat
}


/*
Chat Object - the customer chats in crisp
  {
    id_: ObjectID // irrelevant in this case
    chat_id: string // 'session_id' of conversation in Crisp
    messages: [{
      sender: string
      message: string
    }]
  }
*/

/*
DevChat Object - the conversation of the developer and the chatbot
  {
    ticket_id: 
    messages: [
      {
        content:
        from:
      }
    ]
  }

*/

/**
 * Empty function to as a workaround for https://github.com/vercel/next.js/issues/54282
 * 
 * @returns {Promise<void>}
 */
export const fuckNextChat = async() => {
  
} 

/**
 * Retrieves the chat history from MongoDB based on the given chat ID
 * 
 * @param id    string (expected to be retrieved from the URL of the page)
 * @returns     document with the interface IChat as declared in types.ts, empty array if not found
 */
export const getChatHistory = async (id : string) => {
  const chat = await Chat()

  try {
      const chatHistory = await chat.findOne({ chat_id: id })
      return chatHistory;
  } catch (e) {
      console.error("Chat history not found", e);
      redirect(`/oops?error=${e}`)
  }
}

/**
 * Inserts a dev chat into the database 
 */
export const add_dev_chat = async(params: any) => {
  const devchat = await DevChat()
  const response = await devchat.insertOne({
    ...params
  })
  
}


/**
 * Deletes a dev chat from the database 
 */
export const delete_dev_chat = async(chat_id: any) => {
  const devchat = await DevChat()
  const response = await devchat.deleteOne({
    chat_id: chat_id
  })
  
}


/**
 * Gets a dev chat from the database 
 */
export const get_dev_chat = async(chat_id: string) => {
  const devchat = await DevChat()
  const response = await devchat.findOne({
    chat_id: chat_id
  })

  if (response === null) {
    return null
  }
  response._id = response._id.toString()
  return response
}


/**
 * Replaces the messages array of a dev chat with an updated one
 */
export const update_dev_chat = async(dev: any) => {
  const devchat = await DevChat()
  const response = await devchat.updateOne(
    {_id: new ObjectId(dev._id)},
    {
      $set: {
        messages: dev.messages
      }
    }
  )
  return response
}



/**
 * Fetches a list of conversations from the Crisp API.
 * 
 * @param {number} page_number - The page number of the conversations to retrieve.
 * @returns {Promise<Object>} The response from the Crisp API containing the conversations.
 */
export const getConversations = async(page_number: number) => {
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
    redirect(`/oops?error=${error}`)
  }
}

/**
 * Fetches messages from CRISP's database based on a given session_id.
 * 
 * @param {string} session_id - The session_id to query.
 * @returns {Promise<Object>} The response from CRISP's API, null if the session_id is not valid.
 */
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


/**
 * Updates customer chat messages that we got from Crisp using the session_id 
 */
export const update_chat_messages = async (chat_id: string, new_messages: IMessage[]) => {
    try {const chat = await Chat()
    const response = await chat.updateOne(
      { chat_id: chat_id},
      { $set: { messages: new_messages } }
    )

    return response
  } catch (error) {
    console.error("update_chat_messages error:", error)
  }
} 


/**
 * Queries Crisp for the customer conversation and updates the database with the new updated customer chats 
 */
export const refresh_messages = async (chat_id: string, ticket_id: string) => {
  
  const response = await getMessages(chat_id)
  const new_messages = response.data
  const old_messages = await getChatHistory(chat_id)

  // return if no new messages
  if (new_messages.length == old_messages.length) {
    return
  }

  update_chat_messages(chat_id, new_messages)
  delete_dev_chat(chat_id)
  sendMessage()

}

/**
 * Combines the chatlogs and the problem statement for better inference
 *
 * Fetches a response from a chatbot API based on a given prompt.
 * 
 * @param {string} prompt - The prompt to send to the chatbot.
 * @returns {Promise<Object>} The response from the chatbot API.
 */
export const get_chatbot_response = async(chat_logs: string, problem_statement: string) => {
  try {

    const formData = new FormData()
    formData.append('chat_logs', chat_logs)
    formData.append('problem_statement', problem_statement)
    
    const response = await fetch(`http://localhost:5000/api/NewerInference`, {
        method: 'POST',
        body: formData
    })
    
    const output = await response.json() 
    return output 
  } catch (error){
    console.error("get_chatbot_response error: ",error);
  }
} 


/**
 * Handler for querying the model for generating tickets
 *
 * Fetches a response from a chatbot API based on a given prompt.
 * 
 * @param {string} prompt - The prompt to send to the chatbot.
 * @returns {Promise<Object>} The response from the chatbot API.
 */
export const get_chatbot_response_custom = async(chat_logs: string) => {
  try {

    const formData = new FormData()
    formData.append('instruct', ticket_generation_prompt)
    formData.append('chat_logs', chat_logs)
    
    const response = await fetch(`http://localhost:5000/api/generateTicket`, {
        method: 'POST',
        body: formData
    })
    
    const output = await response.json() 
    return output 
  } catch (error){
    console.error("get_chatbot_response_custom error: ",error);
  }
} 


// TBD: Define initial ticket generation here

/**
 * DEPRECATED: LLAMA2 MODEL. The models are now located in server/server.py
 *
 * Fetches a response from a chatbot API based on a given prompt.
 * 
 * @param {string} prompt - The prompt to send to the chatbot.
 * @returns {Promise<Object>} The response from the chatbot API.
 */
export const get_chatbot_response_old = async(prompt: string) => {
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
    redirect(`/oops?error=${error}`)
  }
} 


// Function for inserting customer chat to the database
export const seed_chat = async( session_id: string, messages: IMessage[] ) => {
  const chat = await Chat()

  const response = await chat.insertOne({
    chat_id: session_id,
    messages: messages,
  })

  return 'success'
 
}

// Function for inserting a ticket to the database
export const seed_ticket = async(params: {}) => {
  const tickets = await Tickets()

  try{
  const response = await tickets.insertOne({
    ...params,
    userIDs: [],
  }) }
  catch(error){
    redirect(`/oops?error=${error}`)
  }
}


// Function called for generating initial tickets
export const seed_tickets_collection = async() => {

    return
    
    const messages_dict: IMessageDict = {}
    const chat = await Chat()
    const chats: IChat[]  = await chat.find({}).toArray()
    const tickets = await Tickets()

    //creates index during initial seeding, doesn't matter if it's called again
    tickets.createIndex({chat_id: 1}, {unique: true})

    chats.map((chat) => {
      messages_dict[chat.chat_id] = {
        messages: []
      }
      messages_dict[chat.chat_id].messages = chat.messages
    })

    const ticket_fails = {}
    
    for (const [session_id, conversation] of Object.entries(messages_dict)) {

      conversation.messages.forEach(message => {
        message['from'] = typeof message['from'] === 'object' ? JSON.stringify(message['from']) : message['from']                    
        message['content'] = typeof message['content'] === 'object' ? JSON.stringify(message['content']) : message['content']
      })

      
      await new Promise(resolve => setTimeout(resolve, 5000))

      let chat_logs = ""
    
      for (const message of conversation.messages) {

        if (message['content'] === `{"namespace":"state:resolved"}`) {
          continue
        } 
  
        if (message['from'] === "user") {
          chat_logs += "User: " + message['content'] + "\n"
        } else {
          chat_logs += "Operator: " + message['content'] + "\n"
        } 
      }


      const input = ticket_generation_prompt + chat_logs + "\n\n" + "Now, give your response in a valid JSON format"
      const response = await get_chatbot_response_old(input)
      const output = response['response']

      try {
        const ticket = JSON.parse(output)
        ticket['status'] = 'closed'
        ticket['date_created'] = new Date().toISOString()
        ticket['chat_id'] = session_id

        
        await seed_ticket(ticket)
      } catch (error) {
          
          const fail = await Fail()
          await fail.insertOne({session_id: session_id, response: response['response']})
      } 

      
    }
}

// Function for getting the conversations from Crisp
export const seed_initial_conversations = async() => {

    return 

    const chat = await Chat()
    chat.createIndex({chat_id: 1}, {unique: true})
    
    const messages_dict: IMessageDict = {}
    let page_number = 1;

    while (true) {
      const conversations_response = await getConversations(page_number)
      const conversations = conversations_response.data
      

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
        messages_dict[session_id].messages = messages.map((message: IMessage) => { return {content: message.content, from: message.from}})

      }

      page_number++
      
    }

    Object.entries(messages_dict).map(async([session_id, conversation]: [string, IConversation]) => {
      
      

      conversation.messages.forEach((message: IMessage) => {
        message['from'] = typeof message['from'] === 'object' ? JSON.stringify(message['from']) : message['from']                    
        message['content'] = typeof message['content'] === 'object' ? JSON.stringify(message['content']) : message['content']
      })

      await seed_chat(session_id, conversation.messages)
      
    })
}

const ticket_generation_prompt = `You are given a support conversation between a customer and a support agent. Your task is to generate a support ticket in the form of a JSON object with the following fields:

{
"name": "[A concise title summarizing the main issue discussed]",
"description": "[A detailed explanation of the issue]",
"priority_score": "[One of 'high', 'medium', or 'low']",
"tags": ["[List of relevant keywords or topics related to the issue]"]
}

You must remember to respond only in valid JSON format. Now, process the following conversation:

Conversation:

`
