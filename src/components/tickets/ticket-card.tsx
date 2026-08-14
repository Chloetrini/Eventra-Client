import React from "react";
import type { Ticket } from "@/types/ticket";
import { CalendarDays, Clock, MapPinIcon, Music4 } from "lucide-react";
import shieldTick from "@/assets/shieldTick.png";
import { useNavigate } from "react-router";
import calendar from "@/assets/calendar.png";
import rightArrow from "@/assets/rightArrow.png";
import backward from "@/assets/backward.png";
import PaymentBtn from "@/components/ui/pay-method-btn";
import { formatDateTime } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { requestTicketRefund, cancelReservation } from "@/lib/tickets-api";
import { useQueryClient } from "@tanstack/react-query";
interface TicketProps {
  ticket: Ticket;
  showActions?: boolean;
}

export function TicketCard({ ticket, showActions = false }: TicketProps) {
  const navigate = useNavigate();
  const {
    category,
    eventDateTime,
    eventEntrance,
    holderName,
    eventName,
    orderID,
    ticketDetails,
    qrImageUrl,
    refundPolicy,
    eventVenue,
  } = ticket;
  const admitsCount = ticketDetails.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const ticketTypeConfig: Record<string, { bg: string; text: string }> = {
    Free: {
      bg: "bg-[#F5A524]",
      text: "text-white",
    },
    Regular: {
      bg: "bg-[#0A4F41]",
      text: "text-[#96E2B5]",
    },
    VIP: {
      bg: "bg-[#0A4F41]",
      text: "text-[#E8D8FF]",
    },
  };
  const ticketType = ticketDetails[0].type;
  const { bg: ticketBg, text: ticketText } = ticketTypeConfig[ticketType] ?? {
    bg: "bg-muted",
    text: "text-muted-foreground",
  };

  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRequestRefund = async () => {
    if (!ticket._id) return;
    setIsProcessing(true);
    try {
      await requestTicketRefund(ticket._id);
      toast.success("Refund requested. We'll email you once it's processed.");
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not request refund. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelRsvp = async () => {
    if (!ticket._id) return;
    setIsProcessing(true);
    try {
      await cancelReservation(ticket._id);
      toast.success("Reservation cancelled.");
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel reservation. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div>
      <div className="w-full mb-8 flex flex-col lg:flex-row  items-stretch">
        {/* Green ticket card */}
        <div className="flex flex-col justify-between w-full lg:w-[811px] xl:w-full h-auto lg:h-[404px] bg-linear-to-br from-black from-10% via-[#021713] via-40% to-[#0C5C48] p-4 min-[400px]:p-5 lg:p-8 rounded-[20px] shadow-[8px_0_30px_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <div className="bg-[#0A4F41] w-fit py-1.5 px-3 min-[400px]:py-2 min-[400px]:px-5 uppercase flex gap-1.5 min-[400px]:gap-2 text-[#96E2B5] rounded-[10px] text-xs min-[400px]:text-sm">
                <Music4 className="size-4" />
                <p>{category}</p>
              </div>
              <div
                className={`${ticketBg} ${ticketText} w-fit py-2 px-5 rounded-[10px] text-sm`}
              >
                <p>{ticketDetails.map((t) => t.type).join(", ")}</p>
              </div>
            </div>
            <div className="text-white pt-[4px] text-xl min-[400px]:text-2xl sm:text-[23px] lg:text-[54px] font-bold font-grotesk">
              <h1 className="w-full lg:w-[428px] leading-tight lg:leading-[50px] h-auto lg:h-[98px]">
                {eventName}
              </h1>
            </div>
          </div>
          <div className="flex gap-1.5 min-[400px]:gap-2 sm:gap-0 my-4 lg:my-0">
            <div className="flex items-center gap-1.5 min-[400px]:gap-2 border-r pr-2 min-[400px]:pr-3 sm:pr-6 lg:pr-10 border-[#E8E6E0]">
              <CalendarDays
                color="#96E2B5"
                className="size-4 min-[400px]:size-5"
              />
              <div>
                <p className="text-[#96E2B5] text-[10px] min-[400px]:text-xs">
                  DATE
                </p>
                <p className="text-white font-medium text-xs min-[400px]:text-sm sm:text-base lg:text-lg">
                  {formatDateTime(eventDateTime, "PP")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 min-[400px]:gap-2 border-r px-2 min-[400px]:px-3 sm:px-6 lg:px-10 border-[#E8E6E0]">
              <Clock color="#96E2B5" className="size-4 min-[400px]:size-5" />
              <div>
                <p className="text-[#96E2B5] text-[10px] min-[400px]:text-xs">
                  TIME
                </p>
                <p className="text-white font-medium text-xs min-[400px]:text-sm sm:text-base lg:text-lg">
                  {formatDateTime(eventDateTime, "p")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 min-[400px]:gap-2 pl-2 min-[400px]:pl-3 sm:pl-6 lg:pl-10 border-[#E8E6E0]">
              <MapPinIcon
                color="#96E2B5"
                className="size-4 min-[400px]:size-5"
              />
              <div>
                <p className="text-[#96E2B5] text-[10px] min-[400px]:text-xs">
                  ENTRY
                </p>
                <p className="text-white font-medium text-xs min-[400px]:text-sm sm:text-base lg:text-lg">
                  {eventEntrance}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <MapPinIcon
              color="#96E2B5"
              size={16}
              className="min-[400px]:hidden"
            />
            <MapPinIcon
              color="#96E2B5"
              size={18}
              className="hidden min-[400px]:block"
            />
            <p className="text-white text-xs min-[400px]:text-sm lg:text-base">
              {eventVenue}. {holderName}.{" "}
              {ticketDetails.map((ticket) => ticket.type).join(", ")}. ADMITS{" "}
              {admitsCount}
            </p>
          </div>
        </div>
        {/* Qr code section */}
        <div className="bg-white shadow-2xl flex flex-col items-center lg:w-[397px] lg:h-[390px] rounded-lg text-center justify-between p-3 min-[400px]:p-4">
          <div className="rounded-full border px-4 min-[400px]:px-6 py-1 mb-2 border-[#0F6E56]">
            <p className="text-[#0F6E56] text-xs min-[400px]:text-sm">
              ADMITS {admitsCount}
            </p>
          </div>
          <div className="bg-white border-2 shadow-lg p-3 rounded-xl mb-4">
            <img
              src={qrImageUrl}
              alt={`QR code for ticket ${orderID}`}
              className="w-[100px] h-[100px] min-[400px]:w-[120px] min-[400px]:h-[120px] lg:w-[150px] lg:h-[150px]"
            />
          </div>
          <div className="border-t-[1px] border-dashed text-center border-[#000000] pt-3 w-full">
            <div className="w-full max-w-[316px] mx-auto gap-[5px]">
              <p className="text-[#4A4451] text-xs min-[400px]:text-sm">
                TICKET ID
              </p>
              <p className="font-space font-bold text-xl min-[400px]:text-2xl text-[#1A1523]">
                {orderID}
              </p>
              <p className="text-xs text-[#4A4451] italic mt-1">Non-transferable</p>
            </div>
            <div className="text-xs min-[400px]:text-[14px] font-[500] leading-[21px] w-full max-w-[316px] mx-auto text-[#0F6E56]">
              <p className="">Eventra</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — only on My Tickets, not on Confirmation */}
      {showActions && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 -mt-4 mb-8">
          <div className="flex items-center gap-2">
            {refundPolicy.type === "refundable" && (
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <img src={shieldTick} alt="" className="size-3.5 shrink-0" />
                {refundPolicy.note || "Refunds allowed until 3 days before the event."}
              </p>
            )}
            {refundPolicy.type === "non-refundable" && (
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground uppercase">
                <img src={shieldTick} alt="" className="size-3.5 shrink-0" />
                Non-refundable
              </p>
            )}
            {refundPolicy.type === "free-cancel" && (
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <img src={shieldTick} alt="" className="size-3.5 shrink-0" />
                Free event · cancel anytime to release your spot.
              </p>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            <PaymentBtn
              icon={calendar}
              editIcon="w-[18px] h-[18px]"
              text="Add to calendar"
              classname="h-9 text-xs sm:text-sm"
              arrow={rightArrow}
              editArrow="w-[18px] h-[18px]"
            />
            {refundPolicy.type === "refundable" && (
              <PaymentBtn
                icon={backward}
                editIcon="w-[18px] h-[18px]"
                text={isProcessing ? "Processing..." : "Request refund"}
                classname="h-9 border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] text-xs sm:text-sm"
                arrow={rightArrow}
                editArrow="w-[18px] h-[18px]"
                onClick={handleRequestRefund}
                disabled={isProcessing}
              />
            )}
            {refundPolicy.type === "free-cancel" && (
              <PaymentBtn
                icon={backward}
                editIcon="w-[18px] h-[18px]"
                text={isProcessing ? "Processing..." : "Cancel RSVP"}
                classname="h-9 border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525] text-xs sm:text-sm"
                arrow={rightArrow}
                editArrow="w-[18px] h-[18px]"
                onClick={handleCancelRsvp}
                disabled={isProcessing}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}