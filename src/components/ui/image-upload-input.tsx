import { Controller, type Control, type FieldError as FieldErrorType, type FieldValues, type Path } from "react-hook-form"
import { useState } from "react"
import ImageUploader from "./image-uploader"
import { uploadEventCoverImage, uploadLineupPhoto } from "@/services/upload-api"
import { toast } from "react-toastify"

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
  onFileSelected?: (file: File | null) => void
  onUploadStatusChange?: (uploading: boolean) => void
  variant?: "default" | "avatar"
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
  onUploadStatusChange,
  variant,
}: ImageUploadInputProps<T>) {
  const [isUploading, setIsUploading] = useState(false)

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
          isUploading={isUploading}
          variant={variant}
          value={field.value}
          onFileChange={async (file) => {
            if (!file) {
              field.onChange("")
              onFileSelected?.(null)
              return
            }

            onFileSelected?.(file)
            setIsUploading(true)
            onUploadStatusChange?.(true)

            try {
              if (variant === "default") {
                const url = await uploadEventCoverImage(file)
                field.onChange(url)
              } else {
                const url = await uploadLineupPhoto(file)
                field.onChange(url)
              }
            } catch (err) {
              field.onChange("")
              toast.error("Image upload failed. Please try again.")
            } finally {
              setIsUploading(false)
              onUploadStatusChange?.(false)
            }
          }}
        />
      )}
    />
  )
}