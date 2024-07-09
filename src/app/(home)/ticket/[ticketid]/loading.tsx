import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function ChatHistorySkeleton() {
  return (
    <div className="flex flex-col m-2">
      {Array(5).fill(3).map((_, index) => (
        <div key={index} className="flex flex-col m-2 border rounded-lg bg-stone-100">
          <div className="flex flex-col m-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function AISkeleton() {
  return (
    <main className="flex h-[calc(75dvh)] flex-col items-center justify-center">
      <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
        <Skeleton className="w-full h-full" />
      </div>
    </main>
  );
}

function TicketSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-10" />
      </CardHeader>
      <div className="flex gap-2 flex-wrap pl-6 pb-6 pr-6">
        <Skeleton className="h-6 w-20" />
        {Array(3).fill(1).map((_, index) => (
          <Skeleton key={index} className="h-6 w-16" />
        ))}
      </div>
      <CardContent>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
    </Card>
  );
}

function Loading() {
  return (
    <div className="flex flex-row m-4">
      <div className="w-2/3 border rounded-lg m-2">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">
              <Skeleton className="h-6 w-24" />
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Skeleton className="h-6 w-24" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat">
            <ChatHistorySkeleton />
          </TabsContent>
          <TabsContent value="ai">
            <AISkeleton />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-1/3 m-2">
        <TicketSkeleton />
      </div>
    </div>
  );
}

export default Loading;
