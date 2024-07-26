const clients = []

// It needs to be an object singleton so we can keep it in memory across exports
export const updateObject = {
  update: 0,  
} 

export function addClient(id, writer) {
  clients.push({ id, writer })
  console.log("added client: " + id)
  console.log(clients)
}

export function removeClient(id) {
  const index = clients.findIndex(client => client.id === id)
  if (index != -1) {
    clients.splice(index, 1)
    console.log("removed client: " + id)
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




