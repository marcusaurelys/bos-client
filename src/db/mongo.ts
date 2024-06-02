import {MongoClient} from 'mongodb'



const client = new MongoClient(process.env.MONGO_URI || '')

async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
      console.log("successfully closed connection")
    }
}
export default client