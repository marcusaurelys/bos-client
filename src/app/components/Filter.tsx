import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React from 'react'
import { PlusCircleIcon, CheckIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Separator } from '@/components/ui/separator'
import { useDataContext } from '@/contexts/DataContext'

const filterChoices =  ["High", "Medium", "Low"]


export default function Filter() {

    const { filters, addFilter, removeFilter, clearFilters } = useDataContext()
    const selectedFilters = [...filters]

  return (
    <>
        <Popover>
            <PopoverTrigger>
                <div className="h-8 border-dashed shadow-sm bg-background text-sm my-2 flex flex-row items-center border border-primary/25 rounded p-3">
                <PlusCircleIcon className="h-4 stroke-1"/>
                <h1 className="">Priority</h1>
                {
                    selectedFilters.size > 0 && 
                    <div className="flex flex-row gap-2 items-center">
                        <Separator orientation="vertical" className="mx-2 h-4"/>
                        {
                            selectedFilters.map((filter, index) => {
                                return <h1 key={filter} className="bg-muted px-2 py-1 rounded text-xs">{filter.slice(0,2)}</h1>
                            })
                        }
                    </div>
                }
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 border rounded" align="start">
                <Command>
                    <CommandList>   
                        {
                            filterChoices.map((filter, index) => {
                                const isSelected = selectedFilters.includes(filter)

                                return <CommandItem className="m-1" key={filter} onSelect={() => {
                                                if (isSelected) {
                                                    removeFilter(filter)
                                                }  
                                                if (!isSelected) {
                                                    addFilter(filter)
                                                }
                                        }}>
                                        <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-primary-foreground": "opacity-50 [&_svg]:invisible")}>
                                                <CheckIcon className={cn("h-4 w-4")} />
                                            </div>
                                            {filter}
                                        </CommandItem> })
                        }
                        
                        {
                            selectedFilters.size > 0 && <>
                                <CommandSeparator />
                                <CommandItem onSelect={clearFilters} className="justify-center flex">
                                    Clear All
                                </CommandItem>
                            </>
                            
                        }    
                    </CommandList>
                </Command>
            </PopoverContent>  
        </Popover>
    </>
  )
}
