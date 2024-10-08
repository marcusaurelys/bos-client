import {MongoClient} from 'mongodb'

const MONGO_URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PRODUCTION : process.env.MONGO_URI 
const client = new MongoClient(MONGO_URI || '')
let cache: any = null

/**
 * Uses the MongoDB database connection, caching the connection for reuse.
 * 
 * @returns {Promise<Object>} The MongoDB database connection.
 */
export async function useDB() {
  
  if (cache) {
    
    return cache
  }

  

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

