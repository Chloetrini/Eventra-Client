export interface Ticket {
    id: string
    category: string
    title: string
    status: "Regular" | "VIP" | "Free"
    // date: string
    // time: string
    eventDateTime:string,
    entryPoint: string
    venue: string
    referenceCode: string
    ticketId: string
    holderName: string
    admits: string
    qrImageUrl: string
    // transferable: boolean
    refundPolicy: {
        type: "refundable" | "non-refundable" | "free-cancel"
        note: string
    }

}