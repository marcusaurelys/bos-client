import { updateObject, addClient, removeClient } from '@/app/api/listen/server'
export const dynamic = 'force-dynamic' // Required because Next.js caches the response, wasted 5 hours on this btw

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  const clientID = crypto.randomUUID()

  addClient(clientID, writer)
  console.log("updateObject server: " + updateObject.update)
  
  // Interesting format
  writer.write(encoder.encode(`data: ${JSON.stringify({update: updateObject.update})}\n\n`))

  req.signal.addEventListener('abort', () => {
    removeClient(clientID)
    writer.close()
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
} 
