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
import { toast } from "react-toastify";
import { useDuplicateEvent, useDeleteEvent } from "@/hooks/use-event-actions";
import { DeleteEventDialog } from "@/components/dialogs/delete-event-dialog";
import { LIVE_EDIT_CUTOFF_DAYS, isPastLiveEditCutoff } from "@/lib/create-event-api";
import Loading from "@/assets/more.png";
import EditPen from "@/assets/magicpen.png";
import Promote from "@/assets/star.png";
import UserProfile from "@/assets/profile-2user.png";
import Preview from "@/assets/play.png";
import Duplicate from "@/assets/3square.png";

type EditableEventStatus =
  | "Live"
  | "Sold out"
  | "Draft"
  | "Pending"
  | "Past"
  | "Rejected"
  | "Cancelled"
  | "Postponed";

interface EventActionsMenuProps {
  eventId: string;
  eventTitle: string;
  /** A draft/rejected event is always editable. A live event ("Live" /
   * "Sold out" / "Postponed" here — approved/postponed on the backend) is
   * editable too, but only up to LIVE_EDIT_CUTOFF_DAYS before it starts —
   * mirrors isLiveEditableEvent/buildEditability used on the event-details
   * page, so this menu's Edit item agrees with that page instead of
   * blocking live edits the backend would actually accept. */
  status?: EditableEventStatus;
  /** Required to know whether a live event is still within the edit
   * cutoff window — omit only for statuses where it doesn't matter
   * (Draft/Rejected/Pending/Past/Cancelled). */
  startDate?: string | null;
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
export function EventActionsMenu({ eventId, eventTitle, status, startDate, onDeleted }: EventActionsMenuProps) {
  const navigate = useNavigate();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const duplicateMutation = useDuplicateEvent();
  const deleteMutation = useDeleteEvent();

  // `status` is optional so callers that don't pass it (none currently)
  // still work, just without this guard.
  const isDraftEditable = status === undefined || status === "Draft" || status === "Rejected";
  const isLiveStatus = status === "Live" || status === "Sold out" || status === "Postponed";
  const isLiveEditable = isLiveStatus && !isPastLiveEditCutoff(startDate);
  const canEdit = isDraftEditable || isLiveEditable;

  const handleEditClick = () => {
    if (!canEdit) {
      toast.error(
        isLiveStatus
          ? `This event starts in less than ${LIVE_EDIT_CUTOFF_DAYS} days and can no longer be edited`
          : "This event can't be edited in its current state."
      );
      return;
    }
    navigate(`/dashboard/create-event/type?eventId=${eventId}`);
  };

  const handleDuplicate = () => {
    duplicateMutation.mutate(eventId, {
      onSuccess: () => toast.success("Event duplicated as a new draft"),
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Could not duplicate event. Please try again.");
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(eventId, {
      onSuccess: () => {
        toast.success("Event deleted");
        onDeleted?.();
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Could not delete event. Please try again.");
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <img src={Loading} alt="More options" className="size-6 text-[#292D32]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleEditClick}
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
          onClick={handleDuplicate}
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
        onConfirm={handleDelete}
      />
    </DropdownMenu>
  );
}
