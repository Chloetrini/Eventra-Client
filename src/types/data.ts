export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
}

export interface BonusOffer {
  title: string;
  description: string;
  percentage: string;
  imageAlt: string;
}

export interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface EventData {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  stats: Stat[];
  features: Feature[];
  bonus: BonusOffer;
  cta: CTASection;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}