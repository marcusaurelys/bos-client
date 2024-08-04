
import {motion} from 'framer-motion'
import { TagIcon } from '@heroicons/react/16/solid'
import {User, ITicket} from "../../types"
import EmployeeTable from './EmployeeTable'
import Link from 'next/link'
import { changeStatus } from '@/db/tickets'
import { UserContext } from '@/contexts/UserContextProvider'
import { useContext } from 'react'
interface TicketProps {
    ticket: ITicket
}

export default function Ticket({ticket}: TicketProps) {

    const user = useContext(UserContext)

    let priorityColor
    if(ticket.priority_score.toLowerCase() === "high") {
        priorityColor = "bg-red-500"
    }
    if(ticket.priority_score.toLowerCase() === "medium") {
        priorityColor = "bg-yellow-400"
    }
    if(ticket.priority_score.toLowerCase() === "low") {
        priorityColor = "bg-green-500"
    }
    
  return ( <>

    <motion.div layout layoutId={ticket._id.toString()} 
        className={`flex flex-col bg-card rounded-sm p-3 text-sm h-fit gap-1`}
        >
        {/* ticket tags */}
        <div className="flex gap-2 flex-wrap">
            <div className={`flex flex-row rounded-md w-fit text-xs py-1 px-2 items-center gap-2 mb-1 text-white ${priorityColor}`}>
                <h1>{ticket.priority_score.charAt(0).toUpperCase() + ticket.priority_score.slice(1)}</h1>
            </div>
            {
                ticket.tags.map((tag, index) => {
                    return <div key={index} className="flex flex-row rounded-md w-fit text-xs border py-1 px-2 items-center gap-2 mb-1">
                        <TagIcon className="h-4 fill-none stroke-primary/40"/>
                        <h1>{tag.charAt(0).toUpperCase() + tag.slice(1)}</h1>
                    </div>
                })
            }

        </div>
        
        <Link href={`ticket/${ticket._id}`} data-test={`ticket-${ticket._id}`}>
            {/* ticket description */}
        <div className="font-semibold">
                <h1>{ticket.name}</h1>
        </div>

        {/* ticket description */}
        <div className="mb-4">
                <h1>{ticket.description}</h1>
        </div>
        </Link>
        

        {/* ticket footer */}
        <div className="flex flex-row mt-auto">
            {user?.role === 'admin' && <EmployeeTable ticket={ticket}/>}
            <h1 className="text-xs text-primary/75 ml-auto">{ticket.date_created.slice(4,15)}</h1>
        </div>


    </motion.div>

    

    
  </>

    
  )
}
