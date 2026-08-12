"use client"

import { Controller, type Control, type FieldError as FieldErrorType, type FieldValues, type Path } from "react-hook-form"
import ImageUploader from "./image-uploader"

type ImageUploadInputProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  label?: string
  labelStyle?: string
  accept?: string
  classname?: string
  previewStyle?: string
  defaultStyle?: string
  placeholder?: string
  errors?: FieldErrorType
  disabled?: boolean
  // called with the raw File — this is where an upload call eventually goes
  onFileSelected?: (file: File | null) => void
}

export function ImageUploadInput<T extends FieldValues>({
  name,
  control,
  label,
  labelStyle,
  accept,
  classname,
  previewStyle,
  defaultStyle,
  placeholder,
  errors,
  onFileSelected,
}: ImageUploadInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ImageUploader
          label={label}
          labelStyle={labelStyle}
          accept={accept}
          classname={classname}
          previewStyle={previewStyle}
          defaultStyle={defaultStyle}
          placeholder={placeholder}
          errors={errors}
          onFileChange={(file) => {
            // TODO: once the backend upload route exists, call it here and
            // write the resolved URL into the field instead of this placeholder.
            // For now this just marks the field non-empty so validation passes
            // locally — swap for the real upload flow when ready.
            field.onChange(file ? "pending-upload" : "")
            onFileSelected?.(file)
          }}
        />
      )}
    />
  )
}