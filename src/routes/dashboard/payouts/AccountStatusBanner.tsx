import { Clock, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const AccountStatusBanner = ({ onDismiss }: { onDismiss: () => void }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#BBE0CF] bg-[#E4F1EB] px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-13 w-13 items-center justify-center rounded-md bg-[#FFFFFF]">
          <Clock className="h-4 w-4 bg-[#0F6E56] rounded-full text-[#FFFFFF]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[16px] font-semibold text-[#7A4E02]">Your account is under review</p>
            <Badge className="bg-[#FFFFFF] text-[#0F6E56] font-space text-xs w-18 h-7.5 rounded-xl">PENDING</Badge>
          </div>
          <p className="mt-0.5 text-[14px] text-[#4A4451]">
            We usually approve within a day. Free events can go live now, paid events unlock once you're verified.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button className="text-xs w-28 h-10">View status</Button>
        <button onClick={onDismiss} className="text-[#7A4E02]">
          <X className="h-4 w-4"/>
        </button>
      </div>
    </div>
  )
}