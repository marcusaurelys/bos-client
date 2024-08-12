import { updateObject, addClient, removeClient } from '@/app/api/listen/server'
 
// Required because Next.js caches the response
// See https://github.com/vercel/next.js/discussions/54075
export const dynamic = 'force-dynamic'


// Router handler for Server-sent Events, we send a signal to refresh the router of all connected clients if a server action that changes the database is called
export async function GET(req: Request) {

  // We create a transfer stream and a client ID 
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  const clientID = crypto.randomUUID()

  // We push to an array the list of connected clients we have
  addClient(clientID, writer)
  
  // Format required for a Server-sent event
  // `data: "example"\n\n`
  writer.write(encoder.encode(`data: ${JSON.stringify({update: updateObject.update})}\n\n`))

  // We terminate the connection when the client sends an abort signal
  req.signal.addEventListener('abort', () => {
    removeClient(clientID)
    writer.close()
  })

  // Headers required for an event-stream
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
} 
