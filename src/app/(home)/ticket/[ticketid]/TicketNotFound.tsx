import Bot from "@/app/components/Bot";
import Listener from "@/app/components/Listener";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IChat } from "@/types";
import { TicketSkeleton } from "./loading";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TicketNotFound(chat_history: IChat){
    return(
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
                            {chat_history.messages.map((message, index) => (
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
                            ))}
                            
                        </div>
                        <div className="text-xs m-2 justify-self-end"> End of chat history. </div>
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
        </>
    )
}