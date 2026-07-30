import type { Ticket } from "@/types/ticket";

export const dummyTicket: Ticket[] = [
  {
    _id: "1",
    category: ["Concert · Afrobeats"],
    eventName: "Afrobeats Night Market",
    ticketDetails: [
      {
        type: "Regular",
        unitPrice: 15000,
        quantity: 2,
      },
    ],
    eventDateTime: "2026-08-15T18:00:00.000Z",
    eventEntrance: "Gate B",
    eventVenue: "Muri Okunola Park, VI",
    orderID: "0001",
    referenceCode: "EVT-8FQ2",
    holderName: "Ada Okafor",
    admits: "Admit 1",
    qrImageUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=TICKET-0001-EVT-8FQ2",
    // transferable: false,
    refundPolicy: {
      type: "refundable",
      note: "Refunds allowed until 3 days before the event.",
    },
  },
  {
    _id: "2",
    category: ["Party"],
    eventName: "Amapiano All Night",
    ticketDetails: [
      {
        type: "VIP",
        unitPrice: 15000,
        quantity: 2,
      },
    ],
    eventDateTime: "2026-08-15T18:00:00.000Z",
    eventEntrance: "Main entrance",
    eventVenue: "Hard Rock Cafe, VI",
    orderID: "0001",
    referenceCode: "EVT-8FQ2",
    holderName: "Ada Okafor",
    admits: "Admit 1",
    qrImageUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=TICKET-0002-EVT-8FQ2",
    // transferable: false,
    refundPolicy: {
      type: "non-refundable",
      note: "Non-refundable",
    },
  },
  {
    _id: "3",
    category: ["Tech · Meetup"],
    eventName: "Lagos Frontend Meetup",
    ticketDetails: [
      {
        type: "Free",
        unitPrice: 15000,
        quantity: 2,
      },
    ],
    eventDateTime: "2026-08-15T18:00:00.000Z",
    eventEntrance: "Reception",
    eventVenue: "Zone Tech Park, Yaba",
    orderID: "0001",
    referenceCode: "EVT-8FQ2",
    holderName: "Ada Okafor",
    admits: "Admit 1",
    qrImageUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=TICKET-0003-EVT-8FQ2",
    // transferable: false,
    refundPolicy: {
      type: "free-cancel",
      note: "Free event - cancel anytime to release your spot.",
    },
  },
];

// const dummyTicket: Ticket[] = [
//     {
//         _id: "1",
//         eventName: "Afrobeats Nigeria",
//         category: ["Concert"],
//         eventDateTime: "2026-08-15T18:00:00.000Z",
//         eventEntrance: "Gate B",
//         eventVenue: "Muri Okunola Park",
//         referenceCode: "REF-AFR-001",
//         orderID: "TEST.111.000",
//         holderName: "Ada Okafor",
//         ticketDetails: [
//             {
//                 type: "Regular",
//                 unitPrice: 15000,
//                 quantity: 2,
//             },
//             {
//                 type: "VIP",
//                 unitPrice: 30000,
//                 quantity: 1,
//             },
//         ],
//         QRcode: "",
//         refundPolicy: {
//             type: "refundable",
//             note: "Refund available up to 48 hours before the event.",
//         },
//     },
//     {
//         _id: "2",
//         eventName: "Afrobeats Nigeria",
//         category: ["Party"],
//         eventDateTime: "2026-08-15T18:00:00.000Z",
//         eventEntrance: "Main Entrance",
//         eventVenue: "Muri Okunola Park",
//         referenceCode: "REF-AFR-002",
//         orderID: "TEST.222.888",
//         holderName: "Jane Smith",
//         ticketDetails: [
//             {
//                 type: "Regular",
//                 unitPrice: 15000,
//                 quantity: 2,
//             },
//             {
//                 type: "VIP",
//                 unitPrice: 30000,
//                 quantity: 1,
//             },
//         ],
//         QRcode: "",
//         refundPolicy: {
//             type: "non-refundable",
//             note: "This ticket cannot be refunded after purchase.",
//         },
//     },
// ]

export const getTicketById = async (_id: string): Promise<Ticket | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const ticket = dummyTicket.find((ticket) => ticket._id === _id)
            resolve(ticket ?? null)
        }, 1000)
    })
}
