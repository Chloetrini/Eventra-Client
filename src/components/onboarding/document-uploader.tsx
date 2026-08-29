import { useRef, useState, type DragEvent } from "react"
import { FileText, X, Loader2, UploadCloud } from "lucide-react"

type DocumentUploaderProps = {
  label?: string
  onFileChange?: (file: File | null) => void
  accept?: string
  isUploading?: boolean
  // The already-saved Cloudinary URL (from form state / localStorage) —
  // shown as "Document uploaded" so a returning organizer sees their prior
  // upload persisted, same fallback pattern as ImageUploader's `value` prop.
  value?: string
  errorMessage?: string
  // Shown in the empty state — overridable so the 3 verification-document
  // slots (CAC certificate / director ID / proof of address) can each
  // describe what they specifically want, instead of one generic prompt.
  promptText?: string
  helperText?: string
}

// Same visual language as ImageUploader (border colors, drag highlight,
// rounded corners) but a PDF can't render as an <img>, so this shows a
// file icon + status text instead of an image preview.
const DocumentUploader = ({
  label,
  onFileChange,
  accept = "image/jpeg,image/png,image/webp,application/pdf",
  isUploading,
  value,
  errorMessage,
  promptText = "Upload your verification document",
  helperText = "Government ID, business registration, or utility bill — JPEG, PNG or PDF, up to 4MB",
}: DocumentUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const hasDocument = Boolean(fileName || value)

  const handleFile = (file: File | null) => {
    setFileName(file?.name ?? null)
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
    <div>
      {label && (
        <p className="tracking-widest text-[#4A4451] mb-2">{label}</p>
      )}
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
        className={`relative w-full rounded-[5px] border cursor-pointer transition-colors text-[14px] px-5 py-6 flex items-center gap-4 ${isDragging
          ? "border-[#0F6E56] bg-[#E4F1EB] dark:bg-[#0F6E56]/15"
          : "border-[#E8E6E0] bg-white dark:bg-card"
          }`}
      >
        {isUploading ? (
          <Loader2 className="w-6 h-6 text-[#0F6E56] animate-spin shrink-0" />
        ) : hasDocument ? (
          <FileText className="w-6 h-6 text-[#0F6E56] shrink-0" />
        ) : (
          <UploadCloud className="w-6 h-6 text-muted-foreground shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          {isUploading ? (
            <p className="font-medium">Uploading…</p>
          ) : hasDocument ? (
            <>
              <p className="font-medium truncate">{fileName ?? "Document uploaded"}</p>
              <p className="text-xs text-muted-foreground">Click to replace</p>
            </>
          ) : (
            <>
              <p className="font-medium">{promptText}</p>
              <p className="text-xs text-muted-foreground">{helperText}</p>
            </>
          )}
        </div>

        {hasDocument && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove document"
            className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
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

      {errorMessage && (
        <p className="text-xs text-destructive mt-1.5">{errorMessage}</p>
      )}
    </div>
  )
}

export default DocumentUploader
