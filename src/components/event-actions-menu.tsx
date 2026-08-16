import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { duplicateEvent, deleteEvent } from "@/services/events-api";
import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboard";
import { DeleteEventDialog } from "@/components/dialogs/delete-event-dialog";
import Loading from "@/assets/more.png";
import EditPen from "@/assets/magicpen.png";
import Promote from "@/assets/star.png";
import UserProfile from "@/assets/profile-2user.png";
import Preview from "@/assets/play.png";
import Duplicate from "@/assets/3square.png";

interface EventActionsMenuProps {
  eventId: string;
  eventTitle: string;
  /** Called after a successful delete, in addition to the automatic
   * list-refresh below — use this when the caller keeps its own local
   * copy of the event list (e.g. dashboard/events, which filters
   * client-side) and needs to remove the row immediately. */
  onDeleted?: () => void;
}

/**
 * The one "..." menu used everywhere an event row appears (the Events
 * list, the dashboard Overview's Recent events, and the single-event
 * details page). Edit/View details/Attendance/Promote navigate;
 * Duplicate and Delete call the real backend directly, and Delete always
 * confirms through the same modal dialog — never a native window.confirm
 * — so every menu behaves identically.
 */
export function EventActionsMenu({ eventId, eventTitle, onDeleted }: EventActionsMenuProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const invalidateEventLists = () => {
    queryClient.invalidateQueries({ queryKey: ["my-events"] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: [DASHBOARD_QUERY_KEY] });
  };

  const duplicateMutation = useMutation({
    mutationFn: () => duplicateEvent(eventId),
    onSuccess: () => {
      toast.success("Event duplicated as a new draft");
      invalidateEventLists();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not duplicate event. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteEvent(eventId),
    onSuccess: () => {
      toast.success("Event deleted");
      invalidateEventLists();
      onDeleted?.();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not delete event. Please try again.");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <img src={Loading} alt="More options" className="size-6 text-[#292D32]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => navigate(`/dashboard/create-event/type?eventId=${eventId}`)}
          className="text-muted-foreground text-[13px]"
        >
          <img src={EditPen} alt="" className="size-4" /> Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate(`/dashboard/events/${eventId}`)}
          className="text-muted-foreground text-[13px]"
        >
          <img src={Preview} alt="" className="size-4" /> View details
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate(`/dashboard/attendees?event=${eventId}`)}
          className="text-muted-foreground text-[13px]"
        >
          <img src={UserProfile} alt="" className="size-4" /> Attendance
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate(`/dashboard/promotion?event=${eventId}`)}
          className="text-muted-foreground text-[13px]"
        >
          <img src={Promote} alt="" className="size-4" /> Promote
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => duplicateMutation.mutate()}
          disabled={duplicateMutation.isPending}
          className="text-muted-foreground text-[13px] border-t border-border"
        >
          <img src={Duplicate} alt="" className="size-4" />
          {duplicateMutation.isPending ? "Duplicating…" : "Duplicate"}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-destructive focus:text-destructive text-[13px]"
          onClick={() => setConfirmingDelete(true)}
        >
          <Trash2 className="size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <DeleteEventDialog
        event={confirmingDelete ? { id: eventId, title: eventTitle } : null}
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        onConfirm={() => deleteMutation.mutate()}
      />
    </DropdownMenu>
  );
}
