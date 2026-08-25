import React from 'react';
import { useParams, useNavigate } from 'react-router';
import AdminEventDetail from '@/components/admin/events/AdminEventDetail';
import { MOCK_ADMIN_EVENTS } from '@/types/admin-events-mock-data';
import PageWrapper from '@/components/page-wrapper';

export default function AdminEventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const event = MOCK_ADMIN_EVENTS.find(
    (e) => e.id === eventId || e.slug === eventId
  ) || MOCK_ADMIN_EVENTS[0];

  return (
    <AdminEventDetail
      event={event}
      onBack={() => navigate('/admin/events')}
      onFlag={(id) => {
        console.log('Flagged event:', id);
      }}
      onRemove={(id) => {
        console.log('Removed event:', id);
        navigate('/admin/events');
      }}
    />
  );
}
