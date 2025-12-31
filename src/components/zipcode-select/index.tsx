"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useList as usePostalCodeList } from "@/lib/api-client/postal-code"

interface Props {
  stateCode?: string
  value?: any
  onChange: (zip: any) => void
}

export function ZipcodeSelect({ stateCode, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const { data, isLoading } = usePostalCodeList({
    state: stateCode,
    search,
    paginate: true,
  })

  const zipcodes = data?.postalCodes ?? []

  return (
    <div className="relative flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "max-w-[400px] justify-between",
              value && "pr-8"
            )}
            disabled={!stateCode}
          >
            <span className="truncate">
              {value ? value.code : "Search zipcode"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="max-w-[400px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Type zipcode..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>
              {isLoading ? "Loading..." : "No zipcode found."}
            </CommandEmpty>

            <CommandGroup className="max-h-[400px] overflow-y-auto">
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange({ code: 'all', name: 'All Zipcodes' })
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value?.code === 'all'
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                All Zipcodes
              </CommandItem>
              {zipcodes.map((zip: any) => (
                <CommandItem
                  key={zip.code}
                  value={zip.code}
                  onSelect={() => {
                    onChange(zip)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.code === zip.code
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {zip.code}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 pr-2 h-6 w-6 hover:bg-transparent"
          onClick={() => onChange(null)}
        >
          <X className="h-4 w-4 opacity-50 hover:opacity-100" />
        </Button>
      )}
    </div>
  )
}
