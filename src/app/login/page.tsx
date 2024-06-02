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
import { FormEventHandler } from "react"
import { getUser } from "@/db/users"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { login } from "@/lib/auth"


interface User {
    email : string,
    password : string
}

export default function Page(){

    async function submit(formData : FormData){
        "use server"
        let success = false
        console.log(formData.get('email'))
        const user = await getUser(formData.get('email') as string)
        console.log(user)
        if(user != null){
            success = await bcrypt.compare(formData.get('password') as string, user.password)
            console.log(success)
            if(success)
                console.log(user.name)
                await login(user.name)
        } else {
            console.log('fail log in; user null')
        }

        if(success)
            redirect('/')
        else
            redirect('fail')

    }

    

    return(
        <div className="flex w-full h-screen items-center justify-center bg-slate-200">
            <Card className="w-[350px]">
            <CardHeader>
            <CardTitle>Welcome to BusinessOS</CardTitle>
            <CardDescription>Log In.</CardDescription>
            </CardHeader>
            <form action={submit}>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="email" placeholder="juandelacruz@gmail.com" />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input  name="password" type="password" placeholder="**********" />
                </div>
                </div>
            
            </CardContent>
            
            <CardFooter className="flex justify-center">
            <Button>Log In</Button>
            </CardFooter>
            </form>
        </Card>
      </div>
    )
}