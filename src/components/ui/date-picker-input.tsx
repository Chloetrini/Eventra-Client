"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Controller, type Control, type FieldError as FieldErrorType, type FieldValues, type Path } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

// returns true for any date before today (today itself stays enabled)
function isPastDate(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const compare = new Date(date)
  compare.setHours(0, 0, 0, 0)
  return compare < today
}

type DatePickerInputProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  label?: string
  id: string
  placeholder?: string
  disabled?: boolean
  classname?: string
  inputClassName?: string
  borderStyle?: "checkout" | "auth" | "onboarding" | "createEvent"
  errors?: FieldErrorType
}

function getCurrentFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

// Call it anywhere with no arguments:
const today = getCurrentFormattedDate();

export function DatePickerInput<T extends FieldValues>({
  name,
  control,
  label,
  id,
  placeholder = today,
  disabled = false,
  classname,
  inputClassName,
  borderStyle,
  errors,
}: DatePickerInputProps<T>) {
  const [open, setOpen] = React.useState(false)
  // separate from field.value so calendar navigation doesn't fight the selected date
  const [month, setMonth] = React.useState<Date | undefined>(undefined)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const date: Date | undefined =
          field.value && isValidDate(new Date(field.value)) ? new Date(field.value) : undefined
        const value = formatDate(date)

        return (
          <div className={classname}>
            {label && (
              <FieldLabel htmlFor={id} className={cn("text-sm", errors ? "text-destructive" : "")}>
                {label}
              </FieldLabel>
            )}
            <InputGroup className={inputClassName}>
              <InputGroupInput
                id={id}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "focus:outline-blue-500 focus:ring-blue-500",
                  errors ? "border-red-600" : "",
                  borderStyle === "checkout"
                    ? "border-[#AEAEB2] h-17.5 px-5 text-black"
                    : borderStyle === "auth"
                    ? "border-[#C3C9D3] h-15 px-3"
                    : borderStyle === "onboarding"
                    ? "border-[#E8E6E0] h-14 px-15"
                    : borderStyle === "createEvent"
                    ? "border-[#E8E6E0] h-14 p-2.5 rounded-[10px]"
                    : "px-3",
                )}
                onChange={(e) => {
                  const typed = new Date(e.target.value)
                  if (isValidDate(typed) && !isPastDate(typed)) {
                    field.onChange(typed.toISOString())
                    setMonth(typed)
                  } else {
                    field.onChange(e.target.value)
                  }
                }}
                onBlur={field.onBlur}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setOpen(true)
                  }
                }}
              />
              <InputGroupAddon align="inline-end">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger
                    render={
                      <InputGroupButton
                        id={`${id}-trigger`}
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Select date"
                        disabled={disabled}
                      >
                        {/* swap this icon for whatever you want */}
                        <CalendarIcon />
                        <span className="sr-only">Select date</span>
                      </InputGroupButton>
                    }
                  />
                  <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
                    <Calendar
                      mode="single"
                      selected={date}
                      month={month ?? date}
                      onMonthChange={setMonth}
                      disabled={isPastDate}
                      onSelect={(selected) => {
                        field.onChange(selected ? selected.toISOString() : "")
                        setMonth(selected)
                        setOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </InputGroupAddon>
            </InputGroup>
            {/* {errors?.message && <FieldError className="text-xs text-destructive">{String(errors.message)}</FieldError>} */}
          </div>
        )
      }}
    />
  )
}