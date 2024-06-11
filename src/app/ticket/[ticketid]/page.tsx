import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { TagIcon } from '@heroicons/react/16/solid'
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { getTickets } from "@/db/tickets";
  
  

export default async function ticket({params}:{params:{ticketid:string}}) {

    const tickets = await getTickets()
    const id = tickets.findIndex(x => x.id === params.ticketid)
    const ticket_info = tickets[id]

    const chat_history = {
        "messages": [
          { "content": "Hi there, I'm experiencing some issues with one of our servers. It seems to be running slow and some services are unresponsive. Can you help?", "from": "Boris" },
          { "content": "Hello! Thank you for reaching out. I'm sorry to hear about the server troubles. We'll get that sorted out for you. Could you please provide the server name or any specific details?", "from": "John" },
          { "content": "Sure, it's our main production server named 'ProdServer01'. It really needs a restart to clear things up.", "from": "Boris" },
          { "content": "Got it, 'ProdServer01.' We'll initiate a restart right away to address the performance issues. We'll keep you updated on the progress. Thanks for bringing this to our attention!", "from": "John" }
        ]
    }

    const action_history = {
        "actions": [
          { "content": "Chat with user, ticket generated", "date": "June 1, 2024" },
        ]
    }

    let priorityColor
    if(ticket_info.priority == "high") {
        priorityColor = "bg-red-500"
    }
    if(ticket_info.priority == "medium") {
        priorityColor = "bg-yellow-400"
    }
    if(ticket_info.priority == "low") {
        priorityColor = "bg-green-500"
    }

    return (<>
        <div className="flex flex-row h-dvh m-4">
            <div className="w-2/3 border rounded-lg m-2">
                <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chat">Chat History</TabsTrigger>
                    <TabsTrigger value="actions">Action History</TabsTrigger>
                </TabsList>
                <TabsContent value="chat">
                    <div className="flex flex-col m-2">
                        {chat_history.messages.map((message, index) => (
                            <div className="flex flex-col m-2 border rounded-lg">
                                <div key={index} className="flex flex-col m-2">
                                    <strong>{message.from}</strong>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="actions">
                    <div className="flex flex-col m-2">
                        {action_history.actions.map((action, index) => (
                            <div className="flex flex-col m-2 border rounded-lg">
                                <div key={index} className="flex flex-col m-2">
                                    <strong>{action.date}</strong>
                                    <p>{action.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
                </Tabs>

            </div>
            <div className="w-1/3 m-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{ticket_info.title}</CardTitle>
                    </CardHeader>
                    <div className="flex gap-2 flex-wrap pl-6 pb-6 pr-6">
                        <div className={`flex flex-row rounded-md w-fit text-xs py-1 px-2 items-center gap-2 mb-1 text-white ${priorityColor}`}>
                            <h1>{ticket_info.priority.charAt(0).toUpperCase() + ticket_info.priority.slice(1)}</h1>
                        </div>
                        {
                            ticket_info.tags.map((tag, index) => {
                                return <div key={index} className="flex flex-row rounded-md w-fit text-xs border py-1 px-2 items-center gap-2 mb-1">
                                    <TagIcon className="h-4 fill-none stroke-primary/40"/>
                                    <h1>{tag.charAt(0).toUpperCase() + tag.slice(1)}</h1>
                                </div>
                            })
                        }
                    </div>
                    <CardContent>
                        {ticket_info.description}
                    </CardContent>
                    <CardFooter>
                        <DropdownMenu>
                        <DropdownMenuTrigger className="w-full">
                            <div className="w-full border">{ticket_info.status}</div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Pending</DropdownMenuItem>
                            <DropdownMenuItem>Open</DropdownMenuItem>
                            <DropdownMenuItem>Closed</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </CardFooter>
                </Card> 
            </div>
        </div>
    </>
    );
  }