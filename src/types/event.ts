export type EventCategory ='CONCERTS' | 'PARTIES' | 'CONFERENCES' | 'COMEDY' | 'SPORTS' | 'ARTS AND THEATRE' | 'FOOD AND DRINKS' | 'TECH';

export type PriceType = 'free' | 'paid';

export type TicketAvailability = 'available' | 'scarce' | 'sold out';

export interface ticketDetails {
  type: string;
  unitPrice: number;
  quantity: number;
  id: number;
  description: string;
  originalPrice: number | null;
  availability: TicketAvailability;
  quantityLeft: number | null;
}



export interface EventLocation {
  venueName: string;
  address: string;
  area: string;
  city: string;
  parkingNote: string | null;
  coordinates: { lat: number; lng: number } | null;
}

export interface Organizer {
  id: number;
  name: string;
  initials: string;
  imageUrl: string | null;
  isVerified: boolean;
  totalEvents: number;
  followers: number;
}

export interface LineupArtist {
  id: number;
  name: string;
  role: string;
  imageUrl: string | null;
}

export interface TicketTier {
  id: number;
  description: string;
  originalPrice: number | null;
  availability: TicketAvailability;
  quantityLeft: number | null;
}

export interface Event {
  id: number;
  name: string;
  coverImageUrl: string | null;
  category: EventCategory;
  subTags: string[];
  featured: boolean;
  startDate: string;
  location: EventLocation;
  priceType: PriceType;
  startingPrice: number;

  // detail page only
  description: string;
  musicType: string | null;
  gatesOpenTime: string;
  doorsCloseTime: string;
  tags: string[];
  lineupCount: number;
  lineup: LineupArtist[];
  organizer: Organizer;
  ticketTiers: ticketDetails[];
  serviceFeePercent: number;
  goodToKnow: string[];
  relatedEventIds: number[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}