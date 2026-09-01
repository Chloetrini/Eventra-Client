import React, { useState } from "react";
import { Flag, ArrowRight, ArrowLeft } from "lucide-react";
import type { AdminEvent } from "@/types/admin-event";
import { StatusBadge } from "./AdminEventsTable";
import { UI_ASSETS } from "@/lib/assets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import PageWrapper from "@/components/page-wrapper";

interface AdminEventDetailProps {
  event: AdminEvent;
  onBack?: () => void;
  onFlag?: (eventId: string) => void;
  onRemove?: (eventId: string) => void;
}

export default function AdminEventDetail({
  event,
  onBack,
  onFlag,
  onRemove,
}: AdminEventDetailProps) {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);


  const handleConfirmRemove = () => {
    setIsRemoveModalOpen(false);
    onRemove?.(event._id);
  };

  const isFlagged = event.status === "FLAGGED";

  return (
    <PageWrapper className="flex flex-col gap-6 p-[20px]">
      {/* Top Back Link */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F6E56] dark:text-[#4ADE80] hover:underline cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </button>
      </div>

      {/* Header Title & Status */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1
            className={`font-grotesk text-3xl font-bold transition-colors ${
              isFlagged ? "text-[#DC2626]" : "text-foreground"
            }`}
          >
            {event.title}
          </h1>
          <StatusBadge status={event.status} />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          By {event.organizerName}
        </p>
      </div>

      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 sm:p-10 text-white shadow-md pt-28.75">
        {/* Background Image / Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{
            backgroundImage: `url(${
              event.details?.bannerImage 
            })`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative z-10 max-w-xl mt-27.85 sm:mt-32 md:mt-34.75 lg:mt-50">
          <p className="font-geist text-xs font-semibold tracking-widest text-[#F5A524] uppercase">
            {event.details?.category}
          </p>
          <h2 className="mt-2 font-grotesk text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {event.title}s
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium text-slate-200">
            {event.details?.formattedDate} - {event.details?.venue}
          </p>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (7 cols) */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* About this event Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <h3 className="font-grotesk text-base font-bold text-foreground">
              About this event
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {event.details?.description}
            </p>
          </div>

          {/* Ticket Types Table Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] font-space font-medium uppercase text-[#6E6577]">
                    <th className="pb-3">TYPE</th>
                    <th className="pb-3">PRICE</th>
                    <th className="pb-3 text-right">QTY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {event.details?.ticketTypes.map((tier) => (
                    <tr key={tier.id}>
                      <td className="py-3.5 font-bold text-foreground">
                        {tier.name}
                      </td>
                      <td className="py-3.5 font-space font-bold text-foreground">
                        {tier.price === 0
                          ? "FREE"
                          : tier.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 font-space font-bold text-foreground text-right">
                        {tier.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Organizer Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <h3 className="font-grotesk text-base font-bold text-foreground">
              Organizer
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-foreground text-sm border border-border">
                {event.details?.organizer.initials}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm font-grotesk">
                  {event.details?.organizer.name}
                </p>
                <p className="text-xs text-muted-foreground font-bold font-space">
                  {event.details?.organizer.verified ? "Verified" : "Unverified"}
                </p>
              </div>
            </div>
            <button className="mt-5 flex w-[70%] items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer font-geist ites">
              View organizer
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Details Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <h3 className="font-grotesk text-base font-bold text-foreground">
              Details
            </h3>
            <div className="mt-4 divide-y divide-border/60 text-sm">
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground font-space text-xs">
                  Date
                </span>
                <span className="font-semibold text-foreground text-right">
                  {event.details?.formattedDate}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground font-space text-xs">
                  Venue
                </span>
                <span className="font-semibold text-foreground text-right">
                  {event.details?.venue}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground font-space text-xs">
                  Capacity
                </span>
                <span className="font-space font-semibold text-foreground text-right">
                  {event.details?.capacity}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground font-space text-xs">
                  Age policy
                </span>
                <span className="font-space font-semibold text-foreground text-right">
                  {event.details?.agePolicy}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground font-space text-xs">
                  Refund policy
                </span>
                <span className="font-semibold text-foreground text-right">
                  {event.details?.refundPolicy}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-6">
        <p className="text-sm text-muted-foreground font-medium">
          Review the details before you decide.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onFlag?.(event._id)}
            className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-colors cursor-pointer shadow-md ${
              isFlagged
                ? "border-[#DC2626] bg-[#FCE8E6] dark:bg-[#DC2626]/20 text-[#DC2626]"
                : "border-border bg-card text-foreground hover:bg-accent"
            }`}
          >
            <Flag className={`h-4 w-4 ${isFlagged ? "text-[#DC2626]" : ""}`} />
            {isFlagged ? "Unflag" : "Flag"}
          </button>
          <button
            onClick={() => setIsRemoveModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] px-5 py-2.5 text-sm font-bold text-white transition-colors cursor-pointer shadow-md"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Remove Event Confirmation Modal */}
      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="space-y-2 items-center">
            <DialogTitle className="font-grotesk text-lg font-bold text-foreground pt-5">
              Are you sure you want to remove event?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground font-medium">
              This action cannot be reversed
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex items-center justify-end gap-3 bg-white">
            <button
              type="button"
              onClick={() => setIsRemoveModalOpen(false)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmRemove}
              className="rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] px-4 py-2 text-sm font-bold text-white cursor-pointer transition-colors shadow-md"
            >
              Remove
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
