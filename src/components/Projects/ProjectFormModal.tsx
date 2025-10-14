import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Project, TeamMember } from '../../types';
import { mockClients, mockTeamMembers } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project: Project | null;
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

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState<any>({});
  const [clients] = useLocalStorage<any[]>('clients', mockClients);

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData({
          ...project,
          tags: project.tags.join(', '),
          client: project.client,
        });
      } else {
        setFormData({
          name: '',
          description: '',
          client: '',
          status: 'draft',
          progress: 0,
          budget: 0,
          deadline: new Date().toISOString().split('T')[0],
          tags: '',
          team: [],
        });
      }
    }
  }, [project, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find(c => c.name === formData.client);

    const finalProject: Project = {
      id: project?.id || crypto.randomUUID(),
      name: formData.name,
      description: formData.description,
      client: formData.client,
      status: formData.status,
      progress: Number(formData.progress),
      budget: Number(formData.budget),
      deadline: formData.deadline,
      tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      team: project?.team || [], // Placeholder for team selection UI
      createdAt: project?.createdAt || new Date().toISOString(),
    };
    onSave(finalProject);
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
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between sticky top-0 bg-white dark:bg-dark-800 z-10">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">
                  {project ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
                  <X size={20} className="text-charcoal-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Project Name</label>
                  <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="client" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Client</label>
                    <select name="client" id="client" value={formData.client || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      <option value="" disabled>Select a client</option>
                      {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Status</label>
                    <select name="status" id="status" value={formData.status || 'draft'} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Deadline</label>
                    <input type="date" name="deadline" id="deadline" value={formData.deadline || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Budget ($)</label>
                    <input type="number" name="budget" id="budget" value={formData.budget || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="progress" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Progress (%)</label>
                        <input type="range" name="progress" id="progress" min="0" max="100" value={formData.progress || 0} onChange={handleChange} className="w-full h-2 bg-sand-200 rounded-lg appearance-none cursor-pointer dark:bg-dark-700 accent-accent-teal" />
                        <div className="text-center text-sm text-charcoal-600 dark:text-gray-400 mt-1">{formData.progress || 0}%</div>
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Tags (comma-separated)</label>
                        <input type="text" name="tags" id="tags" value={formData.tags || ''} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                    </div>
                </div>
              </div>

              <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex items-center justify-end space-x-4 sticky bottom-0">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-300 dark:hover:bg-dark-600 transition-colors">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft dark:shadow-dark-soft"
                >
                  Save Project
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
