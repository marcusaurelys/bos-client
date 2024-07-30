import { fuckNextDB } from '@/db/mongo'
import { fuckNextTickets } from '@/db/tickets'
import { fuckNextChat } from '@/db/chat'
import { fuckNextUsers } from '@/db/users'

import {
    Card,
    CardContent,
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

import { getTicket } from "@/db/tickets";
import { Key } from "react"
import { cookies } from "next/headers";
import Bot from "@/app/components/Bot";
import UpdateStatusForm from "@/app/components/UpdateStatusForm";
import EditTicket from "@/app/components/EditTicket";
import { validateUser } from "@/db/users";
import { IChat, IMessage, ITicket } from '@/types'
import ClientToast from '@/app/components/ErrorToast'
import Listener from '@/app/components/Listener'
import  { TicketSkeleton }  from './loading'
import { getChatHistory } from '@/db/chat'
import { ScrollArea } from '@/components/ui/scroll-area'

export default async function Ticket({params}:{params:{ticketid:string}}) {

    fuckNextDB()
    fuckNextTickets()
    fuckNextChat()
    fuckNextUsers()

    const layout = cookies().get("react-resizable-panels:layout");
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

    let ticket_info: ITicket | null = null
    let chat_history: IChat
    let user: string = ""
    let priorityColor: string = ""
    let errorMessage = ""
    let chatError = "An error occurred while fetching the chat history, please check the TicketID in the url"
    let chatAndTicketError = "An error occurred while fetching the ticket and chat history, please check the TicketID in the url"
    
    try{
        [ticket_info, user] = await Promise.all([getTicket(params.ticketid), validateUser()])
        
        if (ticket_info){
            if(ticket_info.priority == "high") {
                priorityColor = "bg-red-500"
            }
            if(ticket_info.priority == "medium") {
                priorityColor = "bg-yellow-400"
            }
            if(ticket_info.priority == "low") {
                priorityColor = "bg-green-500"
            }
        }
    }
    catch(error: any){
        errorMessage = "An error occurred while fetching the ticket, please check the TicketID in the url"
        console.log(errorMessage)
    }

    chat_history = await getChatHistory(params.ticketid)
 
    if (ticket_info == null) {
        return (
            <>
            <div className="flex flex-row m-4">
                <div className="w-2/3 border rounded-lg m-2">
                    <Tabs defaultValue="chat" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="chat">Chat History</TabsTrigger>
                        <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
                    </TabsList>
                    <TabsContent value="chat">
                        <ScrollArea className="h-[calc(75dvh)]">
                            <div className="flex flex-col m-2">
                                {
                                    chat_history == null ?
                                        <div className="text-xs m-2 justify-self-end"> No chat history available. </div>
                                    :
                                    chat_history.messages.map((message, index) => (
                                        message.from == "operator" 
                                        ?
                                        <div className="flex flex-col m-2 border rounded-lg bg-blue-100" key={index}>
                                            <div className="flex flex-col m-2">
                                                <strong>{message.from}</strong>
                                                <p>{message.content}</p>
                                            </div>
                                        </div>
                                        :
                                        <div className="flex flex-col m-2 border rounded-lg bg-stone-100" key={index}>
                                            <div className="flex flex-col m-2">
                                                <strong>{message.from}</strong>
                                                <p>{message.content}</p>
                                            </div>
                                        </div>
                                    ))
                                }   
                            </div>
                            {
                                chat_history == null ?
                                <div><ClientToast errorMessage={chatError}/></div>
                                :
                                <div className="text-xs m-2 justify-self-end">End of chat history.</div> 
                            }
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="ai">
                        <main className="flex h-[calc(75dvh)] flex-col items-center justify-center">
                            <div className="z-10 rounded-lg w-full h-full text-sm lg:flex">
                                <Bot/>
                            </div>
                        </main>
                    </TabsContent>
                    </Tabs>

                </div>
                <div className="w-1/3 m-2">
                    <TicketSkeleton />
                </div>
            </div>
            <Listener/>
            {
                chat_history == null ?
                <div><ClientToast errorMessage={chatAndTicketError}/></div>
                :
                <div><ClientToast errorMessage={errorMessage}/></div>  
            }
            </>
        )
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
                    <div className="flex flex-col h-[calc(75dvh)] m-2">
                    {
                        chat_history == null ?
                            <div className="text-xs m-2 justify-self-end"> No chat history available. </div>
                        :
                        chat_history.messages.map((message, index) => (
                            message.from == "operator" 
                            ?
                            <div className="flex flex-col m-2 border rounded-lg bg-blue-100" key={index}>
                                <div className="flex flex-col m-2">
                                    <strong>{message.from}</strong>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                            :
                            <div className="flex flex-col m-2 border rounded-lg bg-stone-100" key={index}>
                                <div className="flex flex-col m-2">
                                    <strong>{message.from}</strong>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                    {
                        chat_history == null ?
                        <div><ClientToast errorMessage={chatError}/></div>
                        :
                        <div className="text-xs m-2 justify-self-end"> End of chat history. </div>
                    }  
                </TabsContent>
                <TabsContent value="ai">
                    <main className="flex h-[calc(75dvh)] flex-col items-center justify-center">
                        <div className="z-10 rounded-lg w-full h-full text-sm lg:flex">
                            <Bot/>
                        </div>
                    </main>
                </TabsContent>
                </Tabs>

            </div>
            <div className="w-1/3 m-2">
                <Card>
                    <CardHeader className="flex flex-row justify-between">
                        <CardTitle data-test={`${ticket_info.id}-title`}> {ticket_info.title}</CardTitle>
                        <EditTicket ticket={ticket_info} user={JSON.parse(user)}/>
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
                    <CardContent data-test={`${ticket_info.id}-description`}>
                        {ticket_info.description}
                    </CardContent>
                    <UpdateStatusForm ticketInfo={ticket_info}/>
                </Card> 
            </div>
        </div>
        <Listener/>
    </>
    );
  }
