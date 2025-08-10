import React from "react";
import { EventCard } from "./EventCard";
import { SectionHeader } from "./SectionHeader";

interface Event {
  fest: string;
  id: number;
  title: string;
  date?: string;
  organizing_dept: string;
  time?: string;
  location?: string;
  tags?: string[];
  image: string;
}

interface EventsSectionProps {
  title: string;
  events: Event[];
  showAll?: boolean;
  baseUrl?: string;
}

export const EventsSection = ({
  title,
  events,
  baseUrl = "event",
}: EventsSectionProps) => {
  return (
    <div>
      <SectionHeader title={title} link="events" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 ">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            dept={event.organizing_dept}
            date={event.date || ""}
            festName={event.fest || ""}
            time={event.time || ""}
            location={event.location || ""}
            tags={event.tags || []}
            image={event.image}
            baseUrl={baseUrl}
          />
        ))}
      </div>
    </div>
  );
};
