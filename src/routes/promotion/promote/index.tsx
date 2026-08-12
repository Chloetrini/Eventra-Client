import { useState } from "react"
import { Star, Triangle, Diamond, X, BellDot, Plus, Check, LockKeyhole, CircleAlert} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"


const myEvents = [
  { id: "Afrobeat", name: "Afrobeat Night Market ,Live" },
  { id: "Hiphop", name: "Hiphop Night Market ,Live" },
  { id: "R&B", name: "R&B Night Market ,Live" },
]

type PackageId = "spotlight" | "featured" | "hero"

interface PromoPackage {
  id: PackageId
  name: string
  price: number
  duration: string
  description: string
  popular?: boolean
}

const packages: PromoPackage[] = [
  {
    id: "spotlight",
    name: "Spotlight",
    price: 15000,
    duration: "3 Days",
    description: "Top of your categories and the Explore page",
  },
  {
    id: "featured",
    name: "Featured",
    price: 35000,
    duration: "7 Days",
    description: "In the featured section on the homepage",
    popular: true,
  },
  {
    id: "hero",
    name: "Homepage Hero",
    price: 75000,
    duration: "14 Days",
    description: "Hero Banner plus homepage and explore placement",
  },
]

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

type PromotionStatus = "active" | "pending" | "expired" | "rejected"

interface Promotion {
  event: string
  package: string
  placement: string
  dates: string
  spend: string
  spendNote?: string
  status: PromotionStatus
  statusNote?: string
}

const myPromotions: Promotion[] = [
  {
    event: "Detty December Boat Party",
    package: "Homepage Hero",
    placement: "Hero+Homepage+Explore",
    dates: "Feb 1-Feb 15",
    spend: "₦75,000",
    status: "active",
  },
  {
    event: "Afrobeats Night Market",
    package: "Featured",
    placement: "Featured Events (homepage)",
    dates: "Feb 8-Feb 15",
    spend: "₦35,000",
    status: "pending",
    statusNote: "Simulate approval",
  },
  {
    event: "Old Year Countdown",
    package: "Spotlight",
    placement: "Top of Explore",
    dates: "Dec 20-Dec 23",
    spend: "₦15,000",
    status: "expired",
  },
  {
    event: "Crypto Riches Seminar",
    package: "Featured",
    placement: "-",
    dates: "Mar 1",
    spend: "₦75,000",
    spendNote: "refunded",
    status: "rejected",
  },
]

