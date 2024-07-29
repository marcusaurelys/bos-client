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
import { deleteTicket, refreshTicket} from '@/db/tickets'
import { toast } from '@/components/ui/use-toast'
import { getUserByToken } from '@/db/users'
import { cookies } from 'next/headers'
import { useRouter } from 'next/navigation'

interface EditTicketProps {
    ticket: ITicket,
    user: User,
}

const EditTicket = ({ticket, user}: EditTicketProps) => {

    const [isOpen, setIsOpen] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [tags, setTags] = useState(ticket.tags)

    const router = useRouter()

    // check for unnecessary renders
    // console.log("render called")
    
    const openChange = (open: boolean) => {
        setIsOpen(open)
        setTags(ticket.tags)
    }

    const removeTag = (tag: string) => {
        setTags(t => t.filter((t) => t !== tag))
    } 

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        console.log("DELETING")
        try {
            const res = await deleteTicket(ticket.id)
            if(res) {
                router.push('/')
                toast({
                    description: 'Successfully deleted ticket'
                })
            }
            else {
                toast({
                    description: 'Failed to delete ticket',
                    variant: 'destructive'
                })
            }
        } catch(e) {
            console.error(e)
            toast({
                description: 'Failed to delete ticket',
                variant: 'destructive'
            })
        }
    }
    
    const handleSave = async (formData: FormData) => {
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const priority = formData.get('priority') as string

        try {
            const response = await refreshTicket(ticket.id, {name: title, description: description, priority_score: priority, tags: tags})

            if (response) {
                toast({
                    description: "Successfully edited ticket"
                })
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
        <Dialog open={isOpen} onOpenChange={openChange}>
            <DialogTrigger data-test="edit-ticket-button">
                <EditIcon className="stroke-1"/>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} data-test="edit-ticket-dialog">
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
                                        <XMarkIcon onClick={() => removeTag(tag)} className="h-4 stroke-[1px] stroke-primary/40 cursor-pointer" data-test={`close-${tag.charAt(0).toUpperCase() + tag.slice(1)}-tag`}/>
                                    </div>
                                    
                                </div>
                            })
                        }
                        
                        </div>
                        <div>
                            <Input 
                            data-test="add-tag-input"
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
                            data-test="edit-title-input"
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
                            data-test="edit-description-input"
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
                                <SelectTrigger className="w-[180px]" data-test="edit-priority">
                                    <SelectValue placeholder={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectItem data-test="edit-priority-high" value="high">High</SelectItem>
                                    <SelectItem data-test="edit-priority-medium" value="medium">Medium</SelectItem>
                                    <SelectItem data-test="edit-priority-low"value="low">Low</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            
                        </div>
                    </div>
                

                <DialogFooter>
                    {
                        confirmDelete 
                        ? <div className='flex flex-col items-center gap-2'>

                            <h1 className='text-sm'>Are you sure? This action cannot be undone.</h1>
                            <div className='flex flex-row gap-2 justify-end w-full'>
                                <Button onClick={(e) => {
                                    e.preventDefault 
                                    setConfirmDelete(false)
                                }}>No</Button>
                                <Button variant="destructive" onClick={(e) => handleDelete(e)}>Yes</Button>
                            </div>
                            
                            
                        </div>
                        : <>   
                        <Button variant="destructive" onClick={(e) => {e.preventDefault; setConfirmDelete(true)}}>Delete</Button>
                        <Button data-test="save-edit-button" variant="default" type="submit" onClick={(e) => {setIsOpen(false)}}>Save</Button>
                        </> 
                        
                    }
                    
                    
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
    }
}

export default EditTicket
