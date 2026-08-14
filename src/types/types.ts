export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  category: string;
}

export interface VibeCategory {
  id: string;
  title: string;
  slug: string;
  count: string;
  image: string;
}