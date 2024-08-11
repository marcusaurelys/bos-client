import { Command, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState, memo } from 'react'
import { ArrowUpDown } from 'lucide-react'

interface SortProps {
    column: string
}

interface SortPreference {
    property: string,
    direction: string
}

const Sort = memo(function Sort({column}: SortProps) {

    const searchParams = useSearchParams()
    const param = 'sort' + `${column}`
    const sortParam = searchParams.get(param)
    let init = {}
    
    if (sortParam) {
      const split = sortParam.split(' ') 
      init = {
        property: split[0],
        direction: split[1]
      }
    }

    const [sort, setSort] = useState<SortPreference>(sortParam ? init : null)
    const router = useRouter()
    const pathname = usePathname()

    function handleSelectSort (property: string, direction: string) {
      setSort({property: property, direction: direction})
      router.push(pathname + '?' + createQueryString(`sort${column}`, `${property} ${direction}`))
    }

    const createQueryString = (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      console.log(params.toString())
      params.set(name, value)
      params.sort()
      return params.toString()
    }


  return (
    <>
      <Popover>
            <PopoverTrigger>
                <div className="flex flex-row items-center">
                    <ArrowUpDown className="h-4 stroke-[1px]"/>
                    <h1 className="text-sm">{(sort ? `${sort.property.charAt(0).toUpperCase() + sort.property.slice(1)}: ${sort.direction}` : 'Sort By')}</h1>
                </div>
            </PopoverTrigger>
            <PopoverContent align="end">
              <form>
                <Command>
                  <CommandList>
                    <CommandItem className="m-1" onSelect={() => handleSelectSort("priority", "asc")}>
                      Priority, Ascending
                    </CommandItem>
                    <CommandItem className="m-1" onSelect={() => handleSelectSort("priority", "desc")}>
                      Priority, Descending
                    </CommandItem>
                    <CommandItem className="m-1" onSelect={() => handleSelectSort("date", "asc")}>
                      Date, Ascending
                    </CommandItem>
                    <CommandItem className="m-1" onSelect={() => handleSelectSort("date", "desc")}>
                      Date, Descending
                    </CommandItem>
                  </CommandList>
                </Command>
              </form>
            </PopoverContent>
      </Popover>
    </>
  )
})

export default Sort
