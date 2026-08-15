import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function EventsHeader() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-[480px]:flex-row items-start min-[480px]:items-start justify-between gap-4">
      <div>
        <p className="text-[13px] font-medium tracking-wide uppercase text-[#0F6E56] font-space">
          Manage
        </p>
        <h1 className="text-[28px] font-grotesk min-[480px]:text-2xl sm:text-3xl font-bold text-foreground mt-1">
          Events
        </h1>
        <p className="text-[15px] text-muted-foreground mt-1">
          Create, edit, and track every event, from draft to sold out.
        </p>
      </div>

      <Button  onClick={()=> navigate("/dashboard/create-event/type")} className="bg-[#0F6E56] rounded-[7px] text-[13px] px-4 py-3 hover:bg-[#0F6E56]/90 text-[#FFFFFF] mt-8 font-bold font-700 py-4 gap-1.5 shrink-0 w-full min-[480px]:w-auto">
        <Plus className="size-3" />
        Create Event
      </Button>
    </div>
  );
}