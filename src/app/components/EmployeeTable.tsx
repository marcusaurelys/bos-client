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
import { refreshTicket } from "@/db/tickets";
import { getAllUsers } from "@/db/users";
import { useDataContext } from '@/contexts/DataContext'

import styled from 'styled-components';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Scroll } from "lucide-react";
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

    const { users, setUsers } = useDataContext();
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isOpen, setOpen] = useState(false);
    const { loading, setLoading } = useDataContext();
    const [ticketToUpdate, updateTicket] = useState(ticket);
    const { tickets, ticketsTrigger, setTicketsTrigger } = useDataContext()
     
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
            setTicketsTrigger(trigger => trigger + 1)
            setOpen(false)
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
    }, [ticketsTrigger])
        
    if (loading) {
        return <div>Loading...</div>;
    }

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
                                    <Toggle aria-label="Toggle bold" onClick={() => toggleUser(user)}>
                                        {ticketToUpdate.userIDs.includes(user._id) ? 'Remove User' : 'Assign User'}
                                    </Toggle>
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