const PromotionStatusBadge = ({ status }: { status: PromotionStatus }) => {
  const styles: Record<PromotionStatus, string> = {
    active: "bg-[#E4F1EB] text-[#0F6E56]",
    pending: "bg-[#F4DFB6] text-[#7A4E02]",
    expired: "bg-[#E4F1EB] text-[#0F6E56]",
    rejected: "bg-[#FFC4C4] text-[#BE2525]",
  }
  const labels: Record<PromotionStatus, string> = {
    active: "ACTIVE",
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

const formatNaira = (amount: number) => {
  return `₦${amount.toLocaleString()}`
}

 const Promotions = () => {
  const [showVerifyBanner, setShowVerifyBanner] = useState(true)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(myEvents[0]?.id.toString() ?? null)
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId>("featured")

  const selectedPackage = packages.find(p => p.id === selectedPackageId)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      
      <nav className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Promotions</h1>
        <div className="flex items-center gap-3">
          <Button className="bg-emerald-800 text-white hover:bg-emerald-800/90">
            <Plus className="size-4" />
            Create event
          </Button>
          <Button className='bg-[#D3D3D3]' size="icon">
            <BellDot className=" size-4 text-yellow-400" />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-emerald-800 text-white">LL</AvatarFallback>
          </Avatar>
        </div>
      </nav>

      <div className="border"/>

      {/* pop up to finish account //// */}
      {showVerifyBanner && (
        <Alert className="border-[#f1ebdd] bg-[#F4DFB6]">
            <LockKeyhole className="mt-3 bg-[#ffff]"/>
          <AlertTitle className="flex items-center gap-2 text-[#1A1523]">
            Finish setting up your account
            <Badge className="border-transparent bg-[#E4F1EB] text-[#1A1523]">
              UNVERIFIED
            </Badge>
          </AlertTitle>
          <AlertDescription className="text-[#4A4451]">
            Add your bank details to publish paid events and receive payouts. Free events can't live without it.
          </AlertDescription>
          <AlertAction className="static mt-3 flex items-center gap-3 sm:absolute sm:top-2 sm:mt-0">
            <Button size="sm" className="bg-[#0F6E56] text-[#FFFFFF] hover:bg-[#297260]">
              Add bank account
            </Button>
            <button
              type="button"
              onClick={() => setShowVerifyBanner(false)}
              aria-label="Dismiss"
              className="text-[#1A1523] hover:text-[#1e1c21]"
            >
              <X className="size-4" />
            </button>
          </AlertAction>
        </Alert>
      )}

      
      <div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
         Grow
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-lg font-bold">
          <Star className="border rounded-lg bg-[#E4F1EB] size-3 text-[#4A4451] w-[35px] h-[29px]" />
          Promotions
        </h2>
        <p className="text-sm text-muted-foreground">
          Promote an event for a featured spot and more reach.
        </p>
      </div>

     
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Boost an event</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#4A4451]">
                EVENT TO PROMOTE
              </label>
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {myEvents.map(event => (
                    <SelectItem key={event.id} value={event.name}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[#4A4451]">
                CHOOSE A PACKAGE
              </label>

              {packages.map(pkg => {
                const isSelected = pkg.id === selectedPackageId
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={cn(
                      "flex items-start justify-between rounded-xl border p-3 text-left transition-colors",
                      isSelected
                        ? "border-[#0A4F41] ring-1 ring-[#0A4F41]"
                        : "border-border hover:bg-[#E8F5F0]"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#1A1523]">{pkg.name}</p>
                        {pkg.popular && (
                          <Badge className="border-transparent bg-[#F5A524] text-[#4A4451]">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[#4A4451]">{pkg.duration}</p>
                      <p className="mt-1 text-sm text-[#4A4451]">{pkg.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#0A4F41]">{formatNaira(pkg.price)}</p>
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

            <Button className="h-11 w-full bg-[#0A4F41] text-[#FFFFFF] hover:bg-[#0F766E]">
              {selectedPackage
                ? `Promote for ${formatNaira(selectedPackage.price)}`
                : "Choose a package"}
            </Button>

            <span className="flex gap-2 justify-center items-center text-xs text-muted-foreground">
              <CircleAlert size={12}/>
              <p>
                Payment is via Paystack. Promotions go live once an admin approves.
              </p>
            </span>
          </CardContent>
        </Card>

        {/* ///////// */}

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

            <div className="rounded-lg bg-[#E4F1EB] p-3 font-semibold text-[#0F6E56]">
              Only events that are already <span className="text-[#0A4F41]">published and approved</span> can be promoted.
              Drafts, pending and rejected events aren't eligible.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ////// */}
      <Card size="sm">
        <CardHeader>
          <CardTitle>Your Promotions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t text-left text-xs text-[#6E6577]">
                <th className="px-(--card-spacing) py-2 font-normal">Event</th>
                <th className="px-(--card-spacing) py-2 font-normal">Package</th>
                <th className="px-(--card-spacing) py-2 font-normal">Placement</th>
                <th className="px-(--card-spacing) py-2 font-normal">Dates</th>
                <th className="px-(--card-spacing) py-2 font-normal">Spend</th>
                <th className="px-(--card-spacing) py-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {myPromotions.map((promo, i) => (
                <tr key={i} className="border-t align-top">
                  <td className="px-(--card-spacing) py-3 font-semibold text-[#1A1523]">{promo.event}</td>
                  <td className="px-(--card-spacing) py-3 text-[#1A1523]">{promo.package}</td>
                  <td className="px-(--card-spacing) py-3 text-[#1A1523]">{promo.placement}</td>
                  <td className="px-(--card-spacing) py-3 text-[#1A1523]">{promo.dates}</td>
                  <td className="px-(--card-spacing) py-3">
                    <p className="font-bold text-[#1A1523]">{promo.spend}</p>
                    {promo.spendNote && (
                      <p className="text-xs text-[#1A1523] font-bold">{promo.spendNote}</p>
                    )}
                  </td>
                  <td className="px-(--card-spacing) py-3">
                    <PromotionStatusBadge status={promo.status} />
                    {promo.statusNote && (
                      <p className="mt-1 text-xs text-[#0F6E56]">{promo.statusNote}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
export default Promotions