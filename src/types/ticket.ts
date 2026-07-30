export type Ticket = {
    _id?: string
    eventName?: string
    category: string[]
    eventDateTime: string
    eventEntrance: string
    eventVenue?: string
    referenceCode: string
    orderID?: string
    holderName: string
    admits?: string
    ticketDetails: {
        type: string
        unitPrice: number
        quantity: number
    }[]
    qrImageUrl: string
    refundPolicy: {
        type: "refundable" | "non-refundable" | "free-cancel"
        note: string
    }
}
