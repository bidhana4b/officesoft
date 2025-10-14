import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Task, Project, TeamMember } from '../../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task: Task | null;
  projects: Project[];
  teamMembers: TeamMember[];
  defaultStatus: 'todo' | 'in-progress' | 'review' | 'completed';
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

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSave, task, projects, teamMembers, defaultStatus }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          ...task,
          assigneeId: task.assignee.id,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          status: defaultStatus,
          assigneeId: '',
          priority: 'medium',
          dueDate: new Date().toISOString().split('T')[0],
          projectId: '',
        });
      }
    }
  }, [task, isOpen, defaultStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAssignee = teamMembers.find(m => m.id === formData.assigneeId);
    if (!selectedAssignee) {
        console.error("Assignee not found");
        return;
    }

    const finalTask: Task = {
      id: task?.id || crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      assignee: selectedAssignee,
      priority: formData.priority,
      dueDate: formData.dueDate,
      projectId: formData.projectId,
      comments: task?.comments || [],
      attachments: task?.attachments || [],
    };
    onSave(finalTask);
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
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between sticky top-0 bg-white dark:bg-dark-800 z-10">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">
                  {task ? 'Edit Task' : 'Add New Task'}
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
                    <label htmlFor="projectId" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Project</label>
                    <select name="projectId" id="projectId" value={formData.projectId || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      <option value="" disabled>Select a project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="assigneeId" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Assignee</label>
                    <select name="assigneeId" id="assigneeId" value={formData.assigneeId || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      <option value="" disabled>Select a team member</option>
                      {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Due Date</label>
                    <input type="date" name="dueDate" id="dueDate" value={formData.dueDate || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Priority</label>
                    <select name="priority" id="priority" value={formData.priority || 'medium'} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Status</label>
                    <select name="status" id="status" value={formData.status || 'todo'} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
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
                  Save Task
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
