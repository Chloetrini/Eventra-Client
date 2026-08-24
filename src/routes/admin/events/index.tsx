import React, { useState } from "react";
import { useNavigate } from "react-router";
import AdminEventsHeader from "@/components/admin/events/AdminEventsHeader";
import AdminEventsFilterBar, {
  type StatusFilterOption,
} from "@/components/admin/events/AdminEventsFilterBar";
import AdminEventsTable from "@/components/admin/events/AdminEventsTable";
import AdminEventDetail from "@/components/admin/events/AdminEventDetail";
import { MOCK_ADMIN_EVENTS } from "@/types/admin-events-mock-data";
import type { AdminEvent } from "@/types/admin-event";

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<AdminEvent[]>(MOCK_ADMIN_EVENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilterOption>("all");
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);

  // Filter events based on search query and status filter
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      activeFilter === "all" ||
      evt.status.toLowerCase() === activeFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleEventClick = (event: AdminEvent) => {
    setSelectedEvent(event);
  };

  const handleFlagEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, status: e.status === "FLAGGED" ? "LIVE" : "FLAGGED" }
          : e
      )
    );
    if (selectedEvent?.id === eventId) {
      setSelectedEvent((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "FLAGGED" ? "LIVE" : "FLAGGED",
            }
          : null
      );
    }
  };

  const handleRemoveEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }
  };

  // If an event is selected, display the Event Detail view
  if (selectedEvent) {
    return (
      <AdminEventDetail
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
        onFlag={handleFlagEvent}
        onRemove={handleRemoveEvent}
      />
    );
  }


  return (
    <div className="flex flex-col gap-6">
      <AdminEventsHeader
        events={events}
        selectedEventId={events[0]?.id}
        onSelectEvent={(id) => {
          const evt = events.find((e) => e.id === id);
          if (evt) setSelectedEvent(evt);
        }}
        totalEvents={events.length}
        checkedInCount={3}
        notInCount={5}
      />

      <AdminEventsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <AdminEventsTable
        events={filteredEvents}
        onEventClick={handleEventClick}
      />
    </div>
  );
}
