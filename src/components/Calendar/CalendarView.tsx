import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Plus } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockCalendarEvents, mockTeamMembers } from '../../data/mockData';
import { CalendarEvent as EventType } from '../../types';
import { EventFormModal } from './EventFormModal';

export const CalendarView: React.FC = () => {
  const [events, setEvents] = useLocalStorage<EventType[]>('calendarEvents', mockCalendarEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState<any>(null);

  const handleDateSelect = (selectInfo: any) => {
    setSelectedEvent(null);
    setSelectedDateInfo(selectInfo);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setSelectedDateInfo(null);
      setIsModalOpen(true);
    }
  };

  const handleEventChange = (changeInfo: any) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === changeInfo.event.id
          ? { ...event, start: changeInfo.event.startStr, end: changeInfo.event.endStr }
          : event
      )
    );
  };

  const handleSaveEvent = (eventData: EventType) => {
    setEvents(prev => {
      const exists = prev.some(e => e.id === eventData.id);
      if (exists) {
        return prev.map(e => (e.id === eventData.id ? eventData : e));
      }
      return [...prev, eventData];
    });
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setIsModalOpen(false);
  };

  const eventContent = (eventInfo: any) => {
    return (
      <div className="p-1 text-xs overflow-hidden">
        <b>{eventInfo.timeText}</b>
        <i className="ml-1 truncate">{eventInfo.event.title}</i>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Calendar</h1>
          <p className="text-charcoal-600 dark:text-gray-400">Schedule meetings, track deadlines, and plan your projects.</p>
        </div>
        <motion.button
          onClick={() => {
            setSelectedEvent(null);
            setSelectedDateInfo(null);
            setIsModalOpen(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-hover dark:hover:shadow-dark-hover transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Event</span>
        </motion.button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600 flex-1">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          editable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventChange={handleEventChange}
          eventContent={eventContent}
          height="100%"
          viewClassNames="dark:text-white"
          dayHeaderClassNames="dark:border-dark-600"
          slotLaneClassNames="dark:border-dark-600"
          eventClassNames="bg-accent-teal border-accent-teal text-white p-1 rounded-md"
        />
      </div>

      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        dateInfo={selectedDateInfo}
        teamMembers={mockTeamMembers}
      />
    </div>
  );
};
