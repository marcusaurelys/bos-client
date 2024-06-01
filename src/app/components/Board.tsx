'use client'

import React, { useState } from 'react'
import Column from './Column'


const mockTickets = [
    {id: 1, title: "Unable to access server", description: "My game server is down and I can't connect to it.", status: "todo", priority: "high", tags: ["connection", "server issue"], dateCreated: '2024-05-20T10:00:00Z'},
    {id: 2, title: "High latency issues", description: "Experiencing high ping and latency spikes on my server.", status: "todo", priority: "medium", tags: ["performance", "latency"], dateCreated: '2024-05-21T14:30:00Z'},
    {id: 3, title: "Change server location", description: "I want to move my server to a different region for better performance.", status: "doing", priority: "low", tags: ["location", "configuration"], dateCreated: '2024-05-22T09:15:00Z'},
    {id: 4, title: "Upgrade server plan", description: "Need to upgrade to a higher plan for more resources.", status: "doing", priority: "medium", tags: ["billing", "upgrade"], dateCreated: '2024-05-23T11:45:00Z'},
    {id: 5, title: "Billing error", description: "Charged twice for the same month. Please assist with the refund.", status: "todo", priority: "high", tags: ["billing", "refund"], dateCreated: '2024-05-24T16:00:00Z'},
    {id: 6, title: "Install mod pack", description: "Requesting help to install a specific mod pack on my server.", status: "done", priority: "low", tags: ["installation", "modding"], dateCreated: '2024-05-25T13:20:00Z'},
    {id: 7, title: "Server backup", description: "Need assistance with backing up my current server data.", status: "done", priority: "medium", tags: ["backup", "data"], dateCreated: '2024-05-26T08:55:00Z'},
    {id: 8, title: "DDoS attack", description: "My server is under DDoS attack and I need immediate assistance.", status: "todo", priority: "high", tags: ["security", "DDoS"], dateCreated: '2024-05-27T12:10:00Z'},
    {id: 9, title: "Reset server", description: "Please help me reset my server to the default state.", status: "doing", priority: "medium", tags: ["reset", "configuration"], dateCreated: '2024-05-28T17:25:00Z'},
    {id: 10, title: "Add admin user", description: "Need help adding a new admin user to my server.", status: "done", priority: "low", tags: ["user management", "permissions"], dateCreated: '2024-05-29T10:50:00Z'}
];


function Board() {
    const [tickets, setTickets] = useState(mockTickets)


  return (
    <div className="flex flex-row gap-4 w-full h-full"> 
      <Column title="Pending" status="todo" tickets={tickets}/>
      <Column title="Open" status="doing" tickets={tickets}/>
      <Column title="Closed" status="done" tickets={tickets}/>
    </div>
  )
}

export default Board
