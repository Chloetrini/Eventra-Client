import { Controller, type Control, type FieldError as FieldErrorType, type FieldValues, type Path } from "react-hook-form"
import ImageUploader from "./image-uploader"
import { useUploadEventCoverImage, useUploadLineupPhoto, useUploadRefundEvidence } from "@/hooks/use-upload"
import { toast } from "react-toastify"

// Which backend upload endpoint (and therefore which permission model) an
// upload goes through — separate from `variant` below, which only controls
// crop/preview styling. When omitted, this is inferred from `variant` the
// same way the old hardcoded if/else here always worked, so every existing
// call site (event cover, lineup photos) keeps behaving exactly as before.
// Only refunds-form.tsx sets this explicitly, since evidence screenshots
// need the session-free /uploads/refund-evidence route, not the
// organizer-only lineup-photo one.
type UploadTarget = "event-cover" | "lineup-photo" | "refund-evidence"

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
  uploadTarget?: UploadTarget
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
  uploadTarget,
}: ImageUploadInputProps<T>) {
  const target: UploadTarget = uploadTarget ?? (variant === "default" ? "event-cover" : "lineup-photo")
  const uploadCoverMutation = useUploadEventCoverImage()
  const uploadLineupMutation = useUploadLineupPhoto()
  const uploadRefundEvidenceMutation = useUploadRefundEvidence()
  const isUploading = uploadCoverMutation.isPending || uploadLineupMutation.isPending || uploadRefundEvidenceMutation.isPending

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
              const url =
                target === "event-cover"
                  ? await uploadCoverMutation.mutateAsync(file)
                  : target === "refund-evidence"
                    ? await uploadRefundEvidenceMutation.mutateAsync(file)
                    : await uploadLineupMutation.mutateAsync(file)
              field.onChange(url)
            } catch (err) {
              field.onChange("")
              // Was always the same generic string, even when we had a real
              // reason (file too large, wrong type, session expired). All
              // three upload functions now throw a real Error with an
              // actual message, so surface it.
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
