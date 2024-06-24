'use server'

import {Db, MongoClient} from 'mongodb'

const client = new MongoClient(process.env.MONGO_URI || '', {socketTimeoutMS: 5000, maxIdleTimeMS: 2000})
let cache : Db | null = null

//okay this works kinda lets goo
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

export const fuckNextDB = async() => {
  
}

