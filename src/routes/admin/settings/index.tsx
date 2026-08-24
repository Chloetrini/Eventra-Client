import { useState } from "react"
import { Plus, DotIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import PageWrapper from "@/components/page-wrapper"

interface ToggleSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

function ToggleSwitch({ checked, onCheckedChange }: Omit<ToggleSwitchProps, "label">) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative right-0.5 h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-emerald-700" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5  right-6 size-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5.5" : "translate-x-0.5"
        )}
      />
    </button>
  )
}


interface NumberStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

const NumberStepper = ({ value, onChange, min = 0, max = 100 }: NumberStepperProps) => {
  const update = (next: number) => {
    onChange(Math.min(max, Math.max(min, next)))
  }

  return (
    <div className="flex h-9 w-24 items-center justify-between rounded-md border border-input bg-transparent px-3 shadow-xs">
      <input
        type="number"
        value={value}
        onChange={e => {
          const num = Number(e.target.value)
          if (!isNaN(num)) update(num)
        }}
        min={min}
        max={max}
        className="w-10 bg-transparent text-sm font-medium outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div className="-mr-1 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={() => update(value + 1)}
          aria-label="Increase"
          className="p-0.5 text-muted-foreground hover:text-foreground"
        >
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 5L4 1.5L7 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => update(value - 1)}
          aria-label="Decrease"
          className="p-0.5 text-muted-foreground hover:text-foreground"
        >
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 1L4 4.5L7 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ---- Static data (swap for real API data later) ----

type Role = "owner" | "admin" | "support"

interface AdminMember {
  id: string
  name: string
  email: string
  role: Role
}

const admins: AdminMember[] = [
  { id: "1", name: "Ada Okafor", email: "ada@gmail.com", role: "owner" },
  { id: "2", name: "Osho Ganiyu", email: "ada@gmail.com", role: "admin" },
  { id: "3", name: "Wale Okegunle", email: "ada@gmail.com", role: "support" },
  { id: "4", name: "Olaide Bolajoko", email: "ada@gmail.com", role: "support" },
]

function initials(name: string) {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
}

export default function PlatformSettings() {
  const [platformFee, setPlatformFee] = useState(3)
  const [currency, setCurrency] = useState("")
  const [payoutHold, setPayoutHold] = useState("")
  const [autoApproveEvents, setAutoApproveEvents] = useState(false)
  const [autoApprovePromotions, setAutoApprovePromotions] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const [memberRoles, setMemberRoles] = useState<Record<string, Role>>(
    Object.fromEntries(admins.map(a => [a.id, a.role]))
  )

  return (
    <PageWrapper className="flex flex-col gap-6 p-[20px]">
      {/* Page heading */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-[#0F6E56]">PLATFORM</p>
        <h1 className="text-2xl font-bold text-[#212123]">Settings</h1>
        <p className="text-sm text-[#333234]">
          Commission, platform rules, and admin team.
        </p>
      </div>

      {/* Commission rate */}
      <Card>
        <CardHeader>
          <CardTitle>Commission rate</CardTitle>
        </CardHeader>
        <div className="border mx-4"/>
        <CardContent className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[#4A4451]">
            PLATFORM FEE ({platformFee}%)
          </label>
          <div className="flex items-center gap-2">
            <NumberStepper value={platformFee} onChange={setPlatformFee} min={0} max={100} />
            <Button size="sm" className="bg-[#0F6E56] text-[#FFFF] hover:[#D3D3D3]">
              Save
            </Button>
          </div>
          <p className="text-xs text-[#4A4451]">
            Applied to every paid ticket at checkout. Changing this affects new events only.
          </p>
        </CardContent>
      </Card>

      
{/* // Platform configuration — currency & payout defaults  */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
        </CardHeader>
        <div className="border mx-4"/>
        <CardContent className="flex flex-col gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6a686d]">CURRENCY</label>
            <Select value={currency} onValueChange={(val) => setCurrency(val ?? '')}>
              <SelectTrigger className="w-49.75">
                <SelectValue placeholder="Choose your currency"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Naira">Naira (₦)</SelectItem>
                <SelectItem value="Dollar">Dollar ($)</SelectItem>
                <SelectItem value="Cedis">Cedis (₵)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6a686d]">
              PAYOUT HOLD AFTER EVENTS
            </label>
            <Select value={payoutHold} onValueChange={(val) => setPayoutHold(val ?? '')}>
              <SelectTrigger className="w-49.75">
                <SelectValue placeholder="Processing"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3 days">3 Days</SelectItem>
                <SelectItem value="5 days">5 Days</SelectItem>
                <SelectItem value="7 days">7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
       

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#6a686d]">Auto-approve events</p>
              <p className="text-xs text-[#4A4451]">
                Skip manual review and publish events instantly
              </p>
            </div>
            <ToggleSwitch checked={autoApproveEvents} onCheckedChange={setAutoApproveEvents}  />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6a686d] font-bold">Auto-approve promotions</p>
              <p className="text-xs text-[#4A4451]">
                Publish paid promotions without review
              </p>
            </div>
            <ToggleSwitch checked={autoApprovePromotions} onCheckedChange={setAutoApprovePromotions} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6a686d] font-bold">Maintenance mode</p>
              <p className="text-[#4A4451]">
                Show a maintenance page to all users
              </p>
            </div>
            <ToggleSwitch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>
        </CardContent>
      </Card>

      {/* Admin, Teams & Roles */}
      <Card size="sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="font-extrabold text-[#5f5c63]">Admin, Teams &amp; Roles</CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="size-4" />
            Invite Admin
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 mx-4">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-2/5" />
              <col className="w-2/5" />
              <col className="w-1/5" />
            </colgroup>
            <thead>
              <tr className="border-t text-left text-xs text-[#d5d3d9]">
                <th className="px-(--card-spacing) py-2 font-medium">Name</th>
                <th className="px-(--card-spacing) py-2 font-medium">Email</th>
                <th className="px-(--card-spacing) py-2 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td className="px-(--card-spacing) py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-[#1A1523] text-xs">
                          {initials(admin.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-(--card-spacing) py-3 text-[#58545f]">
                    {admin.email}
                  </td>
                  <td className="px-(--card-spacing) py-3">
                    {memberRoles[admin.id] === "owner" ? (
                      <Badge className="w-22 items-center justify-center gap-1 border-transparent bg-[#E4F1EB] text-[#0F6E56]">
                       <DotIcon className="stroke-9" />
                        OWNER
                      </Badge>
                    ) : (
                      <Select
                        value={memberRoles[admin.id]}
                        onValueChange={value =>
                          setMemberRoles(prev => ({ ...prev, [admin.id]: value as Role }))
                        }
                      >
                        <SelectTrigger size="sm" className="w-22">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}