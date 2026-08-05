import type { Event } from "@/types/event-types";
import { daysFromNow, thisWeekend } from "@/lib/utils";

export const MOCK_EVENTS: Event[] = [
  {
    "_id": "1",
    "slug": "afrobeats-night-market",
    "title": "Afrobeats Night Market",
    "type": "paid",
    "category": "Concerts",
    "subcategory": "Afrobeats",
    "description": "Afrobeats Night Market brings an unforgettable experience to Victoria Island. Join us at Muri Okunola Park for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Muri Okunola Park",
      "address": "Ozumba Mbadiwe Ave, VI",
      "city": "Victoria Island",
      "state": "Lagos"
    },
    "startDate": daysFromNow(0, 18),
    "createdAt": daysFromNow(0, 18),
    "minPrice": 15000,
    "coverImage": "https://picsum.photos/seed/afrobeats/600/450",
    "isPromoted": true,
    "trendingScore": 98,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": "Live music",
    "tags": [
      "Concerts",
      "Afrobeats",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      }
    ],
    "lineupCount": 1,
    "organizer": [
      {
        "name": "Eko Live",
        "initials": "EL",
        "isVerified": true,
        "totalEvents": 42,
        "followers": 12800
      }
    ],
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "amapiano-all-night",
      "jos-plateau-jazz-evening",
      "sunset-rooftop-party"
    ]
  },
  {
    "_id": "2",
    "slug": "amapiano-all-night",
    "title": "Amapiano All Night",
    "type": "paid",
    "category": "Parties",
    "description": "Amapiano All Night brings an unforgettable experience to Victoria Island. Join us at Hard Rock Cafe for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Hard Rock Cafe",
      "address": "Landmark, VI",
      "city": "Victoria Island",
      "state": "Lagos"
    },
    "startDate": daysFromNow(0, 22),
    "createdAt": daysFromNow(0, 22),
    "minPrice": 8000,
    "coverImage": "https://picsum.photos/seed/amapiano/600/450",
    "isPromoted": false,
    "trendingScore": 91,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": "DJ sets",
    "tags": [
      "Parties",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      },
      {
        "name": "Ayra Live Band",
        "role": "Live performance"
      }
    ],
    "lineupCount": 2,
    "organizer": {
      "name": "Lagos Sounds",
      "initials": "LS",
      "isVerified": true,
      "totalEvents": 48,
      "followers": 9600
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "jos-plateau-jazz-evening",
      "sunset-rooftop-party"
    ]
  },
  {
    "_id": "3",
    "slug": "jos-plateau-jazz-evening",
    "title": "Jos Plateau Jazz Evening",
    "type": "free",
    "category": "Concerts",
    "subcategory": "Jazz",
    "description": "Jos Plateau Jazz Evening brings an unforgettable experience to Jos. Join us at Hill Station Hotel for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Hill Station Hotel",
      "address": "Tudun Wada, Jos",
      "city": "Jos",
      "state": "Plateau"
    },
    "startDate": daysFromNow(0, 19),
    "createdAt": daysFromNow(0, 19),
    "minPrice": 0,
    "coverImage": "https://picsum.photos/seed/jazz/600/450",
    "isPromoted": false,
    "trendingScore": 61,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": "Live music",
    "tags": [
      "Concerts",
      "Jazz",
      "Lagos"
    ],
    "lineup": [],
    "lineupCount": 0,
    "organizer": {
      "name": "The Guild Events",
      "initials": "GE",
      "isVerified": false,
      "totalEvents": 37,
      "followers": 4200
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "sunset-rooftop-party"
    ]
  },
  {
    "_id": "4",
    "slug": "sunset-rooftop-party",
    "title": "Sunset Rooftop Party",
    "type": "paid",
    "category": "Parties",
    "description": "Sunset Rooftop Party brings an unforgettable experience to Victoria Island. Join us at Eko Hotel for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Eko Hotel",
      "address": "Adetokunbo Ademola St, VI",
      "city": "Victoria Island",
      "state": "Lagos"
    },
    "startDate": thisWeekend(17),
    "createdAt": thisWeekend(17),
    "minPrice": 12500,
    "coverImage": "https://picsum.photos/seed/rooftop/600/450",
    "isPromoted": false,
    "trendingScore": 88,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": "DJ sets",
    "tags": [
      "Parties",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      }
    ],
    "lineupCount": 1,
    "organizer": {
      "name": "Ventures Africa",
      "initials": "VA",
      "isVerified": true,
      "totalEvents": 33,
      "followers": 7100
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "5",
    "slug": "calabar-carnival",
    "title": "Calabar Carnival",
    "type": "paid",
    "category": "Arts & Theatre",
    "description": "Calabar Carnival brings an unforgettable experience to Calabar. Join us at Cultural Centre for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Cultural Centre",
      "address": "Calabar",
      "city": "Calabar",
      "state": "Cross River"
    },
    "startDate": thisWeekend(16),
    "createdAt": thisWeekend(16),
    "minPrice": 3000,
    "coverImage": "https://picsum.photos/seed/carnival/600/450",
    "isPromoted": false,
    "trendingScore": 84,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": null,
    "tags": [
      "Arts & Theatre",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      },
      {
        "name": "Ayra Live Band",
        "role": "Live performance"
      }
    ],
    "lineupCount": 2,
    "organizer": {
      "name": "Culture Collective",
      "initials": "CC",
      "isVerified": true,
      "totalEvents": 14,
      "followers": 3300
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "6",
    "slug": "detty-december-party",
    "title": "Detty December Party",
    "type": "paid",
    "category": "Parties",
    "description": "Detty December Party brings an unforgettable experience to Ikoyi. Join us at Five Cowries Terminal for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Five Cowries Terminal",
      "address": "Ikoyi",
      "city": "Ikoyi",
      "state": "Lagos"
    },
    "startDate": thisWeekend(22),
    "createdAt": thisWeekend(22),
    "minPrice": 25000,
    "coverImage": "https://picsum.photos/seed/boat/600/450",
    "isPromoted": false,
    "trendingScore": 86,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": "DJ sets",
    "tags": [
      "Parties",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      },
      {
        "name": "Ayra Live Band",
        "role": "Live performance"
      },
      {
        "name": "Amapiano Collective",
        "role": "Special guests"
      }
    ],
    "lineupCount": 3,
    "organizer": {
      "name": "Naija Nights",
      "initials": "NN",
      "isVerified": true,
      "totalEvents": 10,
      "followers": 2100
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "7",
    "slug": "abuja-tech-week",
    "title": "Abuja Tech Week",
    "type": "paid",
    "category": "Conferences",
    "subcategory": "Tech",
    "description": "Abuja Tech Week brings an unforgettable experience to Maitama. Join us at Transcorp Hilton for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Transcorp Hilton",
      "address": "Maitama",
      "city": "Maitama",
      "state": "FCT - Abuja"
    },
    "startDate": daysFromNow(4, 9),
    "createdAt": daysFromNow(4, 9),
    "minPrice": 45000,
    "coverImage": "https://picsum.photos/seed/techweek/600/450",
    "isPromoted": false,
    "trendingScore": 80,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": null,
    "tags": [
      "Conferences",
      "Tech",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      }
    ],
    "lineupCount": 1,
    "organizer": {
      "name": "Eko Live",
      "initials": "EL",
      "isVerified": true,
      "totalEvents": 42,
      "followers": 12800
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "8",
    "slug": "comedy-central-live",
    "title": "Comedy Central Live",
    "type": "paid",
    "category": "Comedy",
    "description": "Comedy Central Live brings an unforgettable experience to Port Harcourt. Join us at Genesis Centre for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Genesis Centre",
      "address": "Port Harcourt",
      "city": "Port Harcourt",
      "state": "Rivers"
    },
    "startDate": daysFromNow(6, 20),
    "createdAt": daysFromNow(6, 20),
    "minPrice": 5000,
    "coverImage": "https://picsum.photos/seed/comedy/600/450",
    "isPromoted": false,
    "trendingScore": 76,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": null,
    "tags": [
      "Comedy",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      },
      {
        "name": "Ayra Live Band",
        "role": "Live performance"
      }
    ],
    "lineupCount": 2, 
    "organizer": {
      "name": "Lagos Sounds",
      "initials": "LS",
      "isVerified": true,
      "totalEvents": 48,
      "followers": 9600
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "9",
    "slug": "kano-startup-mixer",
    "title": "Kano Startup Mixer",
    "type": "free",
    "category": "Tech",
    "description": "Kano Startup Mixer brings an unforgettable experience to Kano. Join us at Kano Innovation Hub for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Kano Innovation Hub",
      "address": "Kano",
      "city": "Kano",
      "state": "Kano"
    },
    "startDate": daysFromNow(5, 16),
    "createdAt": daysFromNow(5, 16),
    "minPrice": 0,
    "coverImage": "https://picsum.photos/seed/startup/600/450",
    "isPromoted": false,
    "trendingScore": 70,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": null,
    "tags": [
      "Tech",
      "Lagos"
    ],
    "lineup": [],
    "lineupCount": 0,
    "organizer": {
      "name": "The Guild Events",
      "initials": "GE",
      "isVerified": false,
      "totalEvents": 37,
      "followers": 4200
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "10",
    "slug": "lagos-jollof-festival",
    "title": "Lagos Jollof Festival",
    "type": "free",
    "category": "Food & Drink",
    "description": "Lagos Jollof Festival brings an unforgettable experience to Oniru. Join us at Landmark Beach for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Landmark Beach",
      "address": "Oniru",
      "city": "Oniru",
      "state": "Lagos"
    },
    "startDate": daysFromNow(15, 12),
    "createdAt": daysFromNow(15, 12),
    "minPrice": 0,
    "coverImage": "https://picsum.photos/seed/jollof/600/450",
    "isPromoted": false,
    "trendingScore": 74,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": "Live music",
    "tags": [
      "Food & Drink",
      "Lagos"
    ],
    "lineup": [],
    "lineupCount": 0,
    "organizer": {
      "name": "Ventures Africa",
      "initials": "VA",
      "isVerified": true,
      "totalEvents": 33,
      "followers": 7100
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "11",
    "slug": "high-life-and-chill",
    "title": "High Life and Chill",
    "type": "paid",
    "category": "Parties",
    "description": "High Life and Chill brings an unforgettable experience to Surulere. Join us at Ojez Restaurant for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Ojez Restaurant",
      "address": "Surulere",
      "city": "Surulere",
      "state": "Lagos"
    },
    "startDate": daysFromNow(18, 21),
    "createdAt": daysFromNow(18, 21),
    "minPrice": 3000,
    "coverImage": "https://picsum.photos/seed/highlife/600/450",
    "isPromoted": false,
    "trendingScore": 68,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": "Live band",
    "tags": [
      "Parties",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      },
      {
        "name": "Ayra Live Band",
        "role": "Live performance"
      }
    ],
    "lineupCount": 2,
    "organizer": {
      "name": "Culture Collective",
      "initials": "CC",
      "isVerified": true,
      "totalEvents": 14,
      "followers": 3300
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "12",
    "slug": "enugu-coal-city-marathon",
    "title": "Enugu Coal City Marathon",
    "type": "paid",
    "category": "Sports",
    "subcategory": "Athletics",
    "description": "Enugu Coal City Marathon brings an unforgettable experience to Enugu. Join us at Nnamdi Azikiwe Stadium for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Nnamdi Azikiwe Stadium",
      "address": "Enugu",
      "city": "Enugu",
      "state": "Enugu"
    },
    "startDate": daysFromNow(21, 7),
    "createdAt": daysFromNow(21, 7),
    "minPrice": 2500,
    "coverImage": "https://picsum.photos/seed/marathon/600/450",
    "isPromoted": false,
    "trendingScore": 66,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": null,
    "tags": [
      "Sports",
      "Athletics",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      },
      {
        "name": "Ayra Live Band",
        "role": "Live performance"
      },
      {
        "name": "Amapiano Collective",
        "role": "Special guests"
      }
    ],
    "lineupCount": 3,
    "organizer": {
      "name": "Naija Nights",
      "initials": "NN",
      "isVerified": true,
      "totalEvents": 10,
      "followers": 2100
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "13",
    "slug": "ibadan-book-and-arts-fair",
    "title": "Ibadan Book & Arts Fair",
    "type": "paid",
    "category": "Arts & Theatre",
    "description": "Ibadan Book & Arts Fair brings an unforgettable experience to Ibadan. Join us at Cultural Centre Mokola for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Cultural Centre Mokola",
      "address": "Ibadan",
      "city": "Ibadan",
      "state": "Oyo"
    },
    "startDate": daysFromNow(24, 10),
    "createdAt": daysFromNow(24, 10),
    "minPrice": 1500,
    "coverImage": "https://picsum.photos/seed/bookfair/600/450",
    "isPromoted": false,
    "trendingScore": 58,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": null,
    "tags": [
      "Arts & Theatre",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      }
    ],
    "lineupCount": 1,
    "organizer": {
      "name": "Eko Live",
      "initials": "EL",
      "isVerified": true,
      "totalEvents": 42,
      "followers": 12800
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "14",
    "slug": "sunday-league-final",
    "title": "Sunday League Final",
    "type": "paid",
    "category": "Sports",
    "subcategory": "Football",
    "description": "Sunday League Final brings an unforgettable experience to Ibadan. Join us at Lekan Salami Stadium for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Lekan Salami Stadium",
      "address": "Ibadan",
      "city": "Ibadan",
      "state": "Oyo"
    },
    "startDate": daysFromNow(45, 16),
    "createdAt": daysFromNow(45, 16),
    "minPrice": 2000,
    "coverImage": "https://picsum.photos/seed/football/600/450",
    "isPromoted": false,
    "trendingScore": 64,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": null,
    "tags": [
      "Sports",
      "Football",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      },
      {
        "name": "Ayra Live Band",
        "role": "Live performance"
      }
    ],
    "lineupCount": 2,
    "organizer": {
      "name": "Lagos Sounds",
      "initials": "LS",
      "isVerified": true,
      "totalEvents": 48,
      "followers": 9600
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "15",
    "slug": "kaduna-food-festival",
    "title": "Kaduna Food Festival",
    "type": "free",
    "category": "Food & Drink",
    "description": "Kaduna Food Festival brings an unforgettable experience to Kaduna. Join us at Murtala Square for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "Murtala Square",
      "address": "Kaduna",
      "city": "Kaduna",
      "state": "Kaduna"
    },
    "startDate": daysFromNow(52, 11),
    "createdAt": daysFromNow(52, 11),
    "minPrice": 0,
    "coverImage": "https://picsum.photos/seed/kadunafood/600/450",
    "isPromoted": false,
    "trendingScore": 55,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": "Live music",
    "tags": [
      "Food & Drink",
      "Lagos"
    ],
    "lineup": [],
    "lineupCount": 0,
    "organizer": {
      "name": "The Guild Events",
      "initials": "GE",
      "isVerified": false,
      "totalEvents": 37,
      "followers": 4200
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  },
  {
    "_id": "16",
    "slug": "benin-bronze-exhibition",
    "title": "Benin Bronze Exhibition",
    "type": "paid",
    "category": "Arts & Theatre",
    "description": "Benin Bronze Exhibition brings an unforgettable experience to Benin City. Join us at National Museum for a night packed with energy, community and great moments from start to finish.\n\nDoors open early — come through, grab your spot and settle in before things really get going.",
    "venue": {
      "name": "National Museum",
      "address": "Benin City",
      "city": "Benin City",
      "state": "Edo"
    },
    "startDate": daysFromNow(60, 10),
    "createdAt": daysFromNow(60, 10),
    "minPrice": 18000,
    "coverImage": "https://picsum.photos/seed/bronze/600/450",
    "isPromoted": false,
    "trendingScore": 52,
    "gatesOpenTime": "5:00 PM",
    "doorsCloseTime": "11:00 PM",
    "musicType": null,
    "tags": [
      "Arts & Theatre",
      "Lagos"
    ],
    "lineup": [
      {
        "name": "DJ Spinall",
        "role": "Headline set"
      }
    ],
    "lineupCount": 1,
    "organizer": {
      "name": "Ventures Africa",
      "initials": "VA",
      "isVerified": true,
      "totalEvents": 33,
      "followers": 7100
    },
    "goodToKnow": [
      "Refunds available until 3 days before the event.",
      "Each ticket has a unique QR code - one entry per ticket.",
      "Valid ID may be required at the gate.",
      "Rain or shine — the event goes on."
    ],
    "relatedEventSlugs": [
      "afrobeats-night-market",
      "amapiano-all-night",
      "jos-plateau-jazz-evening"
    ]
  }
];
