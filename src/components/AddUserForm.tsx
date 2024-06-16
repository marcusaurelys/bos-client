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
import { useState } from 'react'

interface Props {
    register : ((formData : FormData) => void)
}

export default function AddUserForm( { register } : Props ){

    const [isOpen, setOpen] = useState(false)

    return(
    <Dialog open={isOpen} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button variant="default">Add User</Button>
    </DialogTrigger>

    <DialogContent>
    <form action={register}>
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
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discord" className="text-right">
                Discord Username
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
            <Button type="submit" onClick={(e) => {setOpen(false)}}>Add User</Button>
        </DialogFooter>
    </form>
    </DialogContent>
    </Dialog>
    )
}