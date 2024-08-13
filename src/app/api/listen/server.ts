import { IClient } from "@/types"

const clients: IClient[] = []

// The number of updates done by the server. This gets compared to the client-side update object.
export const updateObject = {
  update: 0,  
} 

// Add a connection to the array
export function addClient(id: string, writer: WritableStreamDefaultWriter) {
  clients.push({ id, writer })
}

// Remove a connection from the array
export function removeClient(id: string) {
  const index = clients.findIndex(client => client.id === id)
  if (index != -1) {
    clients.splice(index, 1)
  }

}

// This gets called from invalidating server actions. This makes all listening clients refresh their data
export function sendMessage() {
  const encoder = new TextEncoder()

  // Signal that we have an update
  updateObject.update++
  
  clients.forEach((client) => {
    client.writer.write(encoder.encode(`data: ${JSON.stringify({update: updateObject.update})}\n\n`))
  })

  
  
}




