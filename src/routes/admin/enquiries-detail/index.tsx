import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { useEnquiry } from "@/hooks/useEnquiries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageWrapper from "@/components/page-wrapper";
import { Format } from "@/lib/utils";

function EnquiryDetailSkeleton() {
  return (
    <PageWrapper className="flex flex-col items-center p-4 sm:p-6">
      <div className="w-full  flex flex-col gap-5 sm:gap-6">
        <Skeleton className="h-4 w-20" />
        <div className="rounded-[10px] border-2 border-border bg-card p-6 sm:p-8">
          <Skeleton className="h-6 w-2/3 mb-3" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </PageWrapper>
  );
}

export default function EnquiryDetailPage() {
  const { enquiryId } = useParams<{ enquiryId: string }>();
  const navigate = useNavigate();
  const { data: enquiry, isLoading, isError } = useEnquiry(enquiryId);

  if (isLoading) {
    return <EnquiryDetailSkeleton />;
  }

  if (isError || !enquiry) {
    return (
      <PageWrapper className="flex flex-col items-center p-4 sm:p-6">
        <div className="w-full max-w-3xl rounded-[10px] border-2 border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">This enquiry no longer exists.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="flex flex-col  p-4 sm:p-6">
      <div className="w-full flex flex-col gap-5 sm:gap-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/enquiries")}
            className="flex items-center gap-2 font-space text-[13px] text-[#0F6E56] dark:text-[#4ADE80] mb-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ENQUIRIES
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold font-grotesk">Enquiry</h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                enquiry.status === "unread"
                  ? "bg-[#F4DFB6] dark:bg-[#C97A17]/25 text-[#7A4E02] dark:text-[#FBBF24]"
                  : "bg-[#BBE0CF] dark:bg-[#0F6E56]/25 text-[#0F6E56] dark:text-[#4ADE80]"
              }`}
            >
              {enquiry.status}
            </span>
          </div>
          <p className="font-medium text-[14px] text-muted-foreground">
            {enquiry.fullName} &middot; {enquiry.subject}
          </p>
        </div>

        <div className="rounded-[10px] border-2 border-border bg-card p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3 pb-5 sm:pb-6 border-b-2 border-border">
            <div className="min-w-0">
              <p className="text-xs font-medium font-space tracking-wide uppercase text-[#0F6E56] dark:text-[#4ADE80]">
                Enquiry
              </p>
              <h1 className="text-xl sm:text-2xl font-grotesk font-bold text-foreground break-words">
                {enquiry.subject}
              </h1>
            </div>
            <Badge
              className={
                enquiry.status === "unread"
                  ? "bg-[#F4DFB6] dark:bg-[#C97A17]/25 px-2.5 py-1 font-medium text-[#7A4E02] dark:text-[#FBBF24] hover:bg-[#F4DFB6] dark:hover:bg-[#C97A17]/25 text-xs sm:text-sm whitespace-nowrap shrink-0"
                  : "bg-[#BBE0CF] dark:bg-[#0F6E56]/25 px-2.5 py-1 font-medium text-[#0F6E56] dark:text-[#4ADE80] hover:bg-[#E4F1EB] dark:hover:bg-[#0F6E56]/25 text-xs sm:text-sm whitespace-nowrap shrink-0"
              }
            >
              {enquiry.status === "unread" ? "UNREAD" : "READ"}
            </Badge>
          </div>

          <div className="flex flex-col gap-1.5 py-5 sm:py-6 border-b-2 border-border text-sm">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-bold text-foreground">{enquiry.fullName}</span>
              <span className="text-muted-foreground">&lt;{enquiry.email}&gt;</span>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground font-space">
              {Format.date(enquiry.createdAt)} at {Format.time(enquiry.createdAt)}
            </span>
          </div>

          <div className="pt-5 sm:pt-6 text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap break-words">
            {enquiry.message}
          </div>

          <div className="pt-6 sm:pt-8">
            <a href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${enquiry.subject}`)}`}>
              <Button className="bg-[#0F6E56] hover:bg-[#0c5744] text-white font-bold gap-2 w-full sm:w-auto">
                <Mail className="h-4 w-4" />
                Reply by email
              </Button>
            </a>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
