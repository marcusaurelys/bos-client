import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"


  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { revalidatePath } from 'next/cache'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import AddUserForm from '@/app/components/AddUserForm'

import { fuckNextTickets } from '@/db/tickets'
import { fuckNextUsers, getAllUsers } from '@/db/users'
import { fuckNextDB } from '@/db/mongo'
import { User } from '@/types'
import EditUserForm from "@/app/components/EditUserForm"

export default async function Page(){

    let res = await getAllUsers()
    const users : User[] = JSON.parse(res)

    fuckNextDB()
    fuckNextUsers()
    fuckNextTickets()

        return (
            <div className='h-full pt-3 px-10'>
                <h1 className="text-3xl font-bold text-center pb-3">Your Current team</h1>
                
                <Table className="bg-white b-black">
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead> Discord User ID </TableHead>
                        <TableHead>Role</TableHead>
                        </TableRow>
                        
                    </TableHeader>
                    <TableBody>
                    {users.map((user : User) => (
                        
                        <TableRow key={user._id.toString()}> 
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.discord}</TableCell>
                        <TableCell>{user.role} </TableCell>
                        <TableCell><EditUserForm user={user}/></TableCell>
                        </TableRow>
                        
                    ))}
                    </TableBody>
                </Table>
                

                <div className="flex items-center justify-center py-5    px-11">
                    <AddUserForm/>
                </div>
            </div>
        )
        
}


