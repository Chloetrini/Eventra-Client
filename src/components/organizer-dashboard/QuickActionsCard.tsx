import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickActionsCardProps {
  onCheckIn?: () => void;
  onViewAttendees?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function QuickActionsCard({
  onCheckIn,
  onViewAttendees,
  onEdit,
  onDelete,
}: QuickActionsCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-4 shadow-2xs dark:bg-zinc-900 dark:border-zinc-800">
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
        Quick actions
      </h3>

      <div className="flex items-center gap-2 flex-wrap pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onCheckIn}
          className="h-8 rounded-lg px-3.5 text-xs font-semibold text-zinc-800 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200"
        >
          Check in
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onViewAttendees}
          className="h-8 rounded-lg px-3.5 text-xs font-semibold text-zinc-800 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200"
        >
          Attendees
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="h-8 rounded-lg px-3.5 text-xs font-semibold text-zinc-800 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200"
        >
          Edit
        </Button>

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
