import { useRef, useState, type DragEvent } from "react"
import { X } from "lucide-react"

type ImageUploaderProps = {
  label: string
  labelStyle?: string
  onFileChange?: (file: File | null) => void
  accept?: string
  classname?: string
  previewStyle?: string
  defaultStyle?: string
  imageStyle? :string
}

const ImageUploader = ({
  label,
  labelStyle,
  onFileChange,
  accept = "image/*",
  classname,
  previewStyle,
  defaultStyle,
  imageStyle,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File | null) => {
    // revoke the old object URL before creating a new one, or old
    // previews stay alive in memory until the page is closed
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

  return (
    <div className={classname}>
      <p className={`tracking-widest text-[#4A4451] mb-2 ${labelStyle}`}>
        {label}
      </p>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative w-full rounded-[5px] border cursor-pointer overflow-hidden transition-colors text-[14px] ${preview
            ? previewStyle || "h-60"
            : defaultStyle || "h-40"
          } ${isDragging
            ? "border-[#0F6E56] bg-[#E4F1EB]"
            : "border-[#E8E6E0] bg-white"
          }`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove image"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center px-4">
            <p className="text-[#4A4451] text-center">
              Drag a cover image or click to upload
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

export default ImageUploader