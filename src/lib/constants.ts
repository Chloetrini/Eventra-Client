import type { EventData } from './event-api';
import type { Event } from '@/types/event-types';

// Complete fallback data matching the JSON structure
export const FALLBACK_DATA: EventData = {
  hero: {
    title: 'Sell tickets. Get paid. No stress.',
    subtitle:
      'Publish a published event in minutes, and with real payments, only pay when you sell tickets.',
    ctaText: 'Get Started',
    ctaLink: '/register',
    image: '/images/hero-illustration.svg',
  },
  stats: [
    { id: 1, value: '1,000', label: 'Total Tickets Sold', trend: '+12%' },
    { id: 2, value: '$50K+', label: 'Revenue Generated', trend: '+8%' },
    { id: 3, value: '500+', label: 'Events Hosted', trend: '+15%' },
    { id: 4, value: '95%', label: 'Customer Satisfaction', trend: '+2%' },
  ],
  features: [
    { id: 1, icon: '🎫', title: 'Create tickets', description: 'Create tickets and get paid instantly.', isActive: true },
    { id: 2, icon: '💳', title: 'Road payments', description: 'Road payments and get paid securely.', isActive: true },
    { id: 3, icon: '⚽', title: 'Score at the gate', description: 'Score at the gate and get paid in real-time.', isActive: true },
    { id: 4, icon: '💰', title: 'Get paid', description: 'Get paid and get paid faster than ever.', isActive: true },
    { id: 5, icon: '🛡️', title: 'Only pay when you sell', description: 'Only pay when you sell with zero risk.', isActive: true },
    { id: 6, icon: '🤖', title: 'Automatic payments', description: 'Automatic payments and get paid seamlessly.', isActive: true },
  ],
  bonus: {
    title: 'Get a bonus if alternative ticket included',
    description: 'Get a bonus if alternative ticket included. Share your free bonus and get paid with 5% bonus.',
    percentage: '5%',
    imageAlt: '1105 × 515 Hug illustration',
    ctaText: 'Claim Your Bonus',
    ctaLink: '/claim-bonus',
  },
  cta: {
    title: 'Your event, live today.',
    subtitle: 'Your event, live today. Book now or register.',
    buttonText: 'Book now or register',
    buttonLink: '/register',
  },
};


export const SECTION_TWO_FEATURES = [
  {
    id: 1,
    icon: 'PencilIcon',          
    title: 'Create in minutes',
    description:
      'A polished event page with ticket types, published in a few clicks.',
    accentColor: '#0F6E56',
  },
  {
    id: 2,
    icon: 'Coins',
    title: 'Real payments',
    description:
      'Cards, transfer and USSD. Money held safely until the event.',
    accentColor: '#0F6E56',
  },
  {
    id: 3,
    icon: 'ScanLine',
    title: 'Scan at the gate',
    description:
      'Check guests in fast with QR scanning – even online.',
    accentColor: '#0F6E56',
  },
  {
    id: 4,
    icon: 'ZapIcon',                                                                        
    title: 'Get paid fast',
    description:
      'Automatic payout to your bank a few days after the event.',
    accentColor: '#0F6E56',
  },
];


export const SECTION_THREE_FEATURES = [
  {
    id: 1,
    icon: 'Ticket',
    title: 'Free events cost nothing',
    description: 'You only pay a small fee on paid tickets.',
  },
  {
    id: 2,
    icon: 'CreditCard',
    title: 'Card, bank, tranfer and USSD included',
    description: 'Multiple payment option for you and your attendees.',
  },
  {
    id: 3,
    icon: 'Banknote',
    title: 'Automatic payout',
    description: 'Get paid automatically a few days after your events.',
  },
  {
    id: 4,
    icon: 'QrCode',
    title: 'Gate scanning & attendee list',
    description: 'Smart check-in and real-time attendee tracking.',
  },
];
  
// Section Four – CTA
export const SECTION_FOUR_DATA = {
  badge: 'TAKES ABOUT 5 MINUTES',
  title: 'Your event, live today.',
  description:
    "Set up your organizer account, add your tickets and share one link. We'll handle the payments, the gate and the payout.",
  primaryButtonText: 'Become an organizer',
  primaryButtonLink: '/register',
  secondaryButtonText: 'Contact sales',
  secondaryButtonLink: '/contact',
};
  

