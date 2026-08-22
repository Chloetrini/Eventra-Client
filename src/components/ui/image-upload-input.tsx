import { Controller, type Control, type FieldError as FieldErrorType, type FieldValues, type Path } from "react-hook-form"
import ImageUploader from "./image-uploader"
import { useUploadEventCoverImage, useUploadLineupPhoto } from "@/hooks/use-upload"
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
  const uploadCoverMutation = useUploadEventCoverImage()
  const uploadLineupMutation = useUploadLineupPhoto()
  const isUploading = uploadCoverMutation.isPending || uploadLineupMutation.isPending

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
            onUploadStatusChange?.(true)

            try {
              if (variant === "default") {
                const url = await uploadCoverMutation.mutateAsync(file)
                field.onChange(url)
              } else {
                const url = await uploadLineupMutation.mutateAsync(file)
                field.onChange(url)
              }
            } catch (err) {
              field.onChange("")
              // Was always the same generic string, even when we had a real
              // reason (file too large, wrong type, session expired). Both
              // uploadEventCoverImage/uploadLineupPhoto now throw a real
              // Error with an actual message, so surface it.
              toast.error(err instanceof Error ? err.message : "Image upload failed. Please try again.")
            } finally {
              onUploadStatusChange?.(false)
            }
          }}
        />
      )}
    />
  )
}
