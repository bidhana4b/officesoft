import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, CheckCircle, Calendar, MessageSquare } from 'lucide-react';
import { mockTeamMembers } from '../../data/mockData';
import { Project, Task } from '../../types';

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, tasks }) => {
  const stats = [
    { label: 'Active Projects', value: projects.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'from-accent-teal to-accent-teal-dark' },
    { label: 'Team Members', value: mockTeamMembers.length, icon: Users, color: 'from-accent-orange to-accent-orange-dark' },
    { label: 'Tasks Due', value: tasks.filter(t => t.status !== 'completed').length, icon: Clock, color: 'from-red-500 to-red-600' },
    { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle, color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Welcome back, Sarah</h1>
        <p className="text-charcoal-600 dark:text-gray-400">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-soft dark:shadow-dark-soft hover:shadow-hover dark:hover:shadow-dark-hover transition-all duration-300 border border-transparent dark:border-dark-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-charcoal-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-charcoal-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-soft`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Recent Projects</h2>
            <button className="text-accent-teal dark:text-accent-teal-dark font-medium hover:text-opacity-80 transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="border border-sand-200 dark:border-dark-600 rounded-xl p-4 hover:bg-sand-50 dark:hover:bg-dark-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal-900 dark:text-white mb-1">{project.name}</h3>
                    <p className="text-charcoal-600 dark:text-gray-400 text-sm mb-3">{project.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-charcoal-500 dark:text-gray-500">
                      <span>{project.client}</span>
                      <span>•</span>
                      <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-charcoal-900 dark:text-white">{project.progress}%</p>
                      <div className="w-16 h-2 bg-sand-200 dark:bg-dark-600 rounded-full mt-1">
                        <div 
                          className="h-full bg-gradient-to-r from-accent-teal to-accent-teal-dark rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member) => (
                        <img
                          key={member.id}
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-800"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
        >
          <h2 className="text-section font-semibold text-charcoal-900 dark:text-white mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-teal to-accent-teal-dark rounded-full flex items-center justify-center shadow-soft">
                <CheckCircle size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-charcoal-900 dark:text-white">
                  <span className="font-medium">Marcus</span> completed task in Luxury Resort Rebrand
                </p>
                <p className="text-xs text-charcoal-500 dark:text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-orange to-accent-orange-dark rounded-full flex items-center justify-center shadow-soft">
                <MessageSquare size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-charcoal-900 dark:text-white">
                  <span className="font-medium">Emma</span> added comment to design review
                </p>
                <p className="text-xs text-charcoal-500 dark:text-gray-500 mt-1">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-soft">
                <Calendar size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-charcoal-900 dark:text-white">
                  <span className="font-medium">James</span> scheduled client meeting
                </p>
                <p className="text-xs text-charcoal-500 dark:text-gray-500 mt-1">6 hours ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
      >
        <h2 className="text-section font-semibold text-charcoal-900 dark:text-white mb-6">Upcoming Deadlines</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task) => (
            <div key={task.id} className="border border-sand-200 dark:border-dark-600 rounded-xl p-4 hover:bg-sand-50 dark:hover:bg-dark-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                }`}>
                  {task.priority}
                </span>
                <span className="text-xs text-charcoal-500 dark:text-gray-500">
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="font-medium text-charcoal-900 dark:text-white mb-1">{task.title}</h3>
              <p className="text-sm text-charcoal-600 dark:text-gray-400 mb-3">{task.description}</p>
              
              <div className="flex items-center space-x-2">
                <img
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-charcoal-600 dark:text-gray-400">{task.assignee.name}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
