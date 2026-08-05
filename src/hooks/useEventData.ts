import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { eventApi } from '@/lib/event-api';
import { FALLBACK_DATA } from '@/lib/constants';
import type { EventData, Feature, Stat, BonusOffer, CTASection, HeroData } from '@/lib/event-api';

// Query keys for caching
export const eventKeys = {
  all: ['event'] as const,
  details: () => [...eventKeys.all, 'details'] as const,
  stats: () => [...eventKeys.all, 'stats'] as const,
  features: () => [...eventKeys.all, 'features'] as const,
  bonus: () => [...eventKeys.all, 'bonus'] as const,
  cta: () => [...eventKeys.all, 'cta'] as const,
  byId: (id: string) => [...eventKeys.all, 'detail', id] as const,
  search: (query: string) => [...eventKeys.all, 'search', query] as const,
  popular: (limit: number) => [...eventKeys.all, 'popular', limit] as const,
};

// ---- QUERIES ----

export const useEventData = () => {
  return useQuery({
    queryKey: eventKeys.details(),
    queryFn: async () => {
      try {
        const data = await eventApi.getEventData();
        return data;
      } catch {
        console.warn('API unavailable – using fallback data');
        return FALLBACK_DATA;
      }
    },
    initialData: FALLBACK_DATA,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useEventStats = () => {
  return useQuery({
    queryKey: eventKeys.stats(),
    queryFn: async () => {
      try {
        const stats = await eventApi.getEventStats();
        return stats;
      } catch {
        return FALLBACK_DATA.stats;
      }
    },
    initialData: FALLBACK_DATA.stats,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEventFeatures = () => {
  return useQuery({
    queryKey: eventKeys.features(),
    queryFn: async () => {
      try {
        const features = await eventApi.getEventFeatures();
        return features;
      } catch {
        return FALLBACK_DATA.features;
      }
    },
    initialData: FALLBACK_DATA.features,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEventBonus = () => {
  return useQuery({
    queryKey: eventKeys.bonus(),
    queryFn: async () => {
      try {
        const bonus = await eventApi.getEventBonus();
        return bonus;
      } catch {
        return FALLBACK_DATA.bonus;
      }
    },
    initialData: FALLBACK_DATA.bonus,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEventCTA = () => {
  return useQuery({
    queryKey: eventKeys.cta(),
    queryFn: async () => {
      try {
        const cta = await eventApi.getEventCTA();
        return cta;
      } catch {
        return FALLBACK_DATA.cta;
      }
    },
    initialData: FALLBACK_DATA.cta,
    staleTime: 1000 * 60 * 5,
  });
};

export const useEventById = (eventId: string) => {
  return useQuery({
    queryKey: eventKeys.byId(eventId),
    queryFn: async () => {
      try {
        const event = await eventApi.getEventById(eventId);
        return event;
      } catch {
        return FALLBACK_DATA;
      }
    },
    enabled: !!eventId,
    initialData: FALLBACK_DATA,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchEvents = (query: string) => {
  return useQuery({
    queryKey: eventKeys.search(query),
    queryFn: async () => {
      try {
        const results = await eventApi.searchEvents(query);
        return results;
      } catch {
        return [FALLBACK_DATA];
      }
    },
    enabled: query.length > 0,
    initialData: [FALLBACK_DATA],
    staleTime: 1000 * 60 * 2,
  });
};

export const usePopularEvents = (limit: number = 5) => {
  return useQuery({
    queryKey: eventKeys.popular(limit),
    queryFn: async () => {
      try {
        const events = await eventApi.getPopularEvents(limit);
        return events;
      } catch {
        return [FALLBACK_DATA];
      }
    },
    initialData: [FALLBACK_DATA],
    staleTime: 1000 * 60 * 10,
  });
};

// ---- MUTATIONS ----
// Mutations remain unchanged – they will still attempt API calls

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => eventApi.registerForEvent(eventId),
    onSuccess: () => {
      toast.success('Successfully registered for event!');
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register for event');
      console.error('Registration error:', error);
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventData: Partial<EventData>) => eventApi.createEvent(eventData),
    onSuccess: (data) => {
      toast.success(data.message || 'Event created successfully!');
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create event');
      console.error('Create event error:', error);
    },
  });
};

export const useUpdateEvent = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<EventData>) => eventApi.updateEventData(eventId, data),
    onSuccess: (data) => {
      toast.success(data.message || 'Event updated successfully!');
      queryClient.invalidateQueries({ queryKey: eventKeys.byId(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update event');
      console.error('Update event error:', error);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => eventApi.deleteEvent(eventId),
    onSuccess: (data) => {
      toast.success(data.message || 'Event deleted successfully!');
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete event');
      console.error('Delete event error:', error);
    },
  });
};

// ---- ADMIN MUTATIONS ----

export const useUpdateHero = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (heroData: HeroData) => eventApi.updateHero(heroData),
    onSuccess: (data) => {
      toast.success(data.message || 'Hero section updated successfully!');
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update hero section');
      console.error('Update hero error:', error);
    },
  });
};

export const useUpdateStats = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stats: Stat[]) => eventApi.updateStats(stats),
    onSuccess: (data) => {
      toast.success(data.message || 'Stats updated successfully!');
      queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update stats');
      console.error('Update stats error:', error);
    },
  });
};

export const useUpdateFeatures = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (features: Feature[]) => eventApi.updateFeatures(features),
    onSuccess: (data) => {
      toast.success(data.message || 'Features updated successfully!');
      queryClient.invalidateQueries({ queryKey: eventKeys.features() });
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update features');
      console.error('Update features error:', error);
    },
  });
};

export const useUpdateBonus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bonus: BonusOffer) => eventApi.updateBonus(bonus),
    onSuccess: (data) => {
      toast.success(data.message || 'Bonus updated successfully!');
      queryClient.invalidateQueries({ queryKey: eventKeys.bonus() });
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update bonus');
      console.error('Update bonus error:', error);
    },
  });
};

