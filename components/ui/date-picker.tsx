'use client'

import * as React from 'react'
import { format } from 'date-fns' 
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minDate?: Date 
}

function createLocalFromUTCComponents(date: Date | undefined): Date | undefined {
  if (!date || isNaN(date.getTime())) return undefined
  
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  
  return new Date(year, month, day);
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  disabled = false,
  className,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const dateToDisplay = createLocalFromUTCComponents(value)
  const minDateToUse = createLocalFromUTCComponents(minDate)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateToDisplay && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateToDisplay ? format(dateToDisplay, "PPP", { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateToDisplay}
          onSelect={(date) => {
            const dateToSave = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : undefined
            onChange?.(dateToSave)
            setOpen(false)
          }}
          disabled={minDateToUse ? { before: minDateToUse } : undefined}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}