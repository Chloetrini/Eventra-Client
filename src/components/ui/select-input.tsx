"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Controller,
  type Control,
  type FieldError as FieldErrorType,
  type FieldValues,
  type Path,
} from "react-hook-form"

import { cn } from "@/services/utils"

type BorderStyle = "checkout" | "auth" | "onboarding" | "createEvent"

type SelectInputProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  options: string[]
  placeholder?: string
  disabled?: boolean
  errors?: FieldErrorType
  borderStyle?: BorderStyle
  className?: string
  id?: string
  defaultValue?: string
}

export function SelectInput<T extends FieldValues>({
  name,
  control,
  options,
  placeholder,
  disabled = false,
  errors,
  borderStyle,
  className,
  id,
  defaultValue,
}: SelectInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as T[Path<T>]}
      render={({ field }) => (
        <Select
          value={field.value ?? ""}
          onValueChange={field.onChange}
          disabled={disabled}
        >
          <SelectTrigger
            id={id}
            onBlur={field.onBlur}
            className={cn(
              "w-full bg-transparent",
              errors ? "border-red-600" : "",
              borderStyle === "checkout"
                ? "border-[#AEAEB2] h-17.5 px-5 text-black"
                : borderStyle === "auth"
                ? "border-[#C3C9D3] h-15 px-3"
                : borderStyle === "onboarding"
                ? "border-[#E8E6E0] h-14 px-12"
                : borderStyle === "createEvent"
                ? "border-[#E8E6E0] h-11 p-2.5 rounded-[10px]"
                : "px-3",
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}