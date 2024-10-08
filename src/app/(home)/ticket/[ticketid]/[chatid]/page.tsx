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
import { IChat, ITicket, IConversation, User } from '@/types'
import ClientToast from '@/app/components/ErrorToast'
import Listener from '@/app/components/Listener'
import  { TicketSkeleton }  from './loading'
import { getChatHistory, add_dev_chat, get_dev_chat } from '@/db/chat'
import { ScrollArea } from '@/components/ui/scroll-area'
import RefreshChatLog from '@/app/components/RefreshChatLog'
import { redirect } from 'next/navigation'

export default async function Ticket({params}:{params:{ticketid:string,chatid:string}}) {
    
    fuckNextDB()
    fuckNextTickets()
    fuckNextChat()
    fuckNextUsers()

  const generate_problem_statement = async(chat_history: IConversation | null) => {
     
     if (chat_history === null) {
       throw new Error('BRUH THE CHATS ARE NULL')
     }

     if (!ticket_info) 
         throw new Error("Ticket does not exist")

     let chat_logs = ""
     
     for (const message of chat_history.messages) {
        if (message.from == "user") {
          chat_logs += "User: "
        } else {
          chat_logs += "Operator: "
        }

        chat_logs += message.content + "\n"
      
     }

     
     
     const formData = new FormData()
     formData.append('chat_logs', chat_logs)
     formData.append('sessionID', ticket_info.chat_id )
     try{
        const response = await fetch('http://localhost:5000/api/storeChatLogs', {
            method: "POST",
            body: formData,
          }) 
          const json = await response.json()
          const problem_statement = json.problem_statement
          const solution_statement = json.solution_statement
     
          const devchat: any = {}
          devchat.problem_statement = problem_statement
          devchat.solution_statement = solution_statement
          devchat.chat_id = ticket_info.chat_id
          devchat.messages = []
     
          await add_dev_chat(devchat)
     }
     catch(error: any){
        
        //redirect(`/oops?error=${error}`)
     }
     
     
  }

    let ticket_info: ITicket | null = null
    let chat_history: IChat | null = null
    let devchat
    let priorityColor: string = ""
    let errorMessage = ""
    let chatError = "An error occurred while fetching the chat history, please check the TicketID in the url"
    let chatAndTicketError = "An error occurred while fetching the ticket and chat history, please check the TicketID in the url"

    const userString = cookies().get('user')?.value

    if (!userString) {
        redirect('/login')
    }

    const user = JSON.parse(userString)
    
    try{
        [ticket_info, chat_history, devchat] = await Promise.all([getTicket(params.ticketid), getChatHistory(params.chatid), get_dev_chat(params.chatid)])
        if (ticket_info){
            if(ticket_info.priority_score == "high") {
                priorityColor = "bg-red-500"
            }
            if(ticket_info.priority_score == "medium") {
                priorityColor = "bg-yellow-400"
            }
            if(ticket_info.priority_score == "low") {
                priorityColor = "bg-green-500"
            }
        }
    }
    catch(error: any){
        errorMessage = "An error occurred while fetching the ticket, please check the TicketID in the url"
        
    }

    if (!ticket_info) 
        throw new Error("Ticket does not exist")
        
    if (devchat === null) {
        
        await generate_problem_statement(chat_history)
        devchat = await get_dev_chat(ticket_info.chat_id)
        

        if (devchat === null) {
            throw new Error("DEVCHAT IS NULL!")
        }  
    }

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
            <div className = "flex flex-col w-2/3 m-2">

            
            <div className="border rounded-lg">
                <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chat">Chat History</TabsTrigger>
                    <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
                    
                </TabsList>
                <TabsContent value="chat">
                    <ScrollArea className="h-[calc(75dvh)]">
                    <div className="flex flex-col h-[calc(75dvh)] m-2">
                    {
                        chat_history == null ?
                            <div className="text-xs m-2 justify-self-end"> No chat history available. </div>
                        :
                        chat_history.messages.map((message, index) => (
                            message.from == "operator" 
                            ?
                                message.content == "{\"namespace\":\"state:resolved\"}" ?
                                <div key = {index}></div>
                                :
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
                    {
                        chat_history == null ?
                        <div><ClientToast errorMessage={chatError}/></div>
                        :
                        <div className="text-xs m-2"> End of chat history. </div>
                    } 
                    </div> 
                    </ScrollArea>
                </TabsContent>
                <TabsContent value="ai">
                    <main className="flex h-[calc(75dvh)] flex-col items-center justify-center">
                        <div className="z-10 rounded-lg w-full h-full text-sm lg:flex">
                            <Bot chat_id={ticket_info.chat_id} ticket_id={ticket_info._id} devchat={devchat}/>
                        </div>
                    </main>
                </TabsContent>
                </Tabs>
            </div>
            <div className='mt-2 rounded-lg p-1 cursor-pointer border z-50 w-1/6'>
                <RefreshChatLog ticket_info={ticket_info}/>
            </div>
            </div>
            <div className="w-1/3 m-2">
                <Card>
                    <CardHeader className="flex flex-row justify-between">
                        <CardTitle data-test={`${ticket_info._id}-title`}> {ticket_info.name}</CardTitle>
                        <EditTicket ticket={ticket_info} user={user!}/>
                    </CardHeader>
                    <div className="flex gap-2 flex-wrap pl-6 pb-6 pr-6">
                        <div className={`flex flex-row rounded-md w-fit text-xs py-1 px-2 items-center gap-2 mb-1 text-white ${priorityColor}`}>
                            <h1>{ticket_info.priority_score.charAt(0).toUpperCase() + ticket_info.priority_score.slice(1)}</h1>
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
                    <CardContent data-test={`${ticket_info._id}-description`}>
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
