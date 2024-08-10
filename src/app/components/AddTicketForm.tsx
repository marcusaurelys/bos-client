'use client'

import { Button } from '@/components/ui/button'
import { TagIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { EditIcon } from 'lucide-react'
import React, { useState, memo } from 'react'
import { addTicket, refreshTicket } from '@/db/tickets'
import { toast } from '@/components/ui/use-toast'


const AddTicketForm = memo(function AddTicketForm() {

    const [isOpen, setIsOpen] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [tags, setTags] = useState<string[]>([])

    // check for unnecessary renders
    // console.log("render called")
    
    const openChange = (open: boolean) => {
        setIsOpen(open)
    }

    const removeTag = (tag: string) => {
        setTags(t => t.filter((t) => t !== tag))
    } 

    
    const handleSave = async (formData: FormData) => {
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const priority = formData.get('priority') as string
        const chat_id = formData.get('chat-id') as string

        try {
            const response = await addTicket(chat_id, title, description, priority, tags)

            if (response.success) {
                toast({
                    description: "Successfully added ticket"
                })
            }
            else {
                toast({
                    variant: "destructive",
                    description: response.reason
                })
            }
        }
        catch (error){
            console.log(error)
            toast({
                variant: "destructive",
                description: "Failed to add ticket"
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

    return (
        <Dialog open={isOpen} onOpenChange={openChange}>
            <DialogTrigger asChild data-test="edit-ticket-button">
                   <Button className="h-8 b-gray-50 outline-dashed outline-gray-400 outline-1 font-sans ml-auto mr-2" variant="ghost">Add Ticket </Button> 
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
                            <Label htmlFor="chat-id" className="text-right h-full py-4">
                                Session ID
                            </Label>
                            <Input
                            data-test="edit-title-input"
                            name="chat-id"
                            className="col-span-3"
                            required
                            placeholder="sessionID"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right h-full py-4">
                                Title
                            </Label>
                            <Input
                            data-test="edit-title-input"
                            name="title"
                            className="col-span-3"
                            required
                            placeholder="What's the problem?"
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
                            placeholder="Describe the problem..."
                            />
                        </div>
                    
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right h-full py-4">
                                Priority
                            </Label>
                            <Select name="priority" defaultValue={"high"}>
                                <SelectTrigger className="w-[180px]" data-test="edit-priority">
                                    <SelectValue placeholder="High" />
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
                    <Button data-test="save-edit-button" variant="default" type="submit" onClick={(e) => {setIsOpen(false)}}>Save</Button>   
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
})

export default AddTicketForm
