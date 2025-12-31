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
import { useList as useCountryList } from "@/lib/api-client/country"

interface Props {
  value?: any
  onChange: (country: any) => void
}

export function CountrySelect({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false)

  const { data } = useCountryList({ paginate: false })
  const countries = data?.countries ?? []

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
          >
            <span className="truncate">
              {value ? value.name : "Select country"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="max-w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-[400px] overflow-y-auto">
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange({ code: 'all', name: 'All Countries' })
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
                All Countries
              </CommandItem>
              {countries.map((country: any) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={() => {
                    onChange(country)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.code === country.code
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {country.name}
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
