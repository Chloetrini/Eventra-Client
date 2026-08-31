import { useEffect, useState } from "react"
import { Plus, DotIcon, Trash2, ShieldAlert } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import PageWrapper from "@/components/page-wrapper"
import { useAuth, type User } from "@/context/auth.context"
import { useUpdateProfile } from "@/hooks/use-profile"
import { useAdminTeam, useDeleteAdmin, useInviteAdmin, useUpdateAdminRole } from "@/hooks/use-admin-team"
import { usePlatformSettings, useUpdatePlatformSettings } from "@/hooks/use-platform-settings"
import type { AdminTier } from "@/types/admin-settings"

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

function initials(name: string) {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
}

function InviteAdminDialog() {
  const [open, setOpen] = useState(false)
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [adminRole, setAdminRole] = useState<AdminTier>("support")
  const { mutate, isPending } = useInviteAdmin()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate(
      { fullname, email, adminRole },
      {
        onSuccess: () => {
          toast.success("Invite sent.")
          setOpen(false)
          setFullname("")
          setEmail("")
          setAdminRole("support")
        },
        onError: (err: Error) => {
          toast.error(err.message || "Could not send invite.")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            <Plus className="size-4" />
            Invite Admin
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-fullname">Full name</Label>
            <Input
              id="invite-fullname"
              value={fullname}
              onChange={e => setFullname(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={adminRole} onValueChange={val => setAdminRole(val as AdminTier)}>
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="bg-[#0F6E56] text-white hover:bg-[#0F6E56]/90">
              {isPending ? "Sending..." : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteAdminDialog({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useDeleteAdmin()

  const onConfirm = () => {
    mutate(id, {
      onSuccess: () => {
        toast.success(`${name} removed.`)
        setOpen(false)
      },
      onError: (err: Error) => {
        toast.error(err.message || "Could not remove this admin.")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={`Remove ${name}`}
            className="p-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove {name}?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This permanently removes their admin account and signs them out of any active session. This can't be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? "Removing..." : "Remove admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function PlatformSettings() {
 const { user, setUser } = useAuth()
  const updateProfileMutation = useUpdateProfile()

  const [adminToggles, setAdminToggles] = useState({
    approvals: true,
    refunds: true,
    reports: true,
  })

  useEffect(() => {
    if (user?.adminNotificationPreferences) {
      setAdminToggles(user.adminNotificationPreferences)
    }
  }, [user?.adminNotificationPreferences])

  const handleAdminNotificationToggle = (
    key: "approvals" | "refunds" | "reports",
    checked: boolean
  ) => {
    console.log("TOGGLE CLICKED:", key, "new value:", checked, "current adminToggles:", adminToggles);
  const previous = adminToggles
  const next = { ...adminToggles, [key]: checked }
  setAdminToggles(next)

  console.log("SENDING TO BACKEND:", { adminNotificationPreferences: { [key]: checked } });
     updateProfileMutation.mutate(
      { adminNotificationPreferences: { [key]: checked } },
      {
        onSuccess: (updatedUser) => {
          setUser(updatedUser as User)
        },
        onError: (err: Error) => {
          setAdminToggles(previous)
          toast.error(err.message || "Could not save this preference")
        },
      }
    )
  }
  // Owner-tier only — mirrors requireAdminTier('owner') on every
  // /admin/settings/* route on the backend (see admin.routes.ts). A
  // missing adminRole is treated as owner, same default the backend uses
  // for admin accounts that predate this field.
  const isOwner = user?.role === "admin" && (user.adminRole ?? "owner") === "owner"

  const { data: settings } = usePlatformSettings()
  const { mutate: updateSettings, isPending: isSavingSettings } = useUpdatePlatformSettings()

  const [platformFee, setPlatformFee] = useState(3)
  const [currency, setCurrency] = useState("")
  const [payoutHold, setPayoutHold] = useState("")

  // The fetched row is the source of truth; local state only tracks
  // in-progress edits (the fee stepper + its own Save button) so a save
  // elsewhere on the page can't clobber what the admin is mid-typing.
  useEffect(() => {
    if (!settings) return
    setPlatformFee(settings.platformFeePercent)
    setCurrency(settings.currency)
    setPayoutHold(settings.payoutHold)
  }, [settings])

  const { data: admins = [] } = useAdminTeam()
  const { mutate: updateRole } = useUpdateAdminRole()

  const saveFee = () => {
    updateSettings(
      { platformFeePercent: platformFee },
      {
        onSuccess: () => toast.success("Platform fee updated."),
        onError: (err: Error) => toast.error(err.message || "Could not save platform fee."),
      }
    )
  }

  // A currency change re-converts every stored money field platform-wide
  // (see updatePlatformSettings on the backend) — firing it twice in quick
  // succession (a double-click, or the Select re-firing onValueChange
  // while the first request is still in flight) used to be able to apply
  // a second conversion on top of the first before the settings doc had
  // even saved the new currency, compounding the rate instead of just
  // switching it. The backend now rejects an overlapping change outright,
  // but bailing out here too means it never even gets sent while one is
  // already in flight — see the `disabled={isSavingSettings}` on the
  // Select below for the other half of this guard.
  const onCurrencyChange = (val: string) => {
    if (isSavingSettings) return
    setCurrency(val)
    updateSettings(
      { currency: val as "Naira" | "Dollar" | "Cedis" },
      {
        onError: (err: Error) => {
          toast.error(err.message || "Could not save currency.")
          // Roll the dropdown back to whatever's actually saved — leaving
          // it on the failed target would show a currency the backend
          // never actually switched to.
          setCurrency(settings?.currency ?? "")
        },
      }
    )
  }

  const onPayoutHoldChange = (val: string) => {
    setPayoutHold(val)
    updateSettings(
      { payoutHold: val as "3 days" | "5 days" | "7 days" },
      { onError: (err: Error) => toast.error(err.message || "Could not save payout hold.") }
    )
  }

  const onAutoApproveEventsChange = (checked: boolean) => {
    updateSettings(
      { autoApproveEvents: checked },
      { onError: (err: Error) => toast.error(err.message || "Could not save.") }
    )
  }

  const onAutoApprovePromotionsChange = (checked: boolean) => {
    updateSettings(
      { autoApprovePromotions: checked },
      { onError: (err: Error) => toast.error(err.message || "Could not save.") }
    )
  }

  const onMaintenanceModeChange = (checked: boolean) => {
    updateSettings(
      { maintenanceMode: checked },
      { onError: (err: Error) => toast.error(err.message || "Could not save.") }
    )
  }

  if (!isOwner) {
    return (
      <PageWrapper className="flex flex-col gap-6 p-[20px]">
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border py-24 text-center">
          <ShieldAlert className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Owner access only</p>
          <p className="max-w-sm text-xs text-muted-foreground">
            Only the account owner can view and manage platform settings.
          </p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="flex flex-col gap-6 p-[20px]">
      {/* Page heading */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-[#0F6E56] dark:text-[#4ADE80]">PLATFORM</p>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
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
          <label className="text-xs font-medium text-muted-foreground">
            PLATFORM FEE ({platformFee}%)
          </label>
          <div className="flex items-center gap-2">
            <NumberStepper value={platformFee} onChange={setPlatformFee} min={0} max={100} />
            <Button size="sm" onClick={saveFee} className="bg-[#0F6E56] text-white hover:bg-[#0F6E56]/90">
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
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
            <label className="text-xs font-medium text-muted-foreground">CURRENCY</label>
            <Select value={currency} onValueChange={(val) => onCurrencyChange(val ?? '')} disabled={isSavingSettings}>
              <SelectTrigger className="w-49.75">
                <SelectValue placeholder="Choose your currency"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Naira">Naira (₦)</SelectItem>
                <SelectItem value="Dollar">Dollar ($)</SelectItem>
                <SelectItem value="Cedis">Cedis (₵)</SelectItem>
              </SelectContent>
            </Select>
            {isSavingSettings && (
              <p className="text-xs text-muted-foreground">Saving…</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              PAYOUT HOLD AFTER EVENTS
            </label>
            <Select value={payoutHold} onValueChange={(val) => onPayoutHoldChange(val ?? '')}>
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
              <p className="text-sm font-bold text-foreground">Auto-approve events</p>
              <p className="text-xs text-muted-foreground">
                Skip manual review and publish events instantly
              </p>
            </div>
            <ToggleSwitch checked={settings?.autoApproveEvents ?? false} onCheckedChange={onAutoApproveEventsChange}  />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-foreground font-bold">Auto-approve promotions</p>
              <p className="text-xs text-muted-foreground">
                Publish paid promotions without review
              </p>
            </div>
            <ToggleSwitch checked={settings?.autoApprovePromotions ?? false} onCheckedChange={onAutoApprovePromotionsChange} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-foreground font-bold">Maintenance mode</p>
              <p className="text-muted-foreground">
                Show a maintenance page to all users
              </p>
            </div>
                       <ToggleSwitch checked={settings?.maintenanceMode ?? false} onCheckedChange={onMaintenanceModeChange} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <div className="border mx-4"/>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-foreground">Approvals</p>
              <p className="text-xs text-muted-foreground">
                New events, organizers, or promotions awaiting review
              </p>
            </div>
            <ToggleSwitch
              checked={adminToggles.approvals}
              onCheckedChange={(checked) => handleAdminNotificationToggle("approvals", checked)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-foreground">Refunds</p>
              <p className="text-xs text-muted-foreground">
                A new refund request needs review
              </p>
            </div>
            <ToggleSwitch
              checked={adminToggles.refunds}
              onCheckedChange={(checked) => handleAdminNotificationToggle("refunds", checked)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-foreground">Reports</p>
              <p className="text-xs text-muted-foreground">
                An attendee reported an event or organizer
              </p>
            </div>
            <ToggleSwitch
              checked={adminToggles.reports}
              onCheckedChange={(checked) => handleAdminNotificationToggle("reports", checked)}
            />
          </div>
        </CardContent>
      </Card>


      {/* Admin, Teams & Roles */}
      <Card size="sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="font-extrabold text-foreground">Admin, Teams &amp; Roles</CardTitle>
          <InviteAdminDialog />
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 mx-4">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-2/5" />
              <col className="w-2/5" />
              <col className="w-1/6" />
              <col className="w-10" />
            </colgroup>
            <thead>
              <tr className="border-t text-left text-xs text-muted-foreground">
                <th className="px-(--card-spacing) py-2 font-medium">Name</th>
                <th className="px-(--card-spacing) py-2 font-medium">Email</th>
                <th className="px-(--card-spacing) py-2 font-medium">Role</th>
                <th className="px-(--card-spacing) py-2 font-medium" aria-label="Actions" />
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
                  <td className="px-(--card-spacing) py-3 text-muted-foreground">
                    {admin.email}
                  </td>
                  <td className="px-(--card-spacing) py-3">
                    {admin.role === "owner" ? (
                      <Badge className="w-22 items-center justify-center gap-1 border-transparent bg-[#E4F1EB] dark:bg-[#0F6E56]/15 text-[#0F6E56] dark:text-[#4ADE80]">
                       <DotIcon className="stroke-9" />
                        OWNER
                      </Badge>
                    ) : (
                      <Select
                        value={admin.role}
                        onValueChange={value =>
                          updateRole(
                            { id: admin.id, adminRole: value as AdminTier },
                            {
                              onError: (err: Error) => toast.error(err.message || "Could not update role."),
                            }
                          )
                        }
                      >
                        <SelectTrigger size="sm" className="w-22">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                  <td className="px-(--card-spacing) py-3 text-right">
                    {admin.role !== "owner" && <DeleteAdminDialog id={admin.id} name={admin.name} />}
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
