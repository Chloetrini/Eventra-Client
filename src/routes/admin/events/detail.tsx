import { useParams, useNavigate } from "react-router";
import AdminEventDetail from "@/components/admin/events/AdminEventDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAdminEventDetail, useToggleFlagAdminEvent, useRemoveAdminEvent } from "@/hooks/use-admin-events";

export default function AdminEventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading, isError } = useAdminEventDetail(eventId);
  const toggleFlag = useToggleFlagAdminEvent();
  const removeEvent = useRemoveAdminEvent();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-[20px]">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-64 w-full rounded-2xl lg:col-span-7" />
          <Skeleton className="h-64 w-full rounded-2xl lg:col-span-5" />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Event not found.</p>
        <Button variant="link" onClick={() => navigate("/admin/events")}>
          Back to events
        </Button>
      </div>
    );
  }

  return (
    <AdminEventDetail
      event={event}
      onBack={() => navigate("/admin/events")}
      onFlag={id => {
        toggleFlag.mutate({ id, flagged: event.status === "FLAGGED" });
      }}
      onRemove={id => {
        removeEvent.mutate(id, {
          onSuccess: () => navigate("/admin/events"),
        });
      }}
    />
  );
}
