import type { EventTickets } from "@/types/ticket-tiers";

// Ticket tiers live in their own collection on the backend, keyed by event slug.
// One API call per event: GET /events/:slug/tickets  ->  EventTickets
export const MOCK_TICKETS: EventTickets[] = [
  {
    "eventSlug": "afrobeats-night-market",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 10000,
        "description": "Limited early bird",
        "originalPrice": 15000,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 15000,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 30000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "amapiano-all-night",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 3000,
        "description": "Limited early bird",
        "originalPrice": 8000,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 8000,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 16000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "jos-plateau-jazz-evening",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Free",
        "unitPrice": 0,
        "description": "Free admission",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": 5
      }
    ]
  },
  {
    "eventSlug": "sunset-rooftop-party",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 7500,
        "description": "Limited early bird",
        "originalPrice": 12500,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 12500,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 25000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "calabar-carnival",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 0,
        "description": "Limited early bird",
        "originalPrice": 3000,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 3000,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 6000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "detty-december-party",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 20000,
        "description": "Limited early bird",
        "originalPrice": 25000,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 25000,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 50000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "abuja-tech-week",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 40000,
        "description": "Limited early bird",
        "originalPrice": 45000,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 45000,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 90000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "comedy-central-live",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 0,
        "description": "Limited early bird",
        "originalPrice": 5000,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 5000,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 10000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "kano-startup-mixer",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Free",
        "unitPrice": 0,
        "description": "Free admission",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "lagos-jollof-festival",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Free",
        "unitPrice": 0,
        "description": "Free admission",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": 10
      }
    ]
  },
  {
    "eventSlug": "high-life-and-chill",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 0,
        "description": "Limited early bird",
        "originalPrice": 3000,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 3000,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 6000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "enugu-coal-city-marathon",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 0,
        "description": "Limited early bird",
        "originalPrice": 2500,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 2500,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 5000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "ibadan-book-and-arts-fair",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 0,
        "description": "Limited early bird",
        "originalPrice": 1500,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 1500,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 3000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "sunday-league-final",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 0,
        "description": "Limited early bird",
        "originalPrice": 2000,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 2000,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 4000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  },
  {
    "eventSlug": "kaduna-food-festival",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Free",
        "unitPrice": 0,
        "description": "Free admission",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": 10
      }
    ]
  },
  {
    "eventSlug": "benin-bronze-exhibition",
    "serviceFeePercent": 5,
    "tiers": [
      {
        "id": 1,
        "type": "Early Bird",
        "unitPrice": 13000,
        "description": "Limited early bird",
        "originalPrice": 18000,
        "availability": "sold out",
        "quantityLeft": null
      },
      {
        "id": 2,
        "type": "Regular",
        "unitPrice": 18000,
        "description": "Standard entry",
        "originalPrice": null,
        "availability": "scarce",
        "quantityLeft": 12
      },
      {
        "id": 3,
        "type": "VIP",
        "unitPrice": 36000,
        "description": "VIP access • perks",
        "originalPrice": null,
        "availability": "available",
        "quantityLeft": null
      }
    ]
  }
];
