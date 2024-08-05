'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
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

  
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, memo } from 'react'
import { register } from '@/db/users'
import { useToast } from "@/components/ui/use-toast"
import bcrypt from "bcryptjs"

export default const AddUserForm = memo(function AddUserForm() {

    const [isOpen, setOpen] = useState(false)
    const { toast } = useToast()

    /**
     * Handles user registration by extracting data from the form and calling the `register` function.
     *
     * @param {FormData} formData - The FormData object containing user registration information.
     * @returns {Promise<void>} A promise that resolves when the registration process completes.
     */
    const handleRegister = async (formData : FormData) => {
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirm = formData.get('confirm-pass') as string
        const role = formData.get('role') as string
        const discord = formData.get('discord') as string

        try{
            const response = await register(name, email, password, confirm, role, discord)

            if (response){
                toast({
                    description: "Successfully registered " +  name + " as " + role
                  })
                setOpen(false)
            }

            else{
                setOpen(false)
                toast({
                    variant: "destructive",
                    description: "Failed to register"
                  })
            }
        }
        catch (error){
            console.log(error)
            toast({
                variant: "destructive",
                description: "Failed to register"
              })
        }
    }

    return (
        
    <Dialog open={isOpen} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button variant="default">Add User</Button>
    </DialogTrigger>

    <DialogContent>
    <form action={handleRegister}>
        <DialogHeader>
            <DialogTitle className="text-2xl">
                Add a User
            </DialogTitle>
            <DialogDescription className="text-xs">
                Click Save to add.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                Name
                </Label>
                <Input
                name="name"
                placeholder="Boris Victoria"
                className="col-span-3"
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                Email
                </Label>
                <Input
                name="email"
                placeholder="boris_victoria@dlsu.edu.ph"
                className="col-span-3"
                type="email"
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discord" className="text-right">
                Discord UserID
                </Label>
                <Input
                name="discord"
                placeholder="discord"
                className="col-span-3"
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                Password
                </Label>
                <Input
                name="password"
                placeholder="******"
                className="col-span-3"
                type="password"
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-pass" className="text-right">
                Confirm Password
                </Label>
                <Input
                name="confirm-pass"
                placeholder="******"
                className="col-span-3"
                type="password"
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                Role
                </Label>
                <Select name="role">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Role</SelectLabel>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            
            </div>
        </div>
    
        <DialogFooter>
            <Button type="submit">Add User</Button>
        </DialogFooter>
    </form>
    </DialogContent>
    </Dialog>
    )
})
