'use client'


import { Command, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React, { useCallback, useEffect, useState, memo } from 'react'
import { PlusCircleIcon, CheckIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Separator } from '@/components/ui/separator'
import { useRouter, useSearchParams } from 'next/navigation'

const filterChoices =  ["High", "Medium", "Low"]

interface FilterProps {
    params: string[]
}

const Filter = memo(function Filter({params}: FilterProps) {

    const router = useRouter()
    const searchParams = useSearchParams()

    const [filters, setFilters] = useState<string[]>(params)
    console.log("filters")
    console.log(params)

    const addFilter = (filter : string) => {
        setFilters((prevFilters) => {
            const updatedFilters = [...prevFilters, filter]
            updatedFilters.sort()
            updateURL(updatedFilters)
            return updatedFilters 
        })
    }

    const removeFilter = (filter : string) => {
        setFilters((prevFilters) => {
            const updatedFilters = prevFilters.filter(f => f != filter)
            updatedFilters.sort()
            updateURL(updatedFilters)
            return updatedFilters
        })
    }

    const clearFilters = () => {
        setFilters([])
    }

    
    const selectedFilters = [...filters]

    const createQueryString = (name: string, value: string) => {
        let params = new URLSearchParams(searchParams.toString())
        params.set(name, value)
        params.sort()
        return params.toString()
    }

    const deleteQueryParam = (name: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(name)
        return params.toString()        
    }

    const updateURL = (filters: string[]) => {

        if (filters.length > 0) {
            let stringified = ''
            const temp = filters.map(filter => filter)
            const sortedFilters = temp.sort()
            sortedFilters.forEach((filter : string) => {stringified = stringified += `"${filter.toLowerCase()}",`})
            router.push('?' + createQueryString('filters',`[${stringified.slice(0, -1)}]`))
        }
        else {
            router.push('?' + deleteQueryParam('filters'))
        }
    }
        

  return (
    <>
        <Popover>
            <PopoverTrigger>
                <div data-test="priority-button" className="h-8 border-dashed shadow-sm bg-background text-sm my-2 flex flex-row items-center border border-primary/25 rounded p-3">
                <PlusCircleIcon className="h-4 stroke-1"/>
                <h1 className="">Priority</h1>
                {
                    filters.length > 0 && 
                    <div className="flex flex-row gap-2 items-center">
                        <Separator orientation="vertical" className="mx-2 h-4"/>
                        {
                            filters.map((filter, index) => {
                                return <h1 key={filter} className="bg-muted px-2 py-1 rounded text-xs">{filter.slice(0,2)}</h1>
                            })
                        }
                    </div>
                }
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 border rounded" align="start">
                <form>
                <Command>
                    <CommandList>   
                        {
                            filterChoices.map((filter, index) => {
                                const isSelected = selectedFilters.includes(filter)

                                return <CommandItem className="m-1" key={filter} value={filter} data-test={`filter-${filter}`}  onSelect={() => {
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
                            selectedFilters.length > 0 && <>
                                <CommandSeparator />
                                <CommandItem onSelect={clearFilters} className="justify-center flex">
                                    Clear All
                                </CommandItem>
                            </>
                            
                        }    
                    </CommandList>
                </Command>
                </form>
            </PopoverContent>  
        </Popover>
    </>
  )
})

export default Filter
