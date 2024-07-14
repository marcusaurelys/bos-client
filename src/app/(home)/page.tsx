import Board from "../components/Board";
import { fuckNextTickets, getTicketByStatus } from '@/db/tickets'
import { fuckNextUsers, getUserByToken } from '@/db/users'
import { fuckNextDB } from '@/db/mongo'
import Column from '@/app/components/Column'
import Filter from '@/app/components/Filter'
import { UserContext } from "@/contexts/userContext";
import { cookies } from "next/headers";

function parseStringToArray(input: string): string[] {
  try {
      // Remove any whitespace and check if the input string is a valid array format
      const trimmedInput = input.trim();
      if (trimmedInput.startsWith("[") && trimmedInput.endsWith("]")) {
          // Use JSON.parse to convert the string to an array
          const result = JSON.parse(trimmedInput);
          // Ensure the parsed result is an array of strings
          if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
              return result;
          } else {
              throw new Error("Parsed result is not an array of strings");
          }
      } else {
          throw new Error("Invalid array format");
      }
  } catch (error : any) {
      console.error("Error parsing string to array:", error.message);
      return [];
  }
}

export default async function Home({ searchParams } : { searchParams?: { [key: string]: string | string[] | undefined }}) {

  fuckNextDB()
  fuckNextUsers()
  fuckNextTickets()

  let filters = ['high', 'medium', 'low']

  if( typeof searchParams?.filters === "string" ){
    filters = parseStringToArray(searchParams.filters)
  }
  console.log(filters)
  
  const [pending, open, closed] = await Promise.all([getTicketByStatus('pending', filters), getTicketByStatus('open', filters), getTicketByStatus('closed', filters)])
  

  return (
    <main className="w-full h-[calc(100vh-3rem)] flex justify-center">
      <div className="w-full flex flex-row">
      <div className="flex justify-center items-start w-full h-full">
      <div className="flex flex-col w-fit justify-center">
            <div className="z-10 relative my-3" >
              <Filter/>
            </div>
            <div className="flex gap-12 flex-wrap"> 
              <Column title="Pending" status="pending" tickets={pending}/>
              <Column title="Open" status="open" tickets={open}/>
              <Column title="Closed" status="closed" tickets={closed}/>
            </div>
          </div>   
        </div>
      </div>    
   </main>
  );
  
}


