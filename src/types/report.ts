
export interface ReportComment {
    id: string;
    text: string;
    reporterName: string;
    timeAgo: string
}

interface BaseFlag {
    id: string;
    reportCount: number;
    reason: string;
    comments: ReportComment[]
}

export interface EventFlag extends BaseFlag {
    type: "EVENT";
    eventTitle: string;
    organizer: string;
    category: string;
    when: string;
    venue: string;
    ticketPrice: number
}

export interface UserFlag extends BaseFlag {
    type: "USER";
    username: string;
    joined: string;
    orders: number
}

export type Flag = EventFlag | UserFlag

export interface AuditLogEntry {
    id: string;
    action: string;
    target: string;
    amount?: string;
    admin: string;
    when: string
}