export const useUpdateCTA = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cta: CTASection) => eventApi.updateCTA(cta),
    onSuccess: (data) => {
      toast.success(data.message || 'CTA updated successfully!');
      queryClient.invalidateQueries({ queryKey: eventKeys.cta() });
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update CTA');
      console.error('Update CTA error:', error);
    },
  });
};

// Generic error handler
export const handleQueryError = (error: Error) => {
  toast.error(error.message || 'An unexpected error occurred');
  console.error('Query Error:', error);
};








// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { eventApi } from '@/lib/event-api';
// import type { EventData, Feature, Stat, BonusOffer, CTASection, HeroData } from '@/lib/event-api';

// // Query keys for caching
// export const eventKeys = {
//   all: ['event'] as const,
//   details: () => [...eventKeys.all, 'details'] as const,
//   stats: () => [...eventKeys.all, 'stats'] as const,
//   features: () => [...eventKeys.all, 'features'] as const,
//   bonus: () => [...eventKeys.all, 'bonus'] as const,
//   cta: () => [...eventKeys.all, 'cta'] as const,
//   byId: (id: string) => [...eventKeys.all, 'detail', id] as const,
//   search: (query: string) => [...eventKeys.all, 'search', query] as const,
//   popular: (limit: number) => [...eventKeys.all, 'popular', limit] as const,
// };

// // ---- QUERIES ----

// export const useEventData = () => {
//   return useQuery({
//     queryKey: eventKeys.details(),
//     queryFn: async () => {
//       const data = await eventApi.getEventData();
//       return data;
//     },
//     staleTime: 1000 * 60 * 5,
//     retry: 1,
//   });
// };

// export const useEventStats = () => {
//   return useQuery({
//     queryKey: eventKeys.stats(),
//     queryFn: async () => {
//       const stats = await eventApi.getEventStats();
//       return stats;
//     },
//     staleTime: 1000 * 60 * 5,
//   });
// };

// export const useEventFeatures = () => {
//   return useQuery({
//     queryKey: eventKeys.features(),
//     queryFn: async () => {
//       const features = await eventApi.getEventFeatures();
//       return features;
//     },
//     staleTime: 1000 * 60 * 5,
//   });
// };

// export const useEventBonus = () => {
//   return useQuery({
//     queryKey: eventKeys.bonus(),
//     queryFn: async () => {
//       const bonus = await eventApi.getEventBonus();
//       return bonus;
//     },
//     staleTime: 1000 * 60 * 5,
//   });
// };

// export const useEventCTA = () => {
//   return useQuery({
//     queryKey: eventKeys.cta(),
//     queryFn: async () => {
//       const cta = await eventApi.getEventCTA();
//       return cta;
//     },
//     staleTime: 1000 * 60 * 5,
//   });
// };

// export const useEventById = (eventId: string) => {
//   return useQuery({
//     queryKey: eventKeys.byId(eventId),
//     queryFn: async () => {
//       const event = await eventApi.getEventById(eventId);
//       return event;
//     },
//     enabled: !!eventId,
//     staleTime: 1000 * 60 * 5,
//   });
// };

