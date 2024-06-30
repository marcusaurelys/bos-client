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

interface EmployeeTableProps {
    ticket: ITicket;
}

const CustomDialogContent = styled(DialogContent)`
  width: 800px !important; /* Ensure it overrides other styles */
  min-width: 56%;
  max-width: 100%;
`;


export default function EmployeeTable({ticket}: EmployeeTableProps) {

    const [users, setUsers] = useState<User[]>([]);
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [ticketToUpdate, updateTicket] = useState(ticket);
    const [trigger, setTrigger] = useState(0)
    
    const toggleUser = (user: User) => {
        const userId = user._id;
        const hasUser = ticketToUpdate.userIDs.includes(userId);

        const updatedUserIDs = hasUser
            ? ticketToUpdate.userIDs.filter((id) => id !== userId) // Remove if already present
            : [...ticketToUpdate.userIDs, userId]; // Add if not present

        updateTicket({ ...ticketToUpdate, userIDs: updatedUserIDs });
    };

    const updateUserIDs = async () => {
        try {
            refreshTicket(ticketToUpdate.id, {userIDs: ticketToUpdate.userIDs})
            setTrigger((prev) => {return prev + 1})
        } catch (error) {
            console.error('Error updating user IDs:', error);
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
        if(isOpen){
        //ensure that the ticket has latest data when editing. this is set to any for now because our getTicket function is unhinged
        getTicket(ticket.id).then((ticket: any) => {
            if(ticket){
                updateTicket(ticket)
            }
        })

        getAllUsers().then((users) => {
           setUsers(JSON.parse(users))
           setFilteredUsers(JSON.parse(users))
        })

        getTickets().then((ticket) => {
            setTickets(ticket)
        })
        }

        return () => {
            setUsers([])
            setTickets([])
            setTrigger(0)
        }
    }, [isOpen, trigger])
    
        

    return (
        <Dialog open={isOpen} onOpenChange={setOpen} >
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
                <Table className="w-[800px] rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="justify-end">View Tickets</TableHead>
                            <TableHead className="justify-end">Assign User</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user._id} className={`${ticketToUpdate.userIDs.includes(user._id) ? 'bg-green-100' : 'bg-slate-100'}`}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Tickets</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {tickets.filter(ticket => ticket.userIDs.includes(user._id)).length > 0 ? (
                                                tickets
                                                    .filter(ticket => ticket.userIDs.includes(user._id))
                                                    .map(ticket => (
                                                        <DropdownMenuItem key={ticket.id}>
                                                            {ticket.title}
                                                        </DropdownMenuItem>
                                                    ))
                                            ) : (
                                                <DropdownMenuItem>None</DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell>
                                    <Toggle aria-label="Toggle bold" onClick={() => toggleUser(user)}>
                                        {ticketToUpdate.userIDs.includes(user._id) ? 'Cancel' : 'Select'}
                                    </Toggle>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <DialogFooter>
                    <Button variant="ghost" onClick={clearModal}>Clear Changes</Button>
                    <Button type="submit" onClick={updateUserIDs}>Confirm</Button>
                </DialogFooter>
            </CustomDialogContent>
        </Dialog>
    );
}
