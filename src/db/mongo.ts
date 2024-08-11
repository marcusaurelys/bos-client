import {MongoClient} from 'mongodb'

const client = new MongoClient(process.env.MONGO_URI || '')
let cache: any = null

/**
 * Uses the MongoDB database connection, caching the connection for reuse.
 * 
 * @returns {Promise<Object>} The MongoDB database connection.
 */
export async function useDB() {
  
  if (cache) {
    console.log('db cached!')
    return cache
  }

  console.log('no db cached, making new client')

  const db =  client.db('business-os')
  cache = db
  return db
}

/**
 * Empty function to as a workaround for https://github.com/vercel/next.js/issues/54282
 * 
 * @returns {Promise<void>}
 */
export const fuckNextDB = async() => {
  
}

