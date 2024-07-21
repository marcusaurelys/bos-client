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
import { login } from "@/db/users"

export default function Page(){

    return (
        <div className="flex w-full h-screen items-center justify-center bg-slate-200">
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Welcome to BusinessOS</CardTitle>
                <CardDescription>Log In.</CardDescription>
            </CardHeader>
            <form action={login}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" data-test="login" type="email" placeholder="juandelacruz@gmail.com" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input  name="password" data-test="password" type="password" placeholder="**********" />
                        </div>
                    </div>    
                </CardContent>
            <CardFooter className="flex justify-center">
                <Button data-test="login-button">Log In</Button>
            </CardFooter>
            </form>
        </Card>
      </div>
    )
}
