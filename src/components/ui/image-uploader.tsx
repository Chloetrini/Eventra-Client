import { useRef, useState, type DragEvent } from "react"
import { X, Loader2 } from "lucide-react"
import type { FieldError as FieldErrorType } from 'react-hook-form'
import { FieldError } from "./field"
import photos from '@/assets/photos.png'

type ImageUploaderProps = {
  label?: string
  labelStyle?: string
  onFileChange?: (file: File | null) => void
  accept?: string
  classname?: string
  previewStyle?: string
  defaultStyle?: string
  placeholder?: string
  errors?: FieldErrorType | undefined
  isUploading?: boolean
  variant?: "default" | "avatar"
  value?: string
}

const ImageUploader = ({
  label,
  labelStyle,
  onFileChange,
  accept = "image/*",
  classname,
  previewStyle,
  defaultStyle,
  placeholder,
  errors,
  isUploading,
  variant = "default",
  value,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Fall back to the persisted field value (e.g. a Cloudinary URL already
  // saved in form state) whenever there's no freshly-picked local file.
  // This restores the preview after the component remounts (e.g. navigating
  // away and back), since local `preview` state doesn't survive unmount.
  const displaySrc = preview ?? value ?? null

  const handleFile = (file: File | null) => {
    if (preview) URL.revokeObjectURL(preview)
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
    onFileChange?.(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  if (variant === "avatar") {
    return (
      <div className={classname}>
        <div className="flex items-center gap-3">
          <div
            role="button"
            tabIndex={0}
            onClick={() => !isUploading && inputRef.current?.click()}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !isUploading) inputRef.current?.click()
            }}
            onDragOver={(e) => {
              e.preventDefault()
              if (!isUploading) setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              if (!isUploading) handleDrop(e)
            }}
            className={`relative w-[55px] h-[55px] hover:scale-105 transform rounded-full border cursor-pointer overflow-hidden transition-colors flex-shrink-0 flex items-center justify-center dark:bg-input/30 dark:border-[#303035] ${isDragging
              ? "border-[#0F6E56] bg-[#E4F1EB]"
              : "border-[#E8E6E0] bg-white"
              }`}
          >
            {!displaySrc && (
              <img src={photos} alt="" className="w-5 h-5"/>
            )}

            {displaySrc ? (
              <>
                <img
                  src={displaySrc}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    aria-label="Remove image"
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 "
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </>
            ) : (
              isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              )
            )}
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>
          <div>
            {!displaySrc && (
              <p className={`text-muted-foreground text-sm ${labelStyle}`}>
                {placeholder}
              </p>
            )}
            {errors?.message && <FieldError className="text-xs text-destructive">{String(errors?.message)}</FieldError>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={classname}>
      <p className={`tracking-widest text-[#4A4451] mb-2 dark:text-white ${labelStyle}`}>
        {label}
      </p>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !isUploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isUploading) inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!isUploading) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          if (!isUploading) handleDrop(e)
        }}
        className={`relative w-full rounded-[5px] border cursor-pointer overflow-hidden transition-colors text-[14px] dark:bg-input/30 dark:border-[#303035] ${displaySrc
          ? previewStyle || "h-60"
          : defaultStyle || "h-40"
          } ${isDragging
            ? "border-[#0F6E56] bg-[#E4F1EB]"
            : "border-[#E8E6E0] bg-white"
          }`}
      >
        {displaySrc ? (
          <>
            <img
              src={displaySrc}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <p className="text-white text-sm font-medium">Uploading image…</p>
              </div>
            )}
            {!isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                aria-label="Remove image"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground text-center flex-col">
              {placeholder}
              {errors?.message && <FieldError className="text-xs text-destructive">{String(errors?.message)}</FieldError>}
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  )
}
export default ImageUploader