// export const useSearchEvents = (query: string) => {
//   return useQuery({
//     queryKey: eventKeys.search(query),
//     queryFn: async () => {
//       const results = await eventApi.searchEvents(query);
//       return results;
//     },
//     enabled: query.length > 0,
//     staleTime: 1000 * 60 * 2,
//   });
// };

// export const usePopularEvents = (limit: number = 5) => {
//   return useQuery({
//     queryKey: eventKeys.popular(limit),
//     queryFn: async () => {
//       const events = await eventApi.getPopularEvents(limit);
//       return events;
//     },
//     staleTime: 1000 * 60 * 10,
//   });
// };

// // ---- MUTATIONS ----

// export const useRegisterForEvent = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (eventId: string) => eventApi.registerForEvent(eventId),
//     onSuccess: () => {
//       toast.success('Successfully registered for event!');
//       queryClient.invalidateQueries({ queryKey: eventKeys.details() });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to register for event');
//       console.error('Registration error:', error);
//     },
//   });
// };

// export const useCreateEvent = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (eventData: Partial<EventData>) => eventApi.createEvent(eventData),
//     onSuccess: (data) => {
//       toast.success(data.message || 'Event created successfully!');
//       queryClient.invalidateQueries({ queryKey: eventKeys.all });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to create event');
//       console.error('Create event error:', error);
//     },
//   });
// };

// export const useUpdateEvent = (eventId: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: Partial<EventData>) => eventApi.updateEventData(eventId, data),
//     onSuccess: (data) => {
//       toast.success(data.message || 'Event updated successfully!');
//       queryClient.invalidateQueries({ queryKey: eventKeys.byId(eventId) });
//       queryClient.invalidateQueries({ queryKey: eventKeys.details() });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update event');
//       console.error('Update event error:', error);
//     },
//   });
// };

// export const useDeleteEvent = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (eventId: string) => eventApi.deleteEvent(eventId),
//     onSuccess: (data) => {
//       toast.success(data.message || 'Event deleted successfully!');
//       queryClient.invalidateQueries({ queryKey: eventKeys.all });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to delete event');
//       console.error('Delete event error:', error);
//     },
//   });
// };

// // ---- ADMIN MUTATIONS ----

// export const useUpdateHero = () => {
//   const queryClient = useQueryClient(); // ✅ fixed: no arguments passed
//   return useMutation({
//     mutationFn: (heroData: HeroData) => eventApi.updateHero(heroData),
//     onSuccess: (data) => {
//       toast.success(data.message || 'Hero section updated successfully!');
//       queryClient.invalidateQueries({ queryKey: eventKeys.details() });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update hero section');
//       console.error('Update hero error:', error);
//     },
//   });
// };

// export const useUpdateStats = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (stats: Stat[]) => eventApi.updateStats(stats),
//     onSuccess: (data) => {
//       toast.success(data.message || 'Stats updated successfully!');
//       queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
//       queryClient.invalidateQueries({ queryKey: eventKeys.details() });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update stats');
//       console.error('Update stats error:', error);
//     },
//   });
// };

// export const useUpdateFeatures = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (features: Feature[]) => eventApi.updateFeatures(features),
//     onSuccess: (data) => {
//       toast.success(data.message || 'Features updated successfully!');
//       queryClient.invalidateQueries({ queryKey: eventKeys.features() });
//       queryClient.invalidateQueries({ queryKey: eventKeys.details() });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update features');
//       console.error('Update features error:', error);
//     },
//   });
// };

// export const useUpdateBonus = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (bonus: BonusOffer) => eventApi.updateBonus(bonus),
//     onSuccess: (data) => {
//       toast.success(data.message || 'Bonus updated successfully!');
//       queryClient.invalidateQueries({ queryKey: eventKeys.bonus() });
//       queryClient.invalidateQueries({ queryKey: eventKeys.details() });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update bonus');
//       console.error('Update bonus error:', error);
//     },
//   });
// };

// export const useUpdateCTA = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (cta: CTASection) => eventApi.updateCTA(cta),
//     onSuccess: (data) => {
//       toast.success(data.message || 'CTA updated successfully!');
//       queryClient.invalidateQueries({ queryKey: eventKeys.cta() });
//       queryClient.invalidateQueries({ queryKey: eventKeys.details() });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update CTA');
//       console.error('Update CTA error:', error);
//     },
//   });
// };

// // Generic error handler
// export const handleQueryError = (error: Error) => {
//   toast.error(error.message || 'An unexpected error occurred');
//   console.error('Query Error:', error);
// };