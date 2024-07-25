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
import { fuckNextUsers, getAllUsers, getUserByToken } from '@/db/users'
import { fuckNextDB } from '@/db/mongo'
import { User } from '@/types'
import EditUserForm from "@/app/components/EditUserForm"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ClientToast from "@/app/components/ErrorToast"

export default async function Page(){

    let errorMessage = ""
    let users: User[] = []

    try{
        let res = await getAllUsers()
        users = JSON.parse(res)
    }
    catch (error: any){
        errorMessage = "An error occurred while fetching users, please reload the page"
        revalidatePath('/')
        console.log(errorMessage)
    }
    
    fuckNextDB()
    fuckNextUsers()
    fuckNextTickets()


    const currUser = await getUserByToken(cookies().get('session')?.value || '')

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
                        {currUser?.role === 'admin' &&
                        <TableCell><EditUserForm user={user}/></TableCell>
                        }
                        </TableRow>
                        
                    ))}
                    </TableBody>
                </Table>
                
                {currUser?.role === 'admin' && errorMessage == "" && (
                    <div className="flex items-center justify-center py-5 px-11">
                        <AddUserForm/>
                    </div>
                )}
                <ClientToast errorMessage={errorMessage}/>
            </div>
        )
        
}


