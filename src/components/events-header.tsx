import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EventsHeader() {
  return (
    <div className="flex flex-col min-[480px]:flex-row items-start min-[480px]:items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium tracking-wide uppercase text-[#0F6E56]">
          Manage
        </p>
        <h1 className="text-xl min-[480px]:text-2xl sm:text-3xl font-bold text-[#1A1523] mt-1">
          Events
        </h1>
        <p className="text-sm text-[#4A4451] mt-1">
          Create, edit, and track every event, from draft to sold out.
        </p>
      </div>

      <Button className="bg-[#0F6E56] hover:bg-[#0F6E56]/90 text-white gap-1.5 shrink-0 w-full min-[480px]:w-auto">
        <Plus className="size-4" />
        Create Event
      </Button>
    </div>
  );
}