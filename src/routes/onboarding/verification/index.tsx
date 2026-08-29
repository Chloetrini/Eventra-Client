import { useFormContext, useWatch } from "react-hook-form"
import { useNavigate } from "react-router"
import DocumentUploader from "@/components/onboarding/document-uploader"
import PageSwitcher from "@/components/onboarding/page-switcher"
import { VERIFICATION_FIELDS, type OnboardingValues } from "@/lib/schema"
import PageWrapper from "@/components/page-wrapper"
import { toast } from "react-toastify"
import { useSaveOrganizerProfile } from "@/hooks/use-onboarding"
import { useUploadVerificationDocument } from "@/hooks/use-upload"
import type { VerificationDocumentType } from "@/lib/upload-api"

// One row per document — url/publicId field names on OnboardingValues, plus
// the documentType the upload endpoint needs to file it into the right
// Cloudinary subfolder. Driving the 3 uploaders off this array (rather than
// copy-pasting the same JSX 3 times) keeps them from drifting apart.
const DOCUMENT_ROWS: {
    documentType: VerificationDocumentType
    urlField: "cacCertificateUrl" | "directorIdUrl" | "proofOfAddressUrl"
    publicIdField: "cacCertificatePublicId" | "directorIdPublicId" | "proofOfAddressPublicId"
    label: string
    helperText: string
}[] = [
    {
        documentType: "cacCertificate",
        urlField: "cacCertificateUrl",
        publicIdField: "cacCertificatePublicId",
        label: "CAC certificate",
        helperText: "Your business's CAC registration certificate — JPEG, PNG or PDF, up to 4MB",
    },
    {
        documentType: "directorId",
        urlField: "directorIdUrl",
        publicIdField: "directorIdPublicId",
        label: "Director's government ID",
        helperText: "A valid ID for a director (National ID, passport, or driver's license) — JPEG, PNG or PDF, up to 4MB",
    },
    {
        documentType: "proofOfAddress",
        urlField: "proofOfAddressUrl",
        publicIdField: "proofOfAddressPublicId",
        label: "Proof of address",
        helperText: "A recent utility bill or bank statement showing your business address — JPEG, PNG or PDF, up to 4MB",
    },
]

const VerificationPage = () => {
    const navigate = useNavigate()
    const { control, setValue, trigger, formState: { errors } } = useFormContext<OnboardingValues>()
    const uploadDocumentMutation = useUploadVerificationDocument()
    const saveProfileMutation = useSaveOrganizerProfile()

    const [cacCertificateUrl, directorIdUrl, proofOfAddressUrl] = useWatch({
        control,
        name: [...VERIFICATION_FIELDS],
    })
    const values = { cacCertificateUrl, directorIdUrl, proofOfAddressUrl }

    // Uploaded the same way the event-cover/lineup images are: straight to
    // Cloudinary via the dedicated endpoint, then the resulting url +
    // publicId get saved onto the organizer profile immediately — same
    // "save incrementally" pattern the bank-account step uses — rather than
    // waiting for the final "Submit for review" click on the Review page.
    // That way a returning organizer who closes the tab mid-onboarding
    // doesn't lose an upload.
    const handleDocumentChange = async (
        row: (typeof DOCUMENT_ROWS)[number],
        file: File | null
    ) => {
        if (!file) {
            setValue(row.urlField, "", { shouldValidate: true })
            setValue(row.publicIdField, "")
            return
        }

        try {
            const { url, publicId } = await uploadDocumentMutation.mutateAsync({
                file,
                documentType: row.documentType,
            })
            setValue(row.urlField, url, { shouldValidate: true })
            setValue(row.publicIdField, publicId)

            await saveProfileMutation.mutateAsync({
                [row.urlField]: url,
                [row.publicIdField]: publicId,
            })
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not upload document. Please try again.")
        }
    }

    const handleContinue = async () => {
        const isValid = await trigger([...VERIFICATION_FIELDS])
        if (!isValid) return
        navigate("/onboarding/review")
    }

    return (
        <PageWrapper className="w-full">
            <div className="px-5 py-10 lg:pl-10 lg:pr-60 lg:py-20 flex flex-col gap-10">
                <div>
                    <p className='text-[#0F6E56] dark:text-[#4ADE80]'>STEP 3 OF 4</p>
                    <h3 className="font-grotesk font-bold text-[34px]">Verify your business</h3>
                    <p className="font-grotesk font-medium text-[18px] text-muted-foreground max-w-full md:max-w-[500px] line-clamp-4">
                        We need these three documents to confirm your business before we can approve your account.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-6">
                    {DOCUMENT_ROWS.map((row) => (
                        <DocumentUploader
                            key={row.documentType}
                            label={row.label}
                            value={values[row.urlField]}
                            isUploading={uploadDocumentMutation.isPending && uploadDocumentMutation.variables?.documentType === row.documentType}
                            onFileChange={(file) => handleDocumentChange(row, file)}
                            errorMessage={errors[row.urlField]?.message}
                            promptText={`Upload ${row.label.toLowerCase()}`}
                            helperText={row.helperText}
                        />
                    ))}
                </div>

                <div>
                    <PageSwitcher
                        backOnClick={() => navigate("/onboarding/bank-account")}
                        continueOnClick={handleContinue}
                        disablecontinue={uploadDocumentMutation.isPending}
                    />
                </div>
            </div>
        </PageWrapper>
    )
}

export default VerificationPage
