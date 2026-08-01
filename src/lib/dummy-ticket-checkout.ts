export type TicketCheckout = {
    _id?: string
    eventImage?: string
    eventName?: string
    eventDateTime: string
    eventVenue?: string
    orderID?: string
    ticketDetails: {
            type: string
            unitPrice: number
            quantity: number
        }[]
}

const dummyTicketCheckout = [
    {
        "_id": "1",
        "eventImage": "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1784966970/dummy_ticket_image_fbhjcj.png",
        "eventName": "Afrobeats Nigeria",
        "eventDateTime": "2026-08-15T18:00:00.000Z",
        "eventVenue": "Muri Okunola Park",
        "orderID": "TEST.111.000",
        "ticketDetails": [
            {
                type: "Regular",
                unitPrice: 15000,
                quantity: 2,
            },
            {
                type: "VIP",
                unitPrice: 30000,
                quantity: 1
            }
        ],

    },
    {
        "_id": "2",
        "eventImage": "https://res.cloudinary.com/dyeh9qvbl/image/upload/v1775900460/my_image_uploads/tyysgv6b26g59bwbfels.jpg",
        "eventName": "Afrobeats Nigeria",
        "eventDateTime": "2026-08-15T18:00:00.000Z",
        "eventVenue": "Muri Okunola Park",
        "orderID": "TEST.222.888",
        "ticketDetails": [
            {
                type: "Regular",
                unitPrice: 15000,
                quantity: 2,
            },
            {
                type: "VIP",
                unitPrice: 30000,
                quantity: 1
            }
        ],

    }
]

export const getEventById = async (_id: string): Promise<TicketCheckout | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const ticketCheckout = dummyTicketCheckout.find((ticketCheckout) => ticketCheckout._id === _id)
            resolve(ticketCheckout ?? null)
        }, 1000)
    })
}