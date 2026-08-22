import {
  Ticket,
  CircleDollarSign,
  ShieldCheck,
  CalendarClock,
  CheckCircle2,
  Undo2,
  XCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/types/overview";

// Best-guess mapping against the Figma icon set — flag any mismatches
// and I'll swap the specific key.
export const ICON_MAP: Record<IconKey, LucideIcon> = {
  ticket: Ticket, // Gross ticket sales
  dollar: CircleDollarSign, // Platform revenue
  shield: ShieldCheck, // Held in escrow
  calendar: CalendarClock, // Active events
  check: CheckCircle2, // Recent activity: approved / verified
  undo: Undo2, // Recent activity: refund issued
  x: XCircle, // Recent activity: rejected
  sparkles: Sparkles, // Recent activity: promotion approved
};