export const AVATAR_IMAGES = [
  { id: "1", image: "/public/avatar-old-woman.jpg" },
  { id: "2", image: "/public/avatar-old-man.jpg" },
  { id: "3", image: "/public/avatar-young-woman.jpg" },
  { id: "4", image: "/public/avatar-young-man.jpg" },
];

// Export individual constants for backward compatibility
export const HERO_DATA = FALLBACK_DATA.hero;
export const STATS_DATA = FALLBACK_DATA.stats;
export const FEATURES_DATA = FALLBACK_DATA.features;
export const BONUS_DATA = FALLBACK_DATA.bonus;
export const CTA_DATA = FALLBACK_DATA.cta;

export const STATS_TITLE = 'Ticket selling in 1 hour';

// ==========================================================================
// MOCK EVENTS (for use in event-api.ts when mocks are enabled)
// ==========================================================================
export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Annual tech conference with keynotes and workshops.',
    venue: 'Lagos Convention Center',
    city: 'Lagos',
    state: 'Lagos', // ✅ Nigerian state
    category: 'Tech', // ✅ valid category from schema
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    minPrice: 0,
    trendingScore: 92,
    image: '/images/tech-conference.jpg',
  },
  {
    id: '2',
    title: 'Jazz Night Under the Stars',
    description: 'An evening of smooth jazz in the park.',
    venue: 'Abuja City Park',
    city: 'Abuja',
    state: 'FCT-Abuja',
    category: 'Concerts',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    minPrice: 25,
    trendingScore: 78,
    image: '/images/jazz-night.jpg',
  },
  {
    id: '3',
    title: 'Food Truck Festival',
    description: 'Taste the best food trucks in the city.',
    venue: 'Eko Hotel',
    city: 'Lagos',
    state: 'Lagos',
    category: 'Food & Drink',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    minPrice: 0,
    trendingScore: 65,
    image: '/images/food-truck.jpg',
  },
  {
    id: '4',
    title: 'Startup Pitch Night',
    description: 'Watch startups pitch to investors.',
    venue: 'Innovation Hub, Yaba',
    city: 'Lagos',
    state: 'Lagos',
    category: 'Tech',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    minPrice: 15,
    trendingScore: 88,
    image: '/images/pitch-night.jpg',
  },
  {
    id: '5',
    title: 'Art & Wine Evening',
    description: 'Enjoy art exhibits with wine tasting.',
    venue: 'Terra Kulture',
    city: 'Lagos',
    state: 'Lagos',
    category: 'Arts & Theatre',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    minPrice: 45,
    trendingScore: 70,
    image: '/images/art-wine.jpg',
  },
  {
    id: '6',
    title: 'Yoga Retreat Weekend',
    description: 'Relax and rejuvenate with yoga and meditation.',
    venue: 'Obudu Mountain Resort',
    city: 'Calabar',
    state: 'Cross River',
    category: 'Sports', // or could be "Wellness" but we'll use allowed
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    minPrice: 120,
    trendingScore: 55,
    image: '/images/yoga-retreat.jpg',
  },
  {
    id: '7',
    title: 'Comedy Night with Bovi',
    description: 'Live stand-up comedy from top comedians.',
    venue: 'Eko Hotel',
    city: 'Lagos',
    state: 'Lagos',
    category: 'Comedy',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    minPrice: 20,
    trendingScore: 82,
    image: '/images/comedy-night.jpg',
  },
  {
    id: '8',
    title: 'Science Fair',
    description: 'Explore the latest in science and technology.',
    venue: 'National Museum',
    city: 'Lagos',
    state: 'Lagos',
    category: 'Tech',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    minPrice: 0,
    trendingScore: 60,
    image: '/images/science-fair.jpg',
  },
  {
    id: '9',
    title: 'Fashion Show',
    description: 'Showcase of the latest fashion trends.',
    venue: 'Landmark Event Centre',
    city: 'Lagos',
    state: 'Lagos',
    category: 'Arts & Theatre',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    minPrice: 35,
    trendingScore: 73,
    image: '/images/fashion-show.jpg',
  },
  {
    id: '10',
    title: 'Charity Gala',
    description: 'Evening gala to support local charities.',
    venue: 'Transcorp Hilton',
    city: 'Abuja',
    state: 'FCT-Abuja',
    category: 'Parties',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    minPrice: 100,
    trendingScore: 90,
    image: '/images/charity-gala.jpg',
  },
];