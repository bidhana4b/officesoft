import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { CalendarEvent, TeamMember } from '../../types';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  event: CalendarEvent | null;
  dateInfo: any | null;
  teamMembers: TeamMember[];
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const EventFormModal: React.FC<EventFormModalProps> = ({ isOpen, onClose, onSave, onDelete, event, dateInfo, teamMembers }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setFormData({
          ...event,
          start: event.start.substring(0, 16), // Format for datetime-local
          end: event.end.substring(0, 16),
          attendeeIds: event.attendees.map(a => a.id),
        });
      } else if (dateInfo) {
        setFormData({
          title: '',
          description: '',
          start: dateInfo.startStr.substring(0, 16),
          end: dateInfo.endStr.substring(0, 16),
          type: 'meeting',
          attendeeIds: [],
        });
      } else {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const start = now.toISOString().slice(0, 16);
        now.setHours(now.getHours() + 1);
        const end = now.toISOString().slice(0, 16);

        setFormData({
          title: '',
          description: '',
          start,
          end,
          type: 'meeting',
          attendeeIds: [],
        });
      }
    }
  }, [event, dateInfo, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAttendeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setFormData((prev: any) => ({ ...prev, attendeeIds: selectedIds }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAttendees = teamMembers.filter(m => formData.attendeeIds.includes(m.id));
    
    const finalEvent: CalendarEvent = {
      id: event?.id || crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString(),
      type: formData.type,
      attendees: selectedAttendees,
      projectId: formData.projectId,
    };
    onSave(finalEvent);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">
                  {event ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
                  <X size={20} className="text-charcoal-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Title</label>
                  <input type="text" name="title" id="title" value={formData.title || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="start" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Start Time</label>
                    <input type="datetime-local" name="start" id="start" value={formData.start || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                  <div>
                    <label htmlFor="end" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">End Time</label>
                    <input type="datetime-local" name="end" id="end" value={formData.end || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Event Type</label>
                  <select name="type" id="type" value={formData.type || 'meeting'} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="review">Review</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="attendeeIds" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Attendees</label>
                  <select name="attendeeIds" id="attendeeIds" multiple value={formData.attendeeIds || []} onChange={handleAttendeeChange} className="w-full h-40 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                    {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <div>
                  {event && (
                    <motion.button
                      type="button"
                      onClick={() => onDelete(event.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    >
                      <Trash2 size={16} />
                      <span>Delete Event</span>
                    </motion.button>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-300 dark:hover:bg-dark-600 transition-colors">
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft dark:shadow-dark-soft"
                  >
                    Save Event
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
