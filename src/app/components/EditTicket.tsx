'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon, TagIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ITicket, User } from '@/types'
import { EditIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { refreshTicket, revalidateTicket } from '@/db/tickets'
import { toast } from '@/components/ui/use-toast'
import { getUserByToken } from '@/db/users'
import { cookies } from 'next/headers'

interface EditTicketProps {
    ticket: ITicket,
    user: User,
}

const EditTicket = ({ticket, user}: EditTicketProps) => {

    const [isOpen, setIsOpen] = useState(false)
    const [tags, setTags] = useState(ticket.tags)

    useEffect(() => {
        if(isOpen == true) {
            setTags(ticket.tags)
        }
    }, [isOpen])

    const removeTag = (tag: string) => {
        setTags(t => t.filter((t) => t !== tag))
    } 
    
    const handleSave = async (formData: FormData) => {
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const priority = formData.get('priority') as string

        console.log(title + description + priority + tags)

        try {
            const response = await refreshTicket(ticket.id, {name: title, description: description, priority_score: priority, tags: tags})

            if (response) {
                toast({
                    description: "Successfully edited ticket"
                })
                revalidateTicket(ticket.id)
            }
            else {
                toast({
                    variant: "destructive",
                    description: "Failed to edit ticket"
                })
            }
        }
        catch (error){
            console.log(error)
            toast({
                variant: "destructive",
                description: "Failed to edit ticket"
              })
        }
    }

    const checkEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const target = event.target as  HTMLTextAreaElement
            const tag = target.value
            if (!tags.includes(tag)) {
                setTags([...tags, tag])
            }
            target.value = ""
        }
    }

    if(user?.role !== "admin") {
        return <></>
    } else {

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <EditIcon className="stroke-1"/>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Edit Ticket</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right h-full py-4">
                        Tags
                    </Label>
                    <div className="flex flex-col col-span-3 gap-2">
                        <div className="flex flex-row flex-wrap items-center gap-2">
                        {
                            tags.map((tag, index) => {
                                return <div key={index} className="flex flex-row items-center">
                                    <div className="flex flex-row rounded-md w-fit text-xs border py-1 px-2 items-center gap-2">
                                        <TagIcon className="h-4 fill-none stroke-primary/40"/>
                                        <h1>{tag.charAt(0).toUpperCase() + tag.slice(1)}</h1>
                                        <XMarkIcon onClick={() => removeTag(tag)} className="h-4 stroke-[1px] stroke-primary/40 cursor-pointer" />
                                    </div>
                                    
                                </div>
                            })
                        }
                        
                        </div>
                        <div>
                            <Input 
                            className="col-span-3 h-6 text-xs" 
                            placeholder="+ Add a tag and press enter"
                            onKeyDown={(e) => checkEnter(e)}
                            />
                        </div>
                    </div>
                </div>
                <form action={handleSave} onKeyDown={(e) => {
                    if(e.key === "Enter") {
                        return false
                    }
                }}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right h-full py-4">
                                Title
                            </Label>
                            <Input
                            name="title"
                            className="col-span-3"
                            required
                            defaultValue={ticket?.title}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right h-full py-4">
                                Description
                            </Label>
                            <Textarea 
                            name="description"
                            className="col-span-3 h-32" 
                            defaultValue={ticket?.description}
                            />
                        </div>
                    
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right h-full py-4">
                                Priority
                            </Label>
                            <Select name="priority" defaultValue={ticket.priority}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            
                        </div>
                    </div>
                

                <DialogFooter>
                    <Button type="submit" onClick={(e) => {setIsOpen(false)}}>Save</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
    }
}

export default EditTicket
