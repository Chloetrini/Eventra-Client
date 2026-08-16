"use client"

import { Switch } from "@/components/ui/switch"
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form"
import { cn } from "@/services/utils"

type SwitchInputProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function SwitchInput<T extends FieldValues>({
  name,
  control,
  label,
  description,
  disabled = false,
  className,
  id,
}: SwitchInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div
          className={cn(
            "flex items-center w-full border rounded-[15px] px-4 py-3",
            description ? "justify-between gap-3" : "gap-3",
            className
          )}
        >
          {description ? (
            <>
              <div className="flex flex-col gap-1">
                {label && (
                  <label htmlFor={id} className="text-base font-semibold cursor-pointer">
                    {label}
                  </label>
                )}
                <p className="text-sm text-[#6E6577]">{description}</p>
              </div>
              <Switch
                id={id}
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className="data-[state=checked]:bg-[#0F6E56]"
              />
            </>
          ) : (
            <>
              <Switch
                id={id}
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className="data-[state=checked]:bg-[#0F6E56]"
              />
              {label && (
                <label htmlFor={id} className="text-sm font-medium cursor-pointer">
                  {label}
                </label>
              )}
            </>
          )}
        </div>
      )}
    />
  )
}