import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, Flag, Edit } from 'lucide-react';
import { Task, TeamMember, Project } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';

const columns = [
  { id: 'todo', title: 'To Do', dotColor: 'bg-gray-500' },
  { id: 'in-progress', title: 'In Progress', dotColor: 'bg-yellow-500' },
  { id: 'review', title: 'Review', dotColor: 'bg-blue-500' },
  { id: 'completed', title: 'Completed', dotColor: 'bg-green-500' },
];

interface TaskBoardProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  projects: Project[];
  onEditTask: (task: Task) => void;
  onCreateNewTask: (status: 'todo' | 'in-progress' | 'review' | 'completed') => void;
  onTaskStatusChange: (taskId: string, newStatus: 'todo' | 'in-progress' | 'review' | 'completed') => void;
}

const TaskCard: React.FC<{ task: Task; index: number; onEditTask: (task: Task) => void; onDragStart: (taskId: string) => void; }> = ({ task, index, onEditTask, onDragStart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <motion.div
      key={task.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      draggable
      onDragStart={() => onDragStart(task.id)}
      className="bg-sand-50 dark:bg-dark-700 rounded-xl p-4 cursor-move hover:shadow-soft dark:hover:shadow-dark-soft transition-shadow border border-sand-200 dark:border-dark-600 hover:border-accent-teal dark:hover:border-accent-teal-dark"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-charcoal-900 dark:text-white text-sm pr-2">{task.title}</h3>
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(o => !o)} className="p-1 text-charcoal-500 dark:text-gray-400 hover:bg-sand-100 dark:hover:bg-dark-600 rounded-md">
            <MoreHorizontal size={16} />
          </button>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 mt-1 w-32 bg-white dark:bg-dark-800 rounded-lg shadow-lg z-10 p-2 border border-sand-200 dark:border-dark-600"
              >
                <button onClick={() => { onEditTask(task); setIsMenuOpen(false); }} className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-sm hover:bg-sand-100 dark:hover:bg-dark-600 text-charcoal-700 dark:text-gray-200">
                  <Edit size={14} /><span>Edit</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <p className="text-charcoal-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs text-charcoal-500 dark:text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar size={12} />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
        <span className={`px-2 py-1 text-xs rounded-md ${getPriorityColor(task.priority)}`}>
          <Flag size={10} className="inline mr-1" />
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-charcoal-500 dark:text-gray-500 mt-3 pt-3 border-t border-sand-200 dark:border-dark-600">
        <div className="flex items-center space-x-1">
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name}
            className="w-5 h-5 rounded-full border border-white dark:border-dark-700"
          />
          <span className="text-xs">{task.assignee.name.split(' ')[0]}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onEditTask, onCreateNewTask, onTaskStatusChange }) => {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTask) {
      onTaskStatusChange(draggedTask, newStatus as any);
      setDraggedTask(null);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Task Board</h1>
          <p className="text-charcoal-600 dark:text-gray-400">Manage your team's workflow with drag-and-drop simplicity</p>
        </div>
        
        <motion.button
          onClick={() => onCreateNewTask('todo')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-hover dark:hover:shadow-dark-hover transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Task</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-4 flex flex-col border border-transparent dark:border-dark-600"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${column.dotColor}`} />
                <h2 className="font-semibold text-charcoal-900 dark:text-white">{column.title}</h2>
                <span className="bg-sand-100 dark:bg-dark-700 text-charcoal-600 dark:text-gray-400 text-xs px-2 py-1 rounded-lg">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>
              <button className="p-1 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
                <MoreHorizontal size={16} className="text-charcoal-500 dark:text-gray-500" />
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {getTasksByStatus(column.id).map((task, index) => (
                <TaskCard 
                  key={task.id}
                  task={task}
                  index={index}
                  onEditTask={onEditTask}
                  onDragStart={handleDragStart}
                />
              ))}
              
              <motion.button
                onClick={() => onCreateNewTask(column.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-dashed border-sand-200 dark:border-dark-600 rounded-xl p-4 text-charcoal-500 dark:text-gray-500 hover:border-accent-teal dark:hover:border-accent-teal-dark hover:text-accent-teal dark:hover:text-accent-teal-dark transition-colors flex items-center justify-center space-x-2"
              >
                <Plus size={16} />
                <span className="text-sm">Add Task</span>
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
