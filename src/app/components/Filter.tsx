import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React from 'react'
import { PlusCircleIcon, CheckIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Separator } from '@/components/ui/separator'


const filters = [
    {
      value: "high",
      label: "High",
    },
    {
      value: "medium",
      label: "Medium",
    },
    {
      value: "low",
      label: "Low",
    }
  ]

interface FilterProps {
    selected: Set<string>,
    addFilter: (toAdd: string) => void,
    removeFilter: (toRemove: string) => void
    clearFilters: () => void
}

function FIlter({selected, addFilter, removeFilter, clearFilters}: FilterProps) {

    const selectedValues = new Set(Array.from(selected))

  return (
    <div>
        <Popover>
            <PopoverTrigger>
                <div className="h-8 border-dashed shadow-sm bg-background text-sm my-2 flex flex-row items-center border border-primary/25 rounded p-3">
                <PlusCircleIcon className="h-4 stroke-1"/>
                <h1 className="">Priority</h1>
                {
                    selectedValues.size > 0 && 
                    <div className="flex flex-row gap-2 items-center">
                        <Separator orientation="vertical" className="mx-2 h-4"/>
                        {
                            Array.from(selectedValues).map((filter, index) => {
                                return <h1 key={filter} className="bg-muted px-2 py-1 rounded text-xs">{filter.charAt(0).toUpperCase() + filter.slice(1)}</h1>
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
                            filters.map((f, index) => {
                                const isSelected = selectedValues.has(f.value)

                                return <CommandItem className="m-1" key={f.value} onSelect={() => {
                                    if(isSelected) {
                                        removeFilter(f.value)
                                    }  
                                    if(!isSelected) {
                                        addFilter(f.value)
                                    }
                                }}>
                                            <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-primary-foreground": "opacity-50 [&_svg]:invisible")}>
                                                <CheckIcon className={cn("h-4 w-4")} />
                                            </div>
                                            {f.label}
                                        </CommandItem>
                            })
                        }
                        
                        {
                            selectedValues.size > 0 && <>
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
    </div>
  )
}

export default FIlter
