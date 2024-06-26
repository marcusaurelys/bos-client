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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { getTicket } from "@/db/tickets";
import { Button } from "@/components/ui/button"
import { Key } from "react"
import { ChatLayout } from "@/components/chat/chat-layout"
import { cookies } from "next/headers";
import { handleChangeStatus } from "@/contexts/actions";
import { revalidatePath } from "next/cache";
  
  
export default async function ticket({params}:{params:{ticketid:string}}) {
    const layout = cookies().get("react-resizable-panels:layout");
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
    const ticket_info = await getTicket(params.ticketid)

    if (!ticket_info) {
        return (
            <p>Ticket returned null from database, check the id in the url</p>
        )
    }

    async function setStatus(formData : FormData){
        "use server"
        const status = (formData.get('status') as string).toLowerCase()
        handleChangeStatus(params.ticketid, status)
        revalidatePath(`/ticket/${params.ticketid}`)
    }
    
    const chat_history = {
        "messages": [
          { "content": "Hi there, I'm experiencing some issues with one of our servers. It seems to be running slow and some services are unresponsive. Can you help?", "from": "user" },
          { "content": "Hello! Thank you for reaching out. I'm sorry to hear about the server troubles. We'll get that sorted out for you. Could you please provide the server name or any specific details?", "from": "operator" },
          { "content": "Sure, it's our main production server named 'ProdServer01'. It really needs a restart to clear things up.", "from": "user" },
          { "content": "Got it, 'ProdServer01.' We'll initiate a restart right away to address the performance issues. We'll keep you updated on the progress. Thanks for bringing this to our attention!", "from": "operator" }
        ]
    }

    // const ai_recomm = {
    //     "recs": [
    //       { "content": "lorem ipsum" },
    //     ]
    // }

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
        <div className="flex flex-row m-4">
            <div className="w-2/3 border rounded-lg m-2">

                <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chat">Chat History</TabsTrigger>
                    <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
                </TabsList>
                <TabsContent value="chat">
                    <div className="flex flex-col m-2">
                        {chat_history.messages.map((message, index) => (
                            message.from == "operator" 
                            ?
                            <div className="flex flex-col m-2 border rounded-lg bg-blue-100">
                                <div key={index} className="flex flex-col m-2">
                                    <strong>{message.from}</strong>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                            :
                            <div className="flex flex-col m-2 border rounded-lg bg-stone-100">
                                <div key={index} className="flex flex-col m-2">
                                    <strong>{message.from}</strong>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="ai">
                    <main className="flex h-[calc(75dvh)] flex-col items-center justify-center">
                        <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
                            <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
                        </div>
                    </main>
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
                            ticket_info.tags.map((tag: string, index: Key | null | undefined) => (
                                <div key={index} className="flex flex-row rounded-md w-fit text-xs border py-1 px-2 items-center gap-2 mb-1">
                                    <TagIcon className="h-4 fill-none stroke-primary/40"/>
                                    <h1>{tag.charAt(0).toUpperCase() + tag.slice(1)}</h1>
                                </div>
                            ))
                        }
                    </div>
                    <CardContent>
                        {ticket_info.description}
                    </CardContent>
                    <form action={setStatus}>
                    <CardFooter>
                        <div className="flex flex-row w-full gap-2">
                            <Select name='status'>
                            <SelectTrigger className="w-2/3">
                                <SelectValue placeholder={ticket_info.status.charAt(0).toUpperCase() + ticket_info.status.slice(1)} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                            </Select>
                            <Button className="w-1/3">Update</Button>
                        </div>
                    </CardFooter>
                    </form>
                </Card> 
            </div>
        </div>
    </>
    );
  }
