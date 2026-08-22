"use client"

import * as React from "react"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import {
    Controller,
    type Control,
    type FieldError as FieldErrorType,
    type FieldValues,
    type Path,
} from "react-hook-form"

import { cn } from "@/lib/utils"

type BorderStyle = "checkout" | "auth" | "onboarding" | "createEvent"

const BORDER_STYLE_SX: Record<BorderStyle, { height: number; borderRadius: number; borderColor: string }> = {
    checkout: { height: 70, borderRadius: 6, borderColor: "#AEAEB2" },
    auth: { height: 60, borderRadius: 6, borderColor: "#C3C9D3" },
    onboarding: { height: 56, borderRadius: 6, borderColor: "#E8E6E0" },
    createEvent: { height: 44, borderRadius: 10, borderColor: "#E8E6E0" },
}

// same ring color your other FormBox inputs use on focus, kept here
// so every input variant across the form looks consistent
const FOCUS_RING_COLOR = "#E4F1EB"

type TimePickerInputProps<T extends FieldValues> = {
    name: Path<T>
    control: Control<T>
    disabled?: boolean
    errors?: FieldErrorType
    className?: string
    defaultValue?: Date
    borderStyle?: BorderStyle
    height?: number
    fontSize?: number | string
    fontFamily?: string
    fontWeight?: number | string
}

export function TimePickerInput<T extends FieldValues>({
    name,
    control,
    disabled = false,
    errors,
    className,
    defaultValue,
    borderStyle,
    height,
    fontSize,
    fontFamily,
    fontWeight,
}: TimePickerInputProps<T>) {
    const preset = borderStyle ? BORDER_STYLE_SX[borderStyle] : undefined
    const resolvedHeight = height ?? preset?.height ?? 56
    const borderColor = errors ? "#dc2626" : preset?.borderColor

    // a bare number in sx would get looked up against theme.typography first,
    // so normalise to a px string and skip that lookup entirely
    const resolvedFontSize = typeof fontSize === "number" ? `${fontSize}px` : fontSize

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue as T[Path<T>]}
                render={({ field }) => (
                    <TimePicker
                        value={field.value ? new Date(field.value) : null}
                        onChange={(value) => {
                            field.onChange(value ? value.toISOString() : "")
                        }}
                        disabled={disabled}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors,
                                className: cn(className),
                                sx: {
    "& .MuiPickersOutlinedInput-root": {
        height: resolvedHeight,
        borderRadius: `${preset?.borderRadius ?? 6}px`,
        transition: "box-shadow",
        // set on the input base so the digit sections, separators and
        // placeholder all inherit the same type — undefined values are
        // dropped by emotion, so MUI's defaults still apply when unset
        fontSize: resolvedFontSize,
        fontFamily,
        fontWeight,
        // MUI's own default text color is near-black and never adapts to
        // the app's dark mode (there's no MUI ThemeProvider here to pick
        // that up) — that's why the START/END TIME digits were invisible
        // against a dark background. `--foreground` is the same CSS
        // variable every other themed element already flips between light
        // and dark, so this just follows suit.
        color: "var(--foreground)",
    },
    "& .MuiPickersSectionList-root": {
        display: "flex",
        alignItems: "center",
        height: "100%",
        padding: "0 14px",
        boxSizing: "border-box",
        color: "var(--foreground)",
    },
    "& .MuiSvgIcon-root": {
        color: "var(--foreground)",
    },
    "& .MuiPickersOutlinedInput-notchedOutline": {
        borderColor,
    },
    "&:hover .MuiPickersOutlinedInput-notchedOutline": {
        borderColor: `${borderColor} !important`,
    },
    "&.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
        borderColor: `${borderColor} !important`,
        borderWidth: "1px !important",
    },
    // was: "&.Mui-focused" — that hit the outer wrapper, no radius there.
    // this targets the actual rounded box directly.
    "& .MuiPickersOutlinedInput-root.Mui-focused": {
        boxShadow: `0 0 0 3px ${FOCUS_RING_COLOR}`,
        borderRadius: `${preset?.borderRadius ?? 6}px`,
    },
},
                            },
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    )
}
