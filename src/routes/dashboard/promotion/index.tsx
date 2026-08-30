import { useState } from "react"
import { useSearchParams, Link } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Star, Triangle, Diamond, X, Check, LockKeyhole, CircleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn, formatDate, formatNaira } from "@/lib/utils"
import { fetchMyEvents } from "@/lib/events-api"
import { useOrganizerStatus } from "@/lib/organizer-api"
import {
  fetchPromotionPackages,
  fetchMyPromotions,
  requestPromotion,
  type PromotionPackageId,
  type PromotionStatus,
} from "@/lib/promotion-api"
import { PromotionSkeleton } from "@/components/skeletons/promotion-skeleton"

const wherePromotedEventsAppear = [
  {
    icon: Star,
    text: "A Featured Events band on the landing page",
  },
  {
    icon: Triangle,
    text: "The top of Explore and relevant category result",
  },
  {
    icon: Diamond,
    text: "A clear Featured label, no ranking stays honest",
  },
]

const PromotionStatusBadge = ({ status }: { status: PromotionStatus }) => {
  const styles: Record<PromotionStatus, string> = {
    approved: "bg-[#E4F1EB] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]",
    pending: "bg-[#F4DFB6] text-[#7A4E02] dark:bg-[#7A4E02]/20 dark:text-[#FBBF24]",
    expired: "bg-[#E4F1EB] text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]",
    rejected: "bg-[#FFC4C4] text-[#BE2525] dark:bg-[#BE2525]/20 dark:text-[#FCA5A5]",
  }
  const labels: Record<PromotionStatus, string> = {
    approved: "ACTIVE",
    pending: "PENDING REVIEW",
    expired: "EXPIRED",
    rejected: "REJECTED",
  }
  return (
    <Badge className={cn("border-transparent", styles[status])}>
      {labels[status]}
    </Badge>
  )
}

