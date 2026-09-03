import { useState } from "react";
import { toast } from "react-toastify";
import { CheckCheck, Trash2 } from "lucide-react";
import { useEnquiries, useMarkAllEnquiriesRead, useDeleteEnquiries } from "@/hooks/useEnquiries";
import EnquiriesTable from "@/components/admin/enquiries/EnquiriesTable";
import PageWrapper from "@/components/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import ActionBtn from "@/components/ui/action-btn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

function AdminEnquiriesSkeleton() {
  return (
    <PageWrapper className="flex flex-col gap-5 sm:gap-6 min-w-0 p-4 sm:p-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-24 sm:w-28" />
        <Skeleton className="h-7 sm:h-8 w-36 sm:w-40" />
        <Skeleton className="h-4 w-[320px] sm:w-[420px] max-w-full" />
      </div>

      <div className="w-full overflow-x-auto rounded-[10px] border-2 border-border bg-card">
        <div className="min-w-[750px]">
          <div className="grid grid-cols-4 gap-4 py-4 px-4 sm:px-6 border-b-2 border-border bg-card/50">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">FROM</p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">SUBJECT</p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide">STATUS</p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground font-space tracking-wide text-right">RECEIVED</p>
          </div>

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`grid grid-cols-4 gap-4 py-4 px-4 sm:px-6 items-center ${
                index < 4 ? "border-b-2 border-border" : ""
              }`}
            >
              <Skeleton className="h-4 w-28 sm:w-36" />
              <Skeleton className="h-4 w-32 sm:w-48" />
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

export default function AdminEnquiriesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useEnquiries(page);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const markAllRead = useMarkAllEnquiriesRead();
  const deleteSelected = useDeleteEnquiries();

  const enquiries = data?.enquiries ?? [];
  const hasUnread = (data?.unreadCount ?? 0) > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const allOnPageSelected = enquiries.every((e) => prev.has(e._id));
      if (allOnPageSelected) {
        // Deselect just this page's rows, leave any selection on other
        // pages (unlikely to matter in practice, but cheap to get right).
        const next = new Set(prev);
        enquiries.forEach((e) => next.delete(e._id));
        return next;
      }
      const next = new Set(prev);
      enquiries.forEach((e) => next.add(e._id));
      return next;
    });
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    // Selection is page-scoped in spirit (the checkboxes you can see);
    // clearing it on navigation avoids "delete" silently acting on rows
    // that have scrolled out of view.
    setSelectedIds(new Set());
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: (res) => toast.success(res.message || "All enquiries marked as read."),
      onError: (err: Error) => toast.error(err.message || "Couldn't mark enquiries as read."),
    });
  };

  // Checkboxes are hidden by default and only appear once you've opted
  // into "delete mode" via this button — the first click just reveals
  // them (nothing is deleted yet), a second click (once something's
  // checked) opens the confirm dialog.
  const handleDeleteButtonClick = () => {
    if (!isSelecting) {
      setIsSelecting(true);
      return;
    }
    if (selectedIds.size > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleCancelSelecting = () => {
    setIsSelecting(false);
    setSelectedIds(new Set());
  };

  const handleConfirmDelete = () => {
    deleteSelected.mutate(Array.from(selectedIds), {
      onSuccess: (res) => {
        toast.success(res.message || "Enquiries deleted.");
        setSelectedIds(new Set());
        setIsSelecting(false);
        setIsDeleteModalOpen(false);
      },
      onError: (err: Error) => toast.error(err.message || "Couldn't delete enquiries."),
    });
  };

  if (isLoading) {
    return <AdminEnquiriesSkeleton />;
  }

  return (
    <PageWrapper className="flex flex-col gap-5 sm:gap-6 min-w-0 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium font-space tracking-wide uppercase text-[#0F6E56] dark:text-[#4ADE80]">
            Needs action
          </p>
          <h1 className="text-2xl sm:text-[28px] font-grotesk font-bold text-foreground">
            Enquiries
          </h1>
          <p className="text-sm sm:text-base font-medium text-muted-foreground mt-0.5">
            Messages submitted through the contact form
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionBtn
            type="button"
            text={
              <span className="flex items-center gap-1.5">
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </span>
            }
            onClick={handleMarkAllRead}
            loading={markAllRead.isPending}
            disabled={!hasUnread}
            variant="outline"
            classname="text-sm font-semibold"
          />
          {isSelecting && (
            <>
              {/* "Select all" lives here in the toolbar, next to the
                  action buttons — not up in the table header where it
                  used to be. */}
              <label className="flex items-center gap-1.5 px-2 text-sm font-semibold text-foreground cursor-pointer select-none">
                <Checkbox
                  aria-label="Select all enquiries on this page"
                  checked={enquiries.length > 0 && enquiries.every((e) => selectedIds.has(e._id))}
                  onCheckedChange={toggleSelectAll}
                  className="w-[17px] h-[17px]"
                />
                Select all
              </label>
              <ActionBtn
                type="button"
                text="Cancel"
                onClick={handleCancelSelecting}
                variant="outline"
                classname="text-sm font-semibold"
              />
            </>
          )}
          <ActionBtn
            type="button"
            text={
              <span className="flex items-center gap-1.5">
                <Trash2 className="h-4 w-4" />
                Delete{isSelecting && selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
              </span>
            }
            onClick={handleDeleteButtonClick}
            disabled={isSelecting && selectedIds.size === 0}
            variant="destructive"
            classname="text-sm font-semibold"
          />
        </div>
      </div>

      <EnquiriesTable
        enquiries={enquiries}
        isLoading={isLoading}
        selectedIds={isSelecting ? selectedIds : undefined}
        onToggleSelect={isSelecting ? toggleSelect : undefined}
      />

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <button
            disabled={data.meta.currentPage <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="font-medium disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {data.meta.currentPage} of {data.meta.totalPages}</span>
          <button
            disabled={!data.meta.hasMore}
            onClick={() => handlePageChange(page + 1)}
            className="font-medium disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-grotesk text-lg font-bold text-foreground flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-[#BE2525]" />
              Delete {selectedIds.size} {selectedIds.size === 1 ? "enquiry" : "enquiries"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This can't be undone. The selected {selectedIds.size === 1 ? "enquiry" : "enquiries"} will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <ActionBtn
              type="button"
              text="Confirm Delete"
              loading={deleteSelected.isPending}
              onClick={handleConfirmDelete}
              classname="bg-[#BE2525] hover:bg-[#A11D1D] text-white text-sm px-4 py-2 h-auto rounded-xl font-bold"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
