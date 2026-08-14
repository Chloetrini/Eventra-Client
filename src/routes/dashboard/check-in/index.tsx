import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle2, XCircle, AlertTriangle, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountReviewBanner } from "@/components/account-review-banner";
import { fetchMyEvents } from "@/lib/events-api";
import { checkInTicket, type CheckInResult } from "@/lib/events-api";
import { useOrganizerStatus } from "@/lib/organizer-api";
import { cn } from "@/lib/utils";

type ScanLogEntry = CheckInResult & { code: string; at: number };

export default function CheckIn() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { status } = useOrganizerStatus();

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["my-events"],
    queryFn: fetchMyEvents,
  });

  const selectedEventId = searchParams.get("event") ?? events[0]?._id ?? "";
  const selectedEvent = events.find((e) => e._id === selectedEventId);

  const [code, setCode] = useState("");
  const [log, setLog] = useState<ScanLogEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEventChange = (eventId: string | null) => {
    if (!eventId) return;
    const params = new URLSearchParams(searchParams);
    params.set("event", eventId);
    setSearchParams(params);
  };

  const checkInMutation = useMutation({
    mutationFn: (ticketCode: string) => checkInTicket(selectedEventId, ticketCode),
    onSuccess: (result, ticketCode) => {
      setLog((prev) => [{ ...result, code: ticketCode, at: Date.now() }, ...prev].slice(0, 20));
      setCode("");
      inputRef.current?.focus();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed || !selectedEventId) return;
    checkInMutation.mutate(trimmed);
  };

  const latest = log[0];

  return (
    <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <AccountReviewBanner status={status} />

      <div>
        <p className="text-[16px] min-[400px]:text-sm lg:text-[16px] font-medium tracking-wide uppercase text-[#0A4F41]">
          Manage
        </p>
        <h1 className="text-[34px] leading-[40px] font-grotesk min-[400px] font-semibold text-[#1A1523] mt-1">
          Check-in
        </h1>
        <p className="text-[16px] leading-[26px] font-medium min-[400px]:text-sm lg:text-[16px] text-[#4A4451] mt-1">
          Scan or type a ticket's code to check a guest in at the door.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="py-[5px] text-[#6E6577] text-[16px] font-light uppercase">
          Event
        </span>
        <Select
          value={selectedEventId || undefined}
          onValueChange={handleEventChange}
          disabled={eventsLoading || events.length === 0}
        >
          <SelectTrigger className="w-auto rounded-md py-3 min-[400px]:py-[18px] px-3 min-[400px]:px-4 border-[#E8E6E0] border text-[15px] min-[400px]:text-[15px] text-[#1A1523] font-bold">
            <SelectValue placeholder={eventsLoading ? "Loading events…" : "Select event"}>
              {selectedEvent?.eventTitle}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event._id} value={event._id}>
                {event.eventTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!eventsLoading && events.length === 0 && (
        <p className="text-sm text-[#6E6577]">
          You don't have any events to check guests in for yet.
        </p>
      )}

      {selectedEventId && (
        <>
          <form
            onSubmit={handleSubmit}
            className="border border-[#E8E6E0] rounded-2xl p-6 space-y-4"
          >
            <label className="text-xs font-semibold uppercase tracking-wide text-[#6E6577]">
              Ticket code
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                ref={inputRef}
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Scan a QR code or type the ticket code"
                className="h-12 flex-1 text-base font-mono"
              />
              <Button
                type="submit"
                disabled={!code.trim() || checkInMutation.isPending}
                className="h-12 px-6 bg-[#0F6E56] text-white hover:bg-[#0c5a46]"
              >
                <ScanLine className="size-4" />
                {checkInMutation.isPending ? "Checking…" : "Check in"}
              </Button>
            </div>
            <p className="text-xs text-[#6E6577]">
              This is the same code printed in each ticket's QR image — a camera scanner can be
              wired in later to feed this same field.
            </p>
          </form>

          {latest && (
            <CheckInResultBanner result={latest} />
          )}

          {log.length > 0 && (
            <div className="border border-[#E8E6E0] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#E8E6E0] font-semibold text-[#1A1523]">
                Recent scans this session
              </div>
              <div className="divide-y divide-[#E8E6E0]">
                {log.map((entry) => (
                  <div
                    key={`${entry.code}-${entry.at}`}
                    className="flex items-center justify-between px-5 py-3 text-sm"
                  >
                    <div>
                      <p className="font-mono font-semibold text-[#1A1523]">{entry.code}</p>
                      {entry.ticket?.attendeeName && (
                        <p className="text-xs text-[#6E6577]">{entry.ticket.attendeeName}</p>
                      )}
                    </div>
                    <ResultBadge result={entry.result} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CheckInResultBanner({ result }: { result: ScanLogEntry }) {
  const config = {
    valid: {
      icon: CheckCircle2,
      classes: "bg-[#E4F1EB] border-emerald-200 text-[#0F6E56]",
      title: result.ticket?.attendeeName ? `${result.ticket.attendeeName} checked in` : "Checked in",
    },
    already_used: {
      icon: AlertTriangle,
      classes: "bg-[#FCEBC9] border-amber-200 text-[#7A4E02]",
      title: "Already checked in",
    },
    invalid: {
      icon: XCircle,
      classes: "bg-[#FFE4E4] border-red-200 text-[#BE2525]",
      title: "Not a valid ticket for this event",
    },
  }[result.result];

  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-3 rounded-xl border p-4", config.classes)}>
      <Icon className="size-6 shrink-0" />
      <div>
        <p className="font-bold">{config.title}</p>
        {result.ticket?.attendeeEmail && (
          <p className="text-sm opacity-80">{result.ticket.attendeeEmail}</p>
        )}
      </div>
    </div>
  );
}

function ResultBadge({ result }: { result: CheckInResult["result"] }) {
  const config = {
    valid: { label: "VALID", classes: "bg-[#E4F1EB] text-[#0F6E56]" },
    already_used: { label: "ALREADY USED", classes: "bg-[#FCEBC9] text-[#7A4E02]" },
    invalid: { label: "INVALID", classes: "bg-[#FFE4E4] text-[#BE2525]" },
  }[result];

  return (
    <span className={cn("text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1", config.classes)}>
      {config.label}
    </span>
  );
}