const Promotions = () => {
  const [searchParams] = useSearchParams()
  const preselectedEventId = searchParams.get("event")
  const queryClient = useQueryClient()

  const [showVerifyBanner, setShowVerifyBanner] = useState(true)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(preselectedEventId)
  const [selectedPackageId, setSelectedPackageId] = useState<PromotionPackageId | null>(null)

  const { status: organizerStatus } = useOrganizerStatus()

  const { data: myEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["my-events"],
    queryFn: fetchMyEvents,
  })

  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ["promotion-packages"],
    queryFn: fetchPromotionPackages,
  })

  const { data: myPromotions = [], isLoading: promotionsLoading } = useQuery({
    queryKey: ["my-promotions"],
    queryFn: fetchMyPromotions,
  })

  const promoteMutation = useMutation({
    mutationFn: () => {
      if (!selectedEventId || !selectedPackageId) {
        throw new Error("Pick an event and a package first")
      }
      return requestPromotion(selectedEventId, selectedPackageId)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-promotions"] })
      // Backend collects payment via Paystack before the promotion goes live —
      // hand off to Paystack's hosted checkout.
      window.location.href = data.authorizationUrl
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not start promotion checkout")
    },
  })

  const selectedPackage = packages.find(p => p.id === selectedPackageId)
  const effectivePackageId = selectedPackageId ?? (packages.find(p => p.popular)?.id ?? packages[0]?.id ?? null)

  if (eventsLoading || packagesLoading) {
    return <PromotionSkeleton />
  }

  return (
    <div className="flex flex-col gap-6">

      <div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Grow
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
          <Star className="border border-border rounded-lg bg-[#E4F1EB] size-3 text-[#4A4451] w-[35px] h-[29px] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]" />
          Promotions
        </h2>
        <p className="text-sm text-muted-foreground">
          Promote an event for a featured spot and more reach.
        </p>
      </div>

      {/* Only show this for organizers who haven't finished onboarding — verified/pending organizers don't need it */}
      {showVerifyBanner && organizerStatus === "unverified" && (
        <Alert className="border-[#f1ebdd] bg-[#F4DFB6] dark:border-[#7A4E02]/40 dark:bg-[#7A4E02]/20">
          <LockKeyhole className="mt-3 text-[#7A4E02] dark:text-[#FBBF24]" />
          <AlertTitle className="flex items-center gap-2 text-[#1A1523] dark:text-zinc-50">
            Finish setting up your account
            <Badge className="border-transparent bg-[#E4F1EB] text-[#1A1523] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]">
              UNVERIFIED
            </Badge>
          </AlertTitle>
          <AlertDescription className="text-[#4A4451] dark:text-zinc-300">
            Add your bank details to publish paid events and receive payouts. Free events can still be promoted.
          </AlertDescription>
          <AlertAction className="static mt-3 flex items-center gap-3 sm:absolute sm:top-2 sm:mt-0">
            <Button size="sm" className="bg-[#0F6E56] text-[#FFFFFF] hover:bg-[#297260]" render={<Link to="/onboarding/organisation" />}>
              Add bank account
            </Button>
            <button
              type="button"
              onClick={() => setShowVerifyBanner(false)}
              aria-label="Dismiss"
              className="text-[#1A1523] hover:text-[#1e1c21] dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              <X className="size-4" />
            </button>
          </AlertAction>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Boost an event</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                EVENT TO PROMOTE
              </label>
              <Select
                value={selectedEventId ?? undefined}
                onValueChange={setSelectedEventId}
                disabled={eventsLoading || myEvents.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={eventsLoading ? "Loading your events…" : "Select an event"}>
                    {selectedEventId
                      ? myEvents.find(e => e._id === selectedEventId)
                        ? `${myEvents.find(e => e._id === selectedEventId)!.eventTitle} — ${myEvents.find(e => e._id === selectedEventId)!.status}`
                        : selectedEventId
                      : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {myEvents.map(event => (
                    <SelectItem key={event._id} value={event._id}>
                      {event.eventTitle} — {event.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!eventsLoading && myEvents.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  You don't have any events yet.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">
                CHOOSE A PACKAGE
              </label>

              {packagesLoading && (
                <p className="text-xs text-muted-foreground">Loading packages…</p>
              )}

              {packages.map(pkg => {
                const isSelected = pkg.id === effectivePackageId
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={cn(
                      "flex items-start justify-between rounded-xl border p-3 text-left transition-colors",
                      isSelected
                        ? "border-[#0A4F41] ring-1 ring-[#0A4F41] dark:border-[#4ADE80] dark:ring-[#4ADE80]"
                        : "border-border hover:bg-[#E8F5F0] dark:hover:bg-[#0F6E56]/10"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground">{pkg.label}</p>
                        {pkg.popular && (
                          <Badge className="border-transparent bg-[#F5A524] text-[#4A4451] dark:bg-[#F5A524]/25 dark:text-[#FBBF24]">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{pkg.durationDays} Days</p>
                      <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#0A4F41] dark:text-[#4ADE80]">{formatNaira(pkg.priceNaira, pkg.currency)}</p>
                      {isSelected && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-[#0A4F41] text-[#FFFFFF]">
                          <Check className="size-3" />
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <Button
              className="h-11 w-full bg-[#0A4F41] text-[#FFFFFF] hover:bg-[#0F766E]"
              disabled={!selectedEventId || !effectivePackageId || promoteMutation.isPending}
              onClick={() => {
                setSelectedPackageId(effectivePackageId)
                promoteMutation.mutate()
              }}
            >
              {promoteMutation.isPending
                ? "Starting checkout…"
                : selectedPackage
                  ? `Promote for ${formatNaira(selectedPackage.priceNaira, selectedPackage.currency)}`
                  : "Choose a package"}
            </Button>

            <span className="flex gap-2 justify-center items-center text-xs text-muted-foreground">
              <CircleAlert size={12} />
              <p>
                Payment is via Paystack. Promotions go live once an admin approves.
              </p>
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Where promoted events appear</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3">
              {wherePromotedEventsAppear.map(item => (
                <li key={item.text} className="flex items-start gap-2 text-sm">
                  <item.icon className="mt-0.5 size-3.5 text-[#0F6E56] " />
                  {item.text}
                </li>
              ))}
            </ul>

            <div className="rounded-lg bg-[#E4F1EB] p-3 font-semibold text-[#0F6E56] dark:bg-[#0F6E56]/15 dark:text-[#4ADE80]">
              Only events that are already <span className="text-[#0A4F41] dark:text-[#4ADE80]">published and approved</span> can be promoted.
              Drafts, pending and rejected events aren't eligible.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Your Promotions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {promotionsLoading ? (
            <p className="px-(--card-spacing) py-6 text-sm text-muted-foreground">Loading…</p>
          ) : myPromotions.length === 0 ? (
            <p className="px-(--card-spacing) py-6 text-sm text-muted-foreground">
              You haven't promoted any events yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t text-left text-xs text-muted-foreground">
                  <th className="px-(--card-spacing) py-2 font-normal">Event</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Package</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Placement</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Dates</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Spend</th>
                  <th className="px-(--card-spacing) py-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {myPromotions.map((promo) => (
                  <tr key={promo.eventId} className="border-t align-top">
                    <td className="px-(--card-spacing) py-3 font-semibold text-foreground">{promo.eventTitle}</td>
                    <td className="px-(--card-spacing) py-3 text-foreground">{promo.packageLabel}</td>
                    <td className="px-(--card-spacing) py-3 text-foreground">{promo.placementLabel ?? "-"}</td>
                    <td className="px-(--card-spacing) py-3 text-foreground">
                      {promo.startsAt && promo.endsAt
                        ? `${formatDate(promo.startsAt)} – ${formatDate(promo.endsAt)}`
                        : "Starts once approved"}
                    </td>
                    <td className="px-(--card-spacing) py-3">
                      <p className="font-bold text-foreground">
                        {promo.priceNaira !== null ? formatNaira(promo.priceNaira, promo.currency) : "-"}
                      </p>
                      {!promo.paid && (
                        <p className="text-xs text-foreground font-bold">awaiting payment</p>
                      )}
                    </td>
                    <td className="px-(--card-spacing) py-3">
                      <PromotionStatusBadge status={promo.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default Promotions
