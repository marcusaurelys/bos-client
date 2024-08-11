import { IClient } from "@/types"

const clients: IClient[] = []

// It needs to be an object singleton so we can keep it in memory across exports
export const updateObject = {
  update: 0,  
} 

export function addClient(id: string, writer: WritableStreamDefaultWriter) {
  clients.push({ id, writer })
}

export function removeClient(id: string) {
  const index = clients.findIndex(client => client.id === id)
  if (index != -1) {
    clients.splice(index, 1)
  }

}

export function sendMessage() {
  const encoder = new TextEncoder()

  // Signal that we have an update
  updateObject.update++
  
  clients.forEach((client) => {
    client.writer.write(encoder.encode(`data: ${JSON.stringify({update: updateObject.update})}\n\n`))
  })

  console.log("update pushed to clients")
  
}




