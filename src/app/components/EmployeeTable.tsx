import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState, memo } from 'react';
import { Button } from "@/components/ui/button";
import { User, ITicket } from '@/types';
import { getTicket, getTickets, refreshTicket } from "@/db/tickets";
import { getAllUsers } from "@/db/users";
import styled from 'styled-components';
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";



interface EmployeeTableProps {
    ticket: ITicket;
}

//Resizes the modal
const CustomDialogContent = styled(DialogContent)`
  width: 800px !important; /* Ensure it overrides other styles */
  max-width: 50%;
  max-height: 80%;
`;


const EmployeeTable = memo(function EmployeeTable({ticket}: EmployeeTableProps) {

    const [users, setUsers] = useState<User[]>([]); //users to be assigned on the modal
    const [tickets, setTickets] = useState<ITicket[]>([]); //needed to view what tickets a user is assigned to
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]); //separate state for filtered view
    const [ticketToUpdate, updateTicket] = useState<ITicket>(ticket); //client-side ticket
    const [loading, setLoading] = useState(false) //renders skeleton component when loading
    const { toast } = useToast()

    /**
     * Toggles the assignees of the ticket (Does not automatically update the ticket on the server yet)
     * 
     * @param {User} user - The user to be assigned/removed from the ticket 
     */
    const toggleUser = (user: User) => {
        const userId = user._id;
        const hasUser = ticketToUpdate.userIDs.includes(userId);

        const updatedUserIDs = hasUser
            ? ticketToUpdate.userIDs.filter((id) => id !== userId) // Remove if already present
            : [...ticketToUpdate.userIDs, userId]; // Add if not present

        updateTicket({ ...ticketToUpdate, userIDs: updatedUserIDs });
    };

    
    /**
     * Helper function to compare whether the two arrays are the same
     * 
     * @param {string} a - ObjectId of the users stored in the server
     * @param {string} b - ObjectId of the users stored in the client
     * @returns {boolean} - true if they're different, else if otherwise
     */
    const compareArrays = (a: string[], b: string[]) => {
        const sortedArr1 = a.slice().sort();
        const sortedArr2 = b.slice().sort();

        if (sortedArr1.length !== sortedArr2.length) return false
        else {
          for (var i = 0; i < a.length; i++) {
            if (sortedArr1[i] !== sortedArr2[i]) {
              return false;
            }
          }
          return true;
        }
      };
    
    /**
     * Updates the users assigned on the ticket in the server with the users on the client
     */
    const updateUserIDs = async () => {
        const isEqual = compareArrays(ticket.userIDs, ticketToUpdate.userIDs)

        if (!isEqual){
            try{
                const response = await refreshTicket(ticketToUpdate._id, {userIDs: ticketToUpdate.userIDs})
                if (response) {
                toast({
                        description: 'The assignees of ticket "' + ticket.name + '"' +  " has been updated."
                    })
                } else {
                    toast({
                        variant: "destructive",
                        description: "Request failed."
                    })
                }
            }
            catch (e){
                toast({
                    variant: "destructive",
                    description: "Request failed."
                })
            }
        }
        else{
            toast({
                description: "No changes made."
            })
        }
        
    };

    /**
     * Sorts users based on the filter
     * 
     * @param {string} newFilter - filter to be sorted by
     */
    const sortUsers = (newFilter: string) => {
        //Shallow copy doesn't really matter too much for functionality, might change if needed
        let sortedUsers = [...users];
        if (newFilter === "Name") {
            sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            sortedUsers.sort((a, b) => b.role.localeCompare(a.role));
        } 
        setFilteredUsers(sortedUsers);
    };

    //Fetches data from server, only occurs when modal is opened
    const fetchData = async () => {
        setLoading(true)
        try{
            const [ticketNow, tickets, users] = await Promise.all([getTicket(ticket._id), getTickets(), getAllUsers()])
            if(ticketNow){
                updateTicket(ticketNow)
            }
            setUsers(users) //sets the users that can be assigned
            setFilteredUsers(users) //sets the initial filtered users
            setTickets(tickets) //sets tickets
        } catch(e) {
            console.log(e)
            window.location.reload()
            toast({
                variant: "destructive",
                title: "Error has occurred, refreshing page"
              })
        } finally {
            setLoading(false)
        }
        
    }

    return (
        <Dialog>
            <DialogTrigger onClick = {fetchData} className="font-bold">Assign Ticket</DialogTrigger>
            <CustomDialogContent className="min-h-[600px]">
                {loading ? 
                <Loading/>
                :
                <>
                <DialogHeader>
                    <DialogTitle>{ticket.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-row justify-left items-center">
                    <div>Sort by:</div>
                    <Button variant="ghost" className="ml-2" onClick={() => sortUsers("Name")}>
                        Name
                    </Button>
                    <Button variant="ghost" onClick={() => sortUsers("Role")}>
                        Role
                    </Button>
                </div>
                <Table>
                    <ScrollArea className = "h-[400px]">
                    <TableHeader>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user._id} className={`${ticketToUpdate.userIDs.includes(user._id) ? 'bg-green-100' : 'bg-slate-100'}`}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>View Tickets</DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Tickets</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {tickets.filter(ticket => ticket.userIDs?.includes(user._id)).length > 0 ? (
                                                tickets
                                                    .filter(ticket => ticket.userIDs?.includes(user._id))
                                                    .map(ticket => (
                                                        <DropdownMenuItem key={ticket._id}>
                                                            <Link href={`ticket/${ticket._id}`}>
                                                                {ticket.name}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    ))
                                            ) : (
                                                <DropdownMenuItem>None</DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell>
                                    <Button variant = "ghost" onClick={() => toggleUser(user)}>
                                        {ticketToUpdate.userIDs?.includes(user._id) ? 'Remove User' : 'Assign User'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </ScrollArea>
                </Table>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => updateTicket(ticket)}>Clear Changes</Button>
                    <DialogClose asChild>
                        <Button type="submit" onClick={updateUserIDs}>Confirm</Button>
                    </DialogClose>
                </DialogFooter>
                </>
                }
            </CustomDialogContent>
        </Dialog>
    );
})

//Skeleton Code
function Loading() {
    return (
        <>
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="flex flex-row justify-left items-center mb-4">
                <Skeleton className="h-6 w-16 mr-2" />
                <Skeleton className="h-6 w-16 mr-2" />
                <Skeleton className="h-6 w-16" />
            </div>
            <Table className="w-full rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-full"><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead className="justify-end"><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead className="justify-end"><Skeleton className="h-4 w-full" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array(5).fill(5).map((_, index) => (
                        <TableRow key={index} className="bg-slate-100">
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <DialogFooter className="mt-4">
                <Skeleton className="h-10 w-32 mr-2" />
                <Skeleton className="h-10 w-32" />
            </DialogFooter>
        </>
    );
}

export default EmployeeTable
