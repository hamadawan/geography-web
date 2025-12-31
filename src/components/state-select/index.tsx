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
import { useList as useStateList } from "@/lib/api-client/state"
import { Option } from "@/lib/store/selection-store"

interface Props {
  countryCode?: string
  value?: Option | null
  onChange: (state: Option | null) => void
}

export function StateSelect({ countryCode, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false)

  const { data } = useStateList({
    country: countryCode,
    paginate: false,
  })

  const states = data?.states ?? []

  return (
    <div className="relative flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "max-h-[400px] overflow-y-auto justify-between",
              value && "pr-8"
            )}
            disabled={!countryCode}
          >
            <span className="truncate">
              {value ? value.name : "Select state"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search state..." />
            <CommandEmpty>No state found.</CommandEmpty>
            <CommandGroup className="max-h-[400px] overflow-y-auto">
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange({ code: 'all', name: 'All States' })
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
                All States
              </CommandItem>
              {states.map((state: Option) => (
                <CommandItem
                  key={state.code}
                  value={state.name}
                  onSelect={() => {
                    onChange(state)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.code === state.code
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {state.name}
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
