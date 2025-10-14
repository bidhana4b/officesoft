import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProjectList } from './components/Projects/ProjectList';
import { TaskBoard } from './components/Tasks/TaskBoard';
import { TeamDirectory } from './components/Team/TeamDirectory';
import { ClientView } from './components/Client/ClientView';
import { FinanceView } from './components/Finance/FinanceView';
import { InvoicingView } from './components/Invoicing/InvoicingView';
import { InvoiceTemplatesView } from './components/Invoicing/InvoiceTemplatesView';
import { ChatView } from './components/Chat/ChatView';
import { CalendarView } from './components/Calendar/CalendarView';
import { ProjectFormModal } from './components/Projects/ProjectFormModal';
import { TaskFormModal } from './components/Tasks/TaskFormModal';
import { TeamMemberFormModal } from './components/Team/TeamMemberFormModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Project, Task, TeamMember } from './types';
import { mockProjects, mockTeamMembers, mockTasks } from './data/mockData';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [projects, setProjects] = useLocalStorage<Project[]>('projects', mockProjects);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', mockTasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<'todo' | 'in-progress' | 'review' | 'completed'>('todo');

  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('teamMembers', mockTeamMembers);
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);


  const currentUser = mockTeamMembers.find(m => m.id === '1')!;

  const handleOpenNewProjectModal = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProjectModal = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleSaveProject = (projectToSave: Project) => {
    setProjects(prevProjects => {
      const exists = prevProjects.some(p => p.id === projectToSave.id);
      if (exists) {
        return prevProjects.map(p => (p.id === projectToSave.id ? projectToSave : p));
      }
      return [projectToSave, ...prevProjects];
    });
    handleCloseProjectModal();
  };

  const handleOpenNewTaskModal = (status: 'todo' | 'in-progress' | 'review' | 'completed' = 'todo') => {
    setEditingTask(null);
    setDefaultTaskStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskToSave: Task) => {
    setTasks(prevTasks => {
      const exists = prevTasks.some(t => t.id === taskToSave.id);
      if (exists) {
        return prevTasks.map(t => (t.id === taskToSave.id ? taskToSave : t));
      }
      return [taskToSave, ...prevTasks];
    });
    handleCloseTaskModal();
  };
  
  const handleTaskStatusChange = (taskId: string, newStatus: 'todo' | 'in-progress' | 'review' | 'completed') => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleOpenNewTeamMemberModal = () => {
    setEditingTeamMember(null);
    setIsTeamMemberModalOpen(true);
  };

  const handleOpenEditTeamMemberModal = (member: TeamMember) => {
    setEditingTeamMember(member);
    setIsTeamMemberModalOpen(true);
  };

  const handleCloseTeamMemberModal = () => {
    setIsTeamMemberModalOpen(false);
    setEditingTeamMember(null);
  };

  const handleSaveTeamMember = (memberToSave: TeamMember) => {
    setTeamMembers(prevMembers => {
      const exists = prevMembers.some(m => m.id === memberToSave.id);
      if (exists) {
        return prevMembers.map(m => (m.id === memberToSave.id ? memberToSave : m));
      }
      return [memberToSave, ...prevMembers];
    });
    handleCloseTeamMemberModal();
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard projects={projects} tasks={tasks} />;
      case 'projects':
        return <ProjectList 
                  projects={projects} 
                  onCreateNew={handleOpenNewProjectModal} 
                  onEdit={handleOpenEditProjectModal} 
                />;
      case 'tasks':
        return <TaskBoard 
                  tasks={tasks}
                  teamMembers={teamMembers}
                  projects={projects}
                  onEditTask={handleOpenEditTaskModal}
                  onCreateNewTask={handleOpenNewTaskModal}
                  onTaskStatusChange={handleTaskStatusChange}
                />;
      case 'team':
        return <TeamDirectory 
                  teamMembers={teamMembers}
                  onAddMember={handleOpenNewTeamMemberModal}
                  onEditMember={handleOpenEditTeamMemberModal}
                />;
      case 'chat':
        return <ChatView currentUser={currentUser} />;
      case 'files':
        return <div className="p-6"><h1 className="text-header font-semibold text-charcoal-900 dark:text-white">Files & Resources</h1><p className="text-charcoal-600 dark:text-gray-400 mt-2">Coming soon...</p></div>;
      case 'calendar':
        return <CalendarView />;
      case 'client':
        return <ClientView />;
      case 'finance':
        return <FinanceView />;
      case 'invoicing':
        return <InvoicingView />;
      case 'invoice-templates':
        return <InvoiceTemplatesView />;
      case 'settings':
        return <div className="p-6"><h1 className="text-header font-semibold text-charcoal-900 dark:text-white">Settings</h1><p className="text-charcoal-600 dark:text-gray-400 mt-2">Coming soon...</p></div>;
      default:
        return <Dashboard projects={projects} tasks={tasks} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-sand-50 dark:bg-dark-950 flex transition-colors duration-300">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        <div className={`${isMobileMenuOpen ? 'fixed' : 'hidden'} lg:relative lg:block inset-y-0 left-0 z-50 lg:z-0`}>
          <Sidebar
            activeView={activeView}
            onViewChange={(view) => {
              setActiveView(view);
              setIsMobileMenuOpen(false);
            }}
            isExpanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            currentUser={currentUser}
            onNewProjectClick={handleOpenNewProjectModal}
          />
          
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <ProjectFormModal
          isOpen={isProjectModalOpen}
          onClose={handleCloseProjectModal}
          onSave={handleSaveProject}
          project={editingProject}
        />

        <TaskFormModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          onSave={handleSaveTask}
          task={editingTask}
          projects={projects}
          teamMembers={teamMembers}
          defaultStatus={defaultTaskStatus}
        />

        <TeamMemberFormModal
          isOpen={isTeamMemberModalOpen}
          onClose={handleCloseTeamMemberModal}
          onSave={handleSaveTeamMember}
          member={editingTeamMember}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
