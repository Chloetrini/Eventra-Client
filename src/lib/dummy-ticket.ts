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
    ticketDetails: {
        type: string
        unitPrice: number
        quantity: number
    }[]
    QRcode: string
    refundPolicy: {
        type: "refundable" | "non-refundable" | "free-cancel"
        note: string
    }
}

const dummyTicket: Ticket[] = [
    {
        _id: "1",
        eventName: "Afrobeats Nigeria",
        category: ["Concert"],
        eventDateTime: "2026-08-15T18:00:00.000Z",
        eventEntrance: "Gate B",
        eventVenue: "Muri Okunola Park",
        referenceCode: "REF-AFR-001",
        orderID: "TEST.111.000",
        holderName: "Ada Okafor",
        ticketDetails: [
            {
                type: "Regular",
                unitPrice: 15000,
                quantity: 2,
            },
            {
                type: "VIP",
                unitPrice: 30000,
                quantity: 1,
            },
        ],
        QRcode: "",
        refundPolicy: {
            type: "refundable",
            note: "Refund available up to 48 hours before the event.",
        },
    },
    {
        _id: "2",
        eventName: "Afrobeats Nigeria",
        category: ["Party"],
        eventDateTime: "2026-08-15T18:00:00.000Z",
        eventEntrance: "Main Entrance",
        eventVenue: "Muri Okunola Park",
        referenceCode: "REF-AFR-002",
        orderID: "TEST.222.888",
        holderName: "Jane Smith",
        ticketDetails: [
            {
                type: "Regular",
                unitPrice: 15000,
                quantity: 2,
            },
            {
                type: "VIP",
                unitPrice: 30000,
                quantity: 1,
            },
        ],
        QRcode: "",
        refundPolicy: {
            type: "non-refundable",
            note: "This ticket cannot be refunded after purchase.",
        },
    },
]

export const getTicketById = async (_id: string): Promise<Ticket | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const ticket = dummyTicket.find((ticket) => ticket._id === _id)
            resolve(ticket ?? null)
        }, 1000)
    })
}