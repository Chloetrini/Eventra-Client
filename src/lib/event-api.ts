import { api } from './api';

// Types
export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
  isActive?: boolean;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
  trend?: string;
}

export interface BonusOffer {
  title: string;
  description: string;
  percentage: string;
  imageAlt: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink?: string;
  image?: string;
  avatars?: { id: string; image: string }[]; // ✅ added
}

export interface EventData {
  eventId?: string;
  lastUpdated?: string;
  hero: HeroData;
  stats: Stat[];
  features: Feature[];
  bonus: BonusOffer;
  cta: CTASection;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  body?: T;
}

// Event API endpoints using your existing `api` object
export const eventApi = {
  // Get all event data
  getEventData: async (): Promise<EventData> => {
    const response = (await api.get('/events/data')) as ApiResponse<EventData>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch event data');
    }
    
    if (!response.body) {
      throw new Error('No data received from server');
    }
    
    return response.body;
  },

  // Get event stats only
  getEventStats: async (): Promise<Stat[]> => {
    const response = (await api.get('/events/stats')) as ApiResponse<Stat[]>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch event stats');
    }
    
    return response.body || [];
  },

  // Get event features only
  getEventFeatures: async (): Promise<Feature[]> => {
    const response = (await api.get('/events/features')) as ApiResponse<Feature[]>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch event features');
    }
    
    return response.body || [];
  },

  // Get bonus information
  getEventBonus: async (): Promise<BonusOffer> => {
    const response = (await api.get('/events/bonus')) as ApiResponse<BonusOffer>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch bonus information');
    }
    
    if (!response.body) {
      throw new Error('No bonus data received');
    }
    
    return response.body;
  },

  // Get CTA section
  getEventCTA: async (): Promise<CTASection> => {
    const response = (await api.get('/events/cta')) as ApiResponse<CTASection>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch CTA information');
    }
    
    if (!response.body) {
      throw new Error('No CTA data received');
    }
    
    return response.body;
  },

  // Register for an event
  registerForEvent: async (eventId: string): Promise<{ registrationId: string; eventId: string }> => {
    const response = (await api.post('/events/register', { eventId })) as ApiResponse<{
      registrationId: string;
      eventId: string;
    }>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to register for event');
    }
    
    if (!response.body) {
      throw new Error('No registration data received');
    }
    
    return response.body;
  },

  // Create a new event
  createEvent: async (eventData: Partial<EventData>): Promise<{ eventId: string; message: string }> => {
    const response = (await api.post('/events/create', eventData)) as ApiResponse<{
      eventId: string;
      message: string;
    }>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create event');
    }
    
    if (!response.body) {
      throw new Error('No event creation data received');
    }
    
    return response.body;
  },

  // Update event data
  updateEventData: async (eventId: string, data: Partial<EventData>): Promise<{ message: string }> => {
    const response = (await api.patch(`/events/${eventId}`, data)) as ApiResponse<{
      message: string;
    }>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update event');
    }
    
    return response.body || { message: 'Event updated successfully' };
  },

  // Delete an event
  deleteEvent: async (eventId: string): Promise<{ message: string }> => {
    const response = (await api.delete(`/events/${eventId}`)) as ApiResponse<{
      message: string;
    }>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete event');
    }
    
    return response.body || { message: 'Event deleted successfully' };
  },

  // Get single event by ID
  getEventById: async (eventId: string): Promise<EventData> => {
    const response = (await api.get(`/events/${eventId}`)) as ApiResponse<EventData>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch event');
    }
    
    if (!response.body) {
      throw new Error('No event data received');
    }
    
    return response.body;
  },

  // Search events
  searchEvents: async (query: string): Promise<EventData[]> => {
    const response = (await api.get(`/events/search?q=${encodeURIComponent(query)}`)) as ApiResponse<
      EventData[]
    >;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to search events');
    }
    
    return response.body || [];
  },

  // Get popular events
  getPopularEvents: async (limit: number = 5): Promise<EventData[]> => {
    const response = (await api.get(`/events/popular?limit=${limit}`)) as ApiResponse<
      EventData[]
    >;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch popular events');
    }
    
    return response.body || [];
  },

  // ADMIN: Update hero section
  updateHero: async (heroData: HeroData): Promise<{ message: string }> => {
    const response = (await api.patch('/admin/events/hero', heroData)) as ApiResponse<{
      message: string;
    }>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update hero section');
    }
    
    return response.body || { message: 'Hero section updated successfully' };
  },

  // ADMIN: Update stats
  updateStats: async (stats: Stat[]): Promise<{ message: string }> => {
    const response = (await api.patch('/admin/events/stats', { stats })) as ApiResponse<{
      message: string;
    }>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update stats');
    }
    
    return response.body || { message: 'Stats updated successfully' };
  },

  // ADMIN: Update features
  updateFeatures: async (features: Feature[]): Promise<{ message: string }> => {
    const response = (await api.patch('/admin/events/features', { features })) as ApiResponse<{
      message: string;
    }>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update features');
    }
    
    return response.body || { message: 'Features updated successfully' };
  },

  // ADMIN: Update bonus
  updateBonus: async (bonus: BonusOffer): Promise<{ message: string }> => {
    const response = (await api.patch('/admin/events/bonus', bonus)) as ApiResponse<{
      message: string;
    }>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update bonus');
    }
    
    return response.body || { message: 'Bonus updated successfully' };
  },

  // ADMIN: Update CTA
  updateCTA: async (cta: CTASection): Promise<{ message: string }> => {
    const response = (await api.patch('/admin/events/cta', cta)) as ApiResponse<{
      message: string;
    }>;
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update CTA');
    }
    
    return response.body || { message: 'CTA updated successfully' };
  },
};

// Export types
// export type { ApiResponse };