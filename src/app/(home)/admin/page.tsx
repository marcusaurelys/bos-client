import { useState, useContext } from 'react'
import { redirect } from 'next/navigation'
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
import { cookies } from 'next/headers'
import { createUser, getAllUsers, getToken } from '@/db/users'
import { UserSession } from '@/types'
import { validateUser } from '@/lib/auth'

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
import AddUserForm from '@/components/AddUserForm'


async function register(formData : FormData){
    "use server"

    let success = false

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirm = formData.get('confirm-pass') as string
    const role = formData.get('role') as string

    if(password !== confirm){
        redirect('?failRegister')
    }

    const res = await createUser(name, email, password, role)

    if(!res){
        redirect('?failregister')
    }

    //pls change so that no reload needed
    revalidatePath('/admin')
    
    
}

export default async function Page(){


    //todo make this a function that you will call in layout
    const user = await validateUser(['admin'])
    const users = await getAllUsers()
    const userList = await users.toArray()

    //console.log(userList)


    if(!user){
        redirect('/')
    }

    if(user != null){
        return (
            <div className='h-screen w-screen'>
                hi {user.name}, you are an {user.role}


                <h1 className="text-3xl font-bold text-center pb-3">Your Current team</h1>
                
                <Table className="bg-white b-black">
                    <TableCaption>Your current team</TableCaption>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {userList.map((user) => (
                        
                        <TableRow key={user._id.toString()}> 
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role} </TableCell>
                        </TableRow>
                        
                    ))}
                    </TableBody>
                </Table>
                

                <div className="flex items-center justify-center py-5    px-11">
                    <AddUserForm register={register}/>
                </div>
            </div>
        )
    }
        
}


