import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickActionsCardProps {
  onCheckIn?: () => void;
  onViewAttendees?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  onPostpone?: () => void;
  canCancel?: boolean;
  canPostpone?: boolean;
}

export default function QuickActionsCard({
  onCheckIn,
  onViewAttendees,
  onEdit,
  onDelete,
  onCancel,
  onPostpone,
  canCancel,
  canPostpone,
}: QuickActionsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
      <h3 className="text-base font-bold text-foreground">
        Quick actions
      </h3>

      <div className="flex items-center gap-2 flex-wrap pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onCheckIn}
          className="h-8 rounded-lg px-3.5 text-xs font-semibold text-foreground border-border hover:bg-muted"
        >
          Check in
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onViewAttendees}
          className="h-8 rounded-lg px-3.5 text-xs font-semibold text-foreground border-border hover:bg-muted"
        >
          Attendees
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="h-8 rounded-lg px-3.5 text-xs font-semibold text-foreground border-border hover:bg-muted"
        >
          Edit
        </Button>

        {canPostpone && (
          <Button
            type="button"
            variant="outline"
            onClick={onPostpone}
            className="h-8 rounded-lg px-3.5 text-xs font-semibold text-[#9A3412] border-[#FDE4C8] hover:bg-[#FDE4C8]/40 dark:border-[#9A3412]/40 dark:text-[#FDE4C8] dark:hover:bg-[#9A3412]/20"
          >
            Postpone
          </Button>
        )}

        {canCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-8 rounded-lg px-3.5 text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Cancel event
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={onDelete}
          className="h-8 rounded-lg px-3.5 text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
