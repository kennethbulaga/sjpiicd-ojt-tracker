"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, Building2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { DAVAO_COMPANIES } from "@/lib/constants"

interface CompanyComboboxProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
}

export function CompanyCombobox({ value, onChange, onBlur }: CompanyComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  // Filter companies based on search, and optionally show a "Use custom" option
  const filteredCompanies = useMemo(() => {
    if (!search) return [...DAVAO_COMPANIES]
    const lowerSearch = search.toLowerCase()
    return DAVAO_COMPANIES.filter((c) =>
      c.toLowerCase().includes(lowerSearch)
    )
  }, [search])

  // Show "Use custom value" option when search doesn't match any predefined company exactly
  const showCustomOption =
    search.length > 0 &&
    !DAVAO_COMPANIES.some(
      (c) => c.toLowerCase() === search.toLowerCase()
    )

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen && onBlur) onBlur()
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-h-[44px] h-auto w-full justify-between font-normal whitespace-normal text-left py-2",
            !value && "text-muted-foreground"
          )}
        >
          <span className="break-words">
            {value || "Select or type a company..."}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search companies..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {search ? "No matching companies." : "Start typing to search..."}
            </CommandEmpty>

            {/* Custom value option */}
            {showCustomOption && (
              <CommandGroup heading="Custom">
                <CommandItem
                  value={`custom-${search}`}
                  onSelect={() => {
                    onChange(search)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  <span className="flex-1 truncate">Use &ldquo;{search}&rdquo;</span>
                  <Building2 className="size-4 shrink-0 text-muted-foreground" />
                </CommandItem>
              </CommandGroup>
            )}

            {/* Predefined companies */}
            {filteredCompanies.length > 0 && (
              <CommandGroup heading="Davao Companies">
                {filteredCompanies.map((company) => (
                  <CommandItem
                    key={company}
                    value={company}
                    onSelect={() => {
                      onChange(company === value ? "" : company)
                      setOpen(false)
                      setSearch("")
                    }}
                  >
                    <span className="flex-1 truncate text-left">{company}</span>
                    <Check
                      className={cn(
                        "size-4 shrink-0",
                        value === company ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
