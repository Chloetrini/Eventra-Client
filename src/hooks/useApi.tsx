// import { useQuery } from '@tanstack/react-query'
// import { getEventById } from '@/lib/dummy-ticket';


// const { data: event } = useQuery({
//   queryKey: ["event", eventId],
//   queryFn: () => getEventById(eventId),
//   initialData: () => {
//     return queryClient.getQueryData(["event", eventId]);
//   }
// });

// export const useGetSingleEvent = (id: string) => {
//   return useQuery({
//     queryKey: ['event', id],
//     queryFn: () => getEventById(id),
//     initialData: () => {
//       return queryClient.getQueryData(["event", eventId]);
//     }
//   })
// }