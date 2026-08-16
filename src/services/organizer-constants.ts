// Static content for the Organizer landing page.
// This page has no backend data — it's marketing copy.

export const HERO_DATA = {
  title: 'Sell tickets. Get paid. No stress.',
  subtitle:
    'Publish a published event in minutes, and with real payments, only pay when you sell tickets.',
  ctaText: 'Get Started',
  ctaLink: '/auth/organizer/register',
  image: '/images/hero-illustration.svg',
};

export const AVATAR_IMAGES = [
  { id: "1", image: "/avatar-old-woman.jpg" },
  { id: "2", image: "/avatar-old-man.jpg" },
  { id: "3", image: "/avatar-young-woman.jpg" },
  { id: "4", image: "/avatar-young-man.jpg" },
];

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
  primaryButtonLink: '/auth/organizer/register',
  secondaryButtonText: 'Contact sales',
  secondaryButtonLink: '/contact',
};