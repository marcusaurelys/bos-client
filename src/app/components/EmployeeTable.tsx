import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { User, ITicket } from '@/types';
import { getTicket, getTickets, refreshTicket } from "@/db/tickets";
import { getAllUsers } from "@/db/users";

import styled from 'styled-components';
import { revalidatePath } from "next/cache";
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";



interface EmployeeTableProps {
    ticket: ITicket;
}

const CustomDialogContent = styled(DialogContent)`
  width: 800px !important; /* Ensure it overrides other styles */
  max-width: 50%;
  max-height: 80%;
`;


export default function EmployeeTable({ticket}: EmployeeTableProps) {

    const [users, setUsers] = useState<User[]>([]);
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [ticketToUpdate, updateTicket] = useState(ticket);
    const [trigger, setTrigger] = useState(0)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    
    const toggleUser = (user: User) => {
        const userId = user._id;
        const hasUser = ticketToUpdate.userIDs.includes(userId);

        const updatedUserIDs = hasUser
            ? ticketToUpdate.userIDs.filter((id) => id !== userId) // Remove if already present
            : [...ticketToUpdate.userIDs, userId]; // Add if not present

        updateTicket({ ...ticketToUpdate, userIDs: updatedUserIDs });
    };

    const updateUserIDs = async () => {
        const response = await refreshTicket(ticketToUpdate.id, {userIDs: ticketToUpdate.userIDs})
        if (response) {
            toast({
                description: 'The assignees of ticket "' + ticket.title + '"' +  " has been updated."
              })
            setTrigger((prev) => {return prev + 1})
            clearModal()
            setOpen(false)
        } else {
            toast({
                variant: "destructive",
                title: "Request failed."
              })
        }
    };

    const clearModal = () => {
        updateTicket(ticket);
    };

    const sortUsers = (newFilter: string) => {
        let sortedUsers = [...users];
        if (newFilter === "Name") {
            sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            sortedUsers.sort((a, b) => b.role.localeCompare(a.role));
        }
        setFilteredUsers(sortedUsers);
    };

    useEffect(() => {
        setFilteredUsers(users)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try{
                const [ticketNow, tickets, users] = await Promise.all([getTicket(ticket.id), getTickets(), getAllUsers()])
                if(ticketNow){
                    updateTicket(ticketNow)
                }
                setUsers(JSON.parse(users))
                setFilteredUsers(JSON.parse(users))
                setTickets(tickets)
            } catch(e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
            
        }
        if(isOpen){
            fetchData()
        }
        //ensure that the ticket has latest data when editing. this is set to any for now because our getTicket function is unhinged

        

        return () => {
            setUsers([])
            setTickets([])
            setTrigger(0)
        }
    }, [isOpen, trigger])
    
        

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger className="font-bold">Assign Ticket</DialogTrigger>
        <CustomDialogContent>
            <DialogHeader>
                <DialogTitle>{ticket.title}</DialogTitle>
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
                                        {tickets.filter(ticket => ticket.userIDs.includes(user._id)).length > 0 ? (
                                            tickets
                                                .filter(ticket => ticket.userIDs.includes(user._id))
                                                .map(ticket => (
                                                    <DropdownMenuItem key={ticket.id}>
                                                         <Link href={`ticket/${ticket.id}`}>
                                                            {ticket.title}
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
                                    {ticketToUpdate.userIDs.includes(user._id) ? 'Remove User' : 'Assign User'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </ScrollArea>
            </Table>
            <DialogFooter>
                <Button variant="ghost" onClick={clearModal}>Clear Changes</Button>
                <Button type="submit" onClick={updateUserIDs}>Confirm</Button>
            </DialogFooter>
        </CustomDialogContent>
    </Dialog>
    );
}


function Loading() {
    return (
        <>
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="flex flex-row justify-left items-center mb-4">
                <Skeleton className="h-6 w-16 mr-2" />
                <Skeleton className="h-6 w-16 mr-2" />
                <Skeleton className="h-6 w-16" />
            </div>
            <Table className="w-[800px] rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]"><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead className="justify-end"><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead className="justify-end"><Skeleton className="h-4 w-full" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array(5).fill().map((_, index) => (
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