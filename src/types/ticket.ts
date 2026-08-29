// export interface Ticket {
//     id: string
//     category: string
//     title: string //eventname
//     status: "Regular" | "VIP" | "Free" //ticketDetails
//     // date: string
//     // time: string
//     eventDateTime:string,
//     entryPoint: string //evententrance
//     venue: string //eventvenue
//     referenceCode: string
//     ticketId: string //orderId
//     holderName: string
//     admits: string
//     qrImageUrl: string 
//     // transferable: boolean
//     refundPolicy: {
//         type: "refundable" | "non-refundable" | "free-cancel"
//         note: string
//     }

// }

export type Ticket = {
    _id?: string
    eventName?: string
    admits?: string 
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
    qrImageUrl: string
    refundPolicy: {
        type: "refundable" | "non-refundable" | "free-cancel"
        note: string
    }
    // hasPendingRefundRequest: boolean
}
