import type { Flag, AuditLogEntry } from "@/types/report";

export const mockFlags: Flag[] = [
  {
    id: "flag-1",
    type: "EVENT",
    reportCount: 5,
    reason: "Suspected scam/misleading returns",
    eventTitle: "Get Rich Crypto Seminar",
    organizer: "Unknown limited",
    category: "Conference",
    when: "Sat 8 Mar",
    venue: "Zoom",
    ticketPrice: 25000,
    comments: [
      {
        id: "c1",
        text: 'Promises "300% returns in 2 weeks" — classic scam',
        reporterName: "Ada O.",
        timeAgo: "2h ago",
      },
      {
        id: "c2",
        text: "No real venue and no verifiable organizer info.",
        reporterName: "Musa I.",
        timeAgo: "4h ago",
      },
      {
        id: "c3",
        text: "Same organizer scammed people last year.",
        reporterName: "Chioma E.",
        timeAgo: "6h ago",
      },
      {
        id: "c4",
        text: 'Asked me to pay an extra "activation fee" off-platform',
        reporterName: "Tunde B.",
        timeAgo: "Yesterday",
      },
      {
        id: "c5",
        text: "Fake testimonials pasted into the description.",
        reporterName: "Grace J.",
        timeAgo: "Yesterday",
      },
    ],
  },
  {
    id: "flag-2",
    type: "USER",
    reportCount: 3,
    reason: "Spam and ticket scalping",
    username: "@fastmoney_ng",
    joined: "Feb 2026",
    orders: 2,
    comments: [
      {
        id: "c6",
        text: "Dming people to buy tickets at 3x face value.",
        reporterName: "Zainab Y.",
        timeAgo: "1h ago",
      },
      {
        id: "c7",
        text: "Spamming event comments with resale links.",
        reporterName: "Sam O.",
        timeAgo: "5h ago",
      },
      {
        id: "c8",
        text: "Reselling tickets against platform rules.",
        reporterName: "Kunle A.",
        timeAgo: "Yesterday",
      },
    ],
  },
];

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: "log-1",
    action: "Approved event",
    target: "Afroneats Night Market",
    admin: "Admin",
    when: "2h ago",
  },
  {
    id: "log-2",
    action: "Verified organizer",
    target: "Party Verse Ng",
    admin: "Admin",
    when: "8h ago",
  },
  {
    id: "log-3",
    action: "Issued refund",
    amount: "₦15,000",
    target: "Ada Okafor",
    admin: "Admin",
    when: "8h ago",
  },
  {
    id: "log-4",
    action: "Rejected event",
    target: "Crypto Riches Seminar",
    admin: "Admin",
    when: "8h ago",
  },
  {
    id: "log-5",
    action: "Released payout",
    amount: "₦1,37M",
    target: "Naija Comedy Co.",
    admin: "Admin",
    when: "8h ago",
  },
  {
    id: "log-6",
    action: "Suspended user",
    target: "@ticketflip",
    admin: "Admin",
    when: "8h ago",
  },
];