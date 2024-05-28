import {MongoClient} from 'mongodb'


const client = new MongoClient(process.env.MONGO_URI || '')

export const run = async () => {

    await client.connect()
    console.log("The bluetooth device is ready to pair")
    console.log(`Connected to ${client.options.dbName}`)

}

export default client