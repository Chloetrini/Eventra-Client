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
  type RegisterOptions,
} from "react-hook-form"

import { cn } from "@/lib/utils"

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
  rules?: RegisterOptions<T, Path<T>>
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
  rules,
}: SelectInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as T[Path<T>]}
      rules={rules}
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
              "w-full bg-transparent dark:border-[] transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:border-[#303035]",
              errors ? "border-red-600" : "",
              borderStyle === "checkout"
                ? "border-[#AEAEB2] h-17.5! px-5 text-black dark:text-white"
                : borderStyle === "auth"
                  ? "border-[#C3C9D3] h-15! px-3"
                  : borderStyle === "onboarding"
                    ? "border-[#E8E6E0] h-14! px-12"
                    : borderStyle === "createEvent"
                      ? "border-[#E8E6E0] h-11! p-2.5 rounded-[10px]"
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