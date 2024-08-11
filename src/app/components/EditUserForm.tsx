'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
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
import { changePasswordForUser, deleteUser, editUser } from '@/db/users'
import { useToast } from "@/components/ui/use-toast"
import { User } from "@/types"
import { DialogClose } from "@radix-ui/react-dialog"

interface EditUserFormProps {
    user : User
}

const EditUserForm = memo(function EditUserForm({ user } : EditUserFormProps) {
    
    const [form, setForm] = useState(false) //false means show edit user, true means change password
    const { toast } = useToast()

    /**
     * Updates the user details based on the form data
     * 
     * @param {FormData} formData - updated user data 
     */
    const handleEdit = async(formData : FormData) => {
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const role = formData.get('role') as string
        const discord = formData.get('discord') as string

        if(name == user.name && email == user.email && role == user.role && discord == user.discord){
            toast({
                description: `Nothing to update.`
            })
        }
        
        const res = await editUser(user._id, name, email, role, discord)

        if (res){
            toast({
                description: `Successfully edited ${user.name}`
              })
        }

        else {
            toast({
                variant: 'destructive',
                description: 'Failed to update User' 
            })
        }
    }

    /**
     * Updates the user password based on the form data
     * 
     * @param {FormData} formData - updated password 
     * 
     */
    const handleChangePassword = async(formData : FormData) => {
        const password = formData.get('password') as string
        const confirm = formData.get('confirm-pass') as string

        const res = await changePasswordForUser(user._id, password, confirm)

        if(res == 'Passwords do not match!'){
            toast({
                description: res
            })
        }

        if(res){
            toast({
                description: `Successfully changed password for user.`
            })
        }

        else{
            toast({
                description: `Failed to change password for user.`
            })
        }

    }

    /**
     * Deletes the specified user
     * 
     * @param {User} user - user to delete 
     */
    const handleDelete = async(user : User) => {
        const res = await deleteUser(user._id)

        if(res){
            toast({
                description: 'successfully deleted user.'
            })
        }
        else{
            toast({
                description: 'failed to delete user.'
            })
        }
    }

    return(
        <Dialog>
        <DialogTrigger asChild>
            <Button variant="default">Edit</Button>
        </DialogTrigger>
        <DialogContent>
        {!form ? 
                <>
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Edit {user.name + "'s"} Profile
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Click Save to Edit.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleEdit} name="edit" id="edit-user" className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Name
                        </Label>
                        <Input
                        name="name"
                        placeholder="Boris Victoria"
                        className="col-span-3"
                        defaultValue={user.name}
                        required
                        key="name"
                        
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                        Email
                        </Label>
                        <Input
                        name="email"
                        type="email"
                        placeholder="boris_victoria@dlsu.edu.ph"
                        className="col-span-3"
                        defaultValue={user.email}
                        required
                        key="email"
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
                        defaultValue={user.discord}
                        required
                        key="discord"
                        />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                        Role
                        </Label>
                        <Select name="role" defaultValue={user.role}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={user.role.charAt(0).toUpperCase() + user.role.slice(1)}/>
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
                <DialogFooter className="pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="destructive" onClick={(e) => handleDelete(user)}> Delete User </Button>
                    </DialogClose>
                    <Button type="button" onClick={(e) => {setForm(true)}}> Change Password </Button>
                    <DialogClose asChild>
                        <Button type="submit">Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </form>
            </>
        :

        <>
            <DialogHeader>
                <DialogTitle className="text-2xl">
                    Change {user.name + "'s"} Password
                </DialogTitle>
                <DialogDescription className="text-xs">
                    Click Save to Change.
                </DialogDescription>
            </DialogHeader>

        
        <form action={handleChangePassword} name="change-pass" className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                    Password
                    </Label>
                    <Input
                    name="password"
                    placeholder="********"
                    className="col-span-3"
                    type="password"
                    required
                    key="password"
                    />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-pass" className="text-right">
                Confirm Password
                </Label>
                <Input
                name="confirm-pass"
                placeholder="********"
                className="col-span-3"
                type="password"
                required
                key="confirm"
                />
            </div>
        





        <DialogFooter className="pt-4">
            <Button type="button" onClick={(e) => {setForm(false)}}> Edit Details </Button>
            <Button type="submit">Change Password</Button>
        </DialogFooter>
        </form>


        </>
        
        }
        </DialogContent>
        </Dialog>
        )
    
})

export default EditUserForm
