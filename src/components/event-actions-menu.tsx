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
  /** The backend only allows editing an event while it's still "draft" or
   * "rejected" (see EDITABLE_STATUSES on the backend) — anything else
   * (Live, Pending, Postponed, etc.) fails the save at the very end of the
   * wizard with a 400. Passing status here lets the Edit item warn up
   * front instead of letting the organizer fill out the whole form first. */
  status?: EditableEventStatus;
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
export function EventActionsMenu({ eventId, eventTitle, status, onDeleted }: EventActionsMenuProps) {
  const navigate = useNavigate();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const duplicateMutation = useDuplicateEvent();
  const deleteMutation = useDeleteEvent();

  // Only draft/rejected events can actually be edited on the backend — for
  // everything else (Live, Pending, Postponed, ...), stop them before they
  // fill out the whole wizard and hit a confusing failure on save. `status`
  // is optional so callers that don't pass it (none currently) still work,
  // just without this guard.
  const canEdit = status === undefined || status === "Draft" || status === "Rejected";

  const handleEditClick = () => {
    if (!canEdit) {
      toast.error(
        "Live events can't be edited directly. Use Cancel or Postpone from the event's details page for date/venue/price changes."